"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function BreakoutHint() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("breakout-hint-seen")) return;
    const show = setTimeout(() => setVisible(true), 3200);
    const hide = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem("breakout-hint-seen", "1");
    }, 10000);
    return () => { clearTimeout(show); clearTimeout(hide); };
  }, []);

  const dismiss = () => {
    setVisible(false);
    sessionStorage.setItem("breakout-hint-seen", "1");
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
          onClick={() => {
            dismiss();
            window.dispatchEvent(new KeyboardEvent("keydown", { key: "G", bubbles: true }));
          }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2.5 px-4 py-2 border dark:border-amber-500/40 border-amber-500/60 dark:bg-ink/90 bg-paper/90 backdrop-blur-sm font-mono text-[11px] uppercase tracking-[0.2em] dark:text-accent text-amber-600 hover:dark:border-amber-500/80 hover:border-amber-500 transition-colors duration-150 select-none"
        >
          <kbd className="border dark:border-amber-500/50 border-amber-500/60 px-1.5 py-0.5 text-[10px]">G</kbd>
          <span>press to play breakout</span>
          <span
            role="button"
            aria-label="dismiss"
            onClick={e => { e.stopPropagation(); dismiss(); }}
            className="ml-1 dark:text-zinc-600 text-zinc-400 hover:dark:text-zinc-300 hover:text-zinc-600"
          >
            ×
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
