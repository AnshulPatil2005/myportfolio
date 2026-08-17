"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { profile } from "@/lib/data";
import { CHAPTERS, ROMAN, PROGRESS_KEY } from "./career/data";

// Three.js world loads only when the game opens — stays out of the main bundle.
const Engine3D = dynamic(() => import("./career/Engine3D"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center">
      <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-zinc-500 animate-pulse">
        building the world…
      </p>
    </div>
  ),
});

type Phase = "map" | "world" | "victory" | "pause" | "ending";

const fade = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.25 },
};

export default function CareerMode() {
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<Phase>("map");
  const [saved, setSaved] = useState(0);
  const [vicChapter, setVicChapter] = useState(0);
  const [runId, setRunId] = useState(0);
  const [runStart, setRunStart] = useState(0);
  const phaseRef = useRef<Phase>("map");
  phaseRef.current = phase;

  // C toggles the game
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if ((e.key === "c" || e.key === "C") && !e.ctrlKey && !e.metaKey && !e.altKey) {
        setOpen(o => {
          if (!o) {
            setSaved(parseInt(localStorage.getItem(PROGRESS_KEY) || "0", 10) || 0);
            setPhase("map");
          }
          return !o;
        });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const enterWorld = useCallback((startCleared: number) => {
    setRunStart(startCleared);
    setRunId(r => r + 1);
    setPhase("world");
  }, []);

  // shell keys
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      const ph = phaseRef.current;
      if ([" ", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(k)) e.preventDefault();
      if (k === "escape") {
        if (ph === "world") setPhase("pause");
        else if (ph === "pause") setPhase("world");
        else if (ph === "victory") setPhase("world");
        else setOpen(false);
        return;
      }
      if ((k === " " || k === "enter") && ph === "victory") setPhase("world");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const onEngineEvent = useCallback((e: "victory" | "ending" | "pause", data?: number) => {
    if (e === "pause") {
      setPhase(p => (p === "world" ? "pause" : p));
      return;
    }
    if (e === "victory") {
      const zone = data ?? 0;
      const cleared = zone + 1;
      const prev = parseInt(localStorage.getItem(PROGRESS_KEY) || "0", 10) || 0;
      if (cleared > prev) localStorage.setItem(PROGRESS_KEY, String(cleared));
      setSaved(Math.max(prev, cleared));
      setVicChapter(zone);
      setPhase("victory");
      return;
    }
    if (e === "ending") {
      localStorage.setItem(PROGRESS_KEY, "4");
      setSaved(4);
      setPhase("ending");
    }
  }, []);

  const exitTo = useCallback((sectionId: string) => {
    setOpen(false);
    setTimeout(() => document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" }), 150);
  }, []);

  const vc = CHAPTERS[vicChapter];
  const engineMounted = open && phase !== "map";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="career-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/92 backdrop-blur-sm"
        >
          <div className="relative w-[min(96vw,1180px)] aspect-video max-h-[88vh] border border-amber-500/25 bg-[#0d0a08] overflow-hidden">
            {phase === "map" && (
              <div
                className="absolute inset-0 opacity-40"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,176,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,176,0,0.05) 1px, transparent 1px)",
                  backgroundSize: "44px 44px",
                }}
              />
            )}

            {engineMounted && (
              <Engine3D key={runId} initialCleared={runStart} paused={phase !== "world"} onEvent={onEngineEvent} />
            )}

            {phase === "world" && (
              <button
                onClick={() => setPhase("pause")}
                className="absolute top-2 right-3 z-10 font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-600 hover:text-zinc-300 transition-colors"
              >
                [esc] pause
              </button>
            )}

            <AnimatePresence mode="wait">
              {/* ── CAMPAIGN MAP ── */}
              {phase === "map" && (
                <motion.div key="map" {...fade} className="absolute inset-0 flex flex-col items-center justify-center px-6 overflow-y-auto">
                  <div className="text-center mb-5">
                    <p className="font-mono text-[9px] uppercase tracking-[0.35em] text-zinc-500 mb-1.5">anshulpatil.is-a.dev presents</p>
                    <h2 className="font-display text-5xl text-accent leading-none mb-2">Career Mode</h2>
                    <p className="font-mono text-[10px] text-zinc-500">
                      one path · 3 boss fights · at the end of the road, him
                    </p>
                  </div>

                  <div className="relative w-full max-w-md">
                    <div className="absolute left-[13px] top-2 bottom-2 w-px bg-zinc-800" />
                    {CHAPTERS.map((c, i) => {
                      const cleared = saved > i;
                      const unlocked = saved >= i;
                      const isFinal = i === CHAPTERS.length - 1;
                      return (
                        <div
                          key={i}
                          className="relative w-full flex items-center gap-4 py-[7px] pl-1 pr-3 text-left"
                        >
                          <span
                            className={`relative z-10 w-[26px] h-[26px] shrink-0 rounded-full border flex items-center justify-center font-mono text-[10px]
                              ${cleared ? "border-green-500/70 text-green-400 bg-[#0d1410]"
                                : unlocked ? (isFinal ? "border-red-500 text-red-400 bg-[#170d0d] animate-pulse" : "border-amber-500 text-accent bg-[#171208] animate-pulse")
                                : "border-zinc-800 text-zinc-700 bg-[#0d0a08]"}`}
                          >
                            {cleared ? "✓" : isFinal ? "★" : ROMAN[i]}
                          </span>
                          <span className="flex-1 min-w-0">
                            <span className={`block font-mono text-[11px] font-bold tracking-wide truncate
                              ${cleared ? "text-zinc-400" : unlocked ? (isFinal ? "text-red-400" : "text-zinc-100") : "text-zinc-700"}`}>
                              {c.bossName}
                              {isFinal && <span className="ml-2 text-[8px] uppercase tracking-[0.2em] border border-red-500/50 text-red-400 px-1.5 py-0.5">the meeting</span>}
                            </span>
                            <span className={`block font-mono text-[9px] truncate ${unlocked ? "text-zinc-500" : "text-zinc-800"}`}>
                              {c.year} · {c.org}{!unlocked ? " · beyond a sealed gate" : ""}
                            </span>
                          </span>
                          <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.15em]">
                            {cleared ? <span className="text-green-500/80 border border-green-500/40 px-1.5 py-0.5">cleared</span>
                              : unlocked ? <span className="text-accent">→ here</span>
                              : <span className="text-zinc-700">🔒</span>}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-6 mt-6">
                    <button
                      onClick={() => enterWorld(saved >= 4 ? 3 : Math.min(saved, 3))}
                      className="font-mono text-xs uppercase tracking-[0.2em] text-ink bg-accent px-8 py-2.5 hover:opacity-85 transition-opacity"
                    >
                      {saved === 0 ? "Begin the journey" : saved >= 4 ? "Walk it again" : "Continue the journey"}
                    </button>
                    {saved > 0 && (
                      <button
                        onClick={() => { localStorage.removeItem(PROGRESS_KEY); setSaved(0); }}
                        className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-600 hover:text-zinc-300 transition-colors"
                      >
                        reset progress
                      </button>
                    )}
                  </div>
                  <p className="font-mono text-[9px] text-zinc-700 mt-3">first person · WASD move · shift to sprint · mouse look · hold click to shoot · R reload · 1-4 weapons · E to interact · desktop only</p>
                </motion.div>
              )}

              {/* ── VICTORY ── */}
              {phase === "victory" && (
                <motion.div key={`vic-${vicChapter}`} {...fade} className="absolute inset-0 flex items-center justify-center px-8 bg-black/45">
                  <div className="max-w-xl w-full border border-amber-500/40 bg-[#0d0a08]/95 p-8">
                    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-green-400 mb-2">boss defeated · gate unsealed</p>
                    <h3 className="font-display text-3xl text-zinc-100 mb-4">{vc.bossName}</h3>
                    <p className="font-mono text-[11px] text-zinc-500 italic mb-5">{vc.quip}</p>
                    <div className="border-l-2 border-accent pl-4 mb-6">
                      <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-zinc-600 mb-1.5">what actually happened · {vc.year}</p>
                      <p className="text-[13px] leading-relaxed text-zinc-300">{vc.victory}</p>
                    </div>
                    {vc.unlock && (
                      <div className="flex items-center gap-3 mb-7 font-mono">
                        <span className="text-[9px] uppercase tracking-[0.25em] text-zinc-600">unlocked</span>
                        <span className="text-sm font-bold text-accent">{vc.unlock}</span>
                        <span className="text-[9px] text-zinc-500">{vc.unlockDesc}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <button onClick={() => exitTo(vc.exitTo)} className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600 hover:text-zinc-300 transition-colors">
                        exit to portfolio ↗
                      </button>
                      <button
                        onClick={() => setPhase("world")}
                        className="font-mono text-xs uppercase tracking-[0.2em] text-ink bg-accent px-6 py-2 hover:opacity-85 transition-opacity"
                      >
                        Continue the path [space]
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── PAUSE ── */}
              {phase === "pause" && (
                <motion.div key="pause" {...fade} className="absolute inset-0 flex flex-col items-center justify-center text-center bg-black/55">
                  <h3 className="font-display text-4xl text-zinc-100 mb-8">Paused</h3>
                  <div className="flex flex-col gap-3">
                    <button onClick={() => setPhase("world")} className="font-mono text-xs uppercase tracking-[0.2em] text-ink bg-accent px-8 py-2.5 hover:opacity-85 transition-opacity">
                      Resume [esc]
                    </button>
                    <button onClick={() => setPhase("map")} className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-400 border border-zinc-700 px-8 py-2 hover:text-zinc-100 hover:border-zinc-500 transition-colors">
                      Quit to map
                    </button>
                    <button onClick={() => exitTo("jobs")} className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-600 hover:text-zinc-300 transition-colors mt-2">
                      Exit to portfolio ↗
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ── ENDING ── */}
              {phase === "ending" && (
                <motion.div key="ending" {...fade} className="absolute inset-0 flex items-center justify-center px-8 bg-black/45">
                  <div className="max-w-xl w-full border border-green-400/40 bg-[#0d0a08]/95 p-8 text-center">
                    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-green-400 mb-3">the only winning move</p>
                    <h3 className="font-display text-5xl text-zinc-100 mb-2">Offer Accepted</h3>
                    <p className="font-mono text-[11px] text-zinc-400 mb-8">
                      Three bosses. One path. Every bullet bounced off the last obstacle.<br />
                      And when you finally met him, he asked for the one thing that could end it — a job offer.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 mb-8">
                      <a href="mailto:anshulpatil1022@gmail.com" className="font-mono text-xs uppercase tracking-[0.2em] text-ink bg-accent px-6 py-2.5 hover:opacity-85 transition-opacity">
                        Send the real offer
                      </a>
                      <a href={profile.resumeURL} download className="font-mono text-xs uppercase tracking-[0.2em] text-accent border border-amber-500/40 px-6 py-2.5 hover:border-amber-500 transition-colors">
                        Résumé
                      </a>
                    </div>
                    <p className="font-mono text-[10px] text-zinc-600 mb-6">anshulpatil1022@gmail.com · github.com/AnshulPatil2005</p>
                    <button onClick={() => exitTo("contact")} className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600 hover:text-zinc-300 transition-colors">
                      roll credits — return to portfolio ↗
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
