"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Center-screen welcome: the game is the best way to explore this portfolio.
export default function GameHint() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("game-hint-seen")) return;
    if (window.innerWidth < 768) return; // the game is desktop-only
    const show = setTimeout(() => setVisible(true), 700);
    return () => clearTimeout(show);
  }, []);

  const dismiss = () => {
    setVisible(false);
    sessionStorage.setItem("game-hint-seen", "1");
  };

  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") dismiss(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm"
            onClick={dismiss}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[81] w-[min(92vw,480px)] border dark:border-zinc-700 border-zinc-300 dark:bg-ink bg-paper p-8 shadow-2xl shadow-black/40 select-none text-center"
          >
            <p className="font-mono text-[9px] uppercase tracking-[0.35em] dark:text-accent text-amber-600 mb-3">
              ▶ this portfolio is playable
            </p>
            <h2 className="font-display text-3xl dark:text-zinc-100 text-zinc-900 mb-3">
              Explore it as a game
            </h2>
            <p className="text-[14px] leading-relaxed dark:text-zinc-300 text-zinc-700 mb-2">
              The best way to see this portfolio is to play it — a short first-person
              3D game through my actual experience.
            </p>
            <p className="font-mono text-[11px] dark:text-zinc-500 text-zinc-500 mb-7">
              three bosses from my career · ~3 minutes · me at the end, asking for a job offer
            </p>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => {
                  dismiss();
                  window.dispatchEvent(new KeyboardEvent("keydown", { key: "c", bubbles: true }));
                }}
                className="font-mono text-[12px] uppercase tracking-[0.18em] text-ink bg-accent px-6 py-2.5 hover:opacity-85 transition-opacity"
              >
                ▶ Play the game
              </button>
              <button
                onClick={dismiss}
                className="font-mono text-[11px] uppercase tracking-[0.18em] dark:text-zinc-400 text-zinc-500 border dark:border-zinc-700 border-zinc-300 px-5 py-2.5 hover:dark:text-zinc-200 hover:text-zinc-800 hover:dark:border-zinc-500 hover:border-zinc-400 transition-colors"
              >
                Browse normally
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
