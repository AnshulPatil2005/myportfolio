"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const SKILLS = [
  "Python", "TypeScript", "React", "Next.js",
  "C++", "WASM",  "FastAPI", "Docker",
  "Tailwind", "Git", "SQL", "BRL-CAD",
];

const BW = 90, BH = 26, COLS = 6, ROWS = 2;
const PAD_W = 100, PAD_H = 8;
const BALL_R = 6;
const AMBER = "#ffb000";
const INK   = "#100d0b";

interface Brick { x: number; y: number; alive: boolean; label: string }

function initBricks(cw: number): Brick[] {
  const totalW = COLS * BW + (COLS - 1) * 10;
  const startX = (cw - totalW) / 2;
  return Array.from({ length: COLS * ROWS }, (_, i) => {
    const col = i % COLS, row = Math.floor(i / COLS);
    return {
      x: startX + col * (BW + 10),
      y: 60 + row * (BH + 10),
      alive: true,
      label: SKILLS[i % SKILLS.length],
    };
  });
}

export default function BreakoutGame() {
  const [open, setOpen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef  = useRef<{
    bx: number; by: number; vx: number; vy: number;
    px: number; bricks: Brick[];
    won: boolean; lost: boolean; started: boolean;
  } | null>(null);
  const rafRef = useRef<number>(0);

  const close = useCallback(() => {
    setOpen(false);
    cancelAnimationFrame(rafRef.current);
  }, []);

  // Global G keypress to toggle
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "g" || e.key === "G") {
        if ((e.target as HTMLElement).tagName === "INPUT" ||
            (e.target as HTMLElement).tagName === "TEXTAREA") return;
        setOpen(o => !o);
      }
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  useEffect(() => {
    if (!open) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const CW = canvas.width  = Math.min(window.innerWidth - 32, 620);
    const CH = canvas.height = 420;
    const cy = CH - 40;

    stateRef.current = {
      bx: CW / 2, by: cy - PAD_H - BALL_R - 2,
      vx: 3.2, vy: -3.2,
      px: (CW - PAD_W) / 2,
      bricks: initBricks(CW),
      won: false, lost: false, started: false,
    };

    const onMove = (e: MouseEvent | TouchEvent) => {
      const s = stateRef.current; if (!s) return;
      const rect = canvas.getBoundingClientRect();
      const clientX = "touches" in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      s.px = Math.max(0, Math.min(CW - PAD_W, clientX - rect.left - PAD_W / 2));
    };
    const onStart = () => { if (stateRef.current) stateRef.current.started = true; };
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("touchmove", onMove as EventListener);
    canvas.addEventListener("click", onStart);

    const draw = () => {
      const s = stateRef.current; if (!s) return;
      ctx.fillStyle = INK;
      ctx.fillRect(0, 0, CW, CH);

      // bricks
      s.bricks.forEach(b => {
        if (!b.alive) return;
        ctx.fillStyle = AMBER + "22";
        ctx.strokeStyle = AMBER + "99";
        ctx.lineWidth = 1;
        ctx.fillRect(b.x, b.y, BW, BH);
        ctx.strokeRect(b.x + 0.5, b.y + 0.5, BW - 1, BH - 1);
        ctx.fillStyle = AMBER;
        ctx.font = "bold 9px 'JetBrains Mono', monospace";
        ctx.textAlign = "center";
        ctx.fillText(b.label, b.x + BW / 2, b.y + BH / 2 + 3);
      });

      // paddle
      ctx.fillStyle = "#e4e4e7";
      ctx.fillRect(s.px, cy, PAD_W, PAD_H);

      // ball
      ctx.beginPath();
      ctx.arc(s.bx, s.by, BALL_R, 0, Math.PI * 2);
      ctx.fillStyle = AMBER;
      ctx.fill();

      // HUD
      ctx.fillStyle = AMBER + "66";
      ctx.font = "10px 'JetBrains Mono', monospace";
      ctx.textAlign = "left";
      if (!s.started) {
        ctx.fillStyle = AMBER;
        ctx.textAlign = "center";
        ctx.font = "12px 'JetBrains Mono', monospace";
        ctx.fillText("CLICK TO LAUNCH  ·  G TO CLOSE", CW / 2, CH - 12);
      }
      if (s.won) {
        ctx.fillStyle = AMBER;
        ctx.textAlign = "center";
        ctx.font = "bold 22px 'JetBrains Mono', monospace";
        ctx.fillText("HIRE ME", CW / 2, CH / 2 - 10);
        ctx.font = "11px 'JetBrains Mono', monospace";
        ctx.fillText("anshulpatil1022@gmail.com", CW / 2, CH / 2 + 18);
      }
      if (s.lost) {
        ctx.fillStyle = "#ef4444";
        ctx.textAlign = "center";
        ctx.font = "bold 18px 'JetBrains Mono', monospace";
        ctx.fillText("GAME OVER  ·  CLICK TO RETRY", CW / 2, CH / 2);
      }
    };

    const tick = () => {
      const s = stateRef.current; if (!s) return;
      if (s.won || s.lost) { draw(); return; }
      if (!s.started) { draw(); rafRef.current = requestAnimationFrame(tick); return; }

      s.bx += s.vx; s.by += s.vy;

      // walls
      if (s.bx - BALL_R < 0)    { s.bx = BALL_R;      s.vx = Math.abs(s.vx); }
      if (s.bx + BALL_R > CW)   { s.bx = CW - BALL_R; s.vx = -Math.abs(s.vx); }
      if (s.by - BALL_R < 0)    { s.by = BALL_R;       s.vy = Math.abs(s.vy); }
      // paddle
      if (s.by + BALL_R >= cy && s.bx >= s.px && s.bx <= s.px + PAD_W && s.vy > 0) {
        const hit = (s.bx - s.px) / PAD_W - 0.5; // -0.5 to 0.5
        const speed = Math.sqrt(s.vx * s.vx + s.vy * s.vy);
        s.vx = hit * speed * 2;
        s.vy = -Math.abs(s.vy);
        s.by = cy - BALL_R;
      }
      // lose
      if (s.by > CH + 20) { s.lost = true; }

      // bricks
      for (const b of s.bricks) {
        if (!b.alive) continue;
        if (s.bx + BALL_R > b.x && s.bx - BALL_R < b.x + BW &&
            s.by + BALL_R > b.y && s.by - BALL_R < b.y + BH) {
          b.alive = false;
          const overlapX = Math.min(s.bx + BALL_R - b.x, b.x + BW - (s.bx - BALL_R));
          const overlapY = Math.min(s.by + BALL_R - b.y, b.y + BH - (s.by - BALL_R));
          if (overlapX < overlapY) s.vx = -s.vx; else s.vy = -s.vy;
          break;
        }
      }
      if (s.bricks.every(b => !b.alive)) s.won = true;

      draw();
      rafRef.current = requestAnimationFrame(tick);
    };

    // retry on click after loss
    const onRetry = () => {
      const s = stateRef.current; if (!s) return;
      if (s.lost) {
        s.bx = CW / 2; s.by = cy - PAD_H - BALL_R - 2;
        s.vx = 3.2; s.vy = -3.2;
        s.bricks = initBricks(CW);
        s.won = false; s.lost = false; s.started = false;
      }
    };
    canvas.addEventListener("click", onRetry);

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafRef.current);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("touchmove", onMove as EventListener);
      canvas.removeEventListener("click", onStart);
      canvas.removeEventListener("click", onRetry);
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) close(); }}
    >
      <div className="flex flex-col items-end gap-2">
        <div className="flex items-center gap-4 font-mono text-[10px] text-zinc-500 uppercase tracking-widest pr-1">
          <span>press G or ESC to close</span>
        </div>
        <canvas
          ref={canvasRef}
          className="block cursor-none"
          style={{ border: "1px solid #ffb00033" }}
        />
      </div>
    </div>
  );
}
