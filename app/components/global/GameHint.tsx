"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Full-screen welcome: the game is the best way to explore this portfolio.
// Shown on every visit (no session gate) — desktop only, since the game
// needs pointer lock and a keyboard.
export default function GameHint() {
  const [visible, setVisible] = useState(false);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    // phones get a short note instead of the full takeover — the game needs
    // pointer lock and a keyboard, so it is an invitation, not an offer
    setCompact(window.innerWidth < 860 || !window.matchMedia("(pointer: fine)").matches);
    const show = setTimeout(() => setVisible(true), 550);
    return () => clearTimeout(show);
  }, []);

  const dismiss = () => setVisible(false);

  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    if (compact) return () => window.removeEventListener("keydown", onKey);
    // hold the page still while the takeover is up
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [visible, compact]);

  const play = () => {
    dismiss();
    window.dispatchEvent(new CustomEvent("career-mode:open"));
  };

  if (compact) {
    return (
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
            className="fixed bottom-4 inset-x-4 z-[80] border dark:border-zinc-700 border-zinc-300 dark:bg-ink/97 bg-paper/97 backdrop-blur-md p-5 shadow-2xl shadow-black/30"
          >
            <p className="font-mono text-[9px] uppercase tracking-[0.3em] dark:text-accent text-amber-600 mb-2">
              ▶ this portfolio is playable
            </p>
            <p className="text-[15px] leading-relaxed dark:text-zinc-200 text-zinc-800 mb-1.5">
              There is a first-person game built out of my actual experience —
              two bosses from my career, and me at the end asking for a job offer.
            </p>
            <p className="font-mono text-[11px] leading-relaxed dark:text-zinc-500 text-zinc-500 mb-4">
              It needs a mouse and keyboard, so it only runs on a computer.
              Open this page on a laptop to play it.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={dismiss}
                className="flex-1 font-mono text-[12px] uppercase tracking-[0.18em] text-ink bg-accent px-4 py-3 active:opacity-80 transition-opacity"
              >
                Got it
              </button>
              <a
                href="/#featured-work"
                onClick={dismiss}
                className="font-mono text-[11px] uppercase tracking-[0.18em] dark:text-zinc-400 text-zinc-500 border dark:border-zinc-700 border-zinc-300 px-4 py-3 active:opacity-80 transition-opacity"
              >
                See the work
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-5 dark:bg-ink/95 bg-paper/95 backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.985, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.985, y: 10 }}
            transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
            className="relative w-full h-full max-w-[1500px] border dark:border-zinc-800 border-zinc-300 dark:bg-ink bg-paper overflow-hidden flex flex-col items-center justify-center text-center px-6 select-none"
          >
            {/* faint grid, same language as the game's map screen */}
            <div
              className="absolute inset-0 opacity-[0.35] pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,176,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,176,0,0.05) 1px, transparent 1px)",
                backgroundSize: "52px 52px",
              }}
            />

            <button
              onClick={dismiss}
              aria-label="Close"
              className="absolute top-5 right-6 z-10 font-mono text-[11px] uppercase tracking-[0.25em] dark:text-zinc-600 text-zinc-400 hover:dark:text-zinc-300 hover:text-zinc-700 transition-colors"
            >
              [esc] close
            </button>

            <div className="relative max-w-2xl">
              <p className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.4em] dark:text-accent text-amber-600 mb-6">
                ▶ this portfolio is playable
              </p>

              <h2 className="font-display text-5xl sm:text-6xl md:text-7xl dark:text-zinc-100 text-zinc-900 leading-[1.05] mb-7">
                Explore it as a game
              </h2>

              <p className="text-lg sm:text-xl leading-relaxed dark:text-zinc-300 text-zinc-700 mb-4">
                The best way to see this portfolio is to play it — a short
                first-person 3D game built out of my actual experience.
              </p>

              <p className="font-mono text-[12px] sm:text-[13px] dark:text-zinc-500 text-zinc-500 mb-12">
                two bosses from my career · about three minutes ·
                me at the end, asking for a job offer
              </p>

              <div className="flex flex-wrap items-center justify-center gap-5">
                <button
                  onClick={play}
                  className="font-mono text-[13px] sm:text-sm uppercase tracking-[0.2em] text-ink bg-accent px-10 py-4 hover:opacity-85 transition-opacity"
                >
                  ▶ Play the game
                </button>
                <button
                  onClick={dismiss}
                  className="font-mono text-[12px] uppercase tracking-[0.2em] dark:text-zinc-400 text-zinc-500 border dark:border-zinc-700 border-zinc-300 px-8 py-4 hover:dark:text-zinc-200 hover:text-zinc-800 hover:dark:border-zinc-500 hover:border-zinc-400 transition-colors"
                >
                  Browse normally
                </button>
              </div>
            </div>

            <p className="absolute bottom-6 inset-x-0 font-mono text-[10px] uppercase tracking-[0.28em] dark:text-zinc-700 text-zinc-400">
              anshulpatil.is-a.dev
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
