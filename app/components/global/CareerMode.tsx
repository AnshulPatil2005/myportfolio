"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { profile } from "@/lib/data";
import { CHAPTERS, ROMAN, PROGRESS_KEY, LINKEDIN_URL, INTERVIEW, FOCUS_PITCH } from "./career/data";
import type { RunStats } from "./career/Engine3D";

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

type Phase = "map" | "world" | "interlude" | "victory" | "pause" | "interview" | "ending";

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
  const [introChapter, setIntroChapter] = useState(0);
  const [runId, setRunId] = useState(0);
  const [runStart, setRunStart] = useState(0);
  const [stats, setStats] = useState<RunStats | null>(null);
  const [tooSmall, setTooSmall] = useState(false);
  const [cue, setCue] = useState(0);
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [reply, setReply] = useState<string | null>(null);
  const [rank, setRank] = useState<{ runs: number; percentile: number | null } | null>(null);
  const [copied, setCopied] = useState(false);
  const phaseRef = useRef<Phase>("map");
  phaseRef.current = phase;

  // opened by the C key or by any "▶ Play" button on the site
  useEffect(() => {
    const openGame = () => {
      // pointer lock + WASD simply do not exist on a phone
      setTooSmall(window.innerWidth < 860 || !window.matchMedia("(pointer: fine)").matches);
      setSaved(parseInt(localStorage.getItem(PROGRESS_KEY) || "0", 10) || 0);
      setPhase("map");
      setOpen(true);
    };
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if ((e.key === "c" || e.key === "C") && !e.ctrlKey && !e.metaKey && !e.altKey) {
        setOpen(o => {
          if (!o) {
            setTooSmall(window.innerWidth < 860 || !window.matchMedia("(pointer: fine)").matches);
            setSaved(parseInt(localStorage.getItem(PROGRESS_KEY) || "0", 10) || 0);
            setPhase("map");
          }
          return !o;
        });
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("career-mode:open", openGame);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("career-mode:open", openGame);
    };
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
        if (ph === "interview" || ph === "ending") return;
        if (ph === "world") setPhase("pause");
        else if (ph === "pause") setPhase("world");
        else if (ph === "victory" || ph === "interlude") setPhase("world");
        else setOpen(false);
        return;
      }
      if ((k === " " || k === "enter") && (ph === "victory" || ph === "interlude")) setPhase("world");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const onEngineEvent = useCallback((e: "victory" | "ending" | "pause" | "interlude" | "interview", data?: number, runStats?: RunStats) => {
    if (e === "pause") {
      setPhase(p => (p === "world" ? "pause" : p));
      return;
    }
    if (e === "interview") {
      setQIdx(0);
      setAnswers([]);
      setReply(null);
      setPhase("interview");
      return;
    }
    if (e === "interlude") {
      setIntroChapter(data ?? 0);
      setPhase("interlude");
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
      if (runStats) {
        setStats(runStats);
        fetch("/api/career-score", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(runStats),
        })
          .then(r => (r.ok ? r.json() : null))
          .then(d => { if (d) setRank({ runs: d.runs, percentile: d.percentile }); })
          .catch(() => { /* ranking is a nicety, never block the ending */ });
      }
      localStorage.setItem(PROGRESS_KEY, "3");
      setSaved(3);
      setPhase("ending");
    }
  }, []);

  // a postable result card, drawn to a canvas so there is nothing to host
  const shareCard = useCallback(async () => {
    if (!stats) return;
    const W = 1200, H = 630;
    const c = document.createElement("canvas");
    c.width = W; c.height = H;
    const x = c.getContext("2d");
    if (!x) return;

    x.fillStyle = "#100d0b"; x.fillRect(0, 0, W, H);
    x.strokeStyle = "rgba(255,176,0,0.35)"; x.lineWidth = 2;
    x.strokeRect(28, 28, W - 56, H - 56);

    x.fillStyle = "#ffb000";
    x.font = "600 20px 'JetBrains Mono', monospace";
    x.fillText("CAREER MODE  ·  COMPLETE", 70, 108);

    x.fillStyle = "#f4f4f5";
    x.font = "italic 82px 'Instrument Serif', Georgia, serif";
    x.fillText("I hired Anshul Patil", 70, 214);

    x.fillStyle = "#a1a1aa";
    x.font = "22px 'JetBrains Mono', monospace";
    x.fillText("beat both bosses, then made him an offer", 70, 262);

    const mm = Math.floor(stats.seconds / 60);
    const ss = String(stats.seconds % 60).padStart(2, "0");
    const cells: [string, string][] = [
      ["TIME", `${mm}:${ss}`],
      ["DEATHS", String(stats.deaths)],
      ["ACCURACY", `${stats.accuracy}%`],
    ];
    cells.forEach(([k, v], i) => {
      const cx = 70 + i * 250;
      x.fillStyle = "#71717a";
      x.font = "16px 'JetBrains Mono', monospace";
      x.fillText(k, cx, 380);
      x.fillStyle = "#ffffff";
      x.font = "600 62px 'JetBrains Mono', monospace";
      x.fillText(v, cx, 448);
    });

    if (rank?.percentile != null) {
      x.fillStyle = "#4ade80";
      x.font = "22px 'JetBrains Mono', monospace";
      x.fillText(`faster than ${rank.percentile}% of visitors`, 70, 512);
    }

    x.fillStyle = "#ffb000";
    x.font = "600 24px 'JetBrains Mono', monospace";
    x.fillText("anshulpatil.is-a.dev", 70, H - 74);

    const blob: Blob | null = await new Promise(res => c.toBlob(res, "image/png"));
    if (!blob) return;
    const file = new File([blob], "career-mode.png", { type: "image/png" });

    const nav = navigator as Navigator & { canShare?: (d: { files: File[] }) => boolean };
    if (nav.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: "Career Mode", text: "I hired Anshul Patil." });
        return;
      } catch { /* user dismissed the sheet — fall through to download */ }
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "career-mode.png";
    a.click();
    URL.revokeObjectURL(url);
  }, [stats, rank]);

  const exitTo = useCallback((sectionId: string) => {
    setOpen(false);
    setTimeout(() => document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" }), 150);
  }, []);

  const vc = CHAPTERS[vicChapter];
  const engineMounted = open && !tooSmall && phase !== "map";
  const focus = FOCUS_PITCH[answers[0]] ?? FOCUS_PITCH.browsing;

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
              <Engine3D key={runId} initialCleared={runStart} paused={phase !== "world"} onEvent={onEngineEvent} cinematicCue={cue} />
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
              {/* ── DESKTOP ONLY ── */}
              {tooSmall && (
                <motion.div key="toosmall" {...fade} className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-8 bg-[#0d0a08]">
                  <p className="font-mono text-[9px] uppercase tracking-[0.35em] text-zinc-500 mb-3">career mode</p>
                  <h2 className="font-display text-4xl text-zinc-100 mb-4">Needs a desktop</h2>
                  <p className="text-[14px] leading-relaxed text-zinc-400 max-w-sm mb-8">
                    It is a first-person game — it needs a mouse for pointer-lock aiming
                    and a keyboard to move. Open the site on a laptop and press{" "}
                    <kbd className="border border-zinc-700 px-1.5 py-0.5 font-mono text-[11px]">C</kbd>.
                  </p>
                  <button
                    onClick={() => setOpen(false)}
                    className="font-mono text-xs uppercase tracking-[0.2em] text-ink bg-accent px-7 py-2.5 hover:opacity-85 transition-opacity"
                  >
                    Back to the portfolio
                  </button>
                </motion.div>
              )}

              {/* ── CAMPAIGN MAP ── */}
              {!tooSmall && phase === "map" && (
                <motion.div key="map" {...fade} className="absolute inset-0 flex flex-col items-center justify-center px-6 overflow-y-auto">
                  <div className="text-center mb-5">
                    <p className="font-mono text-[9px] uppercase tracking-[0.35em] text-zinc-500 mb-1.5">anshulpatil.is-a.dev presents</p>
                    <h2 className="font-display text-5xl text-accent leading-none mb-2">Career Mode</h2>
                    <p className="font-mono text-[10px] text-zinc-500">
                      one path · 2 boss fights · at the end of it, him
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
                      onClick={() => enterWorld(saved >= 3 ? 2 : Math.min(saved, 2))}
                      className="font-mono text-xs uppercase tracking-[0.2em] text-ink bg-accent px-8 py-2.5 hover:opacity-85 transition-opacity"
                    >
                      {saved === 0 ? "Begin the journey" : saved >= 3 ? "Walk it again" : "Continue the journey"}
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
                  <p className="font-mono text-[9px] text-zinc-700 mt-3">first person · WASD move · shift to sprint · mouse look · hold click to shoot · R reload · 1-3 weapons · E to interact · desktop only</p>
                </motion.div>
              )}

              {/* ── PRE-LEVEL INTERLUDE ── */}
              {phase === "interlude" && (() => {
                const ic = CHAPTERS[introChapter];
                return (
                  <motion.div key={`intl-${introChapter}`} {...fade} className="absolute inset-0 flex items-center justify-center px-8 bg-black/50">
                    <div className="max-w-xl w-full border border-amber-500/30 bg-[#0d0a08]/95 p-8">
                      <div className="flex items-baseline justify-between mb-1">
                        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500">Chapter {ROMAN[introChapter]} · {ic.year}</p>
                        <p className="font-mono text-[10px] text-zinc-600">{introChapter + 1} / 2</p>
                      </div>
                      <h3 className="font-display text-3xl text-zinc-100 mb-1">{ic.org}</h3>
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent mb-5">{ic.role}</p>
                      <p className="font-mono text-[12.5px] leading-relaxed text-zinc-300 whitespace-pre-line mb-5">{ic.story.join("\n")}</p>
                      <div className="border-l-2 border-accent pl-4 mb-6">
                        <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-zinc-600 mb-1.5">what he did</p>
                        <p className="text-[13px] leading-relaxed text-zinc-300">{ic.victory}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-zinc-600 mb-1">now face it as a boss</p>
                          <p className="font-mono text-sm font-bold text-red-400">{ic.bossName}</p>
                        </div>
                        <button onClick={() => setPhase("world")} className="font-mono text-xs uppercase tracking-[0.2em] text-ink bg-accent px-6 py-2 hover:opacity-85 transition-opacity shrink-0">
                          Fight [space]
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })()}

              {/* ── THE REVERSE INTERVIEW ── */}
              {phase === "interview" && (
                <motion.div key={`iv-${qIdx}-${reply ? 1 : 0}`} {...fade} className="absolute inset-0 flex items-center justify-center px-8 bg-black/70">
                  <div className="max-w-2xl w-full border border-amber-500/35 bg-[#0d0a08]/97 p-9">
                    <div className="flex items-baseline justify-between mb-5">
                      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">anshul is asking</p>
                      <p className="font-mono text-[10px] text-zinc-600">{Math.min(qIdx + 1, INTERVIEW.length)} / {INTERVIEW.length}</p>
                    </div>

                    {reply ? (
                      <>
                        <p className="text-[17px] leading-relaxed text-zinc-100 mb-8">&ldquo;{reply}&rdquo;</p>
                        <button
                          onClick={() => {
                            setReply(null);
                            if (qIdx + 1 >= INTERVIEW.length) { setCue(c => c + 1); setPhase("world"); }
                            else setQIdx(i => i + 1);
                          }}
                          className="font-mono text-xs uppercase tracking-[0.2em] text-ink bg-accent px-7 py-2.5 hover:opacity-85 transition-opacity"
                        >
                          {qIdx + 1 >= INTERVIEW.length ? "Finish" : "Next question"}
                        </button>
                      </>
                    ) : (
                      <>
                        <h3 className="font-display text-3xl text-zinc-100 mb-7 leading-snug">{INTERVIEW[qIdx].q}</h3>
                        <div className="flex flex-col gap-2.5">
                          {INTERVIEW[qIdx].options.map(o => (
                            <button
                              key={o.tag}
                              onClick={() => { setAnswers(a => [...a, o.tag]); setReply(o.reply); }}
                              className="group text-left border border-zinc-800 hover:border-amber-500/60 bg-zinc-950/40 px-5 py-3.5 transition-colors"
                            >
                              <span className="font-mono text-[13px] text-zinc-300 group-hover:text-accent transition-colors">
                                {o.label}
                              </span>
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              )}

              {/* ── VICTORY ── */}
              {phase === "victory" && (
                <motion.div key={`vic-${vicChapter}`} {...fade} className="absolute inset-0 flex items-center justify-center px-8 bg-black/45">
                  <div className="max-w-xl w-full border border-amber-500/40 bg-[#0d0a08]/95 p-8">
                    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-green-400 mb-2">boss defeated · gate unsealed</p>
                    <h3 className="font-display text-3xl text-zinc-100 mb-4">{vc.bossName}</h3>
                    <p className="text-[13px] leading-relaxed text-zinc-400 mb-5 italic">{vc.quip}</p>
                    {vc.bossMsg && (
                      <div className="border dark:border-amber-500/30 border-amber-500/40 bg-amber-500/5 p-4 mb-6">
                        <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-accent mb-2">▸ incoming message — anshul</p>
                        <p className="text-[13.5px] leading-relaxed text-zinc-200">{vc.bossMsg}</p>
                      </div>
                    )}
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
                  <h3 className="font-display text-4xl text-zinc-100 mb-6">Paused</h3>
                  <div className="mb-8 grid grid-cols-2 gap-x-10 gap-y-1.5 font-mono text-[10px] text-left">
                    {[
                      ["WASD", "move"],
                      ["Shift", "sprint"],
                      ["Mouse", "look"],
                      ["Click", "shoot"],
                      ["1 – 3", "weapons"],
                      ["R", "reload"],
                      ["E", "interact"],
                      ["Esc", "pause"],
                    ].map(([k, v]) => (
                      <div key={k} className="flex items-center gap-3">
                        <span className="min-w-[52px] text-zinc-300 border border-zinc-700 px-1.5 py-0.5 text-center">{k}</span>
                        <span className="text-zinc-500 uppercase tracking-[0.15em]">{v}</span>
                      </div>
                    ))}
                  </div>
                  <p className="font-mono text-[10px] text-zinc-600 mb-6 max-w-xs">
                    tip: the barrels in each hall explode — lure a boss past one
                  </p>
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
                    <p className="font-mono text-[11px] text-zinc-400 mb-6">
                      Two bosses. One tunnel. Every bullet bounced off the last obstacle.<br />
                      He told you himself — now go message him about the job offer.
                    </p>

                    {/* what he highlights depends on what they said they wanted */}
                    <div className="border dark:border-amber-500/30 border-amber-500/40 bg-amber-500/5 p-4 mb-6 text-left">
                      <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-accent mb-2">
                        ▸ picked for you — {focus.title}
                      </p>
                      <p className="text-[13.5px] leading-relaxed text-zinc-200 mb-3">{focus.body}</p>
                      <button
                        onClick={() => exitTo(focus.section)}
                        className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400 hover:text-zinc-100 transition-colors"
                      >
                        take me to it ↗
                      </button>
                    </div>
                    {stats && (
                      <div className="flex justify-center gap-8 mb-8 font-mono">
                        {[
                          ["time", `${Math.floor(stats.seconds / 60)}:${String(stats.seconds % 60).padStart(2, "0")}`],
                          ["deaths", String(stats.deaths)],
                          ["accuracy", `${stats.accuracy}%`],
                        ].map(([k, v]) => (
                          <div key={k}>
                            <p className="text-[9px] uppercase tracking-[0.25em] text-zinc-600 mb-1">{k}</p>
                            <p className="text-xl text-zinc-100">{v}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    {rank?.percentile != null && (
                      <p className="font-mono text-[11px] text-green-400 mb-6">
                        faster than {rank.percentile}% of {rank.runs} recorded runs
                      </p>
                    )}
                    <div className="flex flex-wrap justify-center gap-4 mb-4">
                      <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="font-mono text-xs uppercase tracking-[0.2em] text-ink bg-accent px-6 py-2.5 hover:opacity-85 transition-opacity">
                        Message me on LinkedIn
                      </a>
                      <button
                        onClick={shareCard}
                        className="font-mono text-xs uppercase tracking-[0.2em] dark:text-zinc-300 text-zinc-600 border dark:border-zinc-700 border-zinc-300 px-6 py-2.5 hover:dark:border-zinc-500 hover:border-zinc-400 transition-colors"
                      >
                        Share result card
                      </button>
                      <a href="mailto:anshulpatil1022@gmail.com" className="font-mono text-xs uppercase tracking-[0.2em] text-accent border border-amber-500/40 px-6 py-2.5 hover:border-amber-500 transition-colors">
                        Email instead
                      </a>
                      <a href={profile.resumeURL} download className="font-mono text-xs uppercase tracking-[0.2em] dark:text-zinc-400 text-zinc-500 border dark:border-zinc-700 border-zinc-300 px-6 py-2.5 hover:dark:border-zinc-500 hover:border-zinc-400 transition-colors">
                        Résumé
                      </a>
                    </div>
                    <button
                      onClick={() => {
                        const msg = `Hi Anshul — I played Career Mode on your site and finished it in ${Math.floor((stats?.seconds ?? 0) / 60)}m ${String((stats?.seconds ?? 0) % 60).padStart(2, "0")}s. We're hiring for ${focus.title.toLowerCase()} and your ${answers[1] === "tests" ? "testing discipline" : answers[1] === "owns" ? "production ownership" : "shipping pace"} stood out. Can we talk?`;
                        navigator.clipboard?.writeText(msg);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2200);
                      }}
                      className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 hover:text-zinc-200 transition-colors mb-6 block mx-auto"
                    >
                      {copied ? "✓ copied — paste it to him" : "copy an opening message ⧉"}
                    </button>
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
