"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";

// ─── Map: 1 = wall, 0 = open ─────────────────────────────────────────────────
const MAP = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,1,1,0,0,0,0,1,1,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,0,0,0,0,0,0,0,0,1,1,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,1,1,1,1,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,1,1,1,1,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,0,0,0,0,0,0,0,0,1,1,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,1,1,0,0,0,0,1,1,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];
const MW = MAP[0].length, MH = MAP.length;

// Render resolution — stretched to fill via CSS
const SW = 640, SH = 360;

// ─── Types ────────────────────────────────────────────────────────────────────
interface Enemy {
  id: number; x: number; y: number;
  hp: number; alive: boolean;
  hitT: number; atkT: number;
}
interface GS {
  px: number; py: number;
  dx: number; dy: number;
  cx: number; cy: number;
  keys: Set<string>;
  enemies: Enemy[];
  kills: number; round: number;
  hp: number; maxHp: number;
  shotCd: number; gunKick: number;
  dmgT: number; deathT: number;
  roundWon: boolean; roundEndT: number;
  zbuf: Float32Array;
  feed: { msg: string; t: number }[];
}

const SPAWNS = [
  [1.5,1.5],[14.5,1.5],[1.5,13.5],[14.5,13.5],
  [8,4],[8,10],[3,7],[13,7],[5,12],[11,2],
];

function mkEnemies(round: number): Enemy[] {
  const n = Math.min(2 + round, SPAWNS.length);
  return SPAWNS.slice(0, n).map(([x, y], i) => ({
    id: i, x, y, hp: 3, alive: true, hitT: 0, atkT: 0,
  }));
}

function mkGS(round = 1, prevKills = 0): GS {
  return {
    px: 8, py: 7.5, dx: 1, dy: 0.05, cx: 0, cy: 0.66,
    keys: new Set(), enemies: mkEnemies(round),
    kills: prevKills, round, hp: 100, maxHp: 100,
    shotCd: 0, gunKick: 0, dmgT: 0, deathT: 0,
    roundWon: false, roundEndT: 0,
    zbuf: new Float32Array(SW), feed: [],
  };
}

function inBounds(mx: number, my: number) {
  return my >= 0 && my < MH && mx >= 0 && mx < MW;
}
function isWall(mx: number, my: number) {
  return !inBounds(mx, my) || MAP[my][mx] === 1;
}
function tryMove(g: GS, nx: number, ny: number) {
  const r = 0.25;
  if (!isWall(Math.floor(nx + r), Math.floor(g.py)) &&
      !isWall(Math.floor(nx - r), Math.floor(g.py))) g.px = nx;
  if (!isWall(Math.floor(g.px), Math.floor(ny + r)) &&
      !isWall(Math.floor(g.px), Math.floor(ny - r))) g.py = ny;
}
function rot(g: GS, a: number) {
  const cos = Math.cos(a), sin = Math.sin(a);
  const ndx = g.dx*cos - g.dy*sin, ndy = g.dx*sin + g.dy*cos;
  const ncx = g.cx*cos - g.cy*sin, ncy = g.cx*sin + g.cy*cos;
  g.dx = ndx; g.dy = ndy; g.cx = ncx; g.cy = ncy;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function FPSGame() {
  const [open,   setOpen]   = useState(false);
  const lockedRef            = useRef(false);
  const [lockedUI, setLockedUI] = useState(false);
  const canvasRef            = useRef<HTMLCanvasElement>(null);
  const gsRef                = useRef<GS | null>(null);
  const rafRef               = useRef<number>(0);
  const prevTRef             = useRef<number>(0);

  const close = useCallback(() => {
    setOpen(false);
    cancelAnimationFrame(rafRef.current);
    if (document.pointerLockElement) document.exitPointerLock();
  }, []);

  // F to toggle, ESC to close
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "f" || e.key === "F") setOpen(o => !o);
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [close]);

  useEffect(() => {
    if (!open) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    gsRef.current = mkGS(1, 0);

    // Pointer lock
    const reqLock = () => canvas.requestPointerLock();
    const onLC = () => {
      lockedRef.current = document.pointerLockElement === canvas;
      setLockedUI(lockedRef.current);
    };
    document.addEventListener("pointerlockchange", onLC);

    // Input
    const shoot = () => {
      const g = gsRef.current;
      if (!g || g.shotCd > 0 || g.roundWon || g.hp <= 0) return;
      g.shotCd = 0.32; g.gunKick = 0.22;

      // Find nearest enemy aligned with center ray
      let best: Enemy | null = null, bestDist = Infinity;
      for (const e of g.enemies) {
        if (!e.alive) continue;
        const sx = e.x - g.px, sy = e.y - g.py;
        const det = g.cx*g.dy - g.dx*g.cy;
        const inv = 1 / det;
        const tx = inv*(g.dy*sx - g.dx*sy);
        const ty = inv*(-g.cy*sx + g.cx*sy);
        if (ty <= 0.1) continue;
        const scrX = (SW/2)*(1 + tx/ty);
        const sprH = Math.abs(SH/ty);
        if (Math.abs(scrX - SW/2) < sprH*0.28 && ty < bestDist) {
          bestDist = ty; best = e;
        }
      }
      if (best) {
        best.hp--; best.hitT = 0.12;
        if (best.hp <= 0) {
          best.alive = false;
          const g_ = gsRef.current!;
          g_.kills++;
          g_.feed.unshift({ msg: `eliminated target_${String(best.id).padStart(2,"0")}`, t: 3.5 });
          if (g_.feed.length > 4) g_.feed.pop();
        }
      }
    };

    const onKD = (e: KeyboardEvent) => {
      gsRef.current?.keys.add(e.code);
      if (e.code === "Space" && lockedRef.current) shoot();
    };
    const onKU = (e: KeyboardEvent) => gsRef.current?.keys.delete(e.code);
    const onMM = (e: MouseEvent) => {
      if (!lockedRef.current) return;
      const g = gsRef.current; if (!g) return;
      rot(g, e.movementX * 0.0022);
    };
    const onMD = (e: MouseEvent) => {
      if (!lockedRef.current) { reqLock(); return; }
      if (e.button === 0) shoot();
    };

    window.addEventListener("keydown", onKD);
    window.addEventListener("keyup",   onKU);
    window.addEventListener("mousemove", onMM);
    canvas.addEventListener("mousedown", onMD);

    // ── Game loop ─────────────────────────────────────────────────
    const tick = (ts: number) => {
      const dt = Math.min((ts - prevTRef.current) / 1000, 0.05);
      prevTRef.current = ts;
      const g = gsRef.current;
      if (!g) return;

      // Timers
      g.shotCd   = Math.max(0, g.shotCd - dt);
      g.gunKick  = Math.max(0, g.gunKick - dt);
      g.dmgT     = Math.max(0, g.dmgT - dt);
      for (let i = 0; i < g.feed.length; i++) g.feed[i].t -= dt;
      g.feed = g.feed.filter(f => f.t > 0);

      const alive = g.enemies.filter(e => e.alive);

      if (g.hp <= 0) {
        g.deathT += dt;
        if (g.deathT > 2.5) {
          const next = mkGS(g.round, g.kills);
          next.keys = g.keys;
          Object.assign(g, next);
        }
      } else if (!g.roundWon) {
        const ms = 3.2 * dt, rs = 2.2 * dt;

        if (g.keys.has("KeyW") || g.keys.has("ArrowUp"))
          tryMove(g, g.px + g.dx*ms, g.py + g.dy*ms);
        if (g.keys.has("KeyS") || g.keys.has("ArrowDown"))
          tryMove(g, g.px - g.dx*ms, g.py - g.dy*ms);
        if (g.keys.has("KeyA"))
          tryMove(g, g.px + g.dy*ms, g.py - g.dx*ms);
        if (g.keys.has("KeyD"))
          tryMove(g, g.px - g.dy*ms, g.py + g.dx*ms);
        if (g.keys.has("ArrowLeft"))  rot(g, -rs);
        if (g.keys.has("ArrowRight")) rot(g,  rs);

        // Enemy AI
        for (const e of alive) {
          e.hitT = Math.max(0, e.hitT - dt);
          e.atkT = Math.max(0, e.atkT - dt);
          const edx = g.px - e.x, edy = g.py - e.y;
          const dist = Math.sqrt(edx*edx + edy*edy);
          if (dist > 0.55) {
            const spd = 1.5 * dt;
            const nx = e.x + (edx/dist)*spd, ny = e.y + (edy/dist)*spd;
            if (!isWall(Math.floor(nx), Math.floor(e.y))) e.x = nx;
            if (!isWall(Math.floor(e.x), Math.floor(ny))) e.y = ny;
          }
          if (dist < 0.8 && e.atkT <= 0) {
            g.hp    = Math.max(0, g.hp - 18);
            g.dmgT  = 0.5;
            e.atkT  = 1.1;
            if (g.hp <= 0) g.deathT = 0;
          }
        }

        if (alive.length === 0) { g.roundWon = true; g.roundEndT = 4; }
      } else {
        g.roundEndT -= dt;
        if (g.roundEndT <= 0) {
          const next = mkGS(g.round + 1, g.kills);
          next.keys = g.keys;
          Object.assign(g, next);
        }
      }

      // ── Render ────────────────────────────────────────────────
      // Ceiling
      ctx.fillStyle = "#0d0b09";
      ctx.fillRect(0, 0, SW, SH / 2);
      // Floor — subtle gradient
      ctx.fillStyle = "#161210";
      ctx.fillRect(0, SH / 2, SW, SH / 2);

      // Raycasting
      for (let x = 0; x < SW; x++) {
        const camX  = 2 * x / SW - 1;
        const rdx   = g.dx + g.cx * camX;
        const rdy   = g.dy + g.cy * camX;
        let mx = Math.floor(g.px), my = Math.floor(g.py);
        const ddx = rdx === 0 ? 1e30 : Math.abs(1 / rdx);
        const ddy = rdy === 0 ? 1e30 : Math.abs(1 / rdy);
        let stepX: number, stepY: number, sdx: number, sdy: number;
        if (rdx < 0) { stepX=-1; sdx=(g.px-mx)*ddx; } else { stepX=1; sdx=(mx+1-g.px)*ddx; }
        if (rdy < 0) { stepY=-1; sdy=(g.py-my)*ddy; } else { stepY=1; sdy=(my+1-g.py)*ddy; }
        let side = 0, iters = 0;
        while (!isWall(mx, my) && iters++ < 64) {
          if (sdx < sdy) { sdx += ddx; mx += stepX; side = 0; }
          else           { sdy += ddy; my += stepY; side = 1; }
        }
        const pwd = side === 0 ? sdx - ddx : sdy - ddy;
        g.zbuf[x] = pwd;
        const lh  = Math.min(SH * 3, Math.floor(SH / Math.max(0.001, pwd)));
        const y0  = Math.floor((SH - lh) / 2);

        // Amber wall: NS faces brighter, EW darker; distance dims
        const bright = Math.min(1, 1.8 / (pwd + 0.25));
        const sideF  = side === 1 ? 0.6 : 1;
        const r = Math.floor(255 * 0.67 * bright * sideF);
        const gv= Math.floor(255 * 0.43 * bright * sideF * 0.52);
        ctx.fillStyle = `rgb(${r},${gv},0)`;
        ctx.fillRect(x, y0, 1, lh);
      }

      // Enemy sprites (far → near)
      const sortedE = [...alive].sort((a, b) =>
        ((b.x-g.px)**2+(b.y-g.py)**2) - ((a.x-g.px)**2+(a.y-g.py)**2)
      );
      for (const e of sortedE) {
        const sx = e.x - g.px, sy = e.y - g.py;
        const det = g.cx*g.dy - g.dx*g.cy;
        const inv = 1 / det;
        const tx = inv*(g.dy*sx - g.dx*sy);
        const ty = inv*(-g.cy*sx + g.cx*sy);
        if (ty <= 0.05) continue;

        const scrX  = Math.floor((SW/2)*(1 + tx/ty));
        const h     = Math.abs(Math.floor(SH / ty));
        const w     = Math.floor(h * 0.52);
        const x0    = Math.max(0, scrX - Math.floor(w/2));
        const x1    = Math.min(SW-1, scrX + Math.floor(w/2));
        const y0    = Math.max(0, Math.floor((SH - h)/2));
        const y1    = Math.min(SH-1, Math.floor((SH + h)/2));
        const headY = Math.floor(y0 + h * 0.27);
        const bright2 = Math.min(1, 2 / (ty + 0.3));
        const flash = e.hitT > 0;

        for (let stripe = x0; stripe <= x1; stripe++) {
          if (ty >= g.zbuf[stripe]) continue;
          // Head
          const hr = flash ? 255 : Math.floor(255 * bright2);
          const hg = flash ? 255 : Math.floor(90  * bright2);
          ctx.fillStyle = `rgb(${hr},${hg},0)`;
          ctx.fillRect(stripe, y0, 1, Math.max(0, Math.min(headY, y1) - y0));
          // Body
          const br = flash ? 255 : Math.floor(210 * bright2);
          const bg = flash ? 255 : Math.floor(55  * bright2);
          ctx.fillStyle = `rgb(${br},${bg},0)`;
          ctx.fillRect(stripe, headY, 1, Math.max(0, y1 - headY));
        }
      }

      // ── Gun ────────────────────────────────────────────────────
      const kick  = g.gunKick > 0 ? Math.sin((1 - g.gunKick/0.22) * Math.PI) * 22 : 0;
      const gx = SW - 148, gy = SH - 72 - kick;
      // Barrel
      ctx.fillStyle = "#3f3f46";
      ctx.fillRect(gx + 14, gy - 18, 36, 20);
      // Body
      ctx.fillStyle = "#52525b";
      ctx.fillRect(gx, gy, 128, 28);
      ctx.fillStyle = "#71717a";
      ctx.fillRect(gx + 2, gy + 2, 80, 10);
      // Trigger
      ctx.fillStyle = "#3f3f46";
      ctx.fillRect(gx + 50, gy + 14, 12, 16);

      // ── Damage vignette ────────────────────────────────────────
      if (g.dmgT > 0) {
        const grad = ctx.createRadialGradient(SW/2,SH/2,SH*0.12,SW/2,SH/2,SH*0.85);
        grad.addColorStop(0, "rgba(220,0,0,0)");
        grad.addColorStop(1, `rgba(220,0,0,${Math.min(0.85, g.dmgT * 1.6)})`);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, SW, SH);
      }

      // ── CS Crosshair ───────────────────────────────────────────
      const moving = g.keys.has("KeyW")||g.keys.has("KeyS")||
                     g.keys.has("KeyA")||g.keys.has("KeyD");
      const spread = (moving ? 8 : 3) + (g.shotCd > 0.15 ? 6 : 0);
      const len = 6, ccx = SW/2, ccy = SH/2;
      ctx.strokeStyle = "rgba(255,255,255,0.92)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(ccx - spread - len, ccy); ctx.lineTo(ccx - spread, ccy);
      ctx.moveTo(ccx + spread, ccy);       ctx.lineTo(ccx + spread + len, ccy);
      ctx.moveTo(ccx, ccy - spread - len); ctx.lineTo(ccx, ccy - spread);
      ctx.moveTo(ccx, ccy + spread);       ctx.lineTo(ccx, ccy + spread + len);
      ctx.stroke();

      // ── HUD ────────────────────────────────────────────────────
      // HP bar
      ctx.fillStyle = "rgba(0,0,0,0.55)";
      ctx.fillRect(8, SH - 34, 108, 18);
      const hpPct = g.hp / g.maxHp;
      ctx.fillStyle = hpPct > 0.55 ? "#22c55e" : hpPct > 0.3 ? "#eab308" : "#ef4444";
      ctx.fillRect(10, SH - 32, Math.floor(hpPct * 104), 14);
      ctx.fillStyle = "white";
      ctx.font = "bold 9px 'JetBrains Mono',monospace";
      ctx.textAlign = "left";
      ctx.fillText(`♥ ${g.hp}`, 13, SH - 21);

      // Ammo / round
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fillRect(SW/2 - 90, 6, 180, 22);
      ctx.fillStyle = "#ffb000";
      ctx.font = "bold 10px 'JetBrains Mono',monospace";
      ctx.textAlign = "center";
      const rem = alive.length;
      ctx.fillText(`ROUND ${g.round}  ·  ${rem} ENEMY${rem!==1?"IES":"Y"}`, SW/2, 21);

      // Kill feed
      ctx.textAlign = "right";
      g.feed.forEach((f, i) => {
        const a = Math.min(1, f.t * 0.8);
        ctx.fillStyle = `rgba(255,176,0,${a})`;
        ctx.font = "9px 'JetBrains Mono',monospace";
        ctx.fillText(`✓ ${f.msg}`, SW - 8, 18 + i * 13);
      });

      // ── Overlays ───────────────────────────────────────────────
      if (g.roundWon) {
        ctx.fillStyle = "rgba(0,0,0,0.72)";
        ctx.fillRect(0, 0, SW, SH);
        ctx.fillStyle = "#22c55e";
        ctx.textAlign = "center";
        ctx.font = `bold ${Math.floor(SW/18)}px 'JetBrains Mono',monospace`;
        ctx.fillText("COUNTER-TERRORIST WIN", SW/2, SH/2 - 14);
        ctx.fillStyle = "#ffb000";
        ctx.font = `${Math.floor(SW/52)}px 'JetBrains Mono',monospace`;
        ctx.fillText(
          `kills: ${g.kills}   ·   next round in ${Math.ceil(g.roundEndT)}s`,
          SW/2, SH/2 + 18
        );
      }

      if (g.hp <= 0) {
        ctx.fillStyle = "rgba(0,0,0,0.78)";
        ctx.fillRect(0, 0, SW, SH);
        ctx.fillStyle = "#ef4444";
        ctx.textAlign = "center";
        ctx.font = `bold ${Math.floor(SW/16)}px 'JetBrains Mono',monospace`;
        ctx.fillText("ELIMINATED", SW/2, SH/2 - 12);
        ctx.fillStyle = "#71717a";
        ctx.font = `${Math.floor(SW/55)}px 'JetBrains Mono',monospace`;
        ctx.fillText("respawning...", SW/2, SH/2 + 16);
      }

      if (!lockedRef.current && g.hp > 0) {
        ctx.fillStyle = "rgba(0,0,0,0.75)";
        ctx.fillRect(0, 0, SW, SH);
        ctx.fillStyle = "#ffb000";
        ctx.textAlign = "center";
        ctx.font = `bold ${Math.floor(SW/22)}px 'JetBrains Mono',monospace`;
        ctx.fillText("CLICK TO PLAY", SW/2, SH/2 - 12);
        ctx.fillStyle = "#52525b";
        ctx.font = `${Math.floor(SW/58)}px 'JetBrains Mono',monospace`;
        ctx.fillText("WASD · MOUSE LOOK · CLICK / SPACE TO SHOOT · F / ESC TO CLOSE", SW/2, SH/2 + 18);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    prevTRef.current = performance.now();
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("keydown", onKD);
      window.removeEventListener("keyup",   onKU);
      window.removeEventListener("mousemove", onMM);
      canvas.removeEventListener("mousedown", onMD);
      document.removeEventListener("pointerlockchange", onLC);
      if (document.pointerLockElement) document.exitPointerLock();
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="fps"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[300] bg-black flex items-center justify-center"
        >
          <canvas
            ref={canvasRef}
            width={SW}
            height={SH}
            className="w-full h-full object-contain"
            style={{
              imageRendering: "pixelated",
              cursor: lockedUI ? "none" : "crosshair",
            }}
          />
          <button
            onClick={close}
            className="absolute top-4 right-5 font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-600 hover:text-zinc-300 transition-colors duration-150"
          >
            F · ESC to close
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
