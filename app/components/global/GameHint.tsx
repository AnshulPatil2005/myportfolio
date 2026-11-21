"use client";

import { useEffect, useState } from "react";

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

  if (!visible) return null;

  return (
    <aside
      aria-label="Interactive résumé available"
      className={`fixed z-40 border border-fg bg-page motion-safe:animate-[hint-in_300ms_ease-out] ${
        compact ? "bottom-4 inset-x-4 p-5" : "bottom-6 right-6 w-[340px] p-6"
      }`}
    >
      <p className="font-mono text-meta text-muted mb-2">
        interactive résumé
      </p>
      <p className="text-small text-fg mb-2">
        There&rsquo;s a playable version of this CV — a short first-person
        walk through the work, built in the browser.
      </p>
      <p className="font-mono text-meta text-muted mb-5">
        {compact
          ? "It needs a mouse and keyboard, so open this page on a computer to try it."
          : "Two minutes. Or just keep scrolling — everything is on the page too."}
      </p>

      <div className="flex items-center gap-4">
        {compact ? (
          <button
            onClick={dismiss}
            className="flex-1 font-mono text-meta text-fg border border-fg px-4 py-2.5"
          >
            Got it
          </button>
        ) : (
          <button
            onClick={() => {
              dismiss();
              window.dispatchEvent(new CustomEvent("career-mode:open"));
            }}
            className="font-mono text-meta text-page bg-fg px-4 py-2.5 hover:opacity-85 transition-opacity"
          >
            ▶ Try it
          </button>
        )}
        <a
          href="/projects/career-mode"
          onClick={dismiss}
          className="font-mono text-meta link-muted"
        >
          How it was built
        </a>
        <button
          onClick={dismiss}
          aria-label="Dismiss"
          className="ml-auto w-8 h-8 grid place-items-center font-mono text-lg leading-none text-muted hover:text-fg transition-colors"
        >
          ×
        </button>
      </div>
      <style>{`@keyframes hint-in { from { transform: translateY(calc(100% + 1.5rem)); } to { transform: none; } }`}</style>
    </aside>
  );
}
