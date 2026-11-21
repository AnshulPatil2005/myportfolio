"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Career Mode and the command palette are only needed once someone asks for
// them, so they load on that request instead of shipping with every page.
// The triggers are the same as before: C or any "career-mode:open" event for
// the game, ⌘K / Ctrl+K for the palette. Once mounted, each component handles
// its own shortcuts from then on.
const CareerMode = dynamic(() => import("./CareerMode"), { ssr: false });
const CommandPalette = dynamic(
  () => import("./CommandPalette").then((m) => m.CommandPalette),
  { ssr: false }
);

function isTyping(target: EventTarget | null) {
  const tag = (target as HTMLElement | null)?.tagName;
  return tag === "INPUT" || tag === "TEXTAREA";
}

export default function OnDemand() {
  const [game, setGame] = useState(false);
  const [palette, setPalette] = useState(false);

  useEffect(() => {
    if (game) return;
    const open = () => setGame(true);
    const onKey = (e: KeyboardEvent) => {
      if (isTyping(e.target)) return;
      if ((e.key === "c" || e.key === "C") && !e.ctrlKey && !e.metaKey && !e.altKey) setGame(true);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("career-mode:open", open);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("career-mode:open", open);
    };
  }, [game]);

  useEffect(() => {
    if (palette) return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setPalette(true);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [palette]);

  return (
    <>
      {game && <CareerMode autoOpen />}
      {palette && <CommandPalette autoOpen />}
    </>
  );
}
