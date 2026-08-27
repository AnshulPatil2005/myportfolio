"use client";

import { useState } from "react";
import PlayCareerButton from "./PlayCareerButton";

// A silent, looping clip so anyone can judge the craft in five seconds
// without committing to playing anything — which matters most for the
// visitors who would never open a game.
//
// Drop a recording at public/career-mode.mp4 (see README) and it appears
// here automatically. Until then this degrades to a still frame.
const SRC = "/career-mode.mp4";
const POSTER = "/career-mode-poster.jpg";

export default function GameTrailer() {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="relative border dark:border-zinc-800 border-zinc-200 dark:bg-zinc-950/40 bg-zinc-50 aspect-video flex flex-col items-center justify-center gap-4 text-center px-6">
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,176,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,176,0,0.05) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
        <p className="relative font-mono text-[10px] uppercase tracking-[0.3em] dark:text-zinc-500 text-zinc-500">
          Career Mode
        </p>
        <p className="relative text-[14px] max-w-sm leading-relaxed dark:text-zinc-400 text-zinc-600">
          A first-person walk through two chapters of my career, running in this
          browser tab.
        </p>
        <div className="relative">
          <PlayCareerButton />
        </div>
      </div>
    );
  }

  return (
    <figure className="m-0">
      <video
        src={SRC}
        poster={POSTER}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        onError={() => setFailed(true)}
        aria-label="Silent gameplay clip of Career Mode"
        className="w-full aspect-video object-cover border dark:border-zinc-800 border-zinc-200 bg-black"
      />
      <figcaption className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] dark:text-zinc-600 text-zinc-400">
        gameplay · no audio
      </figcaption>
    </figure>
  );
}
