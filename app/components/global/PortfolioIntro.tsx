"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const AMBER = "#ffb000";
const INK   = "#100d0b";
const BALL_R = 7;
const PAD_W  = 120;
const PAD_H  = 10;

const BRICK_LABELS = [
  "Python", "TypeScript", "React",  "Next.js",
  "C++",    "WASM",       "FastAPI", "Docker",
  "Tailwind","Git",       "SQL",     "BRL-CAD",
];
const BCOLS = 6, BROWS = 2, BW = 100, BH = 30, BGAP = 10;

function makeBricks(cw: number, topOffset: number) {
  const totalW = BCOLS * BW + (BCOLS - 1) * BGAP;
  const sx = (cw - totalW) / 2;
  return Array.from({ length: BCOLS * BROWS }, (_, i) => ({
    x: sx + (i % BCOLS) * (BW + BGAP),
    y: topOffset + Math.floor(i / BCOLS) * (BH + BGAP),
    alive: true,
    label: BRICK_LABELS[i % BRICK_LABELS.length],
  }));
}

export default function PortfolioIntro() {
  const [visible,  setVisible]  = useState(false);
  const [winning,  setWinning]  = useState(false);

  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const stateRef     = useRef<{
    bx: number; by: number; vx: number; vy: number;
    px: number; launched: boolean; won: boolean;
    bricks: { x:number; y:number; alive:boolean; label:string }[];
  } | null>(null);
  const rafRef       = useRef<number>(0);
  const autoRef      = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFinishing  = useRef(false);

  useEffect(() => {
    if (!sessionStorage.getItem("portfolio-intro-seen")) setVisible(true);
  }, []);

  const finish = useCallback(() => {
    if (isFinishing.current) return;
    isFinishing.current = true;
    cancelAnimationFrame(rafRef.current);
    if (autoRef.current) clearTimeout(autoRef.current);
    sessionStorage.setItem("portfolio-intro-seen", "1");
    setTimeout(() => setVisible(false), 650);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const CW = canvas.width  = window.innerWidth;
    const CH = canvas.height = window.innerHeight;
    const nameH   = Math.min(220, CH * 0.32);   // vertical space for the DOM name
    const brickTop = nameH + 20;
    const padY    = CH - 64;

    stateRef.current = {
      bx: CW / 2,
      by: padY - PAD_H - BALL_R - 2,
      vx: 4 * (Math.random() > 0.5 ? 1 : -1),
      vy: -4,
      px: (CW - PAD_W) / 2,
      launched: false,
      won: false,
      bricks: makeBricks(CW, brickTop),
    };

    const scheduleAutoLaunch = (delay = 2500) => {
      if (autoRef.current) clearTimeout(autoRef.current);
      autoRef.current = setTimeout(() => {
        if (stateRef.current && !isFinishing.current) stateRef.current.launched = true;
      }, delay);
    };
    scheduleAutoLaunch();

    const onMouseMove = (e: MouseEvent) => {
      const s = stateRef.current;
      if (s) s.px = Math.max(0, Math.min(CW - PAD_W, e.clientX - PAD_W / 2));
    };
    const onTouch = (e: TouchEvent) => {
      const s = stateRef.current;
      if (s) s.px = Math.max(0, Math.min(CW - PAD_W, e.touches[0].clientX - PAD_W / 2));
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") {
        if (stateRef.current) stateRef.current.launched = true;
      }
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove",  onTouch as EventListener);
    window.addEventListener("keydown",    onKey);

    const draw = () => {
      const s = stateRef.current;
      if (!s || isFinishing.current) return;

      ctx.clearRect(0, 0, CW, CH);

      // bricks
      s.bricks.forEach(b => {
        if (!b.alive) return;
        ctx.fillStyle = AMBER + "18";
        ctx.strokeStyle = AMBER + "88";
        ctx.lineWidth = 1;
        ctx.fillRect(b.x, b.y, BW, BH);
        ctx.strokeRect(b.x + 0.5, b.y + 0.5, BW - 1, BH - 1);
        ctx.fillStyle = AMBER;
        ctx.font = "bold 9px 'JetBrains Mono', monospace";
        ctx.textAlign = "center";
        ctx.fillText(b.label, b.x + BW / 2, b.y + BH / 2 + 3);
      });

      // paddle
      ctx.fillStyle = "#d4d4d8";
      ctx.fillRect(s.px, padY, PAD_W, PAD_H);

      // ball
      ctx.beginPath();
      ctx.arc(s.bx, s.by, BALL_R, 0, Math.PI * 2);
      ctx.fillStyle = AMBER;
      ctx.fill();

      // bottom hint
      if (!s.launched) {
        ctx.fillStyle = AMBER + "66";
        ctx.font = "10px 'JetBrains Mono', monospace";
        ctx.textAlign = "center";
        ctx.fillText("MOVE MOUSE · SPACE TO LAUNCH", CW / 2, CH - 20);
      }

      if (!s.launched) { rafRef.current = requestAnimationFrame(draw); return; }

      // physics
      s.bx += s.vx; s.by += s.vy;

      // walls
      if (s.bx - BALL_R < 0)  { s.bx = BALL_R;      s.vx =  Math.abs(s.vx); }
      if (s.bx + BALL_R > CW) { s.bx = CW - BALL_R; s.vx = -Math.abs(s.vx); }
      if (s.by - BALL_R < 0)  { s.by = BALL_R;       s.vy =  Math.abs(s.vy); }

      // ball lost — reset
      if (s.by > CH + 20) {
        s.bx = CW / 2; s.by = padY - PAD_H - BALL_R - 2;
        s.vx = 4 * (Math.random() > 0.5 ? 1 : -1); s.vy = -4;
        s.launched = false;
        scheduleAutoLaunch(1500);
      }

      // paddle
      if (s.vy > 0 && s.by + BALL_R >= padY && s.by + BALL_R <= padY + PAD_H + 4
          && s.bx >= s.px && s.bx <= s.px + PAD_W) {
        const hit = (s.bx - s.px) / PAD_W - 0.5;
        const spd = Math.sqrt(s.vx * s.vx + s.vy * s.vy);
        s.vx = hit * spd * 2.4;
        s.vy = -Math.abs(s.vy);
        s.by = padY - BALL_R;
      }

      // bricks
      for (const b of s.bricks) {
        if (!b.alive) continue;
        if (s.bx + BALL_R > b.x && s.bx - BALL_R < b.x + BW &&
            s.by + BALL_R > b.y && s.by - BALL_R < b.y + BH) {
          b.alive = false;
          const ox = Math.min(s.bx + BALL_R - b.x, b.x + BW - (s.bx - BALL_R));
          const oy = Math.min(s.by + BALL_R - b.y, b.y + BH - (s.by - BALL_R));
          if (ox < oy) s.vx = -s.vx; else s.vy = -s.vy;
          break;
        }
      }

      // win
      if (s.bricks.every(b => !b.alive) && !s.won) {
        s.won = true;
        setWinning(true);
        setTimeout(finish, 1400);
        return;
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove",  onTouch as EventListener);
      window.removeEventListener("keydown",    onKey);
      if (autoRef.current) clearTimeout(autoRef.current);
    };
  }, [visible, finish]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="intro"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
          className="fixed inset-0 z-[200] overflow-hidden select-none"
          style={{ background: INK }}
        >
          {/* Name — DOM element so we get the display font */}
          <div className="absolute top-0 left-0 right-0 flex flex-col items-center pt-10 pointer-events-none z-10">
            <p className="font-mono text-[9px] uppercase tracking-[0.35em] text-amber-500/40 mb-3">
              portfolio &middot; 2026
            </p>
            <h1
              className="font-display text-center leading-[0.9] text-amber-400"
              style={{ fontSize: "clamp(2.8rem, 8vw, 6.5rem)" }}
            >
              Anshul
              <span className="italic block text-amber-500">Patil</span>
            </h1>
            <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-amber-500/30 mt-3">
              break through to enter
            </p>
          </div>

          {/* Game canvas */}
          <canvas ref={canvasRef} className="absolute inset-0" />

          {/* Win flash */}
          <AnimatePresence>
            {winning && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
              >
                <p
                  className="font-display text-amber-400 italic"
                  style={{ fontSize: "clamp(3rem, 10vw, 8rem)" }}
                >
                  welcome.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Skip */}
          <button
            onClick={finish}
            className="absolute top-5 right-6 z-20 font-mono text-[10px] uppercase tracking-[0.22em] text-amber-500/40 hover:text-amber-400 transition-colors duration-200"
          >
            skip →
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
