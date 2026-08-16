"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// ─── Layout ───────────────────────────────────────────────────────────────────
const CELL = 40;
const COLS = 16, ROWS = 12;
const GX = 0, GY = 40;
const PW = 200;
const SW = COLS * CELL + PW; // 840
const SH = ROWS * CELL + GY; // 520
const GAME_W = COLS * CELL;  // 640

// ─── Map ──────────────────────────────────────────────────────────────────────
const CORE_COL = 8, CORE_ROW = 6;
const MAX_CORE_HP = 20;

// Two entry paths converging at the core
const WPS_A: [number, number][] = [[0, 2], [4, 2], [4, 9], [8, 9], [8, 6]];
const WPS_B: [number, number][] = [[15, 9], [11, 9], [11, 3], [8, 3], [8, 6]];

function buildPathSet(): Set<string> {
  const s = new Set<string>();
  function seg(ax: number, ay: number, bx: number, by: number) {
    const dx = bx > ax ? 1 : bx < ax ? -1 : 0;
    const dy = by > ay ? 1 : by < ay ? -1 : 0;
    let cx = ax, cy = ay;
    while (cx !== bx || cy !== by) { s.add(`${cx},${cy}`); cx += dx; cy += dy; }
    s.add(`${bx},${by}`);
  }
  for (const wps of [WPS_A, WPS_B]) {
    for (let i = 0; i < wps.length - 1; i++) seg(wps[i][0], wps[i][1], wps[i + 1][0], wps[i + 1][1]);
  }
  return s;
}
const PATH_SET = buildPathSet();
const isPath = (c: number, r: number) => PATH_SET.has(`${c},${r}`);
const isCore = (c: number, r: number) => c === CORE_COL && r === CORE_ROW;
const gToP = (col: number, row: number): [number, number] => [
  GX + col * CELL + CELL / 2,
  GY + row * CELL + CELL / 2,
];

// ─── Tower defs — Stratum module risk scores ───────────────────────────────────
const TOWER_DEFS = [
  { id: "tests",   cost: 50,  risk: 0.28, dmg: 2,   range: 3,   rate: 1.8, color: "#4ade80", desc: "Fast · Low dmg",      effect: "none"   },
  { id: "worker",  cost: 65,  risk: 0.38, dmg: 2.5, range: 2.5, rate: 1.6, color: "#60a5fa", desc: "Rapid fire",           effect: "none"   },
  { id: "deploy",  cost: 90,  risk: 0.55, dmg: 1.5, range: 3,   rate: 1.0, color: "#fb923c", desc: "Slows -40%",           effect: "slow"   },
  { id: "api",     cost: 80,  risk: 0.64, dmg: 3,   range: 3.5, rate: 1.0, color: "#ffb000", desc: "Balanced",             effect: "none"   },
  { id: "db",      cost: 130, risk: 0.70, dmg: 7,   range: 4,   rate: 0.4, color: "#a78bfa", desc: "Heavy · Slow",         effect: "none"   },
  { id: "billing", cost: 110, risk: 0.78, dmg: 3.5, range: 3.5, rate: 0.8, color: "#f472b6", desc: "AOE splash",           effect: "splash" },
  { id: "config",  cost: 140, risk: 0.82, dmg: 5,   range: 4.5, rate: 0.7, color: "#e879f9", desc: "Long range",           effect: "none"   },
  { id: "auth",    cost: 180, risk: 0.92, dmg: 10,  range: 5,   rate: 0.5, color: "#f87171", desc: "Powerful · High risk", effect: "none"   },
] as const;
type TowerId = typeof TOWER_DEFS[number]["id"];
const tDef = (id: TowerId) => TOWER_DEFS.find(t => t.id === id)!;

// ─── Enemy defs ───────────────────────────────────────────────────────────────
const ENEMY_DEFS = {
  bug:  { name: "BUG",       hp: 10, speed: 1.6, reward: 10, color: "#ff5555", r: 6 },
  leak: { name: "MEM_LEAK",  hp: 28, speed: 0.7, reward: 25, color: "#ff8800", r: 9 },
  race: { name: "RACE_COND", hp: 14, speed: 2.5, reward: 20, color: "#facc15", r: 7 },
  vuln: { name: "CVE",       hp: 22, speed: 2.0, reward: 35, color: "#e879f9", r: 8 },
} as const;
type EnemyType = keyof typeof ENEMY_DEFS;

// ─── Wave generator ───────────────────────────────────────────────────────────
type SpawnEntry = { type: EnemyType; path: "A" | "B"; t: number };
function mkWave(n: number): SpawnEntry[] {
  const out: SpawnEntry[] = [];
  let t = 0;
  const add = (type: EnemyType, count: number, gap: number, flip = false) => {
    for (let i = 0; i < count; i++) {
      out.push({ type, path: (i % 2 === 0) !== flip ? "A" : "B", t });
      t += gap;
    }
  };
  add("bug",  4 + n * 2, 0.8);
  if (n >= 2) add("leak", n,       1.2, true);
  if (n >= 3) add("race", n - 1,   0.6);
  if (n >= 4) add("vuln", n - 2,   0.9, true);
  if (n >= 5) add("bug",  n * 2,   0.45, true);
  return out;
}

// ─── Game state types ─────────────────────────────────────────────────────────
let _uid = 0;

interface Tower {
  id: number; col: number; row: number;
  typeId: TowerId; risk: number;
  shootCd: number; refactored: boolean;
}
interface Enemy {
  id: number; type: EnemyType;
  hp: number; maxHp: number;
  path: "A" | "B"; wpIdx: number;
  px: number; py: number;
  speed: number; slow: number;
  reward: number; dead: boolean;
}
interface Proj {
  id: number;
  px: number; py: number;
  targetId: number;
  dmg: number; speed: number;
  color: string; effect: string;
  dead: boolean;
}
interface GS {
  towers: Tower[];
  enemies: Enemy[];
  projs: Proj[];
  coreHp: number;
  points: number;
  wave: number;
  phase: "prep" | "wave" | "over" | "won";
  spawnQ: SpawnEntry[]; spawnTimer: number; spawnIdx: number;
  selTypeId: TowerId;
  selTowerId: number | null;
  hovCell: [number, number] | null;
  flashMsg: string; flashT: number;
  t: number; // global time for animations
}

function mkGs(): GS {
  _uid = 0;
  return {
    towers: [], enemies: [], projs: [],
    coreHp: MAX_CORE_HP, points: 150, wave: 0,
    phase: "prep",
    spawnQ: [], spawnTimer: 0, spawnIdx: 0,
    selTypeId: "tests", selTowerId: null,
    hovCell: null, flashMsg: "", flashT: 0, t: 0,
  };
}
function mkEnemy(type: EnemyType, path: "A" | "B"): Enemy {
  const def = ENEMY_DEFS[type];
  const wps = path === "A" ? WPS_A : WPS_B;
  const [px, py] = gToP(wps[0][0], wps[0][1]);
  return {
    id: _uid++, type, hp: def.hp, maxHp: def.hp,
    path, wpIdx: 1, px, py,
    speed: def.speed * CELL,
    slow: 1, reward: def.reward, dead: false,
  };
}

// ─── Update (mutates g in place) ──────────────────────────────────────────────
function update(g: GS, dt: number) {
  if (g.phase === "over" || g.phase === "won") return;
  g.t += dt;
  if (g.flashT > 0) g.flashT = Math.max(0, g.flashT - dt);

  // Spawn
  if (g.phase === "wave") {
    g.spawnTimer += dt;
    while (g.spawnIdx < g.spawnQ.length && g.spawnQ[g.spawnIdx].t <= g.spawnTimer) {
      g.enemies.push(mkEnemy(g.spawnQ[g.spawnIdx].type, g.spawnQ[g.spawnIdx].path));
      g.spawnIdx++;
    }
  }

  // Move enemies
  for (const e of g.enemies) {
    if (e.dead) continue;
    const wps = e.path === "A" ? WPS_A : WPS_B;
    if (e.wpIdx >= wps.length) {
      e.dead = true;
      g.coreHp = Math.max(0, g.coreHp - 1);
      g.flashMsg = `${ENEMY_DEFS[e.type].name} breached the core!`;
      g.flashT = 1.5;
      continue;
    }
    const [tx, ty] = gToP(wps[e.wpIdx][0], wps[e.wpIdx][1]);
    const dx = tx - e.px, dy = ty - e.py;
    const dist = Math.hypot(dx, dy);
    const mv = e.speed * e.slow * dt;
    if (dist <= mv) { e.px = tx; e.py = ty; e.wpIdx++; }
    else { e.px += (dx / dist) * mv; e.py += (dy / dist) * mv; }
    e.slow = 1;
  }

  // Tower shooting
  for (const t of g.towers) {
    t.shootCd = Math.max(0, t.shootCd - dt);
    if (t.shootCd > 0) continue;
    const def = tDef(t.typeId);
    const [tpx, tpy] = gToP(t.col, t.row);
    const rangePx = def.range * CELL;
    let best: Enemy | null = null, bestDist = Infinity;
    for (const e of g.enemies) {
      if (e.dead) continue;
      const d = Math.hypot(e.px - tpx, e.py - tpy);
      if (d <= rangePx && d < bestDist) { best = e; bestDist = d; }
    }
    if (!best) continue;
    const rMult = t.refactored ? 1 : (1 - t.risk * 0.75);
    t.shootCd = 1 / def.rate;
    g.projs.push({
      id: _uid++, px: tpx, py: tpy,
      targetId: best.id, dmg: def.dmg * rMult,
      speed: CELL * 10, color: def.color,
      effect: def.effect, dead: false,
    });
  }

  // Move projectiles
  for (const p of g.projs) {
    if (p.dead) continue;
    const target = g.enemies.find(e => e.id === p.targetId);
    if (!target || target.dead) { p.dead = true; continue; }
    const dx = target.px - p.px, dy = target.py - p.py;
    const dist = Math.hypot(dx, dy);
    if (dist <= p.speed * dt || dist < 2) {
      p.dead = true;
      if (p.effect === "splash") {
        for (const e of g.enemies) {
          if (e.dead) continue;
          if (Math.hypot(e.px - target.px, e.py - target.py) <= CELL * 1.5) {
            e.hp -= p.dmg;
            if (e.hp <= 0) { e.dead = true; g.points += e.reward; }
          }
        }
      } else {
        target.hp -= p.dmg;
        if (p.effect === "slow") target.slow = 0.4;
        if (target.hp <= 0) { target.dead = true; g.points += target.reward; }
      }
    } else {
      p.px += (dx / dist) * p.speed * dt;
      p.py += (dy / dist) * p.speed * dt;
    }
  }

  // Clean dead
  g.enemies = g.enemies.filter(e => !e.dead);
  g.projs = g.projs.filter(p => !p.dead);

  // Phase transitions
  if (g.coreHp <= 0) { g.phase = "over"; return; }
  if (g.phase === "wave" && g.enemies.length === 0 && g.spawnIdx >= g.spawnQ.length) {
    g.phase = g.wave >= 6 ? "won" : "prep";
  }
}

// ─── Palette ──────────────────────────────────────────────────────────────────
const C_INK     = "#0f0d0b";
const C_SURFACE = "#161210";
const C_PATH    = "#1e1510";
const C_GRID    = "#1a1612";
const C_ACCENT  = "#ffb000";
const C_TEXT    = "#c8b08a";
const C_DIM     = "#5a4535";
const C_PANEL   = "#0d0b09";

// ─── Render ───────────────────────────────────────────────────────────────────
function render(ctx: CanvasRenderingContext2D, g: GS) {
  const { towers, enemies, projs, coreHp, points, wave, phase,
          selTypeId, selTowerId, hovCell, flashMsg, flashT, t } = g;

  // BG
  ctx.fillStyle = C_INK;
  ctx.fillRect(0, 0, SW, SH);

  // Grid cells
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const x = GX + c * CELL, y = GY + r * CELL;
      ctx.fillStyle = isCore(c, r) ? "#251a08" : isPath(c, r) ? C_PATH : C_SURFACE;
      ctx.fillRect(x, y, CELL, CELL);
      ctx.strokeStyle = C_GRID; ctx.lineWidth = 0.5;
      ctx.strokeRect(x, y, CELL, CELL);
    }
  }

  // Path guide lines
  ctx.setLineDash([5, 9]); ctx.lineWidth = 1;
  for (const wps of [WPS_A, WPS_B]) {
    ctx.strokeStyle = "#3a2518";
    ctx.beginPath();
    wps.forEach(([c, r], i) => {
      const [px, py] = gToP(c, r);
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    });
    ctx.stroke();
  }
  ctx.setLineDash([]);

  // Entry markers
  ctx.fillStyle = "#ef4444cc";
  ctx.font = "bold 7px 'JetBrains Mono', monospace";
  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  const [aeX, aeY] = gToP(WPS_A[0][0], WPS_A[0][1]);
  const [beX, beY] = gToP(WPS_B[0][0], WPS_B[0][1]);
  ctx.fillText("SPAWN A", aeX, aeY - CELL * 0.6);
  ctx.fillText("SPAWN B", beX, beY + CELL * 0.65);

  // Core
  const [cx, cy] = gToP(CORE_COL, CORE_ROW);
  const pulse = Math.sin(t * 3) * 0.5 + 0.5;
  ctx.fillStyle = `rgba(255,176,0,${0.06 + 0.04 * pulse})`;
  ctx.beginPath(); ctx.arc(cx, cy, CELL * 0.9, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = coreHp <= 5 ? "#ef4444" : C_ACCENT;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(GX + CORE_COL * CELL + 5, GY + CORE_ROW * CELL + 5, CELL - 10, CELL - 10);
  ctx.fillStyle = C_ACCENT;
  ctx.font = "bold 7px 'JetBrains Mono', monospace"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillText("CORE", cx, cy - 5);
  ctx.fillStyle = coreHp <= 5 ? "#ef4444" : C_TEXT;
  ctx.font = "7px monospace";
  ctx.fillText(`${coreHp}/${MAX_CORE_HP}`, cx, cy + 5);

  // Hover highlight
  if (hovCell) {
    const [hc, hr] = hovCell;
    if (!isPath(hc, hr) && !isCore(hc, hr) && !towers.some(t2 => t2.col === hc && t2.row === hr)) {
      ctx.fillStyle = "rgba(255,176,0,0.06)";
      ctx.fillRect(GX + hc * CELL, GY + hr * CELL, CELL, CELL);
      ctx.strokeStyle = "rgba(255,176,0,0.3)"; ctx.lineWidth = 1;
      ctx.strokeRect(GX + hc * CELL, GY + hr * CELL, CELL, CELL);
      const def = tDef(selTypeId);
      const [hpx, hpy] = gToP(hc, hr);
      ctx.strokeStyle = "rgba(255,176,0,0.1)"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(hpx, hpy, def.range * CELL, 0, Math.PI * 2); ctx.stroke();
    }
  }

  // Towers
  for (const tw of towers) {
    const def = tDef(tw.typeId);
    const x = GX + tw.col * CELL, y = GY + tw.row * CELL;
    const [tpx, tpy] = gToP(tw.col, tw.row);
    const isSel = tw.id === selTowerId;
    const riskHigh = tw.risk > 0.65 && !tw.refactored;

    ctx.fillStyle = "#181410";
    ctx.fillRect(x + 5, y + 5, CELL - 10, CELL - 10);

    // Border color: high risk = red tint, refactored = green, normal = module color
    if (riskHigh) {
      ctx.strokeStyle = `rgba(239,68,68,${0.4 + tw.risk * 0.4})`;
    } else if (tw.refactored) {
      ctx.strokeStyle = "#22c55e";
    } else {
      ctx.strokeStyle = def.color;
    }
    ctx.lineWidth = isSel ? 2 : 1.5;
    ctx.strokeRect(x + 5, y + 5, CELL - 10, CELL - 10);

    // Label
    ctx.fillStyle = tw.refactored ? "#22c55e" : def.color;
    ctx.font = "bold 8px 'JetBrains Mono', monospace";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(tw.typeId.slice(0, 3), tpx, tpy - 3);

    // Risk / refactor indicator
    if (!tw.refactored) {
      const bw = CELL - 18;
      ctx.fillStyle = "#2a1e10";
      ctx.fillRect(x + 9, y + CELL - 11, bw, 3);
      ctx.fillStyle = tw.risk > 0.7 ? "#ef4444" : tw.risk > 0.5 ? "#f97316" : "#4ade80";
      ctx.fillRect(x + 9, y + CELL - 11, bw * tw.risk, 3);
    } else {
      ctx.fillStyle = "#22c55e88"; ctx.font = "6px monospace";
      ctx.fillText("OK", tpx, tpy + 6);
    }

    if (isSel) {
      ctx.strokeStyle = "rgba(255,176,0,0.18)"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(tpx, tpy, def.range * CELL, 0, Math.PI * 2); ctx.stroke();
    }
  }

  // Enemies
  for (const e of enemies) {
    const def = ENEMY_DEFS[e.type];
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.beginPath(); ctx.ellipse(e.px, e.py + def.r + 2, def.r * 0.7, def.r * 0.25, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = def.color;
    ctx.beginPath(); ctx.arc(e.px, e.py, def.r, 0, Math.PI * 2); ctx.fill();
    if (e.slow < 0.7) { ctx.strokeStyle = "#60a5fa"; ctx.lineWidth = 1.5; ctx.stroke(); }
    // HP bar
    const bw = def.r * 2.5, bx = e.px - bw / 2, by = e.py - def.r - 5;
    ctx.fillStyle = "#1a1208"; ctx.fillRect(bx, by, bw, 3);
    const hpFrac = e.hp / e.maxHp;
    ctx.fillStyle = hpFrac > 0.5 ? "#4ade80" : hpFrac > 0.25 ? "#facc15" : "#ef4444";
    ctx.fillRect(bx, by, bw * hpFrac, 3);
  }

  // Projectiles
  for (const p of projs) {
    ctx.fillStyle = p.color;
    ctx.beginPath(); ctx.arc(p.px, p.py, p.effect === "splash" ? 4 : 3, 0, Math.PI * 2); ctx.fill();
  }

  // ── HUD bar ──────────────────────────────────────────────────────────────────
  ctx.fillStyle = C_PANEL; ctx.fillRect(0, 0, SW, GY);
  ctx.strokeStyle = "#2a1e10"; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, GY); ctx.lineTo(SW, GY); ctx.stroke();

  ctx.fillStyle = C_ACCENT; ctx.font = "bold 9px 'JetBrains Mono', monospace";
  ctx.textAlign = "left"; ctx.textBaseline = "middle";
  ctx.fillText("ARCHITECTURE DRIFT", 12, GY / 2);

  const waveStr = phase === "prep"
    ? (wave === 0 ? "Place modules · SPACE to start" : `WAVE ${wave} cleared`)
    : phase === "wave" ? `WAVE ${wave} / 6`
    : phase === "won" ? "ALL WAVES SURVIVED" : "SYSTEM COMPROMISED";
  ctx.fillStyle = C_TEXT; ctx.font = "9px 'JetBrains Mono', monospace";
  ctx.textAlign = "center";
  ctx.fillText(waveStr, GAME_W / 2, GY / 2);

  ctx.fillStyle = C_ACCENT; ctx.font = "bold 9px 'JetBrains Mono', monospace";
  ctx.textAlign = "right";
  ctx.fillText(`♦ ${points}`, GAME_W - 10, GY / 2);

  // ── Right panel ──────────────────────────────────────────────────────────────
  const PX = GAME_W;
  ctx.fillStyle = C_PANEL; ctx.fillRect(PX, 0, PW, SH);
  ctx.strokeStyle = "#2a1e10"; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(PX, 0); ctx.lineTo(PX, SH); ctx.stroke();

  let py = GY + 8;
  ctx.fillStyle = C_DIM; ctx.font = "7px 'JetBrains Mono', monospace";
  ctx.textAlign = "left"; ctx.textBaseline = "top";
  ctx.fillText("── MODULES ──────────────", PX + 8, py); py += 14;

  for (const def of TOWER_DEFS) {
    const isSel = def.id === selTypeId;
    const canAfford = points >= def.cost;
    const rColor = def.risk > 0.7 ? "#ef4444" : def.risk > 0.5 ? "#f97316" : "#4ade80";

    if (isSel) {
      ctx.fillStyle = "#211710"; ctx.fillRect(PX + 4, py, PW - 8, 34);
      ctx.strokeStyle = C_ACCENT + "35"; ctx.lineWidth = 1;
      ctx.strokeRect(PX + 4, py, PW - 8, 34);
    }

    ctx.fillStyle = canAfford ? def.color : def.color + "44";
    ctx.beginPath(); ctx.arc(PX + 16, py + 10, 5, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = canAfford ? C_TEXT : C_DIM;
    ctx.font = "bold 8px 'JetBrains Mono', monospace";
    ctx.textAlign = "left"; ctx.textBaseline = "top";
    ctx.fillText(def.id, PX + 28, py + 2);

    ctx.fillStyle = canAfford ? C_ACCENT : C_DIM;
    ctx.font = "7px monospace";
    ctx.fillText(`${def.cost}pts`, PX + 28, py + 13);

    ctx.fillStyle = rColor; ctx.textAlign = "right";
    ctx.font = "7px monospace";
    ctx.fillText(`${Math.round(def.risk * 100)}% risk`, PX + PW - 8, py + 2);

    ctx.fillStyle = C_DIM; ctx.textAlign = "left";
    ctx.fillText(def.desc, PX + 28, py + 24);

    py += 37;
  }

  // Selected tower detail
  if (selTowerId !== null) {
    const tw = towers.find(x => x.id === selTowerId);
    if (tw) {
      const def = tDef(tw.typeId);
      const panY = SH - 120;
      ctx.fillStyle = "#141008"; ctx.fillRect(PX + 4, panY, PW - 8, 112);
      ctx.strokeStyle = C_ACCENT + "40"; ctx.lineWidth = 1;
      ctx.strokeRect(PX + 4, panY, PW - 8, 112);

      ctx.fillStyle = def.color;
      ctx.font = "bold 9px 'JetBrains Mono', monospace";
      ctx.textAlign = "left"; ctx.textBaseline = "top";
      ctx.fillText(`[${tw.typeId}]`, PX + 10, panY + 8);

      const rMult = tw.refactored ? 1 : (1 - tw.risk * 0.75);
      ctx.fillStyle = C_TEXT; ctx.font = "7px 'JetBrains Mono', monospace";
      ctx.fillText(`risk:  ${tw.refactored ? "0%" : Math.round(tw.risk * 100) + "%"}`, PX + 10, panY + 23);
      ctx.fillText(`dmg:   ${(def.dmg * rMult).toFixed(1)}`, PX + 10, panY + 34);
      ctx.fillText(`rate:  ${def.rate}/s`, PX + 10, panY + 45);
      ctx.fillText(`range: ${def.range}`, PX + 10, panY + 56);

      if (!tw.refactored) {
        const refCost = Math.round(80 + def.risk * 120);
        const canRef = points >= refCost;
        if (canRef) {
          ctx.fillStyle = "#22c55e22";
          ctx.fillRect(PX + 8, panY + 71, PW - 16, 14);
        }
        ctx.fillStyle = canRef ? "#22c55e" : C_DIM;
        ctx.font = "bold 7px 'JetBrains Mono', monospace";
        ctx.fillText(`[R] Refactor — ${refCost}pts`, PX + 10, panY + 73);
        ctx.fillStyle = C_DIM; ctx.font = "6px monospace";
        ctx.fillText("removes risk penalty", PX + 10, panY + 84);
      } else {
        ctx.fillStyle = "#22c55e"; ctx.font = "7px monospace";
        ctx.fillText("✓ Refactored — full power", PX + 10, panY + 73);
      }
      ctx.fillStyle = "#ef444488"; ctx.font = "7px monospace";
      ctx.fillText("[Del] Sell (50% refund)", PX + 10, panY + 98);
    }
  }

  // ── Phase overlays ────────────────────────────────────────────────────────────
  const OX = GAME_W / 2;
  if (phase === "over" || phase === "won") {
    const OY = SH / 2 + 20;
    ctx.fillStyle = "rgba(12,9,6,0.88)";
    ctx.fillRect(OX - 150, OY - 65, 300, 130);
    ctx.strokeStyle = phase === "won" ? C_ACCENT : "#ef4444"; ctx.lineWidth = 1.5;
    ctx.strokeRect(OX - 150, OY - 65, 300, 130);
    ctx.textAlign = "center"; ctx.textBaseline = "middle";

    if (phase === "won") {
      ctx.fillStyle = C_ACCENT; ctx.font = "bold 14px 'JetBrains Mono', monospace";
      ctx.fillText("SYSTEMS STABLE", OX, OY - 42);
      ctx.fillStyle = C_TEXT; ctx.font = "9px monospace";
      ctx.fillText("All waves survived. Codebase defended.", OX, OY - 24);
      ctx.fillText("This is what Stratum prevents.", OX, OY - 10);
    } else {
      ctx.fillStyle = "#ef4444"; ctx.font = "bold 13px 'JetBrains Mono', monospace";
      ctx.fillText("SYSTEM COMPROMISED", OX, OY - 42);
      ctx.fillStyle = C_TEXT; ctx.font = "9px monospace";
      ctx.fillText("Technical debt collapsed the system.", OX, OY - 24);
      ctx.fillText("Stratum catches this before production.", OX, OY - 10);
    }
    ctx.fillStyle = C_ACCENT; ctx.font = "bold 9px 'JetBrains Mono', monospace";
    ctx.fillText("[ R ] restart", OX, OY + 38);

  } else if (phase === "prep" && wave === 0) {
    const OY = SH / 2 + 20;
    ctx.fillStyle = "rgba(12,9,6,0.90)";
    ctx.fillRect(OX - 155, OY - 72, 310, 144);
    ctx.strokeStyle = C_ACCENT; ctx.lineWidth = 1.5;
    ctx.strokeRect(OX - 155, OY - 72, 310, 144);
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillStyle = C_ACCENT; ctx.font = "bold 13px 'JetBrains Mono', monospace";
    ctx.fillText("ARCHITECTURE DRIFT", OX, OY - 50);
    ctx.fillStyle = C_TEXT; ctx.font = "8px monospace";
    ctx.fillText("Bugs march toward your CORE from two lanes.", OX, OY - 33);
    ctx.fillText("Place modules to intercept them.", OX, OY - 21);
    ctx.fillText("High risk modules deal reduced damage.", OX, OY - 9);
    ctx.fillText("Press R on a selected tower to refactor it.", OX, OY + 3);
    ctx.fillStyle = C_DIM; ctx.font = "7px monospace";
    ctx.fillText("1–8 to switch module · click grid to place", OX, OY + 18);
    ctx.fillStyle = C_ACCENT; ctx.font = "bold 10px 'JetBrains Mono', monospace";
    ctx.fillText("[ SPACE ] Start Wave 1", OX, OY + 44);

  } else if (phase === "prep" && wave > 0) {
    // Small between-waves banner
    ctx.fillStyle = "rgba(12,9,6,0.80)";
    ctx.fillRect(OX - 120, GY + 10, 240, 44);
    ctx.strokeStyle = C_ACCENT + "60"; ctx.lineWidth = 1;
    ctx.strokeRect(OX - 120, GY + 10, 240, 44);
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillStyle = C_ACCENT; ctx.font = "bold 10px 'JetBrains Mono', monospace";
    ctx.fillText(`Wave ${wave} cleared`, OX, GY + 26);
    ctx.fillStyle = C_TEXT; ctx.font = "8px monospace";
    ctx.fillText("[ SPACE ] Launch Wave " + (wave + 1), OX, GY + 40);
  }

  // Flash message
  if (flashT > 0) {
    ctx.fillStyle = `rgba(239,68,68,${Math.min(1, flashT)})`;
    ctx.font = "bold 10px 'JetBrains Mono', monospace";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(flashMsg, GAME_W / 2, GY + 22);
  }
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function TowerDefense() {
  const [open, setOpen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gsRef = useRef<GS>(mkGs());
  const rafRef = useRef<number>(0);
  const lastRef = useRef<number>(0);

  const loop = useCallback((now: number) => {
    const dt = Math.min((now - lastRef.current) / 1000, 0.05);
    lastRef.current = now;
    update(gsRef.current, dt);
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) render(ctx, gsRef.current);
    rafRef.current = requestAnimationFrame(loop);
  }, []);

  useEffect(() => {
    if (!open) return;
    lastRef.current = performance.now();
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [open, loop]);

  // T key — open / close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if ((e.key === "t" || e.key === "T") && !e.ctrlKey && !e.metaKey) {
        setOpen(o => { if (!o) gsRef.current = mkGs(); return !o; });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // In-game keys
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      const g = gsRef.current;
      if (e.key === "Escape") { setOpen(false); return; }

      if (e.key === " ") {
        e.preventDefault();
        if (g.phase === "prep") {
          g.wave++;
          g.phase = "wave";
          g.spawnQ = mkWave(g.wave);
          g.spawnTimer = 0; g.spawnIdx = 0;
        }
        return;
      }

      if ((e.key === "r" || e.key === "R") && (g.phase === "over" || g.phase === "won")) {
        gsRef.current = mkGs(); return;
      }

      if ((e.key === "r" || e.key === "R") && g.selTowerId !== null) {
        const tw = g.towers.find(x => x.id === g.selTowerId);
        if (tw && !tw.refactored) {
          const def = tDef(tw.typeId);
          const cost = Math.round(80 + def.risk * 120);
          if (g.points >= cost) {
            g.points -= cost;
            tw.refactored = true; tw.risk = 0;
            g.flashMsg = `${tw.typeId} refactored — risk eliminated!`;
            g.flashT = 1.5;
          } else {
            g.flashMsg = "Not enough commit points to refactor.";
            g.flashT = 1.0;
          }
        }
        return;
      }

      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        if (g.selTowerId !== null) {
          const tw = g.towers.find(x => x.id === g.selTowerId);
          if (tw) {
            const def = tDef(tw.typeId);
            g.towers = g.towers.filter(x => x.id !== g.selTowerId);
            g.points += Math.floor(def.cost * 0.5);
            g.selTowerId = null;
          }
        }
        return;
      }

      // 1–8 select module type
      const idx = parseInt(e.key) - 1;
      if (idx >= 0 && idx < TOWER_DEFS.length) {
        g.selTypeId = TOWER_DEFS[idx].id as TowerId;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current; if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * SW / rect.width;
    const my = (e.clientY - rect.top) * SH / rect.height;
    const g = gsRef.current;

    // Right panel — select tower type
    if (mx >= GAME_W) {
      const relY = my - GY - 22;
      const idx = Math.floor(relY / 37);
      if (idx >= 0 && idx < TOWER_DEFS.length) {
        g.selTypeId = TOWER_DEFS[idx].id as TowerId;
        g.selTowerId = null;
      }
      return;
    }

    const col = Math.floor((mx - GX) / CELL);
    const row = Math.floor((my - GY) / CELL);
    if (col < 0 || col >= COLS || row < 0 || row >= ROWS) return;

    // Click existing tower — toggle select
    const existing = g.towers.find(t => t.col === col && t.row === row);
    if (existing) {
      g.selTowerId = existing.id === g.selTowerId ? null : existing.id;
      return;
    }

    // Click path / core — deselect
    if (isPath(col, row) || isCore(col, row)) { g.selTowerId = null; return; }

    // Place tower
    const def = tDef(g.selTypeId);
    if (g.points >= def.cost) {
      g.towers.push({ id: _uid++, col, row, typeId: g.selTypeId, risk: def.risk, shootCd: 0, refactored: false });
      g.points -= def.cost;
      g.selTowerId = null;
    } else {
      g.flashMsg = "Not enough commit points!"; g.flashT = 1.0;
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current; if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * SW / rect.width;
    const my = (e.clientY - rect.top) * SH / rect.height;
    const col = Math.floor((mx - GX) / CELL);
    const row = Math.floor((my - GY) / CELL);
    const g = gsRef.current;
    if (mx < GAME_W && col >= 0 && col < COLS && row >= 0 && row < ROWS) {
      g.hovCell = [col, row];
    } else {
      g.hovCell = null;
    }
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="td-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.25, 1, 0.5, 1] }}
            className="relative"
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute -top-8 right-0 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600 hover:text-zinc-300 transition-colors duration-150"
            >
              [ ESC ] close
            </button>
            <canvas
              ref={canvasRef}
              width={SW}
              height={SH}
              onClick={handleClick}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => { gsRef.current.hovCell = null; }}
              className="block cursor-crosshair"
              style={{
                maxWidth: "92vw",
                maxHeight: "88vh",
                imageRendering: "pixelated",
                aspectRatio: `${SW} / ${SH}`,
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
