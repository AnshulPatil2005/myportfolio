"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { profile } from "@/lib/data";

// ─── Canvas ───────────────────────────────────────────────────────────────────
const W = 960, H = 560;
const ACCENT = "#ffb000";
const BG = "#0d0a08";
const RED = "#ff5555";
const TEXT = "#c8b08a";
const DIM = "#5a4535";
const GREEN = "#4ade80";

const ROMAN = ["I", "II", "III", "IV", "V", "VI"];

// ─── Chapters ─────────────────────────────────────────────────────────────────
const CHAPTERS = [
  {
    year: "2025", org: "Techvisio Design", role: "Software Developer Intern",
    story: [
      "First real production system. A full-stack analytics dashboard —",
      "React, Django REST, SQL — drowning under 10,000 user events a day,",
      "300K+ monthly records flowing through AWS S3 pipelines.",
      "The database had become something else. Something slow. Something huge.",
    ],
    bossName: "THE MONOLITH", bossSub: "unindexed · uncached · unkillable (allegedly)",
    victory: "Reduced backend API latency by 40% through query optimization and caching.",
    quip: "weak point found: the queries nobody ever EXPLAIN'd.",
    unlock: "SQL BURST", unlockDesc: "3-round spread — optimized queries hit wider",
    exitTo: "jobs",
  },
  {
    year: "2025", org: "sect_scrape", role: "Research Tooling · Gujarat eCourts",
    story: [
      "Thousands of disposed CRMA bail cases — CrPC 436, 437, 438, 439 —",
      "locked behind the eCourts portal. Playwright automation, OCR,",
      "structured JSONL, preserved source PDFs.",
      "But the portal had a guardian. It demanded proof of humanity. Repeatedly.",
    ],
    bossName: "THE GATEKEEPER", bossSub: "shoot the highlighted glyph — sequence matters",
    victory: "Automated the eCourts portal with Playwright + CAPTCHA/OCR handling, storing structured metadata in JSON/JSONL/SQLite with preserved source HTML/PDF orders.",
    quip: "verification complete: he was human. the scraper wasn't. it won anyway.",
    unlock: "HEADLESS AUTOMATION", unlockDesc: "fire rate up — the browser never sleeps",
    exitTo: "projects",
  },
  {
    year: "2025–26", org: "Gujarati Legal NLP", role: "Independent Research",
    story: [
      "The scraped judgments should have been text. They weren't.",
      "Legacy fonts — LMG-Arun, TERAFONT-VARUN — corrupted ToUnicode maps,",
      "glyphs pretending to be letters. Valid-looking PDFs storing garbage.",
      "The corpus itself was hostile.",
    ],
    bossName: "THE CORRUPTED SCRIPT", bossSub: "living mojibake — purify the swarm",
    victory: "Built a multi-strategy extraction pipeline — legacy font conversion, Tesseract, SuryaOCR, Cloud Vision, glyph-to-Unicode mapping — turning corrupted court PDFs into an ML-ready Gujarati legal corpus.",
    quip: "every glyph mapped. every conjunct restored. the text confessed.",
    unlock: "OCR BEAM", unlockDesc: "shots pierce — nothing stays unreadable",
    exitTo: "research",
  },
  {
    year: "2026", org: "GSoC · BRL-CAD", role: "Selected Contributor · Manifold",
    story: [
      "Google Summer of Code. A C++ geometry engine that must produce",
      "the exact same mesh on every platform, every compiler, every run.",
      "But floating point drifts. Builds diverge. The same operation",
      "returns a subtly different truth on every machine.",
    ],
    bossName: "NON-DETERMINISM", bossSub: "only one instance is real — pin it down",
    victory: "Designed cross-platform determinism checks with fixed mesh cases, canonical artifacts, and SHA256 comparison — plus ASan/UBSan testing and benchmark workflows with dashboard trend visualization.",
    quip: "SHA256 matched on all platforms. reality agreed with itself again.",
    unlock: "DETERMINISTIC BEAM", unlockDesc: "damage up — every shot lands identically",
    exitTo: "jobs",
  },
  {
    year: "2026", org: "Stratum", role: "Founder · Builder",
    story: [
      "Everything learned, fused into one product: an intelligence layer",
      "that reviews PRs, scores deployment risk, and correlates production",
      "incidents back to the code that caused them.",
      "To build it, he had to face the thing it detects.",
    ],
    bossName: "ARCHITECTURE DRIFT", bossSub: "destroy the risky modules to expose the core",
    victory: "Shipped Stratum — PR review with typed findings and risk scoring, deployment conflict detection, live architecture-drift mapping, and Sentry/Render/Railway incident correlation. 4 stages, 115 tests, 3 providers.",
    quip: "drift contained. the modules hold. this is what the product does daily.",
    unlock: "FULL STACK", unlockDesc: "everything at once — spread, pierce, speed",
    exitTo: "featured-work",
  },
  {
    year: "NOW", org: "The Interview", role: "Final Chapter",
    story: [
      "You've cleared his history. Beaten every problem he ever beat.",
      "One obstacle remains between you and the end of this portfolio.",
      "He is standing in the arena. He has seen everything you can do.",
      "He built everything you just fought.",
    ],
    bossName: "ANSHUL PATIL", bossSub: "full-stack developer · immune to conventional weapons",
    victory: "", quip: "", unlock: "", unlockDesc: "",
    exitTo: "contact",
  },
];

// ─── Weapons (tier = chapters cleared) ────────────────────────────────────────
const WEAPONS = [
  { name: "CONSOLE.LOG", rate: 4,  shots: 1, spread: 0,    dmg: 4, pierce: 0 },
  { name: "SQL BURST",   rate: 4,  shots: 3, spread: 0.22, dmg: 4, pierce: 0 },
  { name: "HEADLESS AUTOMATION", rate: 7, shots: 3, spread: 0.22, dmg: 4, pierce: 0 },
  { name: "OCR BEAM",    rate: 7,  shots: 3, spread: 0.2,  dmg: 5, pierce: 1 },
  { name: "DETERMINISTIC BEAM", rate: 8, shots: 3, spread: 0.18, dmg: 6, pierce: 1 },
  { name: "FULL STACK",  rate: 10, shots: 5, spread: 0.34, dmg: 6, pierce: 2 },
];

const GLYPHS = ["અ", "ક", "ષ", "જ્ઞ", "ર", "૨", "Ø", "�", "Ξ", "ঌ"];
const IMMUNE_TEXTS = ["0", "IMMUNE", "0", "already fixed", "0", "skill issue", "0", "nice try"];
const ANSHUL_TAUNTS = [
  "You can't debug me.",
  "I wrote the boss you fought two chapters ago.",
  "Your DPS is impressive. Irrelevant, but impressive.",
  "There is exactly one way to defeat me.",
  "Check my references. Then check your inventory.",
  "I am immune to bullets. Not to opportunities.",
];

// ─── Types ────────────────────────────────────────────────────────────────────
interface PB { x: number; y: number; vx: number; vy: number; dmg: number; pierce: number; dead: boolean }
interface EB { x: number; y: number; vx: number; vy: number; r: number; ch?: string; dead: boolean }
interface Minion { x: number; y: number; vx: number; vy: number; hp: number; t: number; ang: number; diving: boolean; ch: string; dead: boolean }
interface Shield { ang: number; hp: number; ch: string; alive: boolean }
interface Mod { ang: number; hp: number; label: string; cd: number; alive: boolean }
interface Zone { x: number; y: number; r: number; warm: number; life: number }
interface Floater { x: number; y: number; txt: string; t: number; color: string }
interface Particle { x: number; y: number; vx: number; vy: number; t: number; max: number; color: string }

interface FightState {
  ch: number;
  t: number;
  player: { x: number; y: number; hp: number; invuln: number; fireCd: number };
  pb: PB[]; eb: EB[]; minions: Minion[]; floaters: Floater[]; parts: Particle[];
  bossX: number; bossY: number; bossHp: number; bossMax: number;
  shake: number;
  note: string; noteT: number;
  // per-boss mech
  vented: boolean; ventT: number;
  cdA: number; cdB: number; cdC: number; burst: number;
  shields: Shield[]; openT: number;
  spiralA: number;
  ghosts: { x: number; y: number }[]; realIdx: number; pinHits: number; pinT: number; shuffleT: number;
  mods: Mod[]; exposedT: number; zones: Zone[];
  finalT: number; tauntIdx: number; offer: { x: number; y: number } | null; offerT: number;
  cineT: number;
}

type Phase = "title" | "interlude" | "fight" | "victory" | "dead" | "pause" | "cine" | "ending";

function mkFight(ch: number): FightState {
  return {
    ch, t: 0,
    player: { x: W / 2, y: H - 80, hp: 100, invuln: 1.2, fireCd: 0 },
    pb: [], eb: [], minions: [], floaters: [], parts: [],
    bossX: W / 2, bossY: 150,
    bossHp: [300, 340, 380, 420, 500, 999][ch], bossMax: [300, 340, 380, 420, 500, 999][ch],
    shake: 0, note: "", noteT: 0,
    vented: false, ventT: 4,
    cdA: 1.2, cdB: 3.5, cdC: 6, burst: 0,
    shields: Array.from({ length: 5 }, (_, i) => ({ ang: (i / 5) * Math.PI * 2, hp: 24, ch: GLYPHS[i], alive: true })),
    openT: 0,
    spiralA: 0,
    ghosts: [], realIdx: 0, pinHits: 0, pinT: 0, shuffleT: 0,
    mods: ["auth", "api", "billing", "config"].map((label, i) => ({ ang: (i / 4) * Math.PI * 2, hp: 55, label, cd: 1 + i * 0.6, alive: true })),
    exposedT: 0, zones: [],
    finalT: 0, tauntIdx: 0, offer: null, offerT: 0,
    cineT: 0,
  };
}

// ─── Shot helpers ─────────────────────────────────────────────────────────────
function aimAt(fs: FightState, x: number, y: number, speed: number, r = 5, ch?: string, offAng = 0) {
  if (fs.eb.length > 420) return;
  const a = Math.atan2(fs.player.y - y, fs.player.x - x) + offAng;
  fs.eb.push({ x, y, vx: Math.cos(a) * speed, vy: Math.sin(a) * speed, r, ch, dead: false });
}
function ring(fs: FightState, x: number, y: number, n: number, speed: number, phase = 0, r = 5, ch?: string) {
  if (fs.eb.length > 420) return;
  for (let i = 0; i < n; i++) {
    const a = phase + (i / n) * Math.PI * 2;
    fs.eb.push({ x, y, vx: Math.cos(a) * speed, vy: Math.sin(a) * speed, r, ch, dead: false });
  }
}
function floater(fs: FightState, x: number, y: number, txt: string, color = ACCENT) {
  fs.floaters.push({ x, y, txt, t: 0, color });
}
function burst(fs: FightState, x: number, y: number, n: number, color: string, speed = 140) {
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2, s = speed * (0.3 + Math.random() * 0.7);
    fs.parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, t: 0, max: 0.4 + Math.random() * 0.4, color });
  }
}

// ─── Boss updates ─────────────────────────────────────────────────────────────
function updMonolith(fs: FightState, dt: number) {
  fs.bossX = W / 2 + Math.sin(fs.t * 0.5) * 140;
  fs.ventT -= dt;
  if (fs.ventT <= 0) {
    fs.vented = !fs.vented;
    fs.ventT = fs.vented ? 2.6 : 4;
    if (fs.vented) { fs.note = "VENTING — STRIKE NOW"; fs.noteT = 1.4; }
  }
  fs.cdA -= dt;
  if (fs.cdA <= 0) { fs.cdA = 1.25; ring(fs, fs.bossX, fs.bossY, 10, 115, fs.t); }
  fs.cdB -= dt;
  if (fs.cdB <= 0) { fs.cdB = 3.6; fs.burst = 3; fs.cdC = 0; }
  if (fs.burst > 0) {
    fs.cdC -= dt;
    if (fs.cdC <= 0) { fs.cdC = 0.16; fs.burst--; aimAt(fs, fs.bossX, fs.bossY + 40, 230, 9); }
  }
}
function updGatekeeper(fs: FightState, dt: number) {
  fs.bossX = W / 2 + Math.sin(fs.t * 0.7) * 180;
  fs.bossY = 150 + Math.sin(fs.t * 1.4) * 34;
  const alive = fs.shields.filter(s => s.alive);
  if (alive.length === 0) {
    if (fs.openT <= 0) { fs.openT = 6; fs.note = "GATE OPEN"; fs.noteT = 1.4; }
    fs.openT -= dt;
    if (fs.openT <= 0) { fs.shields.forEach(s => { s.alive = true; s.hp = 24; }); fs.note = "SHIELDS RESTORED"; fs.noteT = 1.2; }
  }
  fs.cdA -= dt;
  if (fs.cdA <= 0) {
    fs.cdA = 1.5;
    for (let i = 0; i < 3; i++) aimAt(fs, fs.bossX, fs.bossY, 190, 6, GLYPHS[(Math.random() * GLYPHS.length) | 0], (i - 1) * 0.14);
  }
  fs.cdB -= dt;
  if (fs.cdB <= 0) { fs.cdB = 4.4; ring(fs, fs.bossX, fs.bossY, 12, 130, fs.t, 5, "?"); }
}
function updScript(fs: FightState, dt: number) {
  fs.cdC -= dt;
  if (fs.cdC <= 0) { fs.cdC = 2; fs.bossX = W / 2 + (Math.random() - 0.5) * 360; fs.bossY = 130 + Math.random() * 90; }
  // spiral
  fs.spiralA += dt * 2.6;
  fs.cdA -= dt;
  if (fs.cdA <= 0) {
    fs.cdA = 0.085;
    for (const off of [0, Math.PI]) {
      if (fs.eb.length > 420) break;
      const a = fs.spiralA + off;
      fs.eb.push({ x: fs.bossX, y: fs.bossY, vx: Math.cos(a) * 130, vy: Math.sin(a) * 130, r: 5, ch: GLYPHS[(Math.random() * GLYPHS.length) | 0], dead: false });
    }
  }
  // minions
  fs.cdB -= dt;
  if (fs.cdB <= 0 && fs.minions.filter(m => !m.dead).length < 6) {
    fs.cdB = 1.5;
    fs.minions.push({ x: fs.bossX, y: fs.bossY, vx: 0, vy: 0, hp: 10, t: 0, ang: Math.random() * Math.PI * 2, diving: false, ch: GLYPHS[(Math.random() * GLYPHS.length) | 0], dead: false });
  }
  for (const m of fs.minions) {
    if (m.dead) continue;
    m.t += dt;
    if (!m.diving) {
      m.ang += dt * 1.6;
      m.x = fs.bossX + Math.cos(m.ang) * 70;
      m.y = fs.bossY + Math.sin(m.ang) * 70;
      if (m.t > 2.5) {
        m.diving = true;
        const a = Math.atan2(fs.player.y - m.y, fs.player.x - m.x);
        m.vx = Math.cos(a) * 270; m.vy = Math.sin(a) * 270;
      }
    } else {
      m.x += m.vx * dt; m.y += m.vy * dt;
      if (m.x < -30 || m.x > W + 30 || m.y < -30 || m.y > H + 30) m.dead = true;
    }
  }
}
function updNonDet(fs: FightState, dt: number) {
  if (fs.pinT > 0) {
    fs.pinT -= dt;
    fs.ghosts = [{ x: W / 2, y: 160 }];
    fs.realIdx = 0;
    fs.bossX = W / 2; fs.bossY = 160;
    if (fs.pinT <= 0) { fs.pinHits = 0; fs.shuffleT = 0; }
    return; // pinned: no attacks
  }
  fs.shuffleT -= dt;
  if (fs.shuffleT <= 0 || fs.ghosts.length < 3) {
    fs.shuffleT = 3;
    const base = fs.t * 0.4;
    fs.ghosts = [0, 1, 2].map(i => ({
      x: W / 2 + Math.cos(base + (i / 3) * Math.PI * 2) * 170,
      y: 165 + Math.sin(base + (i / 3) * Math.PI * 2) * 62,
    }));
    const old = fs.ghosts[fs.realIdx] || { x: W / 2, y: 160 };
    fs.realIdx = (Math.random() * 3) | 0;
    ring(fs, old.x, old.y, 14, 150, fs.t);
  }
  const real = fs.ghosts[fs.realIdx];
  fs.bossX = real.x; fs.bossY = real.y;
  fs.cdA -= dt;
  if (fs.cdA <= 0) {
    fs.cdA = 2;
    fs.ghosts.forEach((g, i) => {
      for (let k = -2; k <= 2; k++) aimAt(fs, g.x, g.y, 165, 5, undefined, k * 0.13 + i * 0.03);
    });
  }
}
function updDrift(fs: FightState, dt: number) {
  fs.bossX = W / 2 + Math.sin(fs.t * 0.6) * 90;
  fs.bossY = 155 + Math.cos(fs.t * 0.8) * 26;
  const anyMod = fs.mods.some(m => m.alive);
  if (!anyMod) {
    if (fs.exposedT <= 0) { fs.exposedT = 8; fs.note = "CORE EXPOSED"; fs.noteT = 1.5; }
    fs.exposedT -= dt;
    if (fs.exposedT <= 0) { fs.mods.forEach(m => { m.alive = true; m.hp = 55; }); fs.note = "MODULES REDEPLOYED"; fs.noteT = 1.4; }
  }
  for (const m of fs.mods) {
    if (!m.alive) continue;
    m.ang += dt * 0.5;
    m.cd -= dt;
    if (m.cd <= 0) {
      m.cd = 2.3;
      const mx = fs.bossX + Math.cos(m.ang) * 150, my = fs.bossY + Math.sin(m.ang) * 150;
      aimAt(fs, mx, my, 185, 6);
    }
  }
  fs.cdA -= dt;
  if (fs.cdA <= 0) {
    fs.cdA = 6;
    fs.zones = Array.from({ length: 3 }, () => ({
      x: fs.player.x + (Math.random() - 0.5) * 260,
      y: fs.player.y + (Math.random() - 0.5) * 200,
      r: 58, warm: 1, life: 4,
    }));
  }
  for (const z of fs.zones) {
    if (z.warm > 0) z.warm -= dt;
    else z.life -= dt;
  }
  fs.zones = fs.zones.filter(z => z.life > 0);
  fs.cdB -= dt;
  if (fs.cdB <= 0) { fs.cdB = 5; ring(fs, fs.bossX, fs.bossY, 16, 120, fs.t, 5, GLYPHS[(Math.random() * GLYPHS.length) | 0]); }
}
function updFinal(fs: FightState, dt: number) {
  fs.finalT += dt;
  fs.bossX = W / 2 + Math.sin(fs.t * 0.5) * 120;
  fs.bossY = 150 + Math.sin(fs.t * 1.1) * 18;

  // taunts
  fs.cdC -= dt;
  if (fs.cdC <= 0) {
    fs.cdC = 5;
    fs.note = `ANSHUL: "${ANSHUL_TAUNTS[fs.tauntIdx % ANSHUL_TAUNTS.length]}"`;
    fs.noteT = 3.4;
    fs.tauntIdx++;
  }

  // escalating pattern cycle — he uses every previous boss's moves
  const phase = Math.floor(fs.finalT / 10) % 4;
  fs.cdA -= dt;
  if (fs.cdA <= 0) {
    if (phase === 0) { fs.cdA = 1.1; ring(fs, fs.bossX, fs.bossY, 12, 130, fs.t); }
    else if (phase === 1) { fs.cdA = 1.3; for (let i = 0; i < 3; i++) aimAt(fs, fs.bossX, fs.bossY, 200, 6, GLYPHS[(Math.random() * GLYPHS.length) | 0], (i - 1) * 0.15); }
    else if (phase === 2) { fs.cdA = 0.09; const a = (fs.spiralA += dt * 40); if (fs.eb.length < 420) fs.eb.push({ x: fs.bossX, y: fs.bossY, vx: Math.cos(a) * 140, vy: Math.sin(a) * 140, r: 5, dead: false }); }
    else { fs.cdA = 2; for (let k = -3; k <= 3; k++) aimAt(fs, fs.bossX, fs.bossY, 175, 5, undefined, k * 0.11); }
  }

  // the offer spawns — the only win condition
  if (!fs.offer && (fs.finalT > 22 || fs.player.hp <= 45)) {
    fs.offer = { x: 100 + Math.random() * (W - 200), y: H - 170 - Math.random() * 120 };
    fs.note = "WEAKNESS DISCOVERED: he is open to opportunities. DELIVER THE JOB OFFER.";
    fs.noteT = 5;
  }
  if (fs.offer) fs.offerT += dt;
}

// ─── Player bullet vs boss hit resolution ─────────────────────────────────────
function hitBoss(fs: FightState, b: PB): boolean {
  const ch = fs.ch;
  // final boss: immune
  if (ch === 5) {
    if (Math.hypot(b.x - fs.bossX, b.y - fs.bossY) < 46) {
      floater(fs, b.x, b.y - 8, IMMUNE_TEXTS[(Math.random() * IMMUNE_TEXTS.length) | 0], "#777");
      return true;
    }
    return false;
  }
  // gatekeeper shields
  if (ch === 1) {
    const alive = fs.shields.filter(s => s.alive);
    if (alive.length > 0) {
      for (let i = 0; i < fs.shields.length; i++) {
        const s = fs.shields[i];
        if (!s.alive) continue;
        const sx = fs.bossX + Math.cos(s.ang + fs.t) * 78;
        const sy = fs.bossY + Math.sin(s.ang + fs.t) * 78;
        if (Math.hypot(b.x - sx, b.y - sy) < 16) {
          const firstAlive = fs.shields.findIndex(q => q.alive);
          if (i === firstAlive) {
            s.hp -= b.dmg;
            burst(fs, sx, sy, 4, ACCENT, 90);
            if (s.hp <= 0) { s.alive = false; floater(fs, sx, sy, s.ch + " ✓", GREEN); burst(fs, sx, sy, 14, ACCENT); }
          } else {
            floater(fs, sx, sy, "SEQ!", "#777");
          }
          return true;
        }
      }
      // body immune while shielded
      if (Math.hypot(b.x - fs.bossX, b.y - fs.bossY) < 42) { floater(fs, b.x, b.y, "SHIELDED", "#777"); return true; }
      return false;
    }
  }
  // non-determinism ghosts
  if (ch === 3 && fs.pinT <= 0) {
    for (let i = 0; i < fs.ghosts.length; i++) {
      const g = fs.ghosts[i];
      if (Math.hypot(b.x - g.x, b.y - g.y) < 40) {
        if (i === fs.realIdx) {
          fs.bossHp -= b.dmg; fs.pinHits++;
          floater(fs, b.x, b.y - 6, `-${b.dmg}`, ACCENT);
          burst(fs, b.x, b.y, 3, ACCENT, 80);
          if (fs.pinHits >= 8) { fs.pinT = 3; fs.note = "PINNED — HASHES MATCH"; fs.noteT = 1.6; }
        } else {
          floater(fs, b.x, b.y - 6, "MISMATCH", "#777");
        }
        return true;
      }
    }
    return false;
  }
  // drift modules
  if (ch === 4) {
    for (const m of fs.mods) {
      if (!m.alive) continue;
      const mx = fs.bossX + Math.cos(m.ang) * 150, my = fs.bossY + Math.sin(m.ang) * 150;
      if (Math.hypot(b.x - mx, b.y - my) < 20) {
        m.hp -= b.dmg;
        burst(fs, mx, my, 3, RED, 80);
        if (m.hp <= 0) { m.alive = false; floater(fs, mx, my, m.label + " refactored", GREEN); burst(fs, mx, my, 16, ACCENT); }
        return true;
      }
    }
  }
  // generic body hit
  const r = [70, 42, 44, 40, 46, 46][ch];
  if (Math.hypot(b.x - fs.bossX, b.y - fs.bossY) < r) {
    let mult = 1;
    if (ch === 0) mult = fs.vented ? 1 : 0.25;
    if (ch === 3) mult = fs.pinT > 0 ? 2 : 1;
    if (ch === 4) mult = fs.mods.some(m => m.alive) ? 0.2 : 1;
    const d = b.dmg * mult;
    fs.bossHp -= d;
    floater(fs, b.x, b.y - 6, mult < 1 ? `-${d.toFixed(1)}` : `-${Math.round(d)}`, mult < 1 ? "#777" : mult > 1 ? GREEN : ACCENT);
    burst(fs, b.x, b.y, 3, ACCENT, 80);
    return true;
  }
  return false;
}

// ─── Frame update ─────────────────────────────────────────────────────────────
interface Input { keys: Set<string>; mx: number; my: number; firing: boolean }

function updateFight(fs: FightState, inp: Input, tier: number, dt: number): "ok" | "dead" | "victory" | "cine" {
  fs.t += dt;
  if (fs.noteT > 0) fs.noteT -= dt;
  if (fs.shake > 0) fs.shake = Math.max(0, fs.shake - dt * 26);

  const p = fs.player;
  if (p.invuln > 0) p.invuln -= dt;

  // move
  let dx = 0, dy = 0;
  const k = inp.keys;
  if (k.has("w") || k.has("arrowup")) dy -= 1;
  if (k.has("s") || k.has("arrowdown")) dy += 1;
  if (k.has("a") || k.has("arrowleft")) dx -= 1;
  if (k.has("d") || k.has("arrowright")) dx += 1;
  if (dx || dy) {
    const l = Math.hypot(dx, dy);
    p.x = Math.max(14, Math.min(W - 14, p.x + (dx / l) * 250 * dt));
    p.y = Math.max(14, Math.min(H - 14, p.y + (dy / l) * 250 * dt));
  }

  // fire
  p.fireCd -= dt;
  const wp = WEAPONS[Math.min(tier, WEAPONS.length - 1)];
  if (inp.firing && p.fireCd <= 0) {
    p.fireCd = 1 / wp.rate;
    const aim = Math.atan2(inp.my - p.y, inp.mx - p.x);
    for (let i = 0; i < wp.shots; i++) {
      const off = wp.shots === 1 ? 0 : (i / (wp.shots - 1) - 0.5) * wp.spread;
      fs.pb.push({ x: p.x, y: p.y, vx: Math.cos(aim + off) * 520, vy: Math.sin(aim + off) * 520, dmg: wp.dmg, pierce: wp.pierce, dead: false });
    }
  }

  // boss logic
  [updMonolith, updGatekeeper, updScript, updNonDet, updDrift, updFinal][fs.ch](fs, dt);

  // player bullets
  for (const b of fs.pb) {
    if (b.dead) continue;
    b.x += b.vx * dt; b.y += b.vy * dt;
    if (b.x < -20 || b.x > W + 20 || b.y < -20 || b.y > H + 20) { b.dead = true; continue; }
    // minions
    for (const m of fs.minions) {
      if (m.dead) continue;
      if (Math.hypot(b.x - m.x, b.y - m.y) < 12) {
        m.hp -= b.dmg;
        if (m.hp <= 0) { m.dead = true; burst(fs, m.x, m.y, 8, ACCENT); floater(fs, m.x, m.y, m.ch + " ✓", GREEN); }
        if (b.pierce > 0) b.pierce--; else { b.dead = true; break; }
      }
    }
    if (b.dead) continue;
    if (hitBoss(fs, b)) b.dead = true;
  }

  // enemy bullets
  for (const b of fs.eb) {
    if (b.dead) continue;
    b.x += b.vx * dt; b.y += b.vy * dt;
    if (b.x < -30 || b.x > W + 30 || b.y < -30 || b.y > H + 30) { b.dead = true; continue; }
    if (p.invuln <= 0 && Math.hypot(b.x - p.x, b.y - p.y) < b.r + 9) {
      b.dead = true;
      p.hp -= 9; p.invuln = 1;
      fs.shake = 7;
      burst(fs, p.x, p.y, 10, RED);
    }
  }

  // minion contact
  for (const m of fs.minions) {
    if (m.dead || p.invuln > 0) continue;
    if (Math.hypot(m.x - p.x, m.y - p.y) < 18) {
      m.dead = true; p.hp -= 12; p.invuln = 1; fs.shake = 8; burst(fs, p.x, p.y, 10, RED);
    }
  }

  // corruption zones
  if (fs.ch === 4) {
    for (const z of fs.zones) {
      if (z.warm <= 0 && Math.hypot(z.x - p.x, z.y - p.y) < z.r) p.hp -= 18 * dt;
    }
  }

  // boss contact
  if (p.invuln <= 0 && Math.hypot(fs.bossX - p.x, fs.bossY - p.y) < 52) {
    p.hp -= 14; p.invuln = 1.1; fs.shake = 9; burst(fs, p.x, p.y, 12, RED);
  }

  // the job offer pickup
  if (fs.ch === 5 && fs.offer && Math.hypot(fs.offer.x - p.x, fs.offer.y - p.y) < 30) {
    return "cine";
  }

  // floaters / particles
  for (const f of fs.floaters) f.t += dt;
  fs.floaters = fs.floaters.filter(f => f.t < 0.9);
  for (const pt of fs.parts) { pt.t += dt; pt.x += pt.vx * dt; pt.y += pt.vy * dt; }
  fs.parts = fs.parts.filter(pt => pt.t < pt.max);
  fs.pb = fs.pb.filter(b => !b.dead);
  fs.eb = fs.eb.filter(b => !b.dead);
  fs.minions = fs.minions.filter(m => !m.dead);

  if (p.hp <= 0) return "dead";
  if (fs.ch < 5 && fs.bossHp <= 0) return "victory";
  return "ok";
}

// ─── Render ───────────────────────────────────────────────────────────────────
function drawPoly(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, alpha: number, t: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(t * 0.6);
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = ACCENT;
  ctx.lineWidth = 1.5;
  const pts: [number, number][] = [];
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    pts.push([Math.cos(a) * r, Math.sin(a) * r]);
  }
  ctx.beginPath();
  pts.forEach(([px, py], i) => (i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)));
  ctx.closePath();
  ctx.stroke();
  // internal facets
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]); ctx.lineTo(pts[3][0], pts[3][1]);
  ctx.moveTo(pts[1][0], pts[1][1]); ctx.lineTo(pts[4][0], pts[4][1]);
  ctx.moveTo(pts[2][0], pts[2][1]); ctx.lineTo(pts[5][0], pts[5][1]);
  ctx.stroke();
  ctx.restore();
}

function renderFight(ctx: CanvasRenderingContext2D, fs: FightState, tier: number) {
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, W, H);

  ctx.save();
  if (fs.shake > 0) ctx.translate((Math.random() - 0.5) * fs.shake, (Math.random() - 0.5) * fs.shake);

  // grid
  ctx.strokeStyle = "rgba(255,176,0,0.045)";
  ctx.lineWidth = 1;
  for (let x = 0; x <= W; x += 48) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = 0; y <= H; y += 48) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

  // corruption zones
  for (const z of fs.zones) {
    if (z.warm > 0) {
      ctx.strokeStyle = "rgba(255,85,85,0.5)";
      ctx.setLineDash([6, 6]);
      ctx.beginPath(); ctx.arc(z.x, z.y, z.r, 0, Math.PI * 2); ctx.stroke();
      ctx.setLineDash([]);
    } else {
      ctx.fillStyle = "rgba(255,60,60,0.14)";
      ctx.beginPath(); ctx.arc(z.x, z.y, z.r, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "rgba(255,85,85,0.7)";
      ctx.beginPath(); ctx.arc(z.x, z.y, z.r, 0, Math.PI * 2); ctx.stroke();
    }
  }

  // ── boss ──
  const bx = fs.bossX, by = fs.bossY;
  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  if (fs.ch === 0) {
    // MONOLITH — stacked slabs
    const wobble = Math.sin(fs.t * 2) * 2;
    for (let i = 0; i < 5; i++) {
      const sw = 120 - i * 8, sh = 26;
      const sy = by + 55 - i * 28;
      ctx.fillStyle = "#1c1512";
      ctx.fillRect(bx - sw / 2 + wobble * (i % 2 ? 1 : -1), sy - sh / 2, sw, sh);
      ctx.strokeStyle = fs.vented ? ACCENT : "#4a3828";
      ctx.lineWidth = fs.vented ? 2 : 1.2;
      ctx.strokeRect(bx - sw / 2 + wobble * (i % 2 ? 1 : -1), sy - sh / 2, sw, sh);
    }
    if (fs.vented) {
      ctx.fillStyle = `rgba(255,176,0,${0.25 + Math.sin(fs.t * 10) * 0.15})`;
      ctx.fillRect(bx - 40, by - 20, 80, 60);
    }
    ctx.fillStyle = fs.vented ? ACCENT : "#6a5540";
    ctx.font = "bold 10px monospace";
    ctx.fillText("DB", bx, by - 78);
  } else if (fs.ch === 1) {
    // GATEKEEPER — captcha face
    ctx.fillStyle = "#1c1512";
    ctx.beginPath(); ctx.arc(bx, by, 40, 0, Math.PI * 2); ctx.fill();
    const open = fs.shields.every(s => !s.alive);
    ctx.strokeStyle = open ? ACCENT : "#4a3828"; ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = open ? ACCENT : "#8a7050";
    ctx.font = "bold 9px monospace";
    ctx.fillText("I'M NOT", bx, by - 8);
    ctx.fillText("A ROBOT", bx, by + 4);
    ctx.strokeStyle = open ? ACCENT : "#4a3828";
    ctx.strokeRect(bx - 26, by + 12, 10, 10);
    if (open) { ctx.fillStyle = ACCENT; ctx.font = "10px monospace"; ctx.fillText("✓", bx - 21, by + 17); }
    // shields
    const firstAlive = fs.shields.findIndex(s => s.alive);
    fs.shields.forEach((s, i) => {
      if (!s.alive) return;
      const sx = bx + Math.cos(s.ang + fs.t) * 78;
      const sy = by + Math.sin(s.ang + fs.t) * 78;
      const hot = i === firstAlive;
      ctx.fillStyle = hot ? ACCENT : "#555";
      ctx.font = hot ? "bold 18px monospace" : "16px monospace";
      ctx.fillText(s.ch, sx, sy);
      if (hot) { ctx.strokeStyle = "rgba(255,176,0,0.5)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(sx, sy, 15, 0, Math.PI * 2); ctx.stroke(); }
    });
  } else if (fs.ch === 2) {
    // CORRUPTED SCRIPT — jitter cluster
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2 + fs.t;
      const rr = 20 + Math.sin(fs.t * 3 + i) * 12;
      ctx.fillStyle = i % 3 === 0 ? RED : ACCENT;
      ctx.globalAlpha = 0.5 + Math.random() * 0.5;
      ctx.font = `${12 + (i % 3) * 4}px monospace`;
      ctx.fillText(GLYPHS[(i + ((fs.t * 4) | 0)) % GLYPHS.length], bx + Math.cos(a) * rr + (Math.random() - 0.5) * 6, by + Math.sin(a) * rr + (Math.random() - 0.5) * 6);
    }
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#fff";
    ctx.font = "bold 22px monospace";
    ctx.fillText("�", bx, by);
  } else if (fs.ch === 3) {
    // NON-DETERMINISM — polyhedron ghosts
    fs.ghosts.forEach((g, i) => {
      const real = i === fs.realIdx;
      drawPoly(ctx, g.x, g.y, 36, real ? 1 : 0.3 + Math.random() * 0.15, fs.t + i);
      if (real && fs.pinT <= 0) {
        ctx.globalAlpha = 0.7;
        ctx.fillStyle = ACCENT; ctx.font = "7px monospace";
        ctx.fillText("a3f9…" + ((fs.t * 10) | 0) % 10, g.x, g.y + 50);
        ctx.globalAlpha = 1;
      }
    });
    if (fs.pinT > 0) {
      ctx.strokeStyle = GREEN; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(fs.bossX, fs.bossY, 46, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = GREEN; ctx.font = "bold 8px monospace";
      ctx.fillText("SHA256 LOCKED", fs.bossX, fs.bossY + 58);
    }
  } else if (fs.ch === 4) {
    // ARCHITECTURE DRIFT — core + modules
    const exposed = !fs.mods.some(m => m.alive);
    ctx.fillStyle = "#1c1512";
    ctx.beginPath(); ctx.arc(bx, by, 42, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = exposed ? ACCENT : RED;
    ctx.lineWidth = 2;
    ctx.setLineDash(exposed ? [] : [4, 4]);
    ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = exposed ? ACCENT : RED;
    ctx.font = "bold 9px monospace";
    ctx.fillText("DRIFT", bx, by - 4);
    ctx.font = "7px monospace";
    ctx.fillText(exposed ? "EXPOSED" : "ARMORED", bx, by + 8);
    for (const m of fs.mods) {
      if (!m.alive) continue;
      const mx = bx + Math.cos(m.ang) * 150, my = by + Math.sin(m.ang) * 150;
      ctx.fillStyle = "#1c1210";
      ctx.fillRect(mx - 22, my - 11, 44, 22);
      ctx.strokeStyle = RED; ctx.lineWidth = 1.2;
      ctx.strokeRect(mx - 22, my - 11, 44, 22);
      ctx.fillStyle = RED; ctx.font = "bold 8px monospace";
      ctx.fillText(m.label, mx, my - 1);
      ctx.fillStyle = "#3a2018";
      ctx.fillRect(mx - 18, my + 4, 36, 2);
      ctx.fillStyle = ACCENT;
      ctx.fillRect(mx - 18, my + 4, 36 * (m.hp / 55), 2);
    }
  } else {
    // FINAL — ANSHUL
    const bob = Math.sin(fs.t * 2) * 3;
    // aura
    ctx.fillStyle = `rgba(255,176,0,${0.05 + Math.sin(fs.t * 3) * 0.03})`;
    ctx.beginPath(); ctx.arc(bx, by + bob, 60, 0, Math.PI * 2); ctx.fill();
    // body
    ctx.strokeStyle = ACCENT; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(bx, by - 24 + bob, 13, 0, Math.PI * 2); ctx.stroke(); // head
    ctx.beginPath();
    ctx.moveTo(bx, by - 11 + bob); ctx.lineTo(bx, by + 18 + bob); // torso
    ctx.moveTo(bx, by - 2 + bob); ctx.lineTo(bx - 20, by + 12 + bob); // arms to laptop
    ctx.moveTo(bx, by - 2 + bob); ctx.lineTo(bx + 20, by + 12 + bob);
    ctx.moveTo(bx, by + 18 + bob); ctx.lineTo(bx - 12, by + 40 + bob);
    ctx.moveTo(bx, by + 18 + bob); ctx.lineTo(bx + 12, by + 40 + bob);
    ctx.stroke();
    // laptop
    ctx.fillStyle = "#1c1512";
    ctx.fillRect(bx - 24, by + 10 + bob, 48, 14);
    ctx.strokeStyle = ACCENT; ctx.lineWidth = 1.2;
    ctx.strokeRect(bx - 24, by + 10 + bob, 48, 14);
    ctx.fillStyle = `rgba(255,176,0,${0.5 + Math.sin(fs.t * 8) * 0.3})`;
    ctx.fillRect(bx - 20, by + 13 + bob, 40, 8);
    // name
    ctx.fillStyle = ACCENT; ctx.font = "bold 10px monospace";
    ctx.fillText("ANSHUL PATIL", bx, by - 52 + bob);
    ctx.fillStyle = "#8a7050"; ctx.font = "7px monospace";
    ctx.fillText("FULL-STACK DEVELOPER · FINAL BOSS", bx, by - 41 + bob);

    // the offer
    if (fs.offer) {
      const o = fs.offer;
      const pulse = 0.6 + Math.sin(fs.offerT * 5) * 0.4;
      ctx.fillStyle = `rgba(74,222,128,${0.12 * pulse})`;
      ctx.beginPath(); ctx.arc(o.x, o.y, 34, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#10160f";
      ctx.fillRect(o.x - 16, o.y - 11, 32, 22);
      ctx.strokeStyle = GREEN; ctx.lineWidth = 1.5;
      ctx.strokeRect(o.x - 16, o.y - 11, 32, 22);
      ctx.beginPath();
      ctx.moveTo(o.x - 16, o.y - 11); ctx.lineTo(o.x, o.y + 2); ctx.lineTo(o.x + 16, o.y - 11);
      ctx.stroke();
      ctx.fillStyle = GREEN; ctx.font = "bold 8px monospace";
      ctx.fillText("[ JOB OFFER ]", o.x, o.y + 24);
      ctx.globalAlpha = pulse;
      ctx.fillText("DELIVER IT", o.x, o.y - 22);
      ctx.globalAlpha = 1;
    }
  }

  // minions
  for (const m of fs.minions) {
    ctx.fillStyle = m.diving ? RED : ACCENT;
    ctx.font = "bold 13px monospace";
    ctx.fillText(m.ch, m.x, m.y);
  }

  // enemy bullets
  for (const b of fs.eb) {
    if (b.ch) {
      ctx.fillStyle = RED;
      ctx.font = "11px monospace";
      ctx.fillText(b.ch, b.x, b.y);
    } else {
      ctx.fillStyle = RED;
      ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.fill();
    }
  }

  // player bullets
  ctx.fillStyle = ACCENT;
  for (const b of fs.pb) {
    ctx.beginPath(); ctx.arc(b.x, b.y, 3, 0, Math.PI * 2); ctx.fill();
  }

  // player
  const p = fs.player;
  const flicker = p.invuln > 0 && ((fs.t * 14) | 0) % 2 === 0;
  if (!flicker) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(0, -10); ctx.lineTo(7, 8); ctx.lineTo(0, 4); ctx.lineTo(-7, 8);
    ctx.closePath(); ctx.stroke();
    ctx.restore();
  }

  // particles
  for (const pt of fs.parts) {
    ctx.globalAlpha = 1 - pt.t / pt.max;
    ctx.fillStyle = pt.color;
    ctx.fillRect(pt.x - 1.5, pt.y - 1.5, 3, 3);
  }
  ctx.globalAlpha = 1;

  // floaters
  for (const f of fs.floaters) {
    ctx.globalAlpha = 1 - f.t / 0.9;
    ctx.fillStyle = f.color;
    ctx.font = "bold 10px monospace";
    ctx.fillText(f.txt, f.x, f.y - f.t * 30);
  }
  ctx.globalAlpha = 1;

  ctx.restore(); // shake

  // ── HUD ──
  const chData = CHAPTERS[fs.ch];
  // chapter
  ctx.fillStyle = DIM; ctx.font = "9px monospace"; ctx.textAlign = "left"; ctx.textBaseline = "top";
  ctx.fillText(`CHAPTER ${ROMAN[fs.ch]} · ${chData.year}`, 12, 10);
  // boss bar
  ctx.textAlign = "center";
  ctx.fillStyle = TEXT; ctx.font = "bold 10px monospace";
  ctx.fillText(chData.bossName, W / 2, 10);
  const bw = 380;
  ctx.fillStyle = "#241a10";
  ctx.fillRect(W / 2 - bw / 2, 24, bw, 7);
  if (fs.ch === 5) {
    const frac = fs.cineT > 0 ? Math.max(0, fs.bossHp / 999) : 1;
    ctx.fillStyle = fs.cineT > 0 ? GREEN : ACCENT;
    ctx.fillRect(W / 2 - bw / 2, 24, bw * frac, 7);
    if (fs.cineT <= 0) {
      ctx.fillStyle = "#0d0a08"; ctx.font = "bold 7px monospace";
      ctx.fillText("∞", W / 2, 27.5);
    }
  } else {
    ctx.fillStyle = ACCENT;
    ctx.fillRect(W / 2 - bw / 2, 24, bw * Math.max(0, fs.bossHp / fs.bossMax), 7);
  }
  // player hp
  ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
  ctx.fillStyle = DIM; ctx.font = "8px monospace";
  ctx.fillText("HP", 12, H - 26);
  ctx.fillStyle = "#241a10";
  ctx.fillRect(12, H - 22, 160, 8);
  const hpFrac = Math.max(0, p.hp / 100);
  ctx.fillStyle = hpFrac > 0.5 ? GREEN : hpFrac > 0.25 ? ACCENT : RED;
  ctx.fillRect(12, H - 22, 160 * hpFrac, 8);
  // weapon
  ctx.textAlign = "right";
  ctx.fillStyle = ACCENT; ctx.font = "bold 9px monospace";
  ctx.fillText(WEAPONS[Math.min(tier, WEAPONS.length - 1)].name, W - 12, H - 16);
  // note
  if (fs.noteT > 0) {
    ctx.textAlign = "center";
    ctx.fillStyle = `rgba(255,196,60,${Math.min(1, fs.noteT)})`;
    ctx.font = "bold 11px monospace";
    ctx.fillText(fs.note, W / 2, 54);
  }
}

// cinematic render — the offer is delivered
function renderCine(ctx: CanvasRenderingContext2D, fs: FightState, dt: number) {
  fs.cineT += dt;
  fs.t += dt;
  fs.eb = []; fs.pb = []; fs.minions = [];
  // drain HP bar dramatically
  fs.bossHp = Math.max(0, 999 * (1 - fs.cineT / 2.2));
  if (fs.cineT > 0.4 && Math.random() < 0.3) {
    burst(fs, fs.bossX + (Math.random() - 0.5) * 80, fs.bossY + (Math.random() - 0.5) * 80, 6, Math.random() < 0.5 ? ACCENT : GREEN, 120);
  }
  for (const pt of fs.parts) { pt.t += dt; pt.x += pt.vx * dt; pt.y += pt.vy * dt; }
  fs.parts = fs.parts.filter(pt => pt.t < pt.max);

  renderFight(ctx, fs, 5);
  ctx.fillStyle = "rgba(13,10,8,0.45)";
  ctx.fillRect(0, 0, W, H);
  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  if (fs.cineT > 0.3) {
    ctx.fillStyle = TEXT; ctx.font = "12px monospace";
    ctx.fillText("He reads the offer…", W / 2, H / 2 - 30);
  }
  if (fs.cineT > 1.4) {
    ctx.fillStyle = GREEN; ctx.font = "bold 16px monospace";
    ctx.fillText("CRITICAL HIT", W / 2, H / 2);
  }
  if (fs.cineT > 2.2) {
    ctx.fillStyle = ACCENT; ctx.font = "bold 13px monospace";
    ctx.fillText(`ANSHUL: "When do I start?"`, W / 2, H / 2 + 34);
  }
}

// ─── Typewriter ───────────────────────────────────────────────────────────────
function Typewriter({ lines, speed = 13 }: { lines: string[]; speed?: number }) {
  const [n, setN] = useState(0);
  const full = lines.join("\n");
  useEffect(() => {
    setN(0);
    const iv = setInterval(() => setN(v => (v >= full.length ? v : v + 1)), speed);
    return () => clearInterval(iv);
  }, [full, speed]);
  return (
    <p className="whitespace-pre-line font-mono text-[13px] leading-relaxed text-zinc-300">
      {full.slice(0, n)}
      <span className="text-accent animate-pulse">▌</span>
    </p>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function CareerMode() {
  const [open, setOpen] = useState(false);
  const [phase, setPhaseState] = useState<Phase>("title");
  const [chapter, setChapter] = useState(0);
  const [saved, setSaved] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fsRef = useRef<FightState>(mkFight(0));
  const phaseRef = useRef<Phase>("title");
  const chapterRef = useRef(0);
  const inputRef = useRef<Input>({ keys: new Set(), mx: W / 2, my: 0, firing: false });
  const rafRef = useRef(0);
  const lastRef = useRef(0);

  const setPhase = useCallback((p: Phase) => { phaseRef.current = p; setPhaseState(p); }, []);
  const startChapter = useCallback((ch: number) => {
    chapterRef.current = ch;
    setChapter(ch);
    setPhase("interlude");
  }, [setPhase]);
  const startFight = useCallback(() => {
    fsRef.current = mkFight(chapterRef.current);
    setPhase("fight");
  }, [setPhase]);

  // open / close via key C
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if ((e.key === "c" || e.key === "C") && !e.ctrlKey && !e.metaKey && !e.altKey) {
        setOpen(o => {
          if (!o) {
            const s = parseInt(localStorage.getItem("career-mode-progress") || "0", 10) || 0;
            setSaved(s);
            phaseRef.current = "title"; setPhaseState("title");
          }
          return !o;
        });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // in-game keys
  useEffect(() => {
    if (!open) return;
    const down = (e: KeyboardEvent) => {
      const ph = phaseRef.current;
      const k = e.key.toLowerCase();
      if ([" ", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(k)) e.preventDefault();

      if (k === "escape") {
        if (ph === "fight") setPhase("pause");
        else if (ph === "pause") setPhase("fight");
        else setOpen(false);
        return;
      }
      if (k === " " || k === "enter") {
        if (ph === "interlude") startFight();
        else if (ph === "victory") {
          const next = chapterRef.current + 1;
          if (next >= CHAPTERS.length) setOpen(false);
          else startChapter(next);
        } else if (ph === "dead") startFight();
        return;
      }
      inputRef.current.keys.add(k);
    };
    const up = (e: KeyboardEvent) => inputRef.current.keys.delete(e.key.toLowerCase());
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); };
  }, [open, setPhase, startFight, startChapter]);

  // mouse
  const onMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const c = canvasRef.current; if (!c) return;
    const r = c.getBoundingClientRect();
    inputRef.current.mx = (e.clientX - r.left) * W / r.width;
    inputRef.current.my = (e.clientY - r.top) * H / r.height;
  }, []);

  // loop
  useEffect(() => {
    if (!open) return;
    lastRef.current = performance.now();
    const loop = (now: number) => {
      const dt = Math.min((now - lastRef.current) / 1000, 0.05);
      lastRef.current = now;
      const ctx = canvasRef.current?.getContext("2d");
      const ph = phaseRef.current;
      const fs = fsRef.current;
      if (ctx) {
        if (ph === "fight") {
          const tier = chapterRef.current; // chapters cleared = current chapter index
          const res = updateFight(fs, inputRef.current, tier, dt);
          renderFight(ctx, fs, tier);
          if (res === "dead") setPhase("dead");
          else if (res === "victory") {
            const cleared = chapterRef.current + 1;
            const prev = parseInt(localStorage.getItem("career-mode-progress") || "0", 10) || 0;
            if (cleared > prev) localStorage.setItem("career-mode-progress", String(cleared));
            setSaved(Math.max(prev, cleared));
            setPhase("victory");
          } else if (res === "cine") {
            fs.cineT = 0;
            setPhase("cine");
          }
        } else if (ph === "cine") {
          renderCine(ctx, fs, dt);
          if (fs.cineT > 3.4) {
            localStorage.setItem("career-mode-progress", "6");
            setSaved(6);
            setPhase("ending");
          }
        } else if (ph === "pause" || ph === "dead" || ph === "victory") {
          renderFight(ctx, fs, chapterRef.current);
          ctx.fillStyle = "rgba(13,10,8,0.6)";
          ctx.fillRect(0, 0, W, H);
        } else {
          // title / interlude / ending — ambient bg
          ctx.fillStyle = BG; ctx.fillRect(0, 0, W, H);
          ctx.strokeStyle = "rgba(255,176,0,0.04)";
          for (let x = 0; x <= W; x += 48) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
          for (let y = 0; y <= H; y += 48) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
        }
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [open, setPhase]);

  const exitTo = useCallback((sectionId: string) => {
    setOpen(false);
    setTimeout(() => document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" }), 150);
  }, []);

  const ch = CHAPTERS[chapter];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="career-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/90 backdrop-blur-sm"
        >
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={W}
              height={H}
              onMouseMove={onMouseMove}
              onMouseDown={() => { inputRef.current.firing = true; }}
              onMouseUp={() => { inputRef.current.firing = false; }}
              onMouseLeave={() => { inputRef.current.firing = false; }}
              className="block border border-amber-500/20"
              style={{ maxWidth: "94vw", maxHeight: "88vh", aspectRatio: `${W}/${H}`, cursor: phase === "fight" ? "crosshair" : "default" }}
            />

            {/* ── DOM overlays ── */}
            <AnimatePresence mode="wait">
              {phase === "title" && (
                <motion.div key="title" {...fade} className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
                  <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500 mb-3">anshulpatil.is-a.dev presents</p>
                  <h2 className="font-display text-6xl md:text-7xl text-accent mb-2">Career Mode</h2>
                  <p className="font-mono text-[11px] text-zinc-400 mb-1">every résumé line was a boss fight. now you fight them.</p>
                  <p className="font-mono text-[10px] text-zinc-600 mb-10">WASD move · mouse aim · hold click to shoot · desktop recommended</p>
                  <div className="flex flex-col gap-3 items-center">
                    <button onClick={() => startChapter(0)} className="font-mono text-sm uppercase tracking-[0.2em] text-ink bg-accent px-8 py-2.5 hover:opacity-85 transition-opacity">
                      {saved >= 6 ? "Play again" : "New game"}
                    </button>
                    {saved > 0 && saved < 6 && (
                      <button onClick={() => startChapter(saved)} className="font-mono text-xs uppercase tracking-[0.2em] text-accent border border-amber-500/40 px-8 py-2.5 hover:border-amber-500 transition-colors">
                        Continue — Chapter {ROMAN[saved]}
                      </button>
                    )}
                    <button onClick={() => setOpen(false)} className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600 hover:text-zinc-300 transition-colors mt-3">
                      esc — back to portfolio
                    </button>
                  </div>
                </motion.div>
              )}

              {phase === "interlude" && (
                <motion.div key={`intl-${chapter}`} {...fade} className="absolute inset-0 flex items-center justify-center px-8">
                  <div className="max-w-xl w-full border border-amber-500/25 bg-[#0d0a08]/95 p-8">
                    <div className="flex items-baseline justify-between mb-1">
                      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500">Chapter {ROMAN[chapter]} · {ch.year}</p>
                      <p className="font-mono text-[10px] text-zinc-600">{chapter + 1} / {CHAPTERS.length}</p>
                    </div>
                    <h3 className="font-display text-3xl text-zinc-100 mb-1">{ch.org}</h3>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent mb-6">{ch.role}</p>
                    <Typewriter lines={ch.story} />
                    <div className="mt-8 pt-5 border-t border-zinc-800 flex items-center justify-between">
                      <div>
                        <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-zinc-600 mb-1">incoming boss</p>
                        <p className="font-mono text-sm font-bold text-red-400">{ch.bossName}</p>
                        <p className="font-mono text-[9px] text-zinc-500">{ch.bossSub}</p>
                      </div>
                      <button onClick={startFight} className="font-mono text-xs uppercase tracking-[0.2em] text-ink bg-accent px-6 py-2 hover:opacity-85 transition-opacity shrink-0">
                        Fight [space]
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {phase === "victory" && (
                <motion.div key={`vic-${chapter}`} {...fade} className="absolute inset-0 flex items-center justify-center px-8">
                  <div className="max-w-xl w-full border border-amber-500/40 bg-[#0d0a08]/95 p-8">
                    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-green-400 mb-2">boss defeated</p>
                    <h3 className="font-display text-3xl text-zinc-100 mb-4">{ch.bossName}</h3>
                    <p className="font-mono text-[11px] text-zinc-500 italic mb-5">{ch.quip}</p>
                    <div className="border-l-2 border-accent pl-4 mb-6">
                      <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-zinc-600 mb-1.5">what actually happened · {ch.year}</p>
                      <p className="text-[13px] leading-relaxed text-zinc-300">{ch.victory}</p>
                    </div>
                    {ch.unlock && (
                      <div className="flex items-center gap-3 mb-7 font-mono">
                        <span className="text-[9px] uppercase tracking-[0.25em] text-zinc-600">unlocked</span>
                        <span className="text-sm font-bold text-accent">{ch.unlock}</span>
                        <span className="text-[9px] text-zinc-500">{ch.unlockDesc}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <button onClick={() => exitTo(ch.exitTo)} className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600 hover:text-zinc-300 transition-colors">
                        exit to portfolio ↗
                      </button>
                      <button
                        onClick={() => { const next = chapter + 1; if (next >= CHAPTERS.length) setOpen(false); else startChapter(next); }}
                        className="font-mono text-xs uppercase tracking-[0.2em] text-ink bg-accent px-6 py-2 hover:opacity-85 transition-opacity"
                      >
                        Next chapter [space]
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {phase === "dead" && (
                <motion.div key="dead" {...fade} className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <h3 className="font-display text-5xl text-red-400 mb-3">You Died</h3>
                  <p className="font-mono text-[11px] text-zinc-500 mb-8">{ch.bossName} remains undefeated. Anshul beat it — can you?</p>
                  <div className="flex gap-4">
                    <button onClick={startFight} className="font-mono text-xs uppercase tracking-[0.2em] text-ink bg-accent px-6 py-2 hover:opacity-85 transition-opacity">
                      Retry [space]
                    </button>
                    <button onClick={() => exitTo(ch.exitTo)} className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-500 border border-zinc-700 px-6 py-2 hover:text-zinc-200 hover:border-zinc-500 transition-colors">
                      Exit to portfolio
                    </button>
                  </div>
                </motion.div>
              )}

              {phase === "pause" && (
                <motion.div key="pause" {...fade} className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <h3 className="font-display text-4xl text-zinc-100 mb-8">Paused</h3>
                  <div className="flex flex-col gap-3">
                    <button onClick={() => setPhase("fight")} className="font-mono text-xs uppercase tracking-[0.2em] text-ink bg-accent px-8 py-2.5 hover:opacity-85 transition-opacity">
                      Resume [esc]
                    </button>
                    <button onClick={startFight} className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-400 border border-zinc-700 px-8 py-2 hover:text-zinc-100 hover:border-zinc-500 transition-colors">
                      Restart chapter
                    </button>
                    <button onClick={() => exitTo(ch.exitTo)} className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-600 hover:text-zinc-300 transition-colors mt-2">
                      Exit to portfolio ↗
                    </button>
                  </div>
                </motion.div>
              )}

              {phase === "ending" && (
                <motion.div key="ending" {...fade} className="absolute inset-0 flex items-center justify-center px-8">
                  <div className="max-w-xl w-full border border-green-400/40 bg-[#0d0a08]/95 p-8 text-center">
                    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-green-400 mb-3">the only winning move</p>
                    <h3 className="font-display text-5xl text-zinc-100 mb-2">Offer Accepted</h3>
                    <p className="font-mono text-[11px] text-zinc-400 mb-8">
                      Five bosses. Six chapters. Zero bullets worked on the last one.<br />
                      You defeated Anshul Patil the only way possible — you hired him.
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

            {/* persistent exit — always visible during fights */}
            {(phase === "fight" || phase === "cine") && (
              <button
                onClick={() => setPhase("pause")}
                className="absolute top-2 right-3 font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-600 hover:text-zinc-300 transition-colors"
              >
                [esc] pause / exit
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const fade = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.25 },
};
