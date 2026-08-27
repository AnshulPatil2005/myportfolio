"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// A quiet, non-blocking invitation to the interactive résumé.
//
// This deliberately never covers the page. Someone evaluating a candidate
// should reach the work without clearing an obstacle first — the game is an
// option, not a toll. It appears once per visitor, remembers a decline
// permanently, and the ▶ buttons in the navbar and hero remain for anyone
// who wants it later.
const SEEN_KEY = "career-invite-dismissed";

export default function GameHint() {
  const [visible, setVisible] = useState(false);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(SEEN_KEY)) return;
    } catch {
      return; // storage blocked — err toward not nagging
    }
    setCompact(window.innerWidth < 860 || !window.matchMedia("(pointer: fine)").matches);
    const show = setTimeout(() => setVisible(true), 2600);
    return () => clearTimeout(show);
  }, []);

  const dismiss = () => {
    setVisible(false);
    try { localStorage.setItem(SEEN_KEY, "1"); } catch { /* ignore */ }
  };

  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") dismiss(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.aside
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 18 }}
          transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
          aria-label="Interactive résumé available"
          className={`fixed z-40 border dark:border-zinc-700 border-zinc-300 dark:bg-ink/97 bg-paper/97 backdrop-blur-sm shadow-xl shadow-black/20 ${
            compact ? "bottom-4 inset-x-4 p-5" : "bottom-6 right-6 w-[330px] p-5"
          }`}
        >
          <p className="font-mono text-[9px] uppercase tracking-[0.28em] dark:text-zinc-500 text-zinc-500 mb-2">
            interactive résumé
          </p>
          <p className="text-[14px] leading-relaxed dark:text-zinc-200 text-zinc-800 mb-1.5">
            There&rsquo;s a playable version of this CV — a short first-person
            walk through the work, built in the browser.
          </p>
          <p className="font-mono text-[11px] leading-relaxed dark:text-zinc-500 text-zinc-500 mb-4">
            {compact
              ? "It needs a mouse and keyboard, so open this page on a computer to try it."
              : "Two minutes. Or just keep scrolling — everything is on the page too."}
          </p>

          <div className="flex items-center gap-3">
            {compact ? (
              <button
                onClick={dismiss}
                className="flex-1 font-mono text-[11px] uppercase tracking-[0.18em] dark:text-zinc-200 text-zinc-800 border dark:border-zinc-600 border-zinc-400 px-4 py-2.5 active:opacity-80 transition-opacity"
              >
                Got it
              </button>
            ) : (
              <button
                onClick={() => {
                  dismiss();
                  window.dispatchEvent(new CustomEvent("career-mode:open"));
                }}
                className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink bg-accent px-4 py-2.5 hover:opacity-85 transition-opacity"
              >
                ▶ Try it
              </button>
            )}
            <a
              href="/projects/career-mode"
              onClick={dismiss}
              className="font-mono text-[10px] uppercase tracking-[0.18em] dark:text-zinc-400 text-zinc-500 hover:dark:text-zinc-200 hover:text-zinc-800 transition-colors"
            >
              How it was built
            </a>
            <button
              onClick={dismiss}
              aria-label="Dismiss"
              className="ml-auto font-mono text-[16px] leading-none dark:text-zinc-600 text-zinc-400 hover:dark:text-zinc-300 hover:text-zinc-600 transition-colors"
            >
              ×
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
