"use client";

import { useEffect, useRef, useState } from "react";

// Isometric constants
const COLS = 52, ROWS = 7;
const TX = 10, TY = 5;   // tile half-width & half-height in iso space
const MAX_H = 48;         // max building height px
const AMBER = "#ffb000";
const INK = "#100d0b";

type Contribution = { date: string; count: number };

async function fetchContribs(username: string): Promise<Contribution[]> {
  try {
    const res = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${username}?y=last`
    );
    if (!res.ok) throw new Error();
    const data = await res.json();
    return data.contributions as Contribution[];
  } catch {
    return Array.from({ length: COLS * ROWS }, (_, i) => ({
      date: "",
      count: Math.random() < 0.4 ? Math.ceil(Math.random() * 8) : 0,
    }));
  }
}

function buildGrid(contribs: Contribution[]): { count: number; date: string }[][] {
  const grid: { count: number; date: string }[][] = Array.from(
    { length: ROWS }, () => Array.from({ length: COLS }, () => ({ count: 0, date: "" }))
  );
  const start = contribs.length - COLS * ROWS;
  contribs.slice(start < 0 ? 0 : start).forEach((d, i) => {
    const col = Math.floor(i / ROWS);
    const row = i % ROWS;
    if (col < COLS && row < ROWS) grid[row][col] = { count: d.count, date: d.date };
  });
  return grid;
}

function drawCity(
  ctx: CanvasRenderingContext2D,
  grid: { count: number; date: string }[][],
  cw: number, ch: number,
  rotY: number,
  hovered: { c: number; r: number } | null,
  maxCount: number
) {
  ctx.fillStyle = INK;
  ctx.fillRect(0, 0, cw, ch);

  // Origin: center horizontally, lower half vertically
  const ox = cw / 2;
  const oy = ch * 0.55;
  const rot = (rotY * Math.PI) / 180;

  // Iso projection: rotate around Y axis (col axis)
  const toScreen = (col: number, row: number): [number, number] => {
    // Offset from grid center
    const gc = col - COLS / 2 + 0.5;
    const gr = row - ROWS / 2 + 0.5;
    // Rotate gc around Y
    const rGc = gc * Math.cos(rot) - gr * 0.0;
    const rGr = gc * Math.sin(rot) * 0.35 + gr;
    const sx = ox + (rGc - rGr) * TX * 2;
    const sy = oy + (rGc + rGr) * TY;
    return [sx, sy];
  };

  // Draw back to front so closer tiles are on top
  for (let r = ROWS - 1; r >= 0; r--) {
    for (let c = COLS - 1; c >= 0; c--) {
      const cell = grid[r][c];
      const cnt = cell.count;
      const isHot = hovered?.c === c && hovered?.r === r;

      const h = maxCount > 0 ? (cnt / maxCount) * MAX_H : 0;
      const [sx, sy] = toScreen(c, r);

      const t = TX, ty_ = TY;

      // top face corners
      const top = [
        [sx,       sy - h       ],
        [sx + t,   sy - h + ty_  ],
        [sx,       sy - h + ty_ * 2],
        [sx - t,   sy - h + ty_  ],
      ];
      // bottom base
      const base = [
        [sx,       sy       ],
        [sx + t,   sy + ty_  ],
        [sx,       sy + ty_ * 2],
        [sx - t,   sy + ty_  ],
      ];

      if (cnt === 0) {
        // flat ground tile
        ctx.beginPath();
        ctx.moveTo(sx, sy); ctx.lineTo(sx + t, sy + ty_);
        ctx.lineTo(sx, sy + ty_ * 2); ctx.lineTo(sx - t, sy + ty_);
        ctx.closePath();
        ctx.fillStyle = "#18181b";
        ctx.fill();
        continue;
      }

      // Right face (darker)
      ctx.beginPath();
      ctx.moveTo(sx + t,   sy - h + ty_);
      ctx.lineTo(sx,       sy - h + ty_ * 2);
      ctx.lineTo(sx,       sy + ty_ * 2);
      ctx.lineTo(sx + t,   sy + ty_);
      ctx.closePath();
      const darkFace = isHot
        ? "#a16207" : cnt <= 2 ? "#451a00" : cnt <= 5 ? "#713f12" : "#92400e";
      ctx.fillStyle = darkFace;
      ctx.fill();

      // Left face (mid)
      ctx.beginPath();
      ctx.moveTo(sx - t,   sy - h + ty_);
      ctx.lineTo(sx,       sy - h + ty_ * 2);
      ctx.lineTo(sx,       sy + ty_ * 2);
      ctx.lineTo(sx - t,   sy + ty_);
      ctx.closePath();
      const midFace = isHot
        ? "#ca8a04" : cnt <= 2 ? "#7c2d12" : cnt <= 5 ? "#9a3412" : "#b45309";
      ctx.fillStyle = midFace;
      ctx.fill();

      // Top face (brightest)
      ctx.beginPath();
      top.forEach(([px, py], i) => i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py));
      ctx.closePath();
      const topFace = isHot
        ? AMBER : cnt <= 2 ? "#92400e" : cnt <= 5 ? "#b45309" : "#d97706";
      ctx.fillStyle = topFace;
      ctx.fill();

      // Tooltip
      if (isHot && cell.date) {
        ctx.fillStyle = "rgba(16,13,11,0.9)";
        const label = `${cell.date}  ·  ${cnt} commit${cnt !== 1 ? "s" : ""}`;
        const tw = ctx.measureText(label).width + 16;
        ctx.fillRect(sx - tw / 2, sy - h - 30, tw, 20);
        ctx.fillStyle = AMBER;
        ctx.font = "10px 'JetBrains Mono', monospace";
        ctx.textAlign = "center";
        ctx.fillText(label, sx, sy - h - 15);
      }
    }
  }

  // Axis hint
  ctx.fillStyle = "#3f3f46";
  ctx.font = "9px 'JetBrains Mono', monospace";
  ctx.textAlign = "left";
  ctx.fillText("drag to rotate", 12, ch - 12);
}

export default function GitHubCity({ username }: { username: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gridRef   = useRef<{ count: number; date: string }[][] | null>(null);
  const rotRef    = useRef(25);
  const dragRef   = useRef<{ x: number; startRot: number } | null>(null);
  const hovRef    = useRef<{ c: number; r: number } | null>(null);
  const maxRef    = useRef(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContribs(username).then(contribs => {
      const grid = buildGrid(contribs);
      gridRef.current = grid;
      maxRef.current = Math.max(1, ...contribs.map(d => d.count));
      setLoading(false);
    });
  }, [username]);

  useEffect(() => {
    if (loading) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const grid = gridRef.current;
    if (!grid) return;

    const render = () =>
      drawCity(ctx, grid, canvas.width, canvas.height, rotRef.current, hovRef.current, maxRef.current);

    render();

    const onDown = (e: MouseEvent) => {
      dragRef.current = { x: e.clientX, startRot: rotRef.current };
    };
    const onMove = (e: MouseEvent) => {
      if (dragRef.current) {
        rotRef.current = dragRef.current.startRot + (e.clientX - dragRef.current.x) * 0.4;
        render();
        return;
      }
      // Hover detection: brute-force nearest tile to mouse
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const ox = canvas.width / 2, oy = canvas.height * 0.55;
      const rot = (rotRef.current * Math.PI) / 180;
      let best: { c: number; r: number } | null = null;
      let bestD = 18;
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const gc = c - COLS / 2 + 0.5, gr = r - ROWS / 2 + 0.5;
          const rGc = gc * Math.cos(rot);
          const rGr = gc * Math.sin(rot) * 0.35 + gr;
          const sx = ox + (rGc - rGr) * TX * 2;
          const sy = oy + (rGc + rGr) * TY;
          const d = Math.hypot(mx - sx, my - sy);
          if (d < bestD) { bestD = d; best = { c, r }; }
        }
      }
      hovRef.current = best;
      render();
    };
    const onUp = () => { dragRef.current = null; };

    canvas.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      canvas.removeEventListener("mousedown", onDown);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [loading]);

  if (loading) return (
    <div className="w-full h-[280px] dark:bg-zinc-950 bg-zinc-100 animate-pulse" />
  );

  return (
    <canvas
      ref={canvasRef}
      width={740}
      height={280}
      className="block w-full max-w-[740px] cursor-grab active:cursor-grabbing"
      style={{ imageRendering: "pixelated" }}
    />
  );
}
