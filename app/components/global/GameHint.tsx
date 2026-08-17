"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Corner invitation: explore the résumé by playing the game.
export default function GameHint() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("game-hint-seen")) return;
    if (window.innerWidth < 768) return; // the game is desktop-only
    const show = setTimeout(() => setVisible(true), 2200);
    return () => clearTimeout(show);
  }, []);

  const dismiss = () => {
    setVisible(false);
    sessionStorage.setItem("game-hint-seen", "1");
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: 24, y: 8 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: 24 }}
          transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
          className="fixed bottom-6 right-6 z-40 w-[290px] border dark:border-zinc-700 border-zinc-300 dark:bg-ink/95 bg-paper/95 backdrop-blur-sm p-5 shadow-xl shadow-black/25 select-none"
        >
          <p className="font-mono text-[9px] uppercase tracking-[0.3em] dark:text-accent text-amber-600 mb-2">
            ▶ this portfolio is playable
          </p>
          <p className="text-[13px] leading-relaxed dark:text-zinc-300 text-zinc-700 mb-4">
            Want to explore the résumé as a game? A short 3D shooter — three bosses
            from my career, and me waiting at the end.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                dismiss();
                window.dispatchEvent(new KeyboardEvent("keydown", { key: "c", bubbles: true }));
              }}
              className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink bg-accent px-4 py-2 hover:opacity-85 transition-opacity"
            >
              Play the game
            </button>
            <button
              onClick={dismiss}
              className="font-mono text-[10px] uppercase tracking-[0.18em] dark:text-zinc-500 text-zinc-500 hover:dark:text-zinc-300 hover:text-zinc-700 transition-colors"
            >
              just browse
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
