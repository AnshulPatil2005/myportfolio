"use client";

import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { useEffect, useRef } from "react";
import { CHAPTERS, WEAPONS, IMMUNE_TEXTS, ANSHUL_TAUNTS, ROMAN } from "./data";

// ── World: four zones — three boss arenas, then Anshul at the end ─────────────
const ZONE_GAP = 34;
const ZC = [0, 1, 2, 3].map(i => -i * ZONE_GAP);
const FINAL = 3;
const ROOM_HW = 14;
const ROOM_HD = 11;
const CORR_HW = 3;
const RW = 960, RH = 540;
const EYE = 1.6;

const REDC = 0xff5555;
const GREENC = 0x4ade80;

const ZONE_COL = [0x4ade80, 0x38bdf8, 0xf87171, 0xffd88a];
const ZONE_HEX = ["#4ade80", "#38bdf8", "#f87171", "#ffd88a"];

interface Props {
  initialCleared: number;
  paused: boolean;
  onEvent: (e: "victory" | "ending" | "pause" | "interlude", data?: number) => void;
}

interface PB { x: number; y: number; z: number; vx: number; vy: number; vz: number; dmg: number; pierce: number; life: number; dead: boolean }
interface Part { x: number; y: number; z: number; vx: number; vy: number; vz: number; t: number; max: number; r: number; g: number; b: number }
// telegraphed area pulse — dodge by stepping out of the circle
interface Hazard { x: number; z: number; r: number; warm: number; fade: number; dealt: boolean }
// expanding ground ring — dodge by not being where it crosses
interface Wave { x: number; z: number; R: number; speed: number; max: number; dealt: boolean }

const ROOMS = ZC.map(zc => ({ x1: -ROOM_HW, x2: ROOM_HW, z1: zc - ROOM_HD, z2: zc + ROOM_HD }));
const CORRS = [0, 1, 2].map(i => ({ x1: -CORR_HW, x2: CORR_HW, z1: ZC[i] - ROOM_HD - (ZONE_GAP - ROOM_HD * 2), z2: ZC[i] - ROOM_HD }));

// one guardian creature per zone, met before the boss
// 0 query leech · 1 quantum shard · 2 incident spark
const MOB_SPAWNS = [0, 1, 2].map(zi => ({
  type: zi,
  x: zi % 2 === 0 ? -3.5 : 3.5,
  z: ZC[zi] + 8.2,
}));
const MOB_NAMES = ["QUERY LEECH", "QUANTUM SHARD", "INCIDENT SPARK"];

const MAGS = [12, 6, 4, 8];
const RELOAD_T = [1.0, 1.4, 2.0, 1.6];
const WEAPON_TINT = [0xdff3ff, 0x4ade80, 0x9beeff, 0xffd88a];

export default function Engine3D({ initialCleared, paused, onEvent }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(paused);
  const onEventRef = useRef(onEvent);
  pausedRef.current = paused;
  onEventRef.current = onEvent;

  // HUD refs
  const hpFillRef = useRef<HTMLDivElement>(null);
  const hpNumRef = useRef<HTMLSpanElement>(null);
  const bossWrapRef = useRef<HTMLDivElement>(null);
  const bossNameRef = useRef<HTMLParagraphElement>(null);
  const bossFillRef = useRef<HTMLDivElement>(null);
  const noteRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const blackRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const introNameRef = useRef<HTMLHeadingElement>(null);
  const introSubRef = useRef<HTMLParagraphElement>(null);
  const crossRef = useRef<HTMLDivElement>(null);
  const lockHintRef = useRef<HTMLDivElement>(null);
  const zoneRef = useRef<HTMLDivElement>(null);
  const objRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);
  const weaponRef = useRef<HTMLDivElement>(null);
  const ammoRef = useRef<HTMLDivElement>(null);
  const feedRef = useRef<HTMLDivElement>(null);
  const promptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // ── Renderer / scene / camera ──────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(RW, RH, false);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    mount.appendChild(renderer.domElement);
    const canvas = renderer.domElement;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xcfe4f5);
    scene.fog = new THREE.Fog(0xcfe4f5, 30, 115);

    // bright clean daylight
    scene.add(new THREE.HemisphereLight(0xeaf4ff, 0xcabfa8, 1.0));
    const sun = new THREE.DirectionalLight(0xfff2dc, 2.0);
    sun.position.set(18, 30, 10);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    sun.shadow.camera.left = -30; sun.shadow.camera.right = 30;
    sun.shadow.camera.top = 30; sun.shadow.camera.bottom = -30;
    sun.shadow.camera.near = 1; sun.shadow.camera.far = 90;
    sun.shadow.bias = -0.002;
    scene.add(sun, sun.target);
    ZC.forEach((zc, i) => {
      const pl = new THREE.PointLight(ZONE_COL[i], 40, 32, 1.8);
      pl.position.set(0, 6.5, i === FINAL ? zc : zc - 2);
      scene.add(pl);
    });

    const camera = new THREE.PerspectiveCamera(62, RW / RH, 0.05, 300);
    scene.add(camera);

    const composer = new EffectComposer(renderer);
    composer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    composer.setSize(RW, RH);
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(new UnrealBloomPass(new THREE.Vector2(RW, RH), 0.22, 0.3, 0.9));
    composer.addPass(new OutputPass());

    // ── Helpers ────────────────────────────────────────────────────────────
    const disposables: { dispose: () => void }[] = [];
    const track = <T extends { dispose: () => void }>(d: T): T => { disposables.push(d); return d; };
    const bmat = (color: number, o: Partial<THREE.MeshLambertMaterialParameters> = {}) =>
      track(new THREE.MeshLambertMaterial({ color, ...o }));
    const emat = (color: number, o: Partial<THREE.MeshBasicMaterialParameters> = {}) =>
      track(new THREE.MeshBasicMaterial({ color, ...o }));
    const lmat = (color: number, opacity = 1) =>
      track(new THREE.LineBasicMaterial({ color, transparent: opacity < 1, opacity }));
    const edgesOf = (geo: THREE.BufferGeometry, color: number, opacity = 1) =>
      new THREE.LineSegments(track(new THREE.EdgesGeometry(geo)), lmat(color, opacity));

    const texCache = new Map<string, THREE.CanvasTexture>();
    function textTexture(txt: string, color: string, fontPx = 56): THREE.CanvasTexture {
      const key = `t|${txt}|${color}|${fontPx}`;
      const hit = texCache.get(key);
      if (hit) return hit;
      const c = document.createElement("canvas");
      let ctx = c.getContext("2d")!;
      ctx.font = `bold ${fontPx}px "JetBrains Mono", monospace`;
      const w = Math.ceil(ctx.measureText(txt).width) + 24;
      c.width = Math.max(2, w);
      c.height = fontPx + 28;
      ctx = c.getContext("2d")!;
      ctx.font = `bold ${fontPx}px "JetBrains Mono", monospace`;
      ctx.fillStyle = color;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(txt, c.width / 2, c.height / 2);
      const tex = track(new THREE.CanvasTexture(c));
      tex.anisotropy = 4;
      texCache.set(key, tex);
      return tex;
    }
    function textSprite(txt: string, color: string, worldH = 0.6, fontPx = 56): THREE.Sprite {
      const tex = textTexture(txt, color, fontPx);
      const m = track(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
      const s = new THREE.Sprite(m);
      const img = tex.image as HTMLCanvasElement;
      s.scale.set((img.width / img.height) * worldH, worldH, 1);
      return s;
    }
    // crisp rounded plate with text — for signs, names, and labels
    function plateSprite(txt: string, fg = "#233150", bg = "rgba(252,252,254,0.94)", worldH = 0.42, fontPx = 44): THREE.Sprite {
      const key = `p|${txt}|${fg}|${bg}|${fontPx}`;
      let tex = texCache.get(key);
      if (!tex) {
        const c = document.createElement("canvas");
        let ctx = c.getContext("2d")!;
        ctx.font = `bold ${fontPx}px "JetBrains Mono", monospace`;
        const tw = Math.ceil(ctx.measureText(txt).width);
        const padX = 30, padY = 20, r = 18;
        c.width = tw + padX * 2;
        c.height = fontPx + padY * 2;
        ctx = c.getContext("2d")!;
        const x0 = 2, y0 = 2, w2 = c.width - 4, h2 = c.height - 4;
        ctx.beginPath();
        ctx.moveTo(x0 + r, y0);
        ctx.lineTo(x0 + w2 - r, y0);
        ctx.arcTo(x0 + w2, y0, x0 + w2, y0 + r, r);
        ctx.lineTo(x0 + w2, y0 + h2 - r);
        ctx.arcTo(x0 + w2, y0 + h2, x0 + w2 - r, y0 + h2, r);
        ctx.lineTo(x0 + r, y0 + h2);
        ctx.arcTo(x0, y0 + h2, x0, y0 + h2 - r, r);
        ctx.lineTo(x0, y0 + r);
        ctx.arcTo(x0, y0, x0 + r, y0, r);
        ctx.closePath();
        ctx.fillStyle = bg;
        ctx.fill();
        ctx.font = `bold ${fontPx}px "JetBrains Mono", monospace`;
        ctx.fillStyle = fg;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(txt, c.width / 2, c.height / 2 + 1);
        tex = track(new THREE.CanvasTexture(c));
        tex.anisotropy = 4;
        texCache.set(key, tex);
      }
      const m = track(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
      const s = new THREE.Sprite(m);
      const img = tex.image as HTMLCanvasElement;
      s.scale.set((img.width / img.height) * worldH, worldH, 1);
      return s;
    }
    // soft radial glow texture (muzzle flash) — no font glyphs involved
    function glowTexture(): THREE.CanvasTexture {
      const key = "glow";
      const hit = texCache.get(key);
      if (hit) return hit;
      const c = document.createElement("canvas");
      c.width = c.height = 128;
      const ctx = c.getContext("2d")!;
      const grad = ctx.createRadialGradient(64, 64, 4, 64, 64, 64);
      grad.addColorStop(0, "rgba(255,255,255,1)");
      grad.addColorStop(0.4, "rgba(200,240,255,0.7)");
      grad.addColorStop(1, "rgba(180,230,255,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 128, 128);
      const tex = track(new THREE.CanvasTexture(c));
      texCache.set(key, tex);
      return tex;
    }

    // ── Sky ────────────────────────────────────────────────────────────────
    {
      const skyGeo = track(new THREE.SphereGeometry(220, 24, 16));
      const skyMat = track(new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        uniforms: {
          top: { value: new THREE.Color(0x3f8de0) },
          mid: { value: new THREE.Color(0x9fd0f2) },
          bot: { value: new THREE.Color(0xfdf0da) },
        },
        vertexShader: `varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
        fragmentShader: `varying vec3 vP; uniform vec3 top; uniform vec3 mid; uniform vec3 bot;
          void main(){ float h = normalize(vP).y;
          vec3 c = h > 0.12 ? mix(mid, top, smoothstep(0.12, 0.65, h)) : mix(bot, mid, smoothstep(-0.1, 0.12, h));
          gl_FragColor = vec4(c, 1.0); }`,
      }));
      const sky = new THREE.Mesh(skyGeo, skyMat);
      sky.position.set(0, 0, -51);
      scene.add(sky);
      const c = document.createElement("canvas");
      c.width = c.height = 256;
      const g2 = c.getContext("2d")!;
      const grad = g2.createRadialGradient(128, 128, 10, 128, 128, 128);
      grad.addColorStop(0, "rgba(255,250,235,1)");
      grad.addColorStop(0.25, "rgba(255,235,190,0.8)");
      grad.addColorStop(1, "rgba(255,225,170,0)");
      g2.fillStyle = grad;
      g2.fillRect(0, 0, 256, 256);
      const tex = track(new THREE.CanvasTexture(c));
      const sm = track(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, fog: false }));
      const glow = new THREE.Sprite(sm);
      glow.scale.setScalar(75);
      glow.position.set(0, 14, -255);
      scene.add(glow);
      for (let i = 0; i < 14; i++) {
        const a = (i / 14) * Math.PI * 2;
        const dist = 85 + ((i * 37) % 45);
        const h = 16 + ((i * 53) % 22);
        const m = new THREE.Mesh(
          track(new THREE.ConeGeometry(9 + ((i * 29) % 8), h, 5)),
          bmat(0x8fa8cc, { flatShading: true })
        );
        m.position.set(Math.cos(a) * dist, h / 2 - 2, -51 + Math.sin(a) * dist * 1.2);
        m.rotation.y = a;
        scene.add(m);
      }
    }

    // drifting clouds + floating islands
    const cloudSprites: { s: THREE.Sprite; bx: number; sp: number }[] = [];
    const islands: { g: THREE.Group; by: number }[] = [];
    {
      const c = document.createElement("canvas");
      c.width = 256; c.height = 128;
      const g2 = c.getContext("2d")!;
      for (const [cx, cy, cr] of [[70, 74, 46], [128, 58, 56], [186, 76, 44], [110, 84, 40]] as [number, number, number][]) {
        const grad = g2.createRadialGradient(cx, cy, 4, cx, cy, cr);
        grad.addColorStop(0, "rgba(255,255,255,0.95)");
        grad.addColorStop(1, "rgba(255,255,255,0)");
        g2.fillStyle = grad;
        g2.fillRect(0, 0, 256, 128);
      }
      const tex = track(new THREE.CanvasTexture(c));
      for (let i = 0; i < 9; i++) {
        const sm = track(new THREE.SpriteMaterial({ map: tex, transparent: true, opacity: 0.7, depthWrite: false, fog: false }));
        const s = new THREE.Sprite(sm);
        const w = 20 + (i * 7) % 16;
        s.scale.set(w, w * 0.42, 1);
        const bx = -60 + (i * 137) % 120;
        s.position.set(bx, 26 + (i * 31) % 16, 16 - (i * 53) % 150);
        scene.add(s);
        cloudSprites.push({ s, bx, sp: 0.14 + (i % 3) * 0.08 });
      }
      for (let i = 0; i < 4; i++) {
        const g = new THREE.Group();
        const top = new THREE.Mesh(track(new THREE.CylinderGeometry(2.6, 3.1, 1.1, 7)), bmat(0x9fbf8a, { flatShading: true }));
        const under = new THREE.Mesh(track(new THREE.ConeGeometry(2.9, 3.4, 7)), bmat(0x8a7a68, { flatShading: true }));
        under.rotation.x = Math.PI;
        under.position.y = -2.2;
        const treeT = new THREE.Mesh(track(new THREE.CylinderGeometry(0.09, 0.12, 0.8, 5)), bmat(0x7a5c40));
        treeT.position.y = 0.95;
        const treeC = new THREE.Mesh(track(new THREE.ConeGeometry(0.6, 1.4, 6)), bmat(0x5fae72, { flatShading: true }));
        treeC.position.y = 1.9;
        g.add(top, under, treeT, treeC);
        const side = i % 2 === 0 ? 1 : -1;
        const by = 17 + (i * 5) % 9;
        g.position.set(side * (24 + (i * 11) % 14), by, -8 - i * 32);
        scene.add(g);
        islands.push({ g, by });
      }
    }

    // ── Terrain ────────────────────────────────────────────────────────────
    const ground = new THREE.Mesh(track(new THREE.PlaneGeometry(140, 260)), bmat(0xcfc8b6));
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(0, -0.04, -51);
    scene.add(ground);
    const tint = (hex: number, k: number) => new THREE.Color(hex).multiplyScalar(k).getHex();
    const pastel = (hex: number, k: number) => new THREE.Color(0xe9e2d2).lerp(new THREE.Color(hex), k).getHex();
    ZC.forEach((zc, i) => {
      const floor = new THREE.Mesh(
        track(new THREE.PlaneGeometry(ROOM_HW * 2, ROOM_HD * 2)),
        bmat(pastel(ZONE_COL[i], 0.22))
      );
      floor.rotation.x = -Math.PI / 2;
      floor.position.set(0, -0.02, zc);
      scene.add(floor);
    });
    CORRS.forEach((cr, i) => {
      const floor = new THREE.Mesh(
        track(new THREE.PlaneGeometry(CORR_HW * 2, cr.z2 - cr.z1)),
        bmat(pastel(ZONE_COL[i + 1], 0.28))
      );
      floor.rotation.x = -Math.PI / 2;
      floor.position.set(0, -0.02, (cr.z1 + cr.z2) / 2);
      scene.add(floor);
    });
    const grid = new THREE.GridHelper(260, 130, 0xffffff, 0xffffff);
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.1;
    grid.position.z = -51;
    scene.add(grid);

    const WALL_H = 2.6;
    function mkWall(w: number, d: number, x: number, z: number, accent: number) {
      const geo = track(new THREE.BoxGeometry(w, WALL_H, d));
      const mesh = new THREE.Mesh(geo, bmat(pastel(accent, 0.08)));
      mesh.position.set(x, WALL_H / 2, z);
      const e = edgesOf(geo, accent, 0.55);
      e.position.copy(mesh.position);
      const trim = new THREE.Mesh(track(new THREE.BoxGeometry(w + 0.04, 0.1, d + 0.04)), emat(accent, { transparent: true, opacity: 0.95 }));
      trim.position.set(x, WALL_H - 0.28, z);
      scene.add(mesh, e, trim);
    }
    const segW = ROOM_HW - CORR_HW;
    ZC.forEach((zc, i) => {
      const col = ZONE_COL[i];
      if (i > 0) {
        mkWall(segW, 0.5, -(CORR_HW + segW / 2), zc + ROOM_HD, col);
        mkWall(segW, 0.5, CORR_HW + segW / 2, zc + ROOM_HD, col);
      } else {
        mkWall(ROOM_HW * 2 + 0.5, 0.5, 0, zc + ROOM_HD + 0.25, col);
      }
      if (i < FINAL) {
        mkWall(segW, 0.5, -(CORR_HW + segW / 2), zc - ROOM_HD, col);
        mkWall(segW, 0.5, CORR_HW + segW / 2, zc - ROOM_HD, col);
      } else {
        mkWall(ROOM_HW * 2 + 0.5, 0.5, 0, zc - ROOM_HD - 0.25, col);
      }
      mkWall(0.5, ROOM_HD * 2, -ROOM_HW - 0.25, zc, col);
      mkWall(0.5, ROOM_HD * 2, ROOM_HW + 0.25, zc, col);
      const postGeo = track(new THREE.CylinderGeometry(0.09, 0.09, 3.6, 6));
      for (const [sx, sz] of [[-ROOM_HW, zc - ROOM_HD], [ROOM_HW, zc - ROOM_HD], [ROOM_HW, zc + ROOM_HD], [-ROOM_HW, zc + ROOM_HD]] as [number, number][]) {
        const post = new THREE.Mesh(postGeo, emat(col, { transparent: true, opacity: 0.85 }));
        post.position.set(sx, 1.8, sz);
        scene.add(post);
      }
      const ring = new THREE.Mesh(track(new THREE.RingGeometry(5.1, 5.24, 48)), emat(col, { transparent: true, opacity: 0.35, side: THREE.DoubleSide }));
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(0, 0.02, i === FINAL ? zc : zc - 2);
      scene.add(ring);
    });
    CORRS.forEach((cr, i) => {
      const len = cr.z2 - cr.z1;
      mkWall(0.5, len, -CORR_HW - 0.25, (cr.z1 + cr.z2) / 2, ZONE_COL[i + 1]);
      mkWall(0.5, len, CORR_HW + 0.25, (cr.z1 + cr.z2) / 2, ZONE_COL[i + 1]);
    });

    // gates
    const gates = CORRS.map((cr, i) => {
      const g = new THREE.Group();
      const plane = new THREE.Mesh(track(new THREE.PlaneGeometry(CORR_HW * 2, WALL_H)), emat(ZONE_COL[i], { transparent: true, opacity: 0.18, side: THREE.DoubleSide }));
      plane.position.y = WALL_H / 2;
      const frame = edgesOf(track(new THREE.BoxGeometry(CORR_HW * 2, WALL_H, 0.06)), ZONE_COL[i], 0.7);
      frame.position.y = WALL_H / 2;
      const lock = plateSprite("GATE SEALED", "#a63030", "rgba(252,252,254,0.94)", 0.4);
      lock.position.y = WALL_H + 0.6;
      g.add(plane, frame, lock);
      g.position.set(0, 0, cr.z2);
      scene.add(g);
      return { g, plane: plane.material as THREE.MeshBasicMaterial };
    });

    // no floating story text — the story lives in the pre-level intro cards

    // ambient colorful props
    const propRand = (seed: number) => {
      let s = seed;
      return () => { s = (s * 16807) % 2147483647; return (s % 1000) / 1000; };
    };
    // surroundings beyond the walls — trees and rocks line the whole path
    {
      const rnd = propRand(4242);
      for (let k = 0; k < 44; k++) {
        const side = k % 2 === 0 ? 1 : -1;
        const px2 = side * (17 + rnd() * 12);
        const pz2 = 14 - rnd() * (ZONE_GAP * 3 + 34);
        const zi = Math.max(0, Math.min(FINAL, Math.round(-pz2 / ZONE_GAP)));
        if (rnd() < 0.62) {
          // stylized tree
          const th = 1.4 + rnd() * 2.4;
          const trunk = new THREE.Mesh(track(new THREE.CylinderGeometry(0.12, 0.16, th * 0.45, 6)), bmat(0x7a5c40));
          trunk.position.set(px2, th * 0.22, pz2);
          const crown = new THREE.Mesh(
            track(new THREE.ConeGeometry(0.8 + rnd() * 0.5, th, 6)),
            bmat(new THREE.Color(ZONE_COL[zi]).lerp(new THREE.Color(0x3f9f5f), 0.55).lerp(new THREE.Color(0xffffff), 0.1).getHex(), { flatShading: true })
          );
          crown.position.set(px2, th * 0.45 + th * 0.5, pz2);
          scene.add(trunk, crown);
        } else {
          const rock = new THREE.Mesh(track(new THREE.IcosahedronGeometry(0.5 + rnd() * 0.7, 0)), bmat(0xb8b0a2, { flatShading: true }));
          rock.position.set(px2, 0.4, pz2);
          rock.rotation.y = rnd() * Math.PI;
          scene.add(rock);
        }
      }
    }

    ZC.forEach((zc, zi) => {
      const rnd = propRand(zi * 977 + 13);
      const col = ZONE_COL[zi];
      for (let k = 0; k < 9; k++) {
        const px2 = (rnd() - 0.5) * 24;
        const pz2 = zc + (rnd() - 0.5) * 17;
        if (Math.abs(px2) < 4.5 && Math.abs(pz2 - zc) < 6) continue;
        const h = 0.7 + rnd() * 2.2;
        let geo: THREE.BufferGeometry;
        let py = h / 2;
        if (zi === 0 || zi === 2) geo = track(new THREE.ConeGeometry(0.42 + rnd() * 0.3, h, 5));
        else if (zi === FINAL) geo = track(new THREE.CylinderGeometry(0.2, 0.32, h, 6));
        else { geo = track(new THREE.IcosahedronGeometry(0.5 + rnd() * 0.45, 0)); py = 0.55; }
        const m = new THREE.Mesh(geo, bmat(new THREE.Color(col).lerp(new THREE.Color(0xffffff), 0.2).getHex(), { flatShading: true, emissive: tint(col, 0.1) }));
        m.position.set(px2, py, pz2);
        m.rotation.y = rnd() * Math.PI;
        scene.add(m);
      }
    });

    // pollen dust
    {
      const n = 300;
      const pos = new Float32Array(n * 3);
      for (let i = 0; i < n; i++) {
        pos[i * 3] = (Math.random() - 0.5) * 60;
        pos[i * 3 + 1] = Math.random() * 10 + 0.5;
        pos[i * 3 + 2] = 20 - Math.random() * 150;
      }
      const g = track(new THREE.BufferGeometry());
      g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      const ptsm = track(new THREE.PointsMaterial({ color: 0xffffff, size: 0.09, transparent: true, opacity: 0.3, depthWrite: false }));
      const pts = new THREE.Points(g, ptsm);
      pts.frustumCulled = false;
      scene.add(pts);
    }

    // ── Viewmodel gun — layered sci-fi pistol ──────────────────────────────
    const gun = new THREE.Group();
    const gunGlowMats: THREE.MeshBasicMaterial[] = [];
    {
      const bodyGeo = track(new THREE.BoxGeometry(0.13, 0.15, 0.44));
      const body = new THREE.Mesh(bodyGeo, bmat(0x38424e));
      const topGeo = track(new THREE.BoxGeometry(0.09, 0.06, 0.5));
      const top = new THREE.Mesh(topGeo, bmat(0x2a323c));
      top.position.set(0, 0.1, -0.02);
      const barrel = new THREE.Mesh(track(new THREE.CylinderGeometry(0.035, 0.035, 0.34, 10)), bmat(0x222b34));
      barrel.rotation.x = Math.PI / 2;
      barrel.position.set(0, 0.06, -0.42);
      const core = new THREE.Mesh(track(new THREE.BoxGeometry(0.145, 0.03, 0.3)), emat(0x22d3ee));
      gunGlowMats.push(core.material as THREE.MeshBasicMaterial);
      core.position.set(0, 0.02, -0.05);
      const grip = new THREE.Mesh(track(new THREE.BoxGeometry(0.11, 0.22, 0.13)), bmat(0x2e3843));
      grip.position.set(0, -0.16, 0.12);
      grip.rotation.x = 0.25;
      const sight = new THREE.Mesh(track(new THREE.BoxGeometry(0.02, 0.05, 0.02)), emat(0x22d3ee));
      gunGlowMats.push(sight.material as THREE.MeshBasicMaterial);
      sight.position.set(0, 0.16, -0.2);
      gun.add(body, top, barrel, core, grip, sight);
    }
    gun.position.set(0.32, -0.27, -0.65);
    camera.add(gun);
    const muzzleMat = track(new THREE.SpriteMaterial({ map: glowTexture(), transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }));
    const muzzle = new THREE.Sprite(muzzleMat);
    muzzle.scale.setScalar(0.34);
    muzzle.position.set(0.32, -0.19, -1.1);
    camera.add(muzzle);

    // ── SFX ────────────────────────────────────────────────────────────────
    let actx: AudioContext | null = null;
    function sfx(type: "shot" | "rail" | "hurt" | "boom" | "tick") {
      try {
        if (!actx) actx = new AudioContext();
        const t0 = actx.currentTime;
        const o = actx.createOscillator();
        const g = actx.createGain();
        o.connect(g); g.connect(actx.destination);
        if (type === "shot") {
          o.type = "square";
          o.frequency.setValueAtTime(640, t0);
          o.frequency.exponentialRampToValueAtTime(150, t0 + 0.08);
          g.gain.setValueAtTime(0.04, t0);
          g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.09);
          o.start(t0); o.stop(t0 + 0.1);
        } else if (type === "rail") {
          o.type = "sawtooth";
          o.frequency.setValueAtTime(130, t0);
          o.frequency.exponentialRampToValueAtTime(28, t0 + 0.26);
          g.gain.setValueAtTime(0.09, t0);
          g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.28);
          o.start(t0); o.stop(t0 + 0.3);
        } else if (type === "tick") {
          o.type = "square";
          o.frequency.setValueAtTime(1050, t0);
          o.frequency.exponentialRampToValueAtTime(620, t0 + 0.035);
          g.gain.setValueAtTime(0.022, t0);
          g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.045);
          o.start(t0); o.stop(t0 + 0.05);
        } else if (type === "hurt") {
          o.type = "sawtooth";
          o.frequency.setValueAtTime(210, t0);
          o.frequency.exponentialRampToValueAtTime(55, t0 + 0.18);
          g.gain.setValueAtTime(0.07, t0);
          g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.2);
          o.start(t0); o.stop(t0 + 0.22);
        } else {
          o.type = "triangle";
          o.frequency.setValueAtTime(95, t0);
          o.frequency.exponentialRampToValueAtTime(24, t0 + 0.4);
          g.gain.setValueAtTime(0.11, t0);
          g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.45);
          o.start(t0); o.stop(t0 + 0.5);
        }
      } catch { /* audio unavailable */ }
    }

    // ── Bullets / rail / orbs / particles ──────────────────────────────────
    const MAX_PB = 160;
    const pbMesh = new THREE.InstancedMesh(track(new THREE.SphereGeometry(0.11, 8, 8)), emat(0x22d3ee), MAX_PB);
    pbMesh.frustumCulled = false;
    pbMesh.count = 0;
    scene.add(pbMesh);
    const m4 = new THREE.Matrix4();
    const obMesh = new THREE.InstancedMesh(track(new THREE.SphereGeometry(0.16, 8, 8)), emat(0xffd88a), 24);
    obMesh.frustumCulled = false; obMesh.count = 0;
    scene.add(obMesh);
    const railMat = emat(0x9beeff, { transparent: true, opacity: 0.9 });
    const railMesh = new THREE.Mesh(track(new THREE.BoxGeometry(0.07, 0.07, 1)), railMat);
    railMesh.visible = false;
    scene.add(railMesh);

    const MAXP = 500;
    const partPos = new Float32Array(MAXP * 3);
    const partCol = new Float32Array(MAXP * 3);
    const partGeo = track(new THREE.BufferGeometry());
    partGeo.setAttribute("position", new THREE.BufferAttribute(partPos, 3));
    partGeo.setAttribute("color", new THREE.BufferAttribute(partCol, 3));
    const partMesh = new THREE.Points(partGeo, track(new THREE.PointsMaterial({ size: 0.24, vertexColors: true, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false })));
    partMesh.frustumCulled = false;
    scene.add(partMesh);
    const parts: Part[] = [];
    function burst(x: number, z: number, n: number, color: number, speed = 5, y = 0.9) {
      const r = ((color >> 16) & 255) / 255, g = ((color >> 8) & 255) / 255, b = (color & 255) / 255;
      for (let i = 0; i < n; i++) {
        if (parts.length >= MAXP) return;
        const a = Math.random() * Math.PI * 2;
        const s = speed * (0.3 + Math.random() * 0.7);
        parts.push({ x, y: y + Math.random() * 0.5, z, vx: Math.cos(a) * s, vy: 1 + Math.random() * 3, vz: Math.sin(a) * s, t: 0, max: 0.4 + Math.random() * 0.5, r, g, b });
      }
    }

    // floaters
    const FLOATN = 8;
    const floaters = Array.from({ length: FLOATN }, () => {
      const m = track(new THREE.SpriteMaterial({ transparent: true, depthWrite: false, opacity: 0 }));
      const s = new THREE.Sprite(m);
      s.visible = false;
      scene.add(s);
      return { s, m, t: 0, max: 0.9, live: false };
    });
    let floatIdx = 0;
    function floatTxt(txt: string, color: string, x: number, z: number, h = 0.5, y = 1.6) {
      const f = floaters[floatIdx++ % FLOATN];
      const tex = textTexture(txt, color, 48);
      f.m.map = tex;
      f.m.opacity = 1;
      const img = tex.image as HTMLCanvasElement;
      f.s.scale.set((img.width / img.height) * h, h, 1);
      f.s.position.set(x, y, z);
      f.s.visible = true;
      f.t = 0; f.live = true;
    }

    // hazard pulse visuals (unit radius, scaled per hazard)
    const hazVis = Array.from({ length: 6 }, () => {
      const g = new THREE.Group();
      const fill = new THREE.Mesh(track(new THREE.CircleGeometry(1, 28)), emat(0xff5c3c, { transparent: true, opacity: 0.12, side: THREE.DoubleSide }));
      fill.rotation.x = -Math.PI / 2; fill.position.y = 0.03;
      const rim = new THREE.Mesh(track(new THREE.RingGeometry(0.94, 1, 28)), emat(0xff7050, { transparent: true, opacity: 0.8, side: THREE.DoubleSide }));
      rim.rotation.x = -Math.PI / 2; rim.position.y = 0.04;
      g.add(fill, rim);
      g.visible = false;
      scene.add(g);
      return { g, fill: fill.material as THREE.MeshBasicMaterial, rim: rim.material as THREE.MeshBasicMaterial };
    });
    // shockwave ring visuals (unit radius, scaled per wave)
    const waveVis = Array.from({ length: 4 }, () => {
      const ring = new THREE.Mesh(track(new THREE.RingGeometry(0.94, 1, 48)), emat(0xffffff, { transparent: true, opacity: 0.8, side: THREE.DoubleSide }));
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.05;
      ring.visible = false;
      scene.add(ring);
      return ring;
    });

    // ── Guardian creatures — rounded, finished little machines ─────────────
    interface MobVis { g: THREE.Group; eye?: THREE.Mesh; shardA?: THREE.Group; shardB?: THREE.Group; ring?: THREE.Mesh; core?: THREE.Mesh }
    const mobVis: MobVis[] = MOB_SPAWNS.map(ms => {
      const g = new THREE.Group();
      const v: MobVis = { g };
      if (ms.type === 0) {
        // query leech — squat rounded drive-bot with one glowing eye
        const body = new THREE.Mesh(track(new THREE.SphereGeometry(0.72, 20, 14)), bmat(0xd07038, { emissive: 0x2a1004 }));
        body.scale.y = 0.62;
        body.position.y = 0.6;
        const skirt = new THREE.Mesh(track(new THREE.ConeGeometry(0.78, 0.5, 18)), bmat(0xb05a28));
        skirt.position.y = 0.28;
        const eye = new THREE.Mesh(track(new THREE.SphereGeometry(0.16, 12, 10)), emat(0xff4040));
        eye.position.set(0, 0.68, 0.62);
        v.eye = eye;
        const ant = new THREE.Mesh(track(new THREE.CylinderGeometry(0.02, 0.02, 0.5, 6)), bmat(0x7a4a20));
        ant.position.y = 1.25;
        const tip = new THREE.Mesh(track(new THREE.SphereGeometry(0.06, 8, 8)), emat(0xff8060));
        tip.position.y = 1.52;
        const treadL = new THREE.Mesh(track(new THREE.BoxGeometry(0.28, 0.18, 0.95)), bmat(0x6a4428));
        treadL.position.set(-0.52, 0.1, 0);
        const treadR = treadL.clone();
        treadR.position.x = 0.52;
        g.add(body, skirt, eye, ant, tip, treadL, treadR);
        g.position.set(ms.x, 0, ms.z);
        g.scale.setScalar(1.2);
      } else if (ms.type === 1) {
        // quantum shard — crystal in two places, each with an orbit ring
        const mkShard = () => {
          const sg = new THREE.Group();
          const outer = new THREE.Mesh(track(new THREE.IcosahedronGeometry(0.55, 0)), bmat(0x9fdcff, { flatShading: true, emissive: 0x1a4a66 }));
          const core = new THREE.Mesh(track(new THREE.SphereGeometry(0.2, 10, 8)), emat(0x66e0ff));
          const ring = new THREE.Mesh(track(new THREE.TorusGeometry(0.85, 0.035, 10, 32)), emat(0x38bdf8, { transparent: true, opacity: 0.8 }));
          ring.rotation.x = Math.PI / 2.6;
          sg.add(outer, core, ring);
          sg.position.y = 1.3;
          return sg;
        };
        v.shardA = mkShard();
        v.shardB = mkShard();
        g.add(v.shardA, v.shardB);
      } else {
        // incident spark — spiky red star that falls from the sky
        const core = new THREE.Mesh(track(new THREE.OctahedronGeometry(0.4, 0)), emat(0xff5050));
        const spike = new THREE.Mesh(track(new THREE.OctahedronGeometry(0.4, 0)), emat(0xff9060, { transparent: true, opacity: 0.7 }));
        spike.scale.set(1.5, 0.5, 0.5);
        const spike2 = spike.clone();
        spike2.scale.set(0.5, 1.5, 0.5);
        v.core = core;
        const glowS = new THREE.Sprite(track(new THREE.SpriteMaterial({ map: glowTexture(), color: 0xff6050, transparent: true, opacity: 0.75, depthWrite: false, blending: THREE.AdditiveBlending })));
        glowS.scale.setScalar(1.7);
        g.add(core, spike, spike2, glowS);
        v.ring = new THREE.Mesh(track(new THREE.RingGeometry(0.8, 0.95, 20)), emat(0xff5555, { transparent: true, opacity: 0.6, side: THREE.DoubleSide }));
        v.ring.rotation.x = -Math.PI / 2;
        v.ring.visible = false;
        scene.add(v.ring);
      }
      scene.add(g);
      return v;
    });

    // ── Bosses — finished multi-part models ────────────────────────────────
    interface BossVis {
      group: THREE.Group;
      seams?: THREE.Mesh[]; sats?: THREE.Mesh[];
      ghosts?: THREE.Group[]; hash?: THREE.Sprite; pin?: THREE.Mesh;
      rings?: THREE.Mesh[]; mods?: THREE.Group[]; caps?: THREE.MeshBasicMaterial[];
      screen?: THREE.MeshBasicMaterial; aura?: THREE.MeshBasicMaterial; halo?: THREE.Mesh;
      protoBody?: THREE.Group;
    }
    const bossVis: BossVis[] = ZC.map((zc, zi) => {
      const group = new THREE.Group();
      group.position.set(0, 0, zi === FINAL ? zc : zc - 2);
      scene.add(group);
      const v: BossVis = { group };
      const name = plateSprite(CHAPTERS[zi].bossName, zi === FINAL ? "#8a6a20" : "#a63030", "rgba(252,252,254,0.92)", 0.42);
      name.position.y = zi === 0 ? 6.3 : 4.3;
      group.add(name);
      const orgPlate = plateSprite(`${CHAPTERS[zi].org} · ${CHAPTERS[zi].year}`, "#3a4560", "rgba(252,252,254,0.88)", 0.28, 38);
      orgPlate.position.y = name.position.y - 0.52;
      group.add(orgPlate);

      if (zi === 0) {
        // THE MONOLITH — octagonal drive tower with glowing seams + satellites
        const seams: THREE.Mesh[] = [];
        const sats: THREE.Mesh[] = [];
        const radii = [2.2, 2.0, 1.85, 1.7, 1.5];
        radii.forEach((r, i) => {
          const slabGeo = track(new THREE.CylinderGeometry(r, r + 0.08, 0.8, 8));
          const slab = new THREE.Mesh(slabGeo, bmat(0x5a7a4a, { flatShading: true, emissive: 0x101c0a }));
          slab.position.y = 0.45 + i * 0.95;
          group.add(slab);
          const seam = new THREE.Mesh(track(new THREE.CylinderGeometry(r - 0.05, r - 0.05, 0.12, 8)), emat(0x9fffb0, { transparent: true, opacity: 0.25 }));
          seam.position.y = 0.95 + i * 0.95;
          seams.push(seam);
          group.add(seam);
        });
        for (let i = 0; i < 3; i++) {
          const sat = new THREE.Mesh(track(new THREE.OctahedronGeometry(0.28, 0)), emat(0x4ade80));
          sats.push(sat);
          group.add(sat);
        }
        v.seams = seams;
        v.sats = sats;
        const baseRing = new THREE.Mesh(track(new THREE.TorusGeometry(2.55, 0.1, 10, 40)), bmat(0x4a6a3e));
        baseRing.rotation.x = Math.PI / 2;
        baseRing.position.y = 0.12;
        const dishPole = new THREE.Mesh(track(new THREE.CylinderGeometry(0.06, 0.06, 0.8, 6)), bmat(0x4a6a3e));
        dishPole.position.y = 5.1;
        const dish = new THREE.Mesh(track(new THREE.ConeGeometry(0.5, 0.35, 10)), bmat(0x7a9a6a, { flatShading: true }));
        dish.rotation.x = Math.PI;
        dish.position.y = 5.5;
        group.add(baseRing, dishPole, dish);
      } else if (zi === 1) {
        // NON-DETERMINISM — three ringed crystals, one real
        v.ghosts = [0, 1, 2].map(() => {
          const g = new THREE.Group();
          const outer = new THREE.Mesh(track(new THREE.IcosahedronGeometry(1.25, 0)), bmat(0x8fd4ff, { flatShading: true, transparent: true, opacity: 1, emissive: 0x14405c }));
          outer.position.y = 1.5;
          const core = new THREE.Mesh(track(new THREE.SphereGeometry(0.45, 12, 10)), emat(0x66e0ff, { transparent: true, opacity: 0.9 }));
          core.position.y = 1.5;
          const ring = new THREE.Mesh(track(new THREE.TorusGeometry(1.7, 0.05, 10, 40)), emat(0x38bdf8, { transparent: true, opacity: 0.7 }));
          ring.position.y = 1.5;
          ring.rotation.x = Math.PI / 2.4;
          g.add(outer, core, ring);
          g.position.set(0, 0, zc - 2);
          scene.add(g);
          return g;
        });
        v.hash = plateSprite("sha256: a3f9…", "#1a5276", "rgba(252,252,254,0.9)", 0.3, 40);
        v.hash.visible = false;
        scene.add(v.hash);
        v.pin = new THREE.Mesh(track(new THREE.RingGeometry(1.7, 1.85, 32)), emat(GREENC, { transparent: true, opacity: 0.8, side: THREE.DoubleSide }));
        v.pin.rotation.x = -Math.PI / 2;
        v.pin.position.y = 0.04;
        v.pin.visible = false;
        scene.add(v.pin);
      } else if (zi === 2) {
        // ARCHITECTURE DRIFT — gyroscope core with hex modules
        const core = new THREE.Mesh(track(new THREE.IcosahedronGeometry(1.3, 1)), bmat(0xb04858, { flatShading: true, emissive: 0x300c12 }));
        core.position.y = 1.7;
        v.rings = [0, 1].map(k => {
          const ring = new THREE.Mesh(track(new THREE.TorusGeometry(1.9 - k * 0.35, 0.06, 10, 44)), emat(0xff7080, { transparent: true, opacity: 0.85 }));
          ring.position.y = 1.7;
          group.add(ring);
          return ring;
        });
        group.add(core);
        v.mods = [];
        v.caps = [];
        ["auth", "api", "billing", "config"].forEach(label => {
          const g = new THREE.Group();
          const prism = new THREE.Mesh(track(new THREE.CylinderGeometry(0.72, 0.78, 0.9, 6)), bmat(0xc25868, { flatShading: true, emissive: 0x2a0c12 }));
          prism.position.y = 0.45;
          const capMat = emat(0xff8090, { transparent: true, opacity: 0.9 });
          const cap = new THREE.Mesh(track(new THREE.CylinderGeometry(0.6, 0.6, 0.08, 6)), capMat);
          cap.position.y = 0.94;
          v.caps!.push(capMat);
          const lb = plateSprite(label, "#8a2030", "rgba(252,252,254,0.9)", 0.26, 38);
          lb.position.y = 1.5;
          g.add(prism, cap, lb);
          g.position.set(0, 0, zc - 2);
          scene.add(g);
          v.mods!.push(g);
        });
      } else {
        // ANSHUL — a properly built character, not a stick figure
        const skin = 0xe8c39a, outfit = 0x33415c, trim = 0xffd88a;
        const legL = new THREE.Mesh(track(new THREE.CapsuleGeometry(0.14, 0.65, 4, 10)), bmat(0x2a3548));
        legL.position.set(-0.2, 0.55, 0);
        const legR = legL.clone();
        legR.position.x = 0.2;
        const torso = new THREE.Mesh(track(new THREE.CapsuleGeometry(0.42, 0.75, 4, 12)), bmat(outfit, { emissive: 0x0c1018 }));
        torso.position.y = 1.55;
        const beltGlow = new THREE.Mesh(track(new THREE.TorusGeometry(0.44, 0.035, 8, 28)), emat(trim, { transparent: true, opacity: 0.9 }));
        beltGlow.rotation.x = Math.PI / 2;
        beltGlow.position.y = 1.18;
        const shoulderL = new THREE.Mesh(track(new THREE.SphereGeometry(0.2, 12, 10)), bmat(0x415068));
        shoulderL.position.set(-0.5, 2.0, 0);
        const shoulderR = shoulderL.clone();
        shoulderR.position.x = 0.5;
        const armL = new THREE.Mesh(track(new THREE.CapsuleGeometry(0.12, 0.55, 4, 10)), bmat(outfit));
        armL.position.set(-0.55, 1.55, 0.22);
        armL.rotation.x = -0.7;
        const armR = armL.clone();
        armR.position.x = 0.55;
        const head = new THREE.Mesh(track(new THREE.SphereGeometry(0.34, 18, 14)), bmat(skin));
        head.position.y = 2.62;
        const hair = new THREE.Mesh(track(new THREE.SphereGeometry(0.36, 18, 10, 0, Math.PI * 2, 0, Math.PI / 2.1)), bmat(0x261c14));
        hair.position.y = 2.7;
        const laptop = new THREE.Mesh(track(new THREE.BoxGeometry(1.1, 0.07, 0.75)), bmat(0x3a2e20));
        laptop.position.set(0, 1.42, 0.62);
        v.screen = emat(0x9fe8ff, { transparent: true, opacity: 0.85 });
        const screen = new THREE.Mesh(track(new THREE.PlaneGeometry(1.0, 0.55)), v.screen);
        screen.position.set(0, 1.75, 0.95);
        screen.rotation.x = -0.45;
        v.halo = new THREE.Mesh(track(new THREE.TorusGeometry(0.55, 0.03, 10, 36)), emat(trim, { transparent: true, opacity: 0.85 }));
        v.halo.position.y = 3.25;
        v.halo.rotation.x = Math.PI / 2;
        v.aura = emat(trim, { transparent: true, opacity: 0.16, side: THREE.DoubleSide });
        const aura = new THREE.Mesh(track(new THREE.RingGeometry(1.6, 1.85, 40)), v.aura);
        aura.rotation.x = -Math.PI / 2;
        aura.position.y = 0.03;
        const sub = plateSprite("FULL-STACK DEVELOPER", "#5a4a20", "rgba(252,252,254,0.9)", 0.26, 38);
        sub.position.y = 3.7;
        const handL = new THREE.Mesh(track(new THREE.SphereGeometry(0.11, 10, 8)), bmat(skin));
        handL.position.set(-0.32, 1.48, 0.52);
        const handR = handL.clone();
        handR.position.x = 0.32;
        const footL = new THREE.Mesh(track(new THREE.BoxGeometry(0.2, 0.12, 0.36)), bmat(0x1f2836));
        footL.position.set(-0.2, 0.06, 0.08);
        const footR = footL.clone();
        footR.position.x = 0.2;
        const glassL = new THREE.Mesh(track(new THREE.TorusGeometry(0.09, 0.018, 8, 16)), bmat(0x223040));
        glassL.position.set(-0.13, 2.64, 0.3);
        const glassR = glassL.clone();
        glassR.position.x = 0.13;
        const bridge = new THREE.Mesh(track(new THREE.BoxGeometry(0.08, 0.02, 0.02)), bmat(0x223040));
        bridge.position.set(0, 2.64, 0.32);
        const panelL = new THREE.Mesh(track(new THREE.PlaneGeometry(0.62, 0.4)), emat(0x9fe8ff, { transparent: true, opacity: 0.45, side: THREE.DoubleSide }));
        panelL.position.set(-1.2, 2.2, 0.35);
        panelL.rotation.y = 0.5;
        const panelR = panelL.clone();
        panelR.position.x = 1.2;
        panelR.rotation.y = -0.5;
        // the procedural body lives in its own group — swapped out when the
        // real character model finishes loading
        const protoBody = new THREE.Group();
        protoBody.add(legL, legR, torso, beltGlow, shoulderL, shoulderR, armL, armR, head, hair, handL, handR, footL, footR, glassL, glassR, bridge);
        v.protoBody = protoBody;
        group.add(protoBody, laptop, screen, v.halo, aura, sub, panelL, panelR);
      }
      return v;
    });

    // bake shadow flags: lit surfaces cast/receive, glow + sky don't
    scene.traverse(o => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      const matAny = m.material as THREE.Material & { isMeshBasicMaterial?: boolean; isShaderMaterial?: boolean };
      const glow = matAny.isMeshBasicMaterial === true || matAny.isShaderMaterial === true;
      m.castShadow = !glow;
      m.receiveShadow = !glow;
    });

    // real character model for the final meeting
    // (KayKit Character Pack: Adventurers — CC0, kaylousberg.com)
    const mixers: THREE.AnimationMixer[] = [];
    const anshulActions: { idle?: THREE.AnimationAction; cheer?: THREE.AnimationAction } = {};
    new GLTFLoader().load(
      "/models/anshul.glb",
      gltf => {
        const model = gltf.scene;
        model.scale.setScalar(1.4);
        model.traverse(o => {
          const mm = o as THREE.Mesh;
          if (mm.isMesh) { mm.castShadow = true; mm.receiveShadow = false; }
        });
        const v = bossVis[FINAL];
        if (v.protoBody) v.protoBody.visible = false;
        v.group.add(model);
        const mixer = new THREE.AnimationMixer(model);
        mixers.push(mixer);
        const idleClip = THREE.AnimationClip.findByName(gltf.animations, "Idle") || gltf.animations[0];
        const cheerClip = THREE.AnimationClip.findByName(gltf.animations, "Cheer");
        if (idleClip) {
          anshulActions.idle = mixer.clipAction(idleClip);
          anshulActions.idle.play();
        }
        if (cheerClip) anshulActions.cheer = mixer.clipAction(cheerClip);
      },
      undefined,
      () => { /* offline or missing asset — the procedural body stays */ }
    );

    // ── State ──────────────────────────────────────────────────────────────
    const st = {
      t: 0, timeScale: 1,
      cleared: Math.max(0, Math.min(FINAL, initialCleared)),
      px: 0, pz: ZC[Math.max(0, Math.min(FINAL, initialCleared))] + 8.5,
      php: 100, invuln: 1.2, fireCd: 0,
      yaw: 0, pitch: 0, locked: false, firing: false, muzzleT: 0, bobT: 0, moving: false,
      gunKick: 0, hitT: 0,
      ammo: MAGS.slice(), reloadT: 0, reloadFor: 0,
      swayX: 0, swayY: 0,
      feed: [] as { txt: string; t: number }[], feedDirty: false,
      keys: new Set<string>(),
      pb: [] as PB[],
      hazards: [] as Hazard[],
      waves: [] as Wave[],
      pendingFight: -1,
      fightActive: false, fightZone: -1, introT: -1, vicT: -1, deadT: -1,
      bossX: 0, bossZ: 0, bossHp: 0, bossMax: 1,
      shake: 0, bossPulse: 0, noteT: 0,
      vented: false, ventT: 4, cdA: 1.2, cdB: 3.5,
      ghosts: [] as { x: number; z: number }[], realIdx: 0, pinHits: 0, pinT: 0, shuffleT: 0,
      modSt: [] as { ang: number; hp: number; cd: number; alive: boolean }[],
      exposedT: 0,
      weaponSel: Math.max(0, Math.min(3, initialCleared)),
      slowT: 0, railT: 0, railLen: 0, railYaw: 0, railPitch: 0,
      orbs: [] as { x: number; z: number; a: number; t: number; dead: boolean }[],
      metAnshul: false, tauntT: 2, tauntIdx: 0, nearAnshul: false, canOffer: false, cineT: -1,
      entered: new Set<number>(), introduced: new Set<number>(), bannerT: 0,
      hitSfxT: 0,
      blackT: 0,
      mobs: MOB_SPAWNS.map(ms => ({
        x: ms.x, z: ms.z,
        homeX: ms.x, homeZ: ms.z,
        hp: [24, 20, 18][ms.type],
        alive: true,
        t: Math.random() * 10,
        cd: 1 + Math.random() * 2,
        phase: 0,
        real: 0,
        slotA: { x: ms.x + 2.4, z: ms.z }, slotB: { x: ms.x - 2.4, z: ms.z },
        teleX: 0, teleZ: 0,
      })),
    };

    function note(txt: string, secs = 1.6) {
      if (noteRef.current) noteRef.current.textContent = txt;
      st.noteT = secs;
    }
    function startReload() {
      const w = st.weaponSel;
      if (st.reloadT > 0 || st.ammo[w] >= MAGS[w]) return;
      st.reloadT = RELOAD_T[w];
      st.reloadFor = w;
    }
    function feedKill(txt: string) {
      st.feed.push({ txt, t: st.t });
      if (st.feed.length > 5) st.feed.shift();
      st.feedDirty = true;
    }
    // hitmarker pulse + throttled tick sound on every connected shot
    function registerHit() {
      st.hitT = 0.12;
      if (st.t > st.hitSfxT) {
        st.hitSfxT = st.t + 0.09;
        sfx("tick");
      }
    }
    // enemy attacks are readable area denial, not bullet spam
    function spawnHazard(x: number, z: number, r = 2.1, warm = 0.95) {
      if (st.hazards.length >= 6) return;
      st.hazards.push({ x, z, r, warm, fade: 0.45, dealt: false });
    }
    function spawnWave(x: number, z: number, speed = 5.5, max = 9.5) {
      if (st.waves.length >= 4) return;
      st.waves.push({ x, z, R: 0.6, speed, max, dealt: false });
    }

    function canStand(x: number, z: number): boolean {
      const M = 0.55;
      for (let i = 0; i < ROOMS.length; i++) {
        const r = ROOMS[i];
        if (x > r.x1 + M && x < r.x2 - M && z > r.z1 + M && z < r.z2 - M) {
          if (st.fightActive && i !== st.fightZone) continue;
          return true;
        }
      }
      if (!st.fightActive) {
        for (let i = 0; i < CORRS.length; i++) {
          if (st.cleared < i + 1) continue;
          const c = CORRS[i];
          if (x > c.x1 + M && x < c.x2 - M && z > c.z1 - M && z < c.z2 + M) return true;
        }
      }
      return false;
    }
    function insideWorld(x: number, z: number): boolean {
      for (const r of ROOMS) if (x > r.x1 - 1 && x < r.x2 + 1 && z > r.z1 - 1 && z < r.z2 + 1) return true;
      for (const c of CORRS) if (x > c.x1 - 1 && x < c.x2 + 1 && z > c.z1 - 1 && z < c.z2 + 1) return true;
      return false;
    }

    function initFight(zone: number) {
      st.fightActive = true;
      st.fightZone = zone;
      st.introT = 2.2;
      st.vicT = -1;
      st.bossX = 0;
      st.bossZ = ZC[zone] - 2;
      st.bossHp = st.bossMax = [180, 220, 260][zone];
      st.pb = [];
      st.hazards = [];
      st.waves = [];
      st.vented = false; st.ventT = 4; st.cdA = 2.4; st.cdB = 3.5;
      st.ghosts = []; st.realIdx = 0; st.pinHits = 0; st.pinT = 0; st.shuffleT = 0;
      st.modSt = [0, 1, 2, 3].map(i => ({ ang: (i / 4) * Math.PI * 2, hp: 40, cd: 2 + i * 1.1, alive: true }));
      st.exposedT = 0;
      if (introNameRef.current) introNameRef.current.textContent = CHAPTERS[zone].bossName;
      if (introSubRef.current) introSubRef.current.textContent = CHAPTERS[zone].bossSub;
      if (bossNameRef.current) bossNameRef.current.textContent = CHAPTERS[zone].bossName;
      if (bossFillRef.current) bossFillRef.current.style.background = ZONE_HEX[zone];
    }

    // ── Input ──────────────────────────────────────────────────────────────
    const seqActive = () => st.vicT >= 0 || st.deadT >= 0 || st.cineT >= 0 || st.introT > 0;
    const onLockChange = () => {
      st.locked = document.pointerLockElement === canvas;
      if (!st.locked && !seqActive() && st.pendingFight < 0 && !pausedRef.current) onEventRef.current("pause");
    };
    const onCanvasClick = () => {
      if (!st.locked && !seqActive() && !pausedRef.current) canvas.requestPointerLock();
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!st.locked) return;
      st.yaw -= e.movementX * 0.0022;
      st.pitch = Math.max(-1.3, Math.min(1.3, st.pitch - e.movementY * 0.0022));
      st.swayX = Math.max(-0.06, Math.min(0.06, st.swayX + e.movementX * 0.00045));
      st.swayY = Math.max(-0.05, Math.min(0.05, st.swayY + e.movementY * 0.0004));
    };
    const onDown = (e: MouseEvent) => { if (st.locked && e.button === 0) st.firing = true; };
    const onUp = () => { st.firing = false; };
    const onKeyDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (["w", "a", "s", "d", "shift", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(k)) st.keys.add(k);
      const num = parseInt(k, 10);
      if (num >= 1 && num <= 4 && num - 1 <= st.cleared && num - 1 !== st.weaponSel) {
        st.weaponSel = Math.min(3, num - 1);
        st.reloadT = 0;
      }
      if (k === "r") startReload();
      if (k === "e" && st.canOffer && st.cineT < 0) {
        st.cineT = 0;
        st.pb = [];
        document.exitPointerLock();
        // he celebrates the offer
        if (anshulActions.cheer) {
          anshulActions.idle?.fadeOut(0.3);
          anshulActions.cheer.reset().fadeIn(0.3).play();
        }
      }
    };
    const onKeyUp = (e: KeyboardEvent) => st.keys.delete(e.key.toLowerCase());

    document.addEventListener("pointerlockchange", onLockChange);
    canvas.addEventListener("click", onCanvasClick);
    document.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    // ── Boss AI — telegraphed area attacks, no projectile spam ─────────────
    function updBoss(dt: number) {
      const zone = st.fightZone;
      const oz = ZC[zone];
      if (zone === 0) {
        st.bossX = Math.sin(st.t * 0.5) * 4.7;
        st.bossZ = oz - 2;
        st.ventT -= dt;
        if (st.ventT <= 0) {
          st.vented = !st.vented;
          st.ventT = st.vented ? 3.0 : 3.6;
          if (st.vented) note("VENTING — STRIKE NOW", 1.4);
        }
        st.cdA -= dt;
        if (st.cdA <= 0) { st.cdA = 3.4; spawnWave(st.bossX, st.bossZ, 5.5, 10); }
        st.cdB -= dt;
        if (st.cdB <= 0) { st.cdB = 4.2; spawnHazard(st.px, st.pz, 2.1); }
      } else if (zone === 1) {
        if (st.pinT > 0) {
          st.pinT -= dt;
          st.ghosts = [{ x: 0, z: oz - 2 }];
          st.realIdx = 0;
          st.bossX = 0; st.bossZ = oz - 2;
          if (st.pinT <= 0) { st.pinHits = 0; st.shuffleT = 0; }
          return;
        }
        st.shuffleT -= dt;
        if (st.shuffleT <= 0 || st.ghosts.length < 3) {
          st.shuffleT = 3.2;
          const base = st.t * 0.4;
          const old = st.ghosts[st.realIdx] || { x: 0, z: oz - 2 };
          st.ghosts = [0, 1, 2].map(i => ({
            x: Math.cos(base + (i / 3) * Math.PI * 2) * 5.6,
            z: oz - 2 + Math.sin(base + (i / 3) * Math.PI * 2) * 2.1,
          }));
          st.realIdx = (Math.random() * 3) | 0;
          spawnWave(old.x, old.z, 6, 8);
          burst(old.x, old.z, 10, 0x66e0ff, 4, 1.5);
        }
        const real = st.ghosts[st.realIdx];
        st.bossX = real.x; st.bossZ = real.z;
        st.cdA -= dt;
        if (st.cdA <= 0) {
          st.cdA = 3.4;
          const a = Math.random() * Math.PI * 2;
          spawnHazard(st.px, st.pz, 1.9);
          spawnHazard(st.px + Math.cos(a) * 2.6, st.pz + Math.sin(a) * 2.6, 1.9);
        }
      } else {
        st.bossX = Math.sin(st.t * 0.6) * 3;
        st.bossZ = oz - 2 + Math.cos(st.t * 0.8) * 0.87;
        const anyMod = st.modSt.some(m => m.alive);
        if (!anyMod) {
          if (st.exposedT <= 0) { st.exposedT = 9; note("CORE EXPOSED", 1.5); }
          st.exposedT -= dt;
          if (st.exposedT <= 0) { st.modSt.forEach(m => { m.alive = true; m.hp = 40; }); note("MODULES REDEPLOYED", 1.4); }
        }
        for (const mo of st.modSt) {
          if (!mo.alive) continue;
          mo.ang += dt * 0.5;
          mo.cd -= dt;
          if (mo.cd <= 0) {
            mo.cd = 4.6;
            spawnHazard(st.px + (Math.random() - 0.5) * 3, st.pz + (Math.random() - 0.5) * 3, 2.0);
          }
        }
        st.cdB -= dt;
        if (st.cdB <= 0) { st.cdB = 6; spawnWave(st.bossX, st.bossZ, 5, 9.5); }
      }
    }

    function hitBoss(b: PB): boolean {
      const zone = st.fightZone;
      const bodyH = [5.2, 3.0, 3.4][zone];
      if (zone === 1 && st.pinT <= 0) {
        for (let i = 0; i < st.ghosts.length; i++) {
          const g = st.ghosts[i];
          const d3 = Math.sqrt((b.x - g.x) ** 2 + (b.y - 1.5) ** 2 + (b.z - g.z) ** 2);
          if (d3 < 1.4) {
            if (i === st.realIdx) {
              st.bossHp -= b.dmg; st.pinHits++; st.bossPulse = 0.14;
              burst(b.x, b.z, 3, 0x66e0ff, 3, b.y);
              if (st.pinHits >= 8) { st.pinT = 3.2; note("PINNED — HASHES MATCH", 1.6); }
            } else {
              floatTxt("MISMATCH", "#8aa0b8", b.x, b.z, 0.36, b.y);
            }
            return true;
          }
        }
        return false;
      }
      if (zone === 2) {
        for (let i = 0; i < st.modSt.length; i++) {
          const mo = st.modSt[i];
          if (!mo.alive) continue;
          const mx = st.bossX + Math.cos(mo.ang) * 5, mz = st.bossZ + Math.sin(mo.ang) * 5;
          const d3 = Math.sqrt((b.x - mx) ** 2 + (b.y - 0.9) ** 2 + (b.z - mz) ** 2);
          if (d3 < 0.95) {
            mo.hp -= b.dmg;
            burst(mx, mz, 3, REDC, 3, 1);
            if (mo.hp <= 0) { mo.alive = false; floatTxt(["auth", "api", "billing", "config"][i] + " refactored", "#2f8f4f", mx, mz, 0.5, 1.6); burst(mx, mz, 18, 0xffb0b8, 5, 1); }
            return true;
          }
        }
      }
      const r = [2.4, 1.3, 1.5][zone];
      if (Math.hypot(b.x - st.bossX, b.z - st.bossZ) < r && b.y > 0 && b.y < bodyH) {
        let mult = 1;
        if (zone === 0) mult = st.vented ? 1 : 0.3;
        if (zone === 1) mult = st.pinT > 0 ? 2 : 1;
        if (zone === 2) mult = st.modSt.some(m => m.alive) ? 0.25 : 1;
        st.bossHp -= b.dmg * mult;
        st.bossPulse = 0.14;
        burst(b.x, b.z, mult >= 1 ? 4 : 2, mult >= 1 ? 0xffffff : 0x888888, 3, b.y);
        return true;
      }
      return false;
    }

    // ── Mob combat ─────────────────────────────────────────────────────────
    function killMob(mi: number) {
      const mb = st.mobs[mi];
      mb.alive = false;
      const cols = [0xffa060, 0x66e0ff, 0xff8080];
      burst(mb.x, mb.z, 20, cols[MOB_SPAWNS[mi].type], 5, 1.2);
      sfx("boom");
      feedKill(MOB_NAMES[MOB_SPAWNS[mi].type]);
      st.php = Math.min(100, st.php + 10);
      floatTxt("+10 HP", "#2f8f4f", mb.x, mb.z, 0.4, 2);
    }
    function mobBulletHit(b: PB, seen?: Set<number>): boolean {
      for (let mi = 0; mi < st.mobs.length; mi++) {
        if (seen?.has(mi)) continue;
        const mb = st.mobs[mi];
        if (!mb.alive) continue;
        const ty = MOB_SPAWNS[mi].type;
        if (ty === 1) {
          const other = mb.real === 0 ? mb.slotB : mb.slotA;
          if (Math.sqrt((b.x - mb.x) ** 2 + (b.y - 1.3) ** 2 + (b.z - mb.z) ** 2) < 0.75) {
            seen?.add(mi);
            mb.hp -= b.dmg;
            burst(b.x, b.z, 2, 0x66e0ff, 3, b.y);
            if (mb.hp <= 0) killMob(mi);
            return true;
          }
          if (Math.sqrt((b.x - other.x) ** 2 + (b.y - 1.3) ** 2 + (b.z - other.z) ** 2) < 0.75) {
            seen?.add(mi);
            if (b.dmg > 2) {
              mb.real = 1 - mb.real;
              burst(other.x, other.z, 6, 0x66e0ff, 3, 1.3);
              floatTxt("COLLAPSED", "#2a7ab8", other.x, other.z, 0.34, 1.7);
            }
            return true;
          }
        } else {
          if (ty === 2 && mb.phase < 2) continue;
          const hy = ty === 0 ? 0.75 : 1.0, rr = ty === 0 ? 1.0 : 0.62;
          if (Math.sqrt((b.x - mb.x) ** 2 + (b.y - hy) ** 2 + (b.z - mb.z) ** 2) < rr) {
            seen?.add(mi);
            mb.hp -= b.dmg;
            burst(b.x, b.z, 2, REDC, 3, b.y);
            if (mb.hp <= 0) killMob(mi);
            return true;
          }
        }
      }
      return false;
    }

    function castRay(dmg: number, pierceAll: boolean): number {
      const cp = Math.cos(st.pitch), sp2 = Math.sin(st.pitch);
      const dx = -Math.sin(st.yaw) * cp, dy = sp2, dz = -Math.cos(st.yaw) * cp;
      const seen = new Set<number>();
      let bossDone = false;
      let s = 1.0;
      for (; s < 28; s += 0.55) {
        const probe: PB = { x: st.px + dx * s, y: EYE - 0.1 + dy * s, z: st.pz + dz * s, vx: 0, vy: 0, vz: 0, dmg, pierce: 0, life: 0, dead: false };
        if (probe.y <= 0.03 || probe.y > 8 || !insideWorld(probe.x, probe.z)) break;
        let hit = false;
        if (mobBulletHit(probe, seen)) hit = true;
        if (!bossDone && st.fightActive && hitBoss(probe)) { hit = true; bossDone = true; }
        if (st.cleared >= FINAL && Math.hypot(probe.x - 0, probe.z - ZC[FINAL]) < 1.4) {
          if (Math.random() < 0.06) floatTxt(IMMUNE_TEXTS[(Math.random() * IMMUNE_TEXTS.length) | 0], "#8a94a8", probe.x, probe.z, 0.4, 1.7);
          hit = true;
        }
        if (hit) {
          registerHit();
          burst(probe.x, probe.z, 1, 0x9beeff, 2, probe.y);
          if (!pierceAll) break;
        }
      }
      return s;
    }

    // ── Main update ────────────────────────────────────────────────────────
    function update(rdt: number) {
      const dt = rdt * st.timeScale;
      st.t += dt;
      if (st.noteT > 0) st.noteT -= rdt;
      if (st.shake > 0) st.shake = Math.max(0, st.shake - rdt * 5);
      if (st.bossPulse > 0) st.bossPulse -= rdt;
      if (st.muzzleT > 0) st.muzzleT -= rdt;
      if (st.bannerT > 0) st.bannerT -= rdt;
      if (st.railT > 0) st.railT -= rdt;
      if (st.slowT > 0) st.slowT -= rdt;
      if (st.gunKick > 0) st.gunKick = Math.max(0, st.gunKick - rdt * 5.5);
      if (st.hitT > 0) st.hitT -= rdt;

      if (st.vicT >= 0) {
        st.vicT -= rdt;
        if (st.vicT <= 0) {
          st.timeScale = 1;
          st.fightActive = false;
          st.cleared = st.fightZone + 1;
          st.weaponSel = Math.min(3, st.cleared);
          st.ammo = MAGS.slice();
          st.php = 100;
          onEventRef.current("victory", st.fightZone);
        }
        return;
      }
      if (st.deadT >= 0) {
        st.deadT -= rdt;
        st.blackT = Math.min(1, st.blackT + rdt * 1.4);
        if (st.deadT <= 0) {
          const zone = st.fightZone;
          st.timeScale = 1;
          st.fightActive = false;
          st.php = 100;
          st.invuln = 2;
          st.px = 0; st.pz = ZC[Math.max(0, zone)] + 9.3;
          st.pb = [];
          st.hazards = []; st.waves = [];
          st.ammo = MAGS.slice();
          st.blackT = 0;
          note("respawned — the boss awaits", 2);
        }
        return;
      }
      if (st.cineT >= 0) {
        st.cineT += rdt;
        st.pb = [];
        st.hazards = []; st.waves = [];
        if (st.cineT > 0.5 && Math.random() < 0.25) burst(st.bossX + (Math.random() - 0.5) * 2, st.bossZ + (Math.random() - 0.5) * 2, 8, Math.random() < 0.5 ? GREENC : 0xffd88a, 4, 1.5);
        if (st.cineT > 0.4 && st.cineT < 0.5) note("He reads the offer…", 1.2);
        if (st.cineT > 1.7 && st.cineT < 1.8) note("CRITICAL HIT", 0.9);
        if (st.cineT > 2.6 && st.cineT < 2.7) note(`ANSHUL: "When do I start?"`, 1.4);
        if (st.cineT > 4.0) { st.cineT = -1; onEventRef.current("ending"); }
        return;
      }
      if (st.introT > 0) {
        st.introT -= rdt;
        return;
      }
      // interlude accepted — the fight begins now
      if (st.pendingFight >= 0) {
        const z = st.pendingFight;
        st.pendingFight = -1;
        initFight(z);
        return;
      }
      if (!st.locked) return;

      st.invuln -= dt; // keeps counting down past zero — used as "time since last hit"
      if (st.reloadT > 0) {
        st.reloadT -= dt;
        if (st.reloadT <= 0) st.ammo[st.reloadFor] = MAGS[st.reloadFor];
      }
      // slow out-of-combat recovery: 5s without damage starts regen
      if (st.invuln < -4 && st.php > 0 && st.php < 100) st.php = Math.min(100, st.php + 4 * dt);

      // movement
      let mx = 0, mz = 0;
      if (st.keys.has("w") || st.keys.has("arrowup")) mz += 1;
      if (st.keys.has("s") || st.keys.has("arrowdown")) mz -= 1;
      if (st.keys.has("a") || st.keys.has("arrowleft")) mx -= 1;
      if (st.keys.has("d") || st.keys.has("arrowright")) mx += 1;
      st.moving = mx !== 0 || mz !== 0;
      if (st.moving) {
        const fx = -Math.sin(st.yaw), fz = -Math.cos(st.yaw);
        const rx = -fz, rz = fx;
        let dx = fx * mz + rx * mx, dz = fz * mz + rz * mx;
        const l = Math.hypot(dx, dz);
        dx /= l; dz /= l;
        const spd = (st.keys.has("shift") ? 12.4 : 8.6) * (st.slowT > 0 ? 0.6 : 1);
        const nx = st.px + dx * spd * dt;
        const nz = st.pz + dz * spd * dt;
        if (canStand(nx, nz)) { st.px = nx; st.pz = nz; }
        else if (canStand(nx, st.pz)) st.px = nx;
        else if (canStand(st.px, nz)) st.pz = nz;
        st.bobT += dt * 11;
      }

      // zone entry: banner + boss trigger
      for (let i = 0; i <= FINAL; i++) {
        const inRoom = Math.abs(st.px) < ROOM_HW && Math.abs(st.pz - ZC[i]) < ROOM_HD;
        if (inRoom && !st.entered.has(i)) {
          st.entered.add(i);
          st.bannerT = 3.2;
          if (bannerRef.current) bannerRef.current.textContent = `CHAPTER ${ROMAN[i]} · ${CHAPTERS[i].year} — ${CHAPTERS[i].org}`;
        }
        if (i < FINAL && inRoom && st.cleared === i && !st.fightActive && st.pendingFight < 0 && st.pz < ZC[i] + 7.5) {
          if (st.introduced.has(i)) {
            initFight(i); // retry after death — skip the story card, straight to the fight
          } else {
            st.introduced.add(i);
            st.pendingFight = i;
            document.exitPointerLock();
            onEventRef.current("interlude", i);
          }
        }
      }

      // the final meeting
      if (st.cleared >= FINAL) {
        const dAn = Math.hypot(st.px - 0, st.pz - ZC[FINAL]);
        st.nearAnshul = dAn < 9;
        st.canOffer = dAn < 3.8;
        if (st.nearAnshul) {
          st.tauntT -= dt;
          if (st.tauntT <= 0) {
            st.tauntT = 4.4;
            if (!st.metAnshul) {
              st.metAnshul = true;
              note(`ANSHUL: "You've beaten everything I ever fought. One way to finish this — offer me the job."`, 4.2);
            } else {
              note(`ANSHUL: "${ANSHUL_TAUNTS[st.tauntIdx % ANSHUL_TAUNTS.length]}"`, 3.2);
              st.tauntIdx++;
            }
          }
        }
      } else {
        st.canOffer = false;
      }

      // guardians
      for (let i = 0; i < st.mobs.length; i++) {
        const mb = st.mobs[i];
        if (!mb.alive) continue;
        const spawn = MOB_SPAWNS[i];
        const ty = spawn.type;
        const dP = Math.hypot(mb.x - st.px, mb.z - st.pz);
        mb.t += dt;
        if (dP > 18) continue;

        if (ty === 0) {
          if (dP > 1.2) {
            const a = Math.atan2(st.pz - mb.z, st.px - mb.x);
            const nx = mb.x + Math.cos(a) * 1.4 * dt, nz = mb.z + Math.sin(a) * 1.4 * dt;
            if (canStand(nx, nz)) { mb.x = nx; mb.z = nz; }
          }
          if (st.invuln <= 0 && dP < 1.25) {
            st.php -= 6; st.invuln = 1; st.slowT = 2.0; st.shake = 1;
            sfx("hurt");
            burst(st.px, st.pz, 8, REDC, 3, 1);
            note("query leech attached — slowed!", 1.4);
          }
        } else if (ty === 1) {
          // the shard creeps its anchor toward you, pulsing on arrival
          mb.cd -= dt;
          if (mb.cd <= 0 && dP > 3.2) {
            mb.cd = 4;
            const a = Math.atan2(st.pz - mb.homeZ, st.px - mb.homeX);
            mb.homeX += Math.cos(a) * 2.4;
            mb.homeZ += Math.sin(a) * 2.4;
            spawnHazard(mb.homeX, mb.homeZ, 1.5, 0.6);
            burst(mb.homeX, mb.homeZ, 8, 0x66e0ff, 3, 1.3);
          }
          mb.phase += dt * 0.7;
          mb.slotA.x = mb.homeX + Math.cos(mb.phase) * 2.4; mb.slotA.z = mb.homeZ + Math.sin(mb.phase) * 2.4;
          mb.slotB.x = mb.homeX - Math.cos(mb.phase * 1.3) * 2.4; mb.slotB.z = mb.homeZ - Math.sin(mb.phase * 1.3) * 2.4;
          const rp = mb.real === 0 ? mb.slotA : mb.slotB;
          mb.x = rp.x; mb.z = rp.z;
        } else {
          if (mb.phase === 0) {
            if (dP < 13) { mb.phase = 1; mb.cd = 0.85; mb.teleX = st.px; mb.teleZ = st.pz; }
          } else if (mb.phase === 1) {
            mb.cd -= dt;
            if (mb.cd <= 0) { mb.phase = 2; mb.x = mb.teleX; mb.z = mb.teleZ + 0.01; burst(mb.x, mb.z, 10, REDC, 4, 0.5); }
          } else {
            const a = Math.atan2(st.pz - mb.z, st.px - mb.x);
            const nx = mb.x + Math.cos(a) * 4.0 * dt, nz = mb.z + Math.sin(a) * 4.0 * dt;
            if (canStand(nx, nz)) { mb.x = nx; mb.z = nz; }
            if (st.invuln <= 0 && dP < 0.85) {
              mb.alive = false;
              st.php -= 10; st.invuln = 1; st.shake = 1.2;
              sfx("hurt");
              burst(st.px, st.pz, 12, REDC, 4, 1);
            }
          }
        }
      }

      // weapons
      st.fireCd -= dt;
      if (st.firing && st.cineT < 0) {
        const cp = Math.cos(st.pitch), sp2 = Math.sin(st.pitch);
        const spawnPellet = (off: number, dmg: number, pierce: number, life: number, speed = 24) => {
          if (st.pb.length >= MAX_PB - 2) return;
          const ya = st.yaw + off;
          const dx = -Math.sin(ya) * cp, dy = sp2, dz = -Math.cos(ya) * cp;
          st.pb.push({ x: st.px + dx * 0.6, y: EYE - 0.12 + dy * 0.6, z: st.pz + dz * 0.6, vx: dx * speed, vy: dy * speed, vz: dz * speed, dmg, pierce, life, dead: false });
        };
        const canFire = st.reloadT <= 0;
        if (st.fireCd <= 0 && canFire) {
          if (st.ammo[st.weaponSel] <= 0) {
            startReload();
          } else {
            st.muzzleT = 0.06;
            st.ammo[st.weaponSel]--;
            if (st.weaponSel === 0) { st.fireCd = 0.23; st.gunKick = 0.12; sfx("shot"); spawnPellet(0, 7, 0, 99); }
            else if (st.weaponSel === 1) {
              st.fireCd = 0.6;
              st.gunKick = 0.22;
              sfx("shot");
              for (let i = 0; i < 6; i++) spawnPellet((i / 5 - 0.5) * 0.55, 5, 0, 0.42, 21);
              st.shake = Math.max(st.shake, 0.5);
            } else if (st.weaponSel === 2) {
              st.fireCd = 0.9;
              st.railT = 0.16;
              st.gunKick = 0.3;
              sfx("rail");
              st.railYaw = st.yaw;
              st.railPitch = st.pitch;
              st.railLen = castRay(40, true);
              st.shake = Math.max(st.shake, 0.9);
            } else {
              st.fireCd = 0.32;
              st.gunKick = 0.1;
              sfx("shot");
              if (st.orbs.length < 24) {
                const fa = Math.atan2(-Math.cos(st.yaw), -Math.sin(st.yaw));
                st.orbs.push({ x: st.px, z: st.pz, a: fa + (Math.random() - 0.5) * 0.5, t: 0, dead: false });
              }
            }
            if (st.ammo[st.weaponSel] <= 0) startReload();
          }
        }
      }

      if (st.fightActive) updBoss(dt);

      // player bullets
      for (const b of st.pb) {
        if (b.dead) continue;
        b.life -= dt;
        if (b.life <= 0) { b.dead = true; burst(b.x, b.z, 2, 0xdff3ff, 1.5, Math.max(0.2, b.y)); continue; }
        b.x += b.vx * dt; b.y += b.vy * dt; b.z += b.vz * dt;
        const range2 = (b.x - st.px) ** 2 + (b.z - st.pz) ** 2;
        if (b.y <= 0.02 || b.y > 8 || range2 > 1600 || !insideWorld(b.x, b.z)) { b.dead = true; burst(b.x, b.z, 2, 0xdff3ff, 1.5, Math.max(0.2, b.y)); continue; }
        if (mobBulletHit(b)) {
          registerHit();
          if (b.pierce > 0) b.pierce--;
          else { b.dead = true; continue; }
        }
        if (st.fightActive && hitBoss(b)) { registerHit(); b.dead = true; continue; }
        if (st.cleared >= FINAL && Math.hypot(b.x - 0, b.z - ZC[FINAL]) < 1.4 && b.y > 0 && b.y < 3.3) {
          floatTxt(IMMUNE_TEXTS[(Math.random() * IMMUNE_TEXTS.length) | 0], "#8a94a8", b.x, b.z, 0.42, b.y);
          burst(b.x, b.z, 3, 0x999999, 2.5, b.y);
          b.dead = true;
        }
      }

      // homing orbs
      for (const o of st.orbs) {
        o.t += dt;
        let tx: number | null = null, tz = 0, best = 20;
        for (let mi = 0; mi < st.mobs.length; mi++) {
          const mb = st.mobs[mi];
          if (!mb.alive) continue;
          const d = Math.hypot(mb.x - o.x, mb.z - o.z);
          if (d < best) { best = d; tx = mb.x; tz = mb.z; }
        }
        if (tx === null && st.fightActive) { tx = st.bossX; tz = st.bossZ; }
        if (tx !== null) {
          const want = Math.atan2(tz - o.z, tx - o.x);
          let dA = want - o.a;
          while (dA > Math.PI) dA -= Math.PI * 2;
          while (dA < -Math.PI) dA += Math.PI * 2;
          o.a += Math.max(-6 * dt, Math.min(6 * dt, dA));
        }
        o.x += Math.cos(o.a) * 10.5 * dt;
        o.z += Math.sin(o.a) * 10.5 * dt;
        const probe: PB = { x: o.x, y: 1.2, z: o.z, vx: 0, vy: 0, vz: 0, dmg: 10, pierce: 0, life: 0, dead: false };
        let hit = mobBulletHit(probe);
        if (!hit && st.fightActive && hitBoss(probe)) hit = true;
        if (!hit && st.cleared >= FINAL && Math.hypot(o.x - 0, o.z - ZC[FINAL]) < 1.4) {
          floatTxt(IMMUNE_TEXTS[(Math.random() * IMMUNE_TEXTS.length) | 0], "#8a94a8", o.x, o.z, 0.4, 1.5);
          hit = true;
        }
        if (hit) registerHit();
        if (hit || o.t > 2.6 || !insideWorld(o.x, o.z)) { o.dead = true; burst(o.x, o.z, 5, 0xffd88a, 3, 1.2); }
      }
      st.orbs = st.orbs.filter(o => !o.dead);

      // hazards: telegraph then pulse once
      for (const h of st.hazards) {
        if (h.warm > 0) {
          h.warm -= dt;
          if (h.warm <= 0) {
            burst(h.x, h.z, 14, 0xff7050, 5, 0.4);
            if (st.invuln <= 0 && Math.hypot(h.x - st.px, h.z - st.pz) < h.r) {
              st.php -= 12; st.invuln = 1; st.shake = 1.1;
              sfx("hurt");
              burst(st.px, st.pz, 10, REDC, 4, 1.2);
            }
          }
        } else {
          h.fade -= dt;
        }
      }
      st.hazards = st.hazards.filter(h => h.fade > 0);

      // shockwaves: an expanding ring you step over or away from
      for (const w of st.waves) {
        w.R += w.speed * dt;
        if (!w.dealt) {
          const d = Math.hypot(w.x - st.px, w.z - st.pz);
          if (Math.abs(d - w.R) < 0.55) {
            w.dealt = true;
            if (st.invuln <= 0) {
              st.php -= 10; st.invuln = 1; st.shake = 1;
              sfx("hurt");
              burst(st.px, st.pz, 10, REDC, 4, 1.2);
            }
          } else if (w.R > d + 0.6) w.dealt = true;
        }
      }
      st.waves = st.waves.filter(w => w.R < w.max);

      if (st.fightActive && st.invuln <= 0 && Math.hypot(st.bossX - st.px, st.bossZ - st.pz) < 1.9) {
        st.php -= 12; st.invuln = 1.1; st.shake = 1.3;
        sfx("hurt");
        burst(st.px, st.pz, 12, REDC, 5, 1.2);
      }

      st.pb = st.pb.filter(b => !b.dead);

      if (st.php <= 0 && st.deadT < 0) {
        st.php = 0;
        st.deadT = 1.4;
        st.timeScale = 0.3;
        burst(st.px, st.pz, 40, REDC, 7, 1.2);
        note("you died", 1.5);
      }
      if (st.fightActive && st.bossHp <= 0 && st.vicT < 0) {
        st.bossHp = 0;
        st.vicT = 1.5;
        st.timeScale = 0.22;
        st.shake = 2;
        sfx("boom");
        st.hazards = []; st.waves = [];
        feedKill(CHAPTERS[st.fightZone].bossName);
        burst(st.bossX, st.bossZ, 60, ZONE_COL[st.fightZone], 8, 1.5);
        burst(st.bossX, st.bossZ, 40, 0xffffff, 5, 1.5);
        document.exitPointerLock();
      }
    }

    // ── Visual sync ────────────────────────────────────────────────────────
    const camPos = new THREE.Vector3();
    const camLook = new THREE.Vector3();
    const tmpA = new THREE.Vector3();
    const tmpB = new THREE.Vector3();
    const colA = new THREE.Color();
    const colB = new THREE.Color();

    function syncVisuals() {
      // viewmodel
      st.swayX *= 0.86;
      st.swayY *= 0.86;
      const rlProg = st.reloadT > 0 ? 1 - st.reloadT / RELOAD_T[st.reloadFor] : 0;
      const rlDip = st.reloadT > 0 ? Math.sin(rlProg * Math.PI) : 0;
      muzzleMat.opacity = st.muzzleT > 0 ? 0.9 : 0;
      gun.position.z = -0.65 + st.gunKick * 0.85;
      gun.position.x = 0.32 - st.swayX * 1.2;
      gun.position.y = -0.27 + (st.moving ? Math.sin(st.bobT) * 0.016 : 0) - st.swayY * 0.7 - rlDip * 0.14;
      gun.rotation.x = st.gunKick * 0.8 + st.swayY * 1.1 + rlDip * 0.55;
      gun.rotation.y = -st.swayX * 1.4;
      gun.visible = st.cineT < 0 && !(st.fightActive && st.introT > 0);
      muzzle.visible = gun.visible && st.reloadT <= 0;
      for (const gm of gunGlowMats) gm.color.setHex(WEAPON_TINT[st.weaponSel]);

      // kill feed
      const cutoff = st.t - 3.6;
      if (st.feed.length && st.feed[0].t < cutoff) { st.feed = st.feed.filter(f => f.t >= cutoff); st.feedDirty = true; }
      if (st.feedDirty && feedRef.current) {
        st.feedDirty = false;
        feedRef.current.innerHTML = st.feed
          .map(f => `<div style="font-family:var(--font-mono),monospace;font-size:10px;letter-spacing:0.14em;color:#fff;background:rgba(12,18,28,0.6);padding:3px 10px;border-right:2px solid #22d3ee;text-shadow:0 1px 3px rgba(0,0,0,0.5)">× ${f.txt}</div>`)
          .join("");
      }

      // bullets
      let n = 0;
      for (const b of st.pb) { m4.setPosition(b.x, b.y, b.z); pbMesh.setMatrixAt(n++, m4); }
      pbMesh.count = n; pbMesh.instanceMatrix.needsUpdate = true;
      n = 0;
      for (const o of st.orbs) { m4.setPosition(o.x, 1.2, o.z); obMesh.setMatrixAt(n++, m4); }
      obMesh.count = n; obMesh.instanceMatrix.needsUpdate = true;

      // rail flash
      if (st.railT > 0) {
        const cp2 = Math.cos(st.railPitch), sp3 = Math.sin(st.railPitch);
        const dx = -Math.sin(st.railYaw) * cp2, dy = sp3, dz = -Math.cos(st.railYaw) * cp2;
        const ex = st.px + dx * st.railLen, ey = EYE - 0.1 + dy * st.railLen, ez = st.pz + dz * st.railLen;
        const sx = st.px + dx * 0.9, sy = EYE - 0.14 + dy * 0.9, sz = st.pz + dz * 0.9;
        railMesh.visible = true;
        railMesh.position.set((sx + ex) / 2, (sy + ey) / 2, (sz + ez) / 2);
        railMesh.lookAt(ex, ey, ez);
        railMesh.scale.set(1, 1, Math.max(0.1, st.railLen - 0.9));
        railMat.opacity = (st.railT / 0.16) * 0.9;
      } else railMesh.visible = false;

      // particles
      let pn = 0;
      for (const p of parts) {
        const f = 1 - p.t / p.max;
        partPos[pn * 3] = p.x; partPos[pn * 3 + 1] = p.y; partPos[pn * 3 + 2] = p.z;
        partCol[pn * 3] = p.r * f; partCol[pn * 3 + 1] = p.g * f; partCol[pn * 3 + 2] = p.b * f;
        pn++;
      }
      partGeo.setDrawRange(0, pn);
      partGeo.attributes.position.needsUpdate = true;
      partGeo.attributes.color.needsUpdate = true;

      for (const f of floaters) {
        if (!f.live) continue;
        f.t += 0.016;
        f.s.position.y += 0.022;
        f.m.opacity = Math.max(0, 1 - f.t / f.max);
        if (f.t >= f.max) { f.live = false; f.s.visible = false; }
      }

      // hazard pulses
      for (let i = 0; i < 6; i++) {
        const h = st.hazards[i];
        const v = hazVis[i];
        if (h) {
          v.g.visible = true;
          v.g.position.set(h.x, 0, h.z);
          v.g.scale.setScalar(h.r);
          if (h.warm > 0) {
            v.fill.opacity = 0.08;
            v.rim.opacity = 0.5 + Math.sin(st.t * 14) * 0.3;
          } else {
            const f = Math.max(0, h.fade / 0.45);
            v.fill.opacity = 0.35 * f;
            v.rim.opacity = 0.9 * f;
          }
        } else v.g.visible = false;
      }
      // shockwave rings
      for (let i = 0; i < 4; i++) {
        const w = st.waves[i];
        const v = waveVis[i];
        if (w) {
          v.visible = true;
          v.position.set(w.x, 0.05, w.z);
          v.scale.setScalar(w.R);
          const wm = v.material as THREE.MeshBasicMaterial;
          wm.opacity = Math.max(0, 0.85 * (1 - w.R / w.max));
          wm.color.setHex(st.fightActive ? ZONE_COL[st.fightZone] : 0xffffff);
        } else v.visible = false;
      }

      // gates
      gates.forEach((g, i) => {
        const openGate = st.cleared >= i + 1;
        g.g.visible = !openGate;
        if (!openGate) g.plane.opacity = 0.12 + Math.sin(st.t * 3 + i) * 0.05;
      });

      // guardians
      mobVis.forEach((mv, i) => {
        const mb = st.mobs[i];
        const ty = MOB_SPAWNS[i].type;
        if (!mb.alive) {
          mv.g.visible = false;
          if (mv.ring) mv.ring.visible = false;
          return;
        }
        mv.g.visible = true;
        if (ty === 0) {
          mv.g.position.set(mb.x, Math.abs(Math.sin(mb.t * 5)) * 0.08, mb.z);
          mv.g.rotation.y = Math.atan2(st.px - mb.x, st.pz - mb.z);
          mv.g.rotation.z = Math.sin(mb.t * 7) * 0.06;
          if (mv.eye) mv.eye.scale.setScalar(1 + Math.sin(mb.t * 6) * 0.15);
        } else if (ty === 1) {
          mv.shardA!.position.set(mb.slotA.x, 1.3 + Math.sin(mb.t * 2) * 0.1, mb.slotA.z);
          mv.shardB!.position.set(mb.slotB.x, 1.3 - Math.sin(mb.t * 2) * 0.1, mb.slotB.z);
          mv.shardA!.rotation.y = st.t * 1.4;
          mv.shardB!.rotation.y = -st.t * 1.4;
          mv.shardA!.children.forEach(c => { const mm = (c as THREE.Mesh).material as THREE.Material & { opacity: number }; mm.opacity = mb.real === 0 ? 1 : 0.3; });
          mv.shardB!.children.forEach(c => { const mm = (c as THREE.Mesh).material as THREE.Material & { opacity: number }; mm.opacity = mb.real === 1 ? 1 : 0.3; });
          mv.g.position.set(0, 0, 0);
        } else {
          if (mb.phase === 0) {
            mv.g.position.set(MOB_SPAWNS[i].x, 1.2 + Math.sin(mb.t * 3) * 0.2, MOB_SPAWNS[i].z);
            if (mv.ring) mv.ring.visible = false;
          } else if (mb.phase === 1) {
            const f = Math.max(0, mb.cd / 0.85);
            mv.g.position.set(mb.teleX, 1 + 5 * f, mb.teleZ);
            if (mv.ring) {
              mv.ring.visible = true;
              mv.ring.position.set(mb.teleX, 0.03, mb.teleZ);
              (mv.ring.material as THREE.MeshBasicMaterial).opacity = 0.3 + Math.sin(st.t * 16) * 0.25;
            }
          } else {
            mv.g.position.set(mb.x, 1.0, mb.z);
            if (mv.ring) mv.ring.visible = false;
          }
          mv.g.rotation.y = st.t * 3;
          if (mv.core) mv.core.rotation.x = st.t * 4;
        }
      });

      // bosses
      for (let zi = 0; zi <= FINAL; zi++) {
        const v = bossVis[zi];
        const defeated = zi < FINAL && st.cleared > zi;
        const activeFight = st.fightActive && st.fightZone === zi;
        if (defeated) {
          v.group.visible = false;
          v.ghosts?.forEach(g => (g.visible = false));
          if (v.hash) v.hash.visible = false;
          if (v.pin) v.pin.visible = false;
          v.mods?.forEach(m => (m.visible = false));
          continue;
        }
        v.group.visible = zi !== 1;
        const oz = ZC[zi];
        const bx = activeFight ? st.bossX : 0;
        const bz = activeFight ? st.bossZ : (zi === FINAL ? oz : oz - 2);
        if (zi !== 1) v.group.position.set(bx, 0, bz);
        const pulse = 1 + (activeFight && st.bossPulse > 0 ? st.bossPulse * 0.5 : 0);
        v.group.scale.setScalar(pulse);
        if (activeFight && st.vicT >= 0) v.group.scale.setScalar(Math.max(0.01, st.vicT / 1.5));

        if (zi === 0) {
          v.group.rotation.y = st.t * 0.15;
          const hot = activeFight && st.vented;
          v.seams!.forEach(s => {
            (s.material as THREE.MeshBasicMaterial).opacity = hot ? 0.7 + Math.sin(st.t * 10) * 0.25 : 0.2;
          });
          v.sats!.forEach((s, k) => {
            const a = st.t * (0.8 + k * 0.25) + (k / 3) * Math.PI * 2;
            s.position.set(Math.cos(a) * 3.4, 2 + Math.sin(st.t * 2 + k) * 0.8, Math.sin(a) * 3.4);
            s.rotation.y = st.t * 2;
          });
        } else if (zi === 1) {
          if (activeFight) {
            v.ghosts!.forEach((g, i) => {
              const gh = st.ghosts[i];
              if (!gh) { g.visible = false; return; }
              g.visible = true;
              g.position.set(gh.x, 0, gh.z);
              g.rotation.y = st.t * (0.6 + i * 0.2);
              const real = i === st.realIdx;
              g.children.forEach(c => {
                const mm = (c as THREE.Mesh).material as THREE.Material & { opacity: number; transparent: boolean };
                mm.transparent = true;
                mm.opacity = real ? 1 : 0.28;
              });
            });
            if (st.pinT > 0 && st.ghosts.length === 1) {
              v.ghosts![1].visible = false; v.ghosts![2].visible = false;
              if (v.pin) { v.pin.visible = true; v.pin.position.set(st.bossX, 0.04, st.bossZ); }
              if (v.hash) v.hash.visible = false;
            } else {
              if (v.pin) v.pin.visible = false;
              if (v.hash && st.ghosts[st.realIdx]) {
                v.hash.visible = true;
                v.hash.position.set(st.ghosts[st.realIdx].x, 3.2, st.ghosts[st.realIdx].z);
              }
            }
          } else {
            v.ghosts!.forEach((g, i) => {
              g.visible = i === 0;
              if (i === 0) { g.position.set(0, 0, oz - 2); g.rotation.y = st.t * 0.4; }
            });
            if (v.hash) v.hash.visible = false;
            if (v.pin) v.pin.visible = false;
          }
          v.group.visible = true;
          v.group.position.set(0, 0, oz - 2);
        } else if (zi === 2) {
          const exposed = activeFight && !st.modSt.some(m => m.alive);
          v.rings![0].rotation.x = st.t * 0.9;
          v.rings![0].rotation.y = st.t * 0.4;
          v.rings![1].rotation.y = st.t * 1.1;
          v.rings![1].rotation.z = st.t * 0.5;
          v.rings!.forEach(rg => ((rg.material as THREE.MeshBasicMaterial).color.setHex(exposed ? 0xffd0d8 : 0xff7080)));
          st.modSt.forEach((mo, i) => {
            const mg = v.mods![i];
            const aliveNow = activeFight ? mo.alive : true;
            if (!aliveNow) { mg.visible = false; return; }
            mg.visible = true;
            const ang = activeFight ? mo.ang : (i / 4) * Math.PI * 2 + st.t * 0.15;
            mg.position.set(bx + Math.cos(ang) * 5, 0, bz + Math.sin(ang) * 5);
            mg.rotation.y = -ang;
            v.caps![i].opacity = 0.6 + Math.sin(st.t * 4 + i) * 0.3;
          });
        } else {
          v.group.position.y = Math.sin(st.t * 2) * 0.06;
          v.group.rotation.y = Math.atan2(st.px - bx, st.pz - bz);
          if (v.screen) v.screen.opacity = 0.6 + Math.sin(st.t * 8) * 0.2;
          if (v.aura) v.aura.opacity = 0.1 + Math.sin(st.t * 3) * 0.06;
          if (v.halo) { v.halo.rotation.z = st.t * 0.8; v.halo.position.y = 3.25 + Math.sin(st.t * 2) * 0.06; }
          if (st.cineT >= 0 && v.screen) v.screen.opacity = 1;
        }
      }

      // camera — first person
      const cosP = Math.cos(st.pitch), sinP = Math.sin(st.pitch);
      const dirX = -Math.sin(st.yaw) * cosP, dirY = sinP, dirZ = -Math.cos(st.yaw) * cosP;
      const bob = st.moving && st.deadT < 0 ? Math.sin(st.bobT) * 0.045 : 0;
      camPos.set(st.px, EYE + bob, st.pz);
      camLook.set(st.px + dirX, EYE + bob + dirY, st.pz + dirZ);

      if (st.introT > 0 && st.fightActive) {
        const k = 1 - Math.max(0, Math.min(1, st.introT / 2.2));
        const e = k * k * (3 - 2 * k);
        tmpA.set(st.bossX + 2.5, 2.4, st.bossZ + 6);
        tmpB.set(st.bossX, 1.6, st.bossZ);
        camPos.lerpVectors(tmpA, camPos, e);
        camLook.lerpVectors(tmpB, camLook, e);
      }
      if (st.cineT >= 0) {
        const k = Math.min(1, st.cineT / 1.2);
        const e = k * k * (3 - 2 * k);
        tmpA.set(3.4, 2.2, ZC[FINAL] + 5.2);
        tmpB.set(0, 1.7, ZC[FINAL]);
        camPos.lerpVectors(camPos, tmpA, e);
        camLook.lerpVectors(camLook, tmpB, e);
      }
      if (st.deadT >= 0) {
        camPos.y = EYE - Math.min(1, (1.4 - st.deadT) * 1.4) * 1.0;
      }
      if (st.shake > 0) {
        camPos.x += (Math.random() - 0.5) * st.shake * 0.22;
        camPos.y += (Math.random() - 0.5) * st.shake * 0.16;
      }
      camera.position.copy(camPos);
      camera.lookAt(camLook);
      if (st.deadT >= 0) camera.rotation.z = (1.4 - st.deadT) * 0.3;

      const targetFov = st.keys.has("shift") && st.moving ? 70 : 62;
      camera.fov += (targetFov - camera.fov) * 0.12;
      camera.updateProjectionMatrix();

      sun.position.set(st.px + 18, 30, st.pz + 10);
      sun.target.position.set(st.px, 0, st.pz);

      // drifting clouds + bobbing islands
      cloudSprites.forEach((c2, i) => {
        c2.s.position.x = c2.bx + Math.sin(st.t * 0.05 * (1 + c2.sp) + i * 2.1) * 9;
      });
      islands.forEach((is, i) => {
        is.g.position.y = is.by + Math.sin(st.t * 0.5 + i * 1.7) * 0.5;
        is.g.rotation.y = st.t * 0.04 * (i % 2 === 0 ? 1 : -1);
      });

      const zAt = Math.max(0, Math.min(FINAL, Math.round(-st.pz / ZONE_GAP)));
      colA.setHex(ZONE_COL[zAt]).multiplyScalar(0.08);
      colB.setHex(0xc4daea).add(colA);
      (scene.fog as THREE.Fog).color.lerp(colB, 0.03);

      // HUD
      if (hpFillRef.current) {
        const f = Math.max(0, st.php) / 100;
        hpFillRef.current.style.width = `${f * 100}%`;
        hpFillRef.current.style.background = f > 0.5 ? "#4ade80" : f > 0.25 ? "#ffb000" : "#ff5555";
      }
      if (hpNumRef.current) hpNumRef.current.textContent = String(Math.max(0, Math.ceil(st.php)));
      if (bossWrapRef.current) bossWrapRef.current.style.opacity = st.fightActive ? "1" : "0";
      if (bossFillRef.current && st.fightActive) {
        bossFillRef.current.style.width = `${Math.max(0, st.bossHp / st.bossMax) * 100}%`;
      }
      if (noteRef.current) noteRef.current.style.opacity = String(Math.max(0, Math.min(1, st.noteT)));
      if (flashRef.current) flashRef.current.style.opacity = String(Math.max(0, (st.invuln - 0.45)) * 0.5);
      if (blackRef.current) blackRef.current.style.opacity = String(st.blackT);
      if (introRef.current) introRef.current.style.opacity = st.introT > 0.25 && st.fightActive ? "1" : "0";
      if (crossRef.current) {
        crossRef.current.style.opacity = st.locked && st.cineT < 0 && st.introT <= 0 ? "1" : "0";
        const sc = 1 + (st.hitT > 0 ? st.hitT * 2.2 : 0) + (st.gunKick > 0.15 ? 0.15 : 0);
        crossRef.current.style.transform = `translate(-50%, -50%) scale(${sc.toFixed(3)})`;
      }
      if (lockHintRef.current) lockHintRef.current.style.opacity = !st.locked && !seqActive() && !pausedRef.current ? "1" : "0";
      if (bannerRef.current) bannerRef.current.style.opacity = st.bannerT > 0.4 ? "1" : "0";
      if (promptRef.current) promptRef.current.style.opacity = st.canOffer && st.cineT < 0 ? "1" : "0";
      if (weaponRef.current) weaponRef.current.textContent = `[${st.weaponSel + 1}] ${WEAPONS[st.weaponSel].name}${st.cleared > 0 ? ` · 1-${Math.min(4, st.cleared + 1)}` : ""}`;
      if (ammoRef.current) {
        const reloading = st.reloadT > 0;
        ammoRef.current.textContent = reloading ? "RELOADING" : `${Math.ceil(st.ammo[st.weaponSel])}`;
        ammoRef.current.style.fontSize = reloading ? "13px" : "30px";
        ammoRef.current.style.opacity = reloading ? String(0.5 + Math.sin(st.t * 10) * 0.4) : "1";
      }
      if (zoneRef.current) {
        const dots = Array.from({ length: 4 }, (_, i) => (i < st.cleared ? "◆" : i === FINAL ? "★" : "◇")).join(" ");
        zoneRef.current.textContent = `${dots}   zone ${ROMAN[zAt]} — ${CHAPTERS[zAt].bossName}`;
      }
      if (objRef.current) {
        objRef.current.textContent = st.fightActive
          ? `defeat ${CHAPTERS[st.fightZone].bossName}`
          : st.cleared >= FINAL
            ? "he's waiting at the end of the path — press E near him"
            : `follow the path — ${CHAPTERS[st.cleared].bossName} guards the way`;
      }
    }

    function updParts(rdt: number) {
      for (const p of parts) {
        p.t += rdt;
        p.x += p.vx * rdt; p.y += p.vy * rdt; p.z += p.vz * rdt;
        p.vy -= 6 * rdt;
      }
      for (let i = parts.length - 1; i >= 0; i--) if (parts[i].t >= parts[i].max) parts.splice(i, 1);
    }

    // ── Loop ───────────────────────────────────────────────────────────────
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const rdt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!pausedRef.current) {
        update(rdt);
        updParts(rdt);
        for (const mx of mixers) mx.update(rdt);
      }
      syncVisuals();
      composer.render();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // ── Cleanup ────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(raf);
      if (document.pointerLockElement === canvas) document.exitPointerLock();
      document.removeEventListener("pointerlockchange", onLockChange);
      canvas.removeEventListener("click", onCanvasClick);
      document.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      // dispose everything, including runtime-loaded GLTF resources
      scene.traverse(o => {
        const m = o as THREE.Mesh;
        if (m.isMesh) {
          m.geometry?.dispose();
          const mats = Array.isArray(m.material) ? m.material : [m.material];
          mats.forEach(mt => (mt as THREE.Material | undefined)?.dispose?.());
        }
      });
      for (const d of disposables) d.dispose();
      composer.dispose();
      renderer.dispose();
      if (canvas.parentElement === mount) mount.removeChild(canvas);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative w-full h-full select-none">
      <div ref={mountRef} className="absolute inset-0" />

      <div
        ref={flashRef}
        className="absolute inset-0 pointer-events-none transition-opacity duration-150"
        style={{ opacity: 0, background: "radial-gradient(ellipse at center, transparent 45%, rgba(220,40,40,0.55) 100%)" }}
      />
      <div ref={blackRef} className="absolute inset-0 pointer-events-none bg-black transition-opacity duration-200" style={{ opacity: 0 }} />

      {/* crosshair */}
      <div ref={crossRef} className="absolute left-1/2 top-1/2 pointer-events-none transition-opacity duration-200" style={{ transform: "translate(-50%, -50%)", opacity: 0 }}>
        <div className="relative w-[26px] h-[26px]">
          <span className="absolute left-1/2 top-0 w-px h-[7px] bg-[#dff3ff] -translate-x-1/2" />
          <span className="absolute left-1/2 bottom-0 w-px h-[7px] bg-[#dff3ff] -translate-x-1/2" />
          <span className="absolute top-1/2 left-0 h-px w-[7px] bg-[#dff3ff] -translate-y-1/2" />
          <span className="absolute top-1/2 right-0 h-px w-[7px] bg-[#dff3ff] -translate-y-1/2" />
          <span className="absolute left-1/2 top-1/2 w-[2px] h-[2px] bg-[#dff3ff] -translate-x-1/2 -translate-y-1/2" />
        </div>
      </div>

      <div ref={lockHintRef} className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 pointer-events-none" style={{ opacity: 0 }}>
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#9adfff] border border-[#9adfff]/40 bg-[#10101e]/85 px-6 py-3 animate-pulse">
          click to take control
        </p>
      </div>

      <div
        ref={bannerRef}
        className="absolute top-[18%] inset-x-0 text-center font-display text-3xl text-white pointer-events-none transition-opacity duration-700"
        style={{ opacity: 0, textShadow: "0 2px 14px rgba(0,0,0,0.5)" }}
      />

      <div ref={promptRef} className="absolute bottom-[22%] inset-x-0 flex justify-center pointer-events-none transition-opacity duration-300" style={{ opacity: 0 }}>
        <p className="font-mono text-[12px] uppercase tracking-[0.25em] text-green-300 border border-green-400/60 bg-[#10141e]/85 px-5 py-2.5 animate-pulse">
          [ E ] extend the job offer
        </p>
      </div>

      {/* HUD */}
      <div ref={zoneRef} className="absolute top-2.5 left-4 font-mono text-[9px] uppercase tracking-[0.2em] text-white/85 pointer-events-none" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.55)" }} />
      <div ref={bossWrapRef} className="absolute top-2.5 inset-x-0 flex flex-col items-center pointer-events-none transition-opacity duration-300" style={{ opacity: 0 }}>
        <p ref={bossNameRef} className="font-mono text-[10px] font-bold tracking-[0.25em] text-white mb-1.5" style={{ textShadow: "0 1px 5px rgba(0,0,0,0.6)" }} />
        <div className="w-[340px] max-w-[50vw] h-[7px] bg-black/45 border border-black/30">
          <div ref={bossFillRef} className="h-full" style={{ width: "100%", background: "#4ade80" }} />
        </div>
      </div>
      <div ref={feedRef} className="absolute top-10 right-4 pointer-events-none flex flex-col items-end gap-1" />
      <div ref={noteRef} className="absolute top-16 inset-x-0 text-center font-mono text-[12px] font-bold text-white pointer-events-none px-8" style={{ opacity: 0, textShadow: "0 1px 8px rgba(0,0,0,0.6)" }} />
      <div className="absolute bottom-3 left-4 pointer-events-none flex items-end gap-2.5">
        <span ref={hpNumRef} className="font-mono text-3xl font-bold text-white leading-none" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.6)" }}>100</span>
        <div className="pb-0.5">
          <p className="font-mono text-[8px] uppercase tracking-[0.25em] text-white/70 mb-1" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}>HP</p>
          <div className="w-[130px] h-[7px] bg-black/45 border border-black/30">
            <div ref={hpFillRef} className="h-full" style={{ width: "100%", background: "#4ade80" }} />
          </div>
        </div>
      </div>
      <div className="absolute bottom-3 right-4 pointer-events-none text-right">
        <div ref={weaponRef} className="font-mono text-[9px] font-bold tracking-[0.2em] text-white/85 mb-1" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.55)" }} />
        <div ref={ammoRef} className="font-mono font-bold text-white leading-none" style={{ fontSize: 30, textShadow: "0 1px 6px rgba(0,0,0,0.6)" }} />
        <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/60 mt-0.5" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}>R reload</p>
      </div>
      <div ref={objRef} className="absolute bottom-3 inset-x-0 text-center font-mono text-[9px] uppercase tracking-[0.2em] text-white/80 pointer-events-none" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.55)" }} />

      {/* boss intro splash */}
      <div ref={introRef} className="absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-500 pointer-events-none" style={{ opacity: 0 }}>
        <div className="absolute top-0 inset-x-0 h-[12%] bg-black/70" />
        <div className="absolute bottom-0 inset-x-0 h-[12%] bg-black/70" />
        <p className="font-mono text-[10px] uppercase tracking-[0.5em] text-red-400 mb-3 animate-pulse">⚠ warning ⚠</p>
        <h3 ref={introNameRef} className="font-display text-5xl md:text-6xl text-white mb-2" style={{ textShadow: "0 2px 20px rgba(0,0,0,0.6)" }} />
        <p ref={introSubRef} className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/70" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }} />
      </div>
    </div>
  );
}
