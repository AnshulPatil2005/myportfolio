"use client";

import { useEffect, useRef } from "react";

const CELL = 14;
const INTERVAL = 160;

function randomGrid(cols: number, rows: number): Uint8Array {
  const g = new Uint8Array(cols * rows);
  for (let i = 0; i < g.length; i++) g[i] = Math.random() < 0.28 ? 1 : 0;
  return g;
}

function step(g: Uint8Array, cols: number, rows: number): Uint8Array {
  const n = new Uint8Array(cols * rows);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let neighbors = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = (r + dr + rows) % rows;
          const nc = (c + dc + cols) % cols;
          neighbors += g[nr * cols + nc];
        }
      }
      const alive = g[r * cols + c];
      n[r * cols + c] =
        alive ? (neighbors === 2 || neighbors === 3 ? 1 : 0)
              : (neighbors === 3 ? 1 : 0);
    }
  }
  return n;
}

export default function ConwayCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const cols = () => Math.ceil(canvas.width  / CELL);
    const rows = () => Math.ceil(canvas.height / CELL);

    let grid = randomGrid(cols(), rows());

    const onClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const c = Math.floor((e.clientX - rect.left) / CELL);
      const r = Math.floor((e.clientY - rect.top)  / CELL);
      const cols_ = cols();
      if (c >= 0 && c < cols_ && r >= 0 && r < rows()) {
        const idx = r * cols_ + c;
        grid[idx] = grid[idx] ? 0 : 1;
      }
    };
    canvas.addEventListener("click", onClick);

    const draw = () => {
      const c = cols(), r = rows();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let row = 0; row < r; row++) {
        for (let col = 0; col < c; col++) {
          if (grid[row * c + col]) {
            ctx.fillStyle = "#ffb000";
            ctx.fillRect(col * CELL + 1, row * CELL + 1, CELL - 2, CELL - 2);
          }
        }
      }
    };

    draw();
    const timer = setInterval(() => {
      grid = step(grid, cols(), rows());
      draw();
    }, INTERVAL);

    return () => {
      clearInterval(timer);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto"
      style={{ opacity: 0.06 }}
      aria-hidden="true"
    />
  );
}
