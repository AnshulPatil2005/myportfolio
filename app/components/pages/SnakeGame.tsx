"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const CELL = 13, GAP = 3, COLS = 52, ROWS = 7;
const AMBER = "#ffb000";
const INK = "#100d0b";
const W = COLS * (CELL + GAP) - GAP;
const H = ROWS * (CELL + GAP) - GAP;

type Coord = { c: number; r: number };
type Dir = "U" | "D" | "L" | "R";

async function fetchGrid(username: string): Promise<number[][]> {
  try {
    const res = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${username}?y=last`
    );
    if (!res.ok) throw new Error();
    const data = await res.json();
    // API returns contributions sorted by date ascending
    const contributions: { date: string; count: number }[] = data.contributions;
    // Build 7-row × 52-col grid (days ordered Sun=0 to Sat=6)
    const grid: number[][] = Array.from({ length: ROWS }, () =>
      new Array(COLS).fill(0)
    );
    const start = contributions.length - COLS * ROWS;
    contributions.slice(start < 0 ? 0 : start).forEach((d, i) => {
      const col = Math.floor(i / ROWS);
      const row = i % ROWS;
      if (col < COLS && row < ROWS) grid[row][col] = d.count;
    });
    return grid;
  } catch {
    // fallback: random sparse grid
    return Array.from({ length: ROWS }, () =>
      Array.from({ length: COLS }, () => (Math.random() < 0.35 ? Math.ceil(Math.random() * 5) : 0))
    );
  }
}

function randFood(snake: Coord[], grid: number[][]): Coord | null {
  const hot: Coord[] = [];
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++)
      if (grid[r][c] > 0 && !snake.some(s => s.c === c && s.r === r))
        hot.push({ c, r });
  if (!hot.length) return null;
  return hot[Math.floor(Math.random() * hot.length)];
}

export default function SnakeGame({ username }: { username: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<{
    snake: Coord[]; dir: Dir; next: Dir;
    food: Coord | null; grid: number[][];
    score: number; dead: boolean; started: boolean;
  } | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [score, setScore] = useState(0);
  const [dead, setDead] = useState(false);
  const [loading, setLoading] = useState(true);

  const startGame = useCallback((grid: number[][]) => {
    const snake: Coord[] = [{ c: 3, r: 3 }];
    stateRef.current = {
      snake, dir: "R", next: "R",
      food: randFood(snake, grid),
      grid, score: 0, dead: false, started: false,
    };
    setScore(0);
    setDead(false);
  }, []);

  // Fetch grid data once
  useEffect(() => {
    fetchGrid(username).then(grid => {
      startGame(grid);
      setLoading(false);
    });
  }, [username, startGame]);

  // Canvas draw loop
  useEffect(() => {
    if (loading) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      const s = stateRef.current;
      if (!s) return;
      ctx.fillStyle = INK;
      ctx.fillRect(0, 0, W, H);

      // base grid cells
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const cnt = s.grid[r][c];
          const x = c * (CELL + GAP), y = r * (CELL + GAP);
          if (cnt === 0) {
            ctx.fillStyle = "#27272a";
          } else if (cnt <= 2) {
            ctx.fillStyle = "#92400e";
          } else if (cnt <= 5) {
            ctx.fillStyle = "#b45309";
          } else {
            ctx.fillStyle = "#d97706";
          }
          ctx.fillRect(x, y, CELL, CELL);
        }
      }

      // food — pulsing amber square
      if (s.food) {
        const { c, r } = s.food;
        ctx.fillStyle = AMBER;
        ctx.fillRect(c * (CELL + GAP), r * (CELL + GAP), CELL, CELL);
      }

      // snake
      s.snake.forEach(({ c, r }, i) => {
        ctx.fillStyle = i === 0 ? "#ffffff" : "#e4e4e7";
        ctx.fillRect(c * (CELL + GAP), r * (CELL + GAP), CELL, CELL);
      });

      if (!s.started) {
        ctx.fillStyle = "rgba(16,13,11,0.65)";
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = AMBER;
        ctx.font = "bold 13px 'JetBrains Mono', monospace";
        ctx.textAlign = "center";
        ctx.fillText("PRESS ARROW KEYS TO START", W / 2, H / 2 - 6);
        ctx.font = "10px 'JetBrains Mono', monospace";
        ctx.fillStyle = "#a1a1aa";
        ctx.fillText("eat amber squares · don't hit yourself", W / 2, H / 2 + 14);
      }

      if (s.dead) {
        ctx.fillStyle = "rgba(16,13,11,0.7)";
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "#ef4444";
        ctx.font = "bold 14px 'JetBrains Mono', monospace";
        ctx.textAlign = "center";
        ctx.fillText(`DEAD  ·  SCORE ${s.score}`, W / 2, H / 2 - 6);
        ctx.fillStyle = AMBER;
        ctx.font = "10px 'JetBrains Mono', monospace";
        ctx.fillText("press R to restart", W / 2, H / 2 + 14);
      }
    };

    const tick = () => {
      const s = stateRef.current;
      if (!s || s.dead || !s.started) { draw(); return; }
      s.dir = s.next;
      const head = s.snake[0];
      const next: Coord = {
        c: (head.c + (s.dir === "R" ? 1 : s.dir === "L" ? -1 : 0) + COLS) % COLS,
        r: (head.r + (s.dir === "D" ? 1 : s.dir === "U" ? -1 : 0) + ROWS) % ROWS,
      };
      if (s.snake.some(seg => seg.c === next.c && seg.r === next.r)) {
        s.dead = true;
        setDead(true);
        draw();
        return;
      }
      s.snake.unshift(next);
      if (s.food && next.c === s.food.c && next.r === s.food.r) {
        s.score++;
        setScore(s.score);
        s.food = randFood(s.snake, s.grid);
      } else {
        s.snake.pop();
      }
      draw();
    };

    draw();
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(tick, 135);

    const onKey = (e: KeyboardEvent) => {
      const s = stateRef.current;
      if (!s) return;
      if (e.key === "r" || e.key === "R") {
        if (s.dead) { startGame(s.grid); return; }
      }
      const MAP: Record<string, Dir> = {
        ArrowUp: "U", ArrowDown: "D", ArrowLeft: "L", ArrowRight: "R",
        w: "U", s: "D", a: "L", d: "R",
      };
      const d = MAP[e.key];
      if (!d) return;
      e.preventDefault();
      if (!s.started) s.started = true;
      const opposite: Record<Dir, Dir> = { U: "D", D: "U", L: "R", R: "L" };
      if (d !== opposite[s.dir]) s.next = d;
    };
    window.addEventListener("keydown", onKey);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      window.removeEventListener("keydown", onKey);
    };
  }, [loading, startGame]);

  if (loading) return null;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest dark:text-zinc-500 text-zinc-400 mb-1">
        <span>Score: <span className="text-accent">{score}</span></span>
        <span>arrow keys / wasd · R to restart</span>
      </div>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="block"
        style={{ imageRendering: "pixelated" }}
      />
    </div>
  );
}
