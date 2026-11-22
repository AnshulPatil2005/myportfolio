"use client";

import { useState } from "react";
import PlayCareerButton from "./PlayCareerButton";

// A silent, looping clip so anyone can judge the craft in five seconds
// without committing to playing anything — which matters most for the
// visitors who would never open a game.
//
// Drop a recording at public/career-mode.mp4 (and optionally a poster at
// public/career-mode-poster.jpg) and it appears here on the next build. The
// page checks for the files on the server, so without them nothing 404s.
const SRC = "/career-mode.mp4";
const POSTER = "/career-mode-poster.jpg";

export default function GameTrailer({
  hasVideo,
  hasPoster,
}: {
  hasVideo: boolean;
  hasPoster: boolean;
}) {
  const [failed, setFailed] = useState(!hasVideo);

  if (failed) {
    return (
      <div className="relative border border-line bg-wash aspect-video flex flex-col items-center justify-center gap-4 text-center px-6">
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,176,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,176,0,0.05) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
        <p className="relative font-mono text-meta text-muted">
          Career Mode
        </p>
        <p className="relative text-[14px] max-w-sm leading-relaxed text-muted">
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
        poster={hasPoster ? POSTER : undefined}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        onError={() => setFailed(true)}
        aria-label="Silent gameplay clip of Career Mode"
        className="w-full aspect-video object-cover border border-line bg-black"
      />
      <figcaption className="mt-2 font-mono text-meta text-muted">
        gameplay · no audio
      </figcaption>
    </figure>
  );
}
