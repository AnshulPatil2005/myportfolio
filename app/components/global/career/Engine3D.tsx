"use client";

import * as THREE from "three";
import { useEffect, useRef } from "react";
import { CHAPTERS, WEAPONS, GLYPHS, IMMUNE_TEXTS, ANSHUL_TAUNTS, ROMAN } from "./data";

// ── One continuous world. The player character walks a path through six
//    zones; each zone's boss guards the gate to the next. Zone 6 is Anshul.
const ZONE_GAP = 34;
const ZC = [0, 1, 2, 3, 4, 5].map(i => -i * ZONE_GAP); // zone centers (z)
const ROOM_HW = 14;   // room half-width
const ROOM_HD = 11;   // room half-depth
const CORR_HW = 3;    // corridor half-width
const RW = 960, RH = 540;

const AMBER = 0xffb000;
const AMBER_HI = 0xffcf60;
const REDC = 0xff5555;
const GREENC = 0x4ade80;
const DARK = 0x1c1512;

interface Props {
  initialCleared: number;
  paused: boolean;
  onEvent: (e: "victory" | "ending" | "pause", data?: number) => void;
}

interface PB { x: number; y: number; z: number; vx: number; vy: number; vz: number; dmg: number; pierce: number; dead: boolean }
interface EB { x: number; z: number; vx: number; vz: number; r: number; dead: boolean }
interface MinionS { x: number; z: number; vx: number; vz: number; hp: number; t: number; ang: number; diving: boolean; dead: boolean }
interface Part { x: number; y: number; z: number; vx: number; vy: number; vz: number; t: number; max: number; r: number; g: number; b: number }

// walkable rectangles: rooms always; corridor i needs boss i beaten
const ROOMS = ZC.map(zc => ({ x1: -ROOM_HW, x2: ROOM_HW, z1: zc - ROOM_HD, z2: zc + ROOM_HD }));
const CORRS = [0, 1, 2, 3, 4].map(i => ({ x1: -CORR_HW, x2: CORR_HW, z1: ZC[i] - ROOM_HD - (ZONE_GAP - ROOM_HD * 2), z2: ZC[i] - ROOM_HD }));

export default function Engine3D({ initialCleared, paused, onEvent }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(paused);
  const onEventRef = useRef(onEvent);
  pausedRef.current = paused;
  onEventRef.current = onEvent;

  // HUD refs
  const hpFillRef = useRef<HTMLDivElement>(null);
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

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0d0a08);
    scene.fog = new THREE.Fog(0x0d0a08, 14, 44);

    const camera = new THREE.PerspectiveCamera(62, RW / RH, 0.05, 140);
    scene.add(camera);

    // ── Helpers ────────────────────────────────────────────────────────────
    const disposables: { dispose: () => void }[] = [];
    const track = <T extends { dispose: () => void }>(d: T): T => { disposables.push(d); return d; };
    const bmat = (color: number, o: Partial<THREE.MeshBasicMaterialParameters> = {}) =>
      track(new THREE.MeshBasicMaterial({ color, ...o }));
    const lmat = (color: number, opacity = 1) =>
      track(new THREE.LineBasicMaterial({ color, transparent: opacity < 1, opacity }));
    const edgesOf = (geo: THREE.BufferGeometry, color: number, opacity = 1) =>
      new THREE.LineSegments(track(new THREE.EdgesGeometry(geo)), lmat(color, opacity));

    const texCache = new Map<string, THREE.CanvasTexture>();
    function textTexture(txt: string, color: string, fontPx = 56): THREE.CanvasTexture {
      const key = `${txt}|${color}|${fontPx}`;
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

    // ── Terrain ────────────────────────────────────────────────────────────
    const ground = new THREE.Mesh(track(new THREE.PlaneGeometry(120, 300)), bmat(0x0b0908));
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(0, -0.02, -85);
    scene.add(ground);
    const grid = new THREE.GridHelper(300, 150, 0x3a2a18, 0x1d1410);
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.5;
    grid.position.z = -85;
    scene.add(grid);

    const WALL_H = 2.6;
    function mkWall(w: number, d: number, x: number, z: number) {
      const geo = track(new THREE.BoxGeometry(w, WALL_H, d));
      const mesh = new THREE.Mesh(geo, bmat(0x0f0c0a));
      mesh.position.set(x, WALL_H / 2, z);
      const e = edgesOf(geo, AMBER, 0.3);
      e.position.copy(mesh.position);
      scene.add(mesh, e);
    }
    // rooms with corridor gaps
    const segW = (ROOM_HW - CORR_HW); // 11
    ZC.forEach((zc, i) => {
      // +Z wall (entry side): gap if a corridor comes in (i > 0)
      if (i > 0) {
        mkWall(segW, 0.5, -(CORR_HW + segW / 2), zc + ROOM_HD);
        mkWall(segW, 0.5, CORR_HW + segW / 2, zc + ROOM_HD);
      } else {
        mkWall(ROOM_HW * 2 + 0.5, 0.5, 0, zc + ROOM_HD + 0.25);
      }
      // −Z wall (exit side): gap if corridor leaves (i < 5)
      if (i < 5) {
        mkWall(segW, 0.5, -(CORR_HW + segW / 2), zc - ROOM_HD);
        mkWall(segW, 0.5, CORR_HW + segW / 2, zc - ROOM_HD);
      } else {
        mkWall(ROOM_HW * 2 + 0.5, 0.5, 0, zc - ROOM_HD - 0.25);
      }
      // side walls
      mkWall(0.5, ROOM_HD * 2, -ROOM_HW - 0.25, zc);
      mkWall(0.5, ROOM_HD * 2, ROOM_HW + 0.25, zc);
      // corner pillars
      const postGeo = track(new THREE.CylinderGeometry(0.09, 0.09, 3.6, 6));
      for (const [sx, sz] of [[-ROOM_HW, zc - ROOM_HD], [ROOM_HW, zc - ROOM_HD], [ROOM_HW, zc + ROOM_HD], [-ROOM_HW, zc + ROOM_HD]] as [number, number][]) {
        const post = new THREE.Mesh(postGeo, bmat(AMBER, { transparent: true, opacity: 0.75 }));
        post.position.set(sx, 1.8, sz);
        scene.add(post);
      }
    });
    // corridor walls
    CORRS.forEach(cr => {
      const len = cr.z2 - cr.z1;
      mkWall(0.5, len, -CORR_HW - 0.25, (cr.z1 + cr.z2) / 2);
      mkWall(0.5, len, CORR_HW + 0.25, (cr.z1 + cr.z2) / 2);
    });

    // gates — sealed until the zone's boss dies
    const gates = CORRS.map((cr, i) => {
      const g = new THREE.Group();
      const plane = new THREE.Mesh(track(new THREE.PlaneGeometry(CORR_HW * 2, WALL_H)), bmat(AMBER, { transparent: true, opacity: 0.16, side: THREE.DoubleSide }));
      plane.position.y = WALL_H / 2;
      const frame = edgesOf(track(new THREE.BoxGeometry(CORR_HW * 2, WALL_H, 0.06)), AMBER, 0.7);
      frame.position.y = WALL_H / 2;
      const lock = textSprite("⚠ GATE SEALED", "#ffb000", 0.34);
      lock.position.y = WALL_H + 0.5;
      g.add(plane, frame, lock);
      g.position.set(0, 0, cr.z2); // at the room's exit
      scene.add(g);
      return { g, plane: plane.material as THREE.MeshBasicMaterial };
    });

    // story sign panels — chapter text stands along the path
    function addSign(txt: string, x: number, y: number, z: number, color = "#c8b08a", h = 0.3) {
      const s = textSprite(txt, color, h, 44);
      s.position.set(x, y, z);
      scene.add(s);
    }
    CHAPTERS[0].story.forEach((ln, k) => addSign(ln, k % 2 === 0 ? -5 : 5, 1.7, 8.5 - k * 1.3));
    CORRS.forEach((cr, i) => {
      const story = CHAPTERS[i + 1].story;
      story.forEach((ln, k) => {
        addSign(ln, k % 2 === 0 ? -2.1 : 2.1, 1.7, cr.z2 - 2 - k * 2.4);
      });
    });
    addSign("↓ follow the path", 0, 1.2, ZC[0] - 9, "#8a7050");

    // ambient zone props
    const propRand = (seed: number) => {
      let s = seed;
      return () => { s = (s * 16807) % 2147483647; return (s % 1000) / 1000; };
    };
    ZC.forEach((zc, zi) => {
      const rnd = propRand(zi * 977 + 13);
      for (let k = 0; k < 7; k++) {
        const px2 = (rnd() - 0.5) * 24;
        const pz2 = zc + (rnd() - 0.5) * 17;
        if (Math.abs(px2) < 4 && Math.abs(pz2 - zc) < 5) continue; // keep the arena center clear
        if (zi === 0) {
          const h = 0.6 + rnd() * 1.6;
          const geo = track(new THREE.BoxGeometry(0.9, h, 0.9));
          const e = edgesOf(geo, 0x4a3828, 0.8);
          e.position.set(px2, h / 2, pz2);
          scene.add(e);
        } else if (zi === 1) {
          const geo = track(new THREE.CylinderGeometry(0.16, 0.2, 2.4, 6));
          const e = edgesOf(geo, 0x4a3828, 0.7);
          e.position.set(px2, 1.2, pz2);
          scene.add(e);
        } else if (zi === 2) {
          const sp = textSprite(GLYPHS[k % GLYPHS.length], k % 3 === 0 ? "#5a3030" : "#4a3828", 0.6);
          sp.position.set(px2, 0.8 + rnd() * 1.6, pz2);
          scene.add(sp);
        } else if (zi === 3) {
          const geo = track(new THREE.IcosahedronGeometry(0.5 + rnd() * 0.5, 0));
          const m = new THREE.Mesh(geo, bmat(0x4a3828, { wireframe: true, transparent: true, opacity: 0.6 }));
          m.position.set(px2, 0.7, pz2);
          scene.add(m);
        } else if (zi === 4) {
          const h = 1 + rnd() * 2.4;
          const geo = track(new THREE.BoxGeometry(1.1, h, 1.1));
          const e = edgesOf(geo, 0x5a2a22, 0.75);
          e.position.set(px2, h / 2, pz2);
          scene.add(e);
        } else {
          const geo = track(new THREE.CylinderGeometry(0.14, 0.14, 2.8 + rnd() * 1.2, 6));
          const m = new THREE.Mesh(geo, bmat(AMBER, { transparent: true, opacity: 0.5 }));
          m.position.set(px2, 1.5, pz2);
          scene.add(m);
        }
      }
    });

    // floating dust across the whole path
    {
      const n = 400;
      const pos = new Float32Array(n * 3);
      for (let i = 0; i < n; i++) {
        pos[i * 3] = (Math.random() - 0.5) * 60;
        pos[i * 3 + 1] = Math.random() * 10 + 0.5;
        pos[i * 3 + 2] = 20 - Math.random() * 220;
      }
      const g = track(new THREE.BufferGeometry());
      g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      const ptsm = track(new THREE.PointsMaterial({ color: 0x6a5030, size: 0.09, transparent: true, opacity: 0.6, depthWrite: false }));
      const pts = new THREE.Points(g, ptsm);
      pts.frustumCulled = false;
      scene.add(pts);
    }

    // ── Player character ───────────────────────────────────────────────────
    const player = new THREE.Group();
    {
      const bodyGeo = track(new THREE.CapsuleGeometry(0.3, 0.85, 4, 10));
      const body = new THREE.Mesh(bodyGeo, bmat(0x14100d));
      body.position.y = 1.02;
      const bodyE = edgesOf(track(new THREE.CylinderGeometry(0.32, 0.32, 1.35, 8)), 0xffffff, 0.5);
      bodyE.position.y = 1.02;
      const head = new THREE.Mesh(track(new THREE.SphereGeometry(0.3, 16, 12)), bmat(0x14100d));
      head.position.y = 1.95;
      const headE = edgesOf(track(new THREE.BoxGeometry(0.44, 0.44, 0.44)), 0xffffff, 0.4);
      headE.position.y = 1.95;
      const gunGeo = track(new THREE.BoxGeometry(0.1, 0.1, 0.62));
      const gunM = new THREE.Mesh(gunGeo, bmat(0x241c14));
      gunM.position.set(0.34, 1.25, -0.3);
      const gunE = edgesOf(gunGeo, AMBER, 0.9);
      gunE.position.copy(gunM.position);
      const ring = new THREE.Mesh(track(new THREE.RingGeometry(0.5, 0.6, 24)), bmat(AMBER, { transparent: true, opacity: 0.45, side: THREE.DoubleSide }));
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.03;
      player.add(body, bodyE, head, headE, gunM, gunE, ring);
    }
    scene.add(player);
    const muzzleMat = track(new THREE.SpriteMaterial({ map: textTexture("✦", "#ffcf60", 64), transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }));
    const muzzle = new THREE.Sprite(muzzleMat);
    muzzle.scale.setScalar(0.34);
    muzzle.position.set(0.34, 1.25, -0.75);
    player.add(muzzle);

    // ── Bullets / particles / floaters / zones / minions ──────────────────
    const MAX_PB = 160, MAX_EB = 340;
    const pbMesh = new THREE.InstancedMesh(track(new THREE.SphereGeometry(0.11, 8, 8)), bmat(AMBER_HI), MAX_PB);
    const ebMesh = new THREE.InstancedMesh(track(new THREE.SphereGeometry(0.17, 8, 8)), bmat(REDC), MAX_EB);
    pbMesh.frustumCulled = false; ebMesh.frustumCulled = false;
    pbMesh.count = 0; ebMesh.count = 0;
    scene.add(pbMesh, ebMesh);
    const m4 = new THREE.Matrix4();
    const EB_Y = 1.25;

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

    const zoneVis = Array.from({ length: 3 }, () => {
      const g = new THREE.Group();
      const fill = new THREE.Mesh(track(new THREE.CircleGeometry(1.9, 28)), bmat(0xff3c3c, { transparent: true, opacity: 0.14, side: THREE.DoubleSide }));
      fill.rotation.x = -Math.PI / 2; fill.position.y = 0.03;
      const rim = new THREE.Mesh(track(new THREE.RingGeometry(1.8, 1.9, 28)), bmat(REDC, { transparent: true, opacity: 0.7, side: THREE.DoubleSide }));
      rim.rotation.x = -Math.PI / 2; rim.position.y = 0.04;
      g.add(fill, rim);
      g.visible = false;
      scene.add(g);
      return { g, fill: fill.material as THREE.MeshBasicMaterial, rim: rim.material as THREE.MeshBasicMaterial };
    });

    const MINN = 8;
    const minionVis = Array.from({ length: MINN }, (_, i) => {
      const s = textSprite(GLYPHS[i % GLYPHS.length], "#ffffff", 0.8);
      s.visible = false;
      scene.add(s);
      return s;
    });

    // ── Boss visuals — all six live in the world ───────────────────────────
    interface BossVis {
      group: THREE.Group;
      slabEdges?: THREE.LineSegments[]; vent?: THREE.Mesh;
      faceEdges?: THREE.LineSegments; check?: THREE.Sprite; shields?: THREE.Sprite[];
      deco?: THREE.Sprite[];
      ghosts?: THREE.Group[]; hash?: THREE.Sprite; pin?: THREE.Mesh;
      coreEdge?: THREE.LineSegments; mods?: THREE.Group[];
      screen?: THREE.MeshBasicMaterial; aura?: THREE.MeshBasicMaterial;
    }
    const bossVis: BossVis[] = ZC.map((zc, zi) => {
      const group = new THREE.Group();
      group.position.set(0, 0, zc);
      scene.add(group);
      const v: BossVis = { group };
      const name = textSprite(CHAPTERS[zi].bossName, zi === 5 ? "#ffb000" : "#ff8866", 0.44);
      name.position.y = zi === 0 ? 5.4 : 4.1;
      group.add(name);

      if (zi === 0) {
        v.slabEdges = [];
        for (let i = 0; i < 5; i++) {
          const geo = track(new THREE.BoxGeometry(4 - i * 0.27, 0.85, 2.3));
          const slab = new THREE.Mesh(geo, bmat(DARK));
          slab.position.y = 0.46 + i * 0.9;
          const e = edgesOf(geo, 0x4a3828);
          e.position.y = slab.position.y;
          group.add(slab, e);
          v.slabEdges.push(e);
        }
        v.vent = new THREE.Mesh(track(new THREE.BoxGeometry(2.6, 1.9, 2.45)), bmat(AMBER, { transparent: true, opacity: 0 }));
        v.vent.position.y = 1.8;
        group.add(v.vent);
      } else if (zi === 1) {
        const faceGeo = track(new THREE.BoxGeometry(2.5, 2.5, 0.55));
        const face = new THREE.Mesh(faceGeo, bmat(DARK));
        face.position.y = 1.6;
        v.faceEdges = edgesOf(faceGeo, 0x4a3828);
        v.faceEdges.position.y = 1.6;
        const label = textSprite("I'M NOT A ROBOT", "#c8b08a", 0.34);
        label.position.set(0, 2.15, 0.4);
        v.check = textSprite("☐", "#c8b08a", 0.6);
        v.check.position.set(0, 1.2, 0.4);
        group.add(face, v.faceEdges, label, v.check);
        v.shields = GLYPHS.slice(0, 5).map(gl => {
          const sp = textSprite(gl, "#ffffff", 0.85);
          scene.add(sp);
          return sp;
        });
      } else if (zi === 2) {
        const core = textSprite("�", "#ffffff", 2.0);
        core.position.y = 1.5;
        group.add(core);
        v.deco = Array.from({ length: 10 }, (_, i) => {
          const sp = textSprite(GLYPHS[i % GLYPHS.length], i % 3 === 0 ? "#ff5555" : "#ffb000", 0.55);
          group.add(sp);
          return sp;
        });
      } else if (zi === 3) {
        v.ghosts = [0, 1, 2].map(() => {
          const g = new THREE.Group();
          const outer = new THREE.Mesh(track(new THREE.IcosahedronGeometry(1.35, 0)), bmat(AMBER, { wireframe: true, transparent: true, opacity: 1 }));
          outer.position.y = 1.5;
          const inner = new THREE.Mesh(track(new THREE.IcosahedronGeometry(0.72, 0)), bmat(AMBER, { transparent: true, opacity: 0.14 }));
          inner.position.y = 1.5;
          g.add(outer, inner);
          g.position.set(0, 0, zc);
          scene.add(g);
          return g;
        });
        v.hash = textSprite("sha256: a3f9…", "#ffb000", 0.3);
        v.hash.visible = false;
        scene.add(v.hash);
        v.pin = new THREE.Mesh(track(new THREE.RingGeometry(1.7, 1.85, 32)), bmat(GREENC, { transparent: true, opacity: 0.8, side: THREE.DoubleSide }));
        v.pin.rotation.x = -Math.PI / 2;
        v.pin.position.y = 0.04;
        v.pin.visible = false;
        scene.add(v.pin);
      } else if (zi === 4) {
        const coreGeo = track(new THREE.IcosahedronGeometry(1.4, 1));
        const core = new THREE.Mesh(coreGeo, bmat(0x140e0c));
        core.position.y = 1.6;
        v.coreEdge = new THREE.LineSegments(track(new THREE.WireframeGeometry(coreGeo)), lmat(REDC, 0.9));
        v.coreEdge.position.y = 1.6;
        group.add(core, v.coreEdge);
        v.mods = ["auth", "api", "billing", "config"].map(label => {
          const g = new THREE.Group();
          const geo = track(new THREE.BoxGeometry(1.6, 0.75, 1.0));
          const box = new THREE.Mesh(geo, bmat(0x140e0c));
          const edge = edgesOf(geo, REDC);
          const lb = textSprite(label, "#ff5555", 0.34);
          lb.position.y = 0.85;
          g.add(box, edge, lb);
          g.position.set(0, 0.6, zc);
          scene.add(g);
          return g;
        });
      } else {
        const head = new THREE.Mesh(track(new THREE.SphereGeometry(0.42, 18, 14)), bmat(DARK));
        head.position.y = 2.5;
        const headE = edgesOf(track(new THREE.BoxGeometry(0.62, 0.62, 0.62)), AMBER, 0.35);
        headE.position.y = 2.5;
        const body = new THREE.Mesh(track(new THREE.CapsuleGeometry(0.34, 1.0, 4, 10)), bmat(DARK));
        body.position.y = 1.45;
        const bodyE = edgesOf(track(new THREE.CylinderGeometry(0.36, 0.36, 1.5, 8)), AMBER, 0.3);
        bodyE.position.y = 1.45;
        const lapGeo = track(new THREE.BoxGeometry(1.5, 0.09, 0.95));
        const laptop = new THREE.Mesh(lapGeo, bmat(0x0f0c0a));
        laptop.position.set(0, 1.1, 0.75);
        const lapE = edgesOf(lapGeo, AMBER, 0.8);
        lapE.position.copy(laptop.position);
        v.screen = bmat(AMBER, { transparent: true, opacity: 0.7 });
        const screen = new THREE.Mesh(track(new THREE.PlaneGeometry(1.32, 0.62)), v.screen);
        screen.position.set(0, 1.5, 1.1);
        screen.rotation.x = -0.5;
        const sub = textSprite("FULL-STACK DEVELOPER", "#8a7050", 0.26);
        sub.position.y = 3.5;
        v.aura = bmat(AMBER, { transparent: true, opacity: 0.15, side: THREE.DoubleSide });
        const aura = new THREE.Mesh(track(new THREE.RingGeometry(1.6, 1.85, 40)), v.aura);
        aura.rotation.x = -Math.PI / 2;
        aura.position.y = 0.03;
        group.add(head, headE, body, bodyE, laptop, lapE, screen, sub, aura);
      }
      return v;
    });

    // ── State ──────────────────────────────────────────────────────────────
    const st = {
      t: 0, timeScale: 1,
      cleared: Math.max(0, Math.min(5, initialCleared)),
      px: 0, pz: ZC[Math.max(0, Math.min(5, initialCleared))] + 8.5,
      php: 100, invuln: 1.2, fireCd: 0,
      yaw: 0, pitch: 0.32, locked: false, firing: false, muzzleT: 0, bobT: 0, moving: false,
      keys: new Set<string>(),
      pb: [] as PB[], eb: [] as EB[], minions: [] as MinionS[],
      // fight
      fightActive: false, fightZone: -1, introT: -1, vicT: -1, deadT: -1,
      bossX: 0, bossZ: 0, bossHp: 0, bossMax: 1,
      shake: 0, bossPulse: 0, noteT: 0,
      vented: false, ventT: 4, cdA: 1.2, cdB: 3.5, cdC: 6, burstN: 0,
      shieldSt: [] as { ang: number; hp: number; alive: boolean }[],
      openT: 0, spiralA: 0,
      ghosts: [] as { x: number; z: number }[], realIdx: 0, pinHits: 0, pinT: 0, shuffleT: 0,
      modSt: [] as { ang: number; hp: number; cd: number; alive: boolean }[],
      exposedT: 0,
      dzones: [] as { x: number; z: number; warm: number; life: number }[],
      // final meeting
      metAnshul: false, tauntT: 2, tauntIdx: 0, nearAnshul: false, canOffer: false, cineT: -1,
      entered: new Set<number>(), bannerT: 0,
      blackT: 0,
    };

    function note(txt: string, secs = 1.6) {
      if (noteRef.current) noteRef.current.textContent = txt;
      st.noteT = secs;
    }
    function aimShot(x: number, z: number, speed: number, r = 0.17, offAng = 0) {
      if (st.eb.length > MAX_EB - 4) return;
      const a = Math.atan2(st.pz - z, st.px - x) + offAng;
      st.eb.push({ x, z, vx: Math.cos(a) * speed, vz: Math.sin(a) * speed, r, dead: false });
    }
    function ringShot(x: number, z: number, n: number, speed: number, phase = 0, r = 0.17) {
      if (st.eb.length > MAX_EB - n - 1) return;
      for (let i = 0; i < n; i++) {
        const a = phase + (i / n) * Math.PI * 2;
        st.eb.push({ x, z, vx: Math.cos(a) * speed, vz: Math.sin(a) * speed, r, dead: false });
      }
    }

    function canStand(x: number, z: number): boolean {
      const M = 0.55;
      for (let i = 0; i < ROOMS.length; i++) {
        const r = ROOMS[i];
        if (x > r.x1 + M && x < r.x2 - M && z > r.z1 + M && z < r.z2 - M) {
          if (st.fightActive && i !== st.fightZone) continue; // sealed in during a fight
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

    function initFight(zone: number) {
      st.fightActive = true;
      st.fightZone = zone;
      st.introT = 2.2;
      st.vicT = -1;
      st.bossX = 0;
      st.bossZ = ZC[zone];
      st.bossHp = st.bossMax = [300, 340, 380, 420, 500][zone];
      st.eb = []; st.pb = []; st.minions = [];
      st.vented = false; st.ventT = 4; st.cdA = 1.2; st.cdB = 3.5; st.cdC = 6; st.burstN = 0;
      st.shieldSt = GLYPHS.slice(0, 5).map((_, i) => ({ ang: (i / 5) * Math.PI * 2, hp: 24, alive: true }));
      st.openT = 0; st.spiralA = 0;
      st.ghosts = []; st.realIdx = 0; st.pinHits = 0; st.pinT = 0; st.shuffleT = 0;
      st.modSt = [0, 1, 2, 3].map(i => ({ ang: (i / 4) * Math.PI * 2, hp: 55, cd: 1 + i * 0.6, alive: true }));
      st.exposedT = 0;
      st.dzones = [];
      if (introNameRef.current) introNameRef.current.textContent = CHAPTERS[zone].bossName;
      if (introSubRef.current) introSubRef.current.textContent = CHAPTERS[zone].bossSub;
      if (bossNameRef.current) bossNameRef.current.textContent = CHAPTERS[zone].bossName;
    }

    // ── Input ──────────────────────────────────────────────────────────────
    const seqActive = () => st.vicT >= 0 || st.deadT >= 0 || st.cineT >= 0 || st.introT > 0;
    const onLockChange = () => {
      st.locked = document.pointerLockElement === canvas;
      if (!st.locked && !seqActive() && !pausedRef.current) onEventRef.current("pause");
    };
    const onCanvasClick = () => {
      if (!st.locked && !seqActive() && !pausedRef.current) canvas.requestPointerLock();
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!st.locked) return;
      st.yaw -= e.movementX * 0.0022;
      st.pitch = Math.max(-0.15, Math.min(1.05, st.pitch + e.movementY * 0.0018));
    };
    const onDown = (e: MouseEvent) => { if (st.locked && e.button === 0) st.firing = true; };
    const onUp = () => { st.firing = false; };
    const onKeyDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(k)) st.keys.add(k);
      if (k === "e" && st.canOffer && st.cineT < 0) {
        st.cineT = 0;
        st.eb = []; st.pb = [];
        document.exitPointerLock();
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

    // ── Boss AI (zone-local origins) ───────────────────────────────────────
    function updBoss(dt: number) {
      const zone = st.fightZone;
      const oz = ZC[zone];
      if (zone === 0) {
        st.bossX = Math.sin(st.t * 0.5) * 4.7;
        st.bossZ = oz - 2;
        st.ventT -= dt;
        if (st.ventT <= 0) {
          st.vented = !st.vented;
          st.ventT = st.vented ? 2.6 : 4;
          if (st.vented) note("VENTING — STRIKE NOW", 1.4);
        }
        st.cdA -= dt;
        if (st.cdA <= 0) { st.cdA = 1.25; ringShot(st.bossX, st.bossZ, 10, 3.9, st.t); }
        st.cdB -= dt;
        if (st.cdB <= 0) { st.cdB = 3.6; st.burstN = 3; st.cdC = 0; }
        if (st.burstN > 0) {
          st.cdC -= dt;
          if (st.cdC <= 0) { st.cdC = 0.16; st.burstN--; aimShot(st.bossX, st.bossZ + 1, 7.7, 0.3); }
        }
      } else if (zone === 1) {
        st.bossX = Math.sin(st.t * 0.7) * 6;
        st.bossZ = oz - 2 + Math.sin(st.t * 1.4) * 1.1;
        const alive = st.shieldSt.filter(s => s.alive);
        if (alive.length === 0) {
          if (st.openT <= 0) { st.openT = 6; note("GATE OPEN", 1.4); }
          st.openT -= dt;
          if (st.openT <= 0) { st.shieldSt.forEach(s => { s.alive = true; s.hp = 24; }); note("SHIELDS RESTORED", 1.2); }
        }
        st.cdA -= dt;
        if (st.cdA <= 0) {
          st.cdA = 1.5;
          for (let i = 0; i < 3; i++) aimShot(st.bossX, st.bossZ, 6.3, 0.2, (i - 1) * 0.14);
        }
        st.cdB -= dt;
        if (st.cdB <= 0) { st.cdB = 4.4; ringShot(st.bossX, st.bossZ, 12, 4.3, st.t); }
      } else if (zone === 2) {
        st.cdC -= dt;
        if (st.cdC <= 0) { st.cdC = 2; st.bossX = (Math.random() - 0.5) * 12; st.bossZ = oz - 3 + Math.random() * 4; burst(st.bossX, st.bossZ, 8, AMBER, 3, 1.5); }
        st.spiralA += dt * 2.6;
        st.cdA -= dt;
        if (st.cdA <= 0) {
          st.cdA = 0.085;
          for (const off of [0, Math.PI]) {
            if (st.eb.length > MAX_EB - 2) break;
            const a = st.spiralA + off;
            st.eb.push({ x: st.bossX, z: st.bossZ, vx: Math.cos(a) * 4.3, vz: Math.sin(a) * 4.3, r: 0.17, dead: false });
          }
        }
        st.cdB -= dt;
        if (st.cdB <= 0 && st.minions.filter(m => !m.dead).length < 6) {
          st.cdB = 1.5;
          st.minions.push({ x: st.bossX, z: st.bossZ, vx: 0, vz: 0, hp: 10, t: 0, ang: Math.random() * Math.PI * 2, diving: false, dead: false });
        }
        for (const m of st.minions) {
          if (m.dead) continue;
          m.t += dt;
          if (!m.diving) {
            m.ang += dt * 1.6;
            m.x = st.bossX + Math.cos(m.ang) * 2.3;
            m.z = st.bossZ + Math.sin(m.ang) * 2.3;
            if (m.t > 2.5) {
              m.diving = true;
              const a = Math.atan2(st.pz - m.z, st.px - m.x);
              m.vx = Math.cos(a) * 9; m.vz = Math.sin(a) * 9;
            }
          } else {
            m.x += m.vx * dt; m.z += m.vz * dt;
            if (Math.abs(m.x) > ROOM_HW + 2 || Math.abs(m.z - oz) > ROOM_HD + 2) m.dead = true;
          }
        }
      } else if (zone === 3) {
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
          st.shuffleT = 3;
          const base = st.t * 0.4;
          const old = st.ghosts[st.realIdx] || { x: 0, z: oz - 2 };
          st.ghosts = [0, 1, 2].map(i => ({
            x: Math.cos(base + (i / 3) * Math.PI * 2) * 5.6,
            z: oz - 2 + Math.sin(base + (i / 3) * Math.PI * 2) * 2.1,
          }));
          st.realIdx = (Math.random() * 3) | 0;
          ringShot(old.x, old.z, 14, 5, st.t);
          burst(old.x, old.z, 10, AMBER, 4, 1.5);
        }
        const real = st.ghosts[st.realIdx];
        st.bossX = real.x; st.bossZ = real.z;
        st.cdA -= dt;
        if (st.cdA <= 0) {
          st.cdA = 2;
          st.ghosts.forEach((g, i) => {
            for (let k = -2; k <= 2; k++) aimShot(g.x, g.z, 5.5, 0.17, k * 0.13 + i * 0.03);
          });
        }
      } else if (zone === 4) {
        st.bossX = Math.sin(st.t * 0.6) * 3;
        st.bossZ = oz - 2 + Math.cos(st.t * 0.8) * 0.87;
        const anyMod = st.modSt.some(m => m.alive);
        if (!anyMod) {
          if (st.exposedT <= 0) { st.exposedT = 8; note("CORE EXPOSED", 1.5); }
          st.exposedT -= dt;
          if (st.exposedT <= 0) { st.modSt.forEach(m => { m.alive = true; m.hp = 55; }); note("MODULES REDEPLOYED", 1.4); }
        }
        for (const mo of st.modSt) {
          if (!mo.alive) continue;
          mo.ang += dt * 0.5;
          mo.cd -= dt;
          if (mo.cd <= 0) {
            mo.cd = 2.3;
            aimShot(st.bossX + Math.cos(mo.ang) * 5, st.bossZ + Math.sin(mo.ang) * 5, 6.2, 0.2);
          }
        }
        st.cdA -= dt;
        if (st.cdA <= 0) {
          st.cdA = 6;
          st.dzones = Array.from({ length: 3 }, () => ({
            x: Math.max(-ROOM_HW + 2, Math.min(ROOM_HW - 2, st.px + (Math.random() - 0.5) * 15)),
            z: Math.max(oz - ROOM_HD + 2, Math.min(oz + ROOM_HD - 2, st.pz + (Math.random() - 0.5) * 11)),
            warm: 1, life: 4,
          }));
        }
        for (const z of st.dzones) { if (z.warm > 0) z.warm -= dt; else z.life -= dt; }
        st.dzones = st.dzones.filter(z => z.life > 0);
        st.cdB -= dt;
        if (st.cdB <= 0) { st.cdB = 5; ringShot(st.bossX, st.bossZ, 16, 4, st.t); }
      }
    }

    function hitBoss(b: PB): boolean {
      const zone = st.fightZone;
      const bodyH = [4.8, 3.0, 3.0, 3.0, 3.2][zone];
      if (zone === 1) {
        const anyShield = st.shieldSt.some(s => s.alive);
        if (anyShield) {
          const firstAlive = st.shieldSt.findIndex(q => q.alive);
          for (let i = 0; i < st.shieldSt.length; i++) {
            const s = st.shieldSt[i];
            if (!s.alive) continue;
            const sx = st.bossX + Math.cos(s.ang + st.t) * 2.6;
            const sz = st.bossZ + Math.sin(s.ang + st.t) * 2.6;
            const d3 = Math.sqrt((b.x - sx) ** 2 + (b.y - 1.4) ** 2 + (b.z - sz) ** 2);
            if (d3 < 0.62) {
              if (i === firstAlive) {
                s.hp -= b.dmg;
                burst(sx, sz, 4, AMBER, 3, 1.3);
                if (s.hp <= 0) { s.alive = false; floatTxt(GLYPHS[i] + " ✓", "#4ade80", sx, sz); burst(sx, sz, 16, AMBER, 5, 1.3); }
              } else {
                floatTxt("SEQ!", "#999999", sx, sz, 0.36);
              }
              return true;
            }
          }
          if (Math.hypot(b.x - st.bossX, b.z - st.bossZ) < 1.4 && b.y > 0 && b.y < bodyH) { floatTxt("SHIELDED", "#999999", b.x, b.z, 0.36, b.y); return true; }
          return false;
        }
      }
      if (zone === 3 && st.pinT <= 0) {
        for (let i = 0; i < st.ghosts.length; i++) {
          const g = st.ghosts[i];
          const d3 = Math.sqrt((b.x - g.x) ** 2 + (b.y - 1.5) ** 2 + (b.z - g.z) ** 2);
          if (d3 < 1.45) {
            if (i === st.realIdx) {
              st.bossHp -= b.dmg; st.pinHits++; st.bossPulse = 0.14;
              burst(b.x, b.z, 3, AMBER, 3, b.y);
              if (st.pinHits >= 8) { st.pinT = 3; note("PINNED — HASHES MATCH", 1.6); }
            } else {
              floatTxt("MISMATCH", "#999999", b.x, b.z, 0.36, b.y);
            }
            return true;
          }
        }
        return false;
      }
      if (zone === 4) {
        for (let i = 0; i < st.modSt.length; i++) {
          const mo = st.modSt[i];
          if (!mo.alive) continue;
          const mx = st.bossX + Math.cos(mo.ang) * 5, mz = st.bossZ + Math.sin(mo.ang) * 5;
          const d3 = Math.sqrt((b.x - mx) ** 2 + (b.y - 0.98) ** 2 + (b.z - mz) ** 2);
          if (d3 < 0.85) {
            mo.hp -= b.dmg;
            burst(mx, mz, 3, REDC, 3, 1);
            if (mo.hp <= 0) { mo.alive = false; floatTxt(["auth", "api", "billing", "config"][i] + " refactored", "#4ade80", mx, mz, 0.5, 1.4); burst(mx, mz, 18, AMBER, 5, 1); }
            return true;
          }
        }
      }
      const r = [2.3, 1.4, 1.5, 1.35, 1.55][zone];
      if (Math.hypot(b.x - st.bossX, b.z - st.bossZ) < r && b.y > 0 && b.y < bodyH) {
        let mult = 1;
        if (zone === 0) mult = st.vented ? 1 : 0.25;
        if (zone === 3) mult = st.pinT > 0 ? 2 : 1;
        if (zone === 4) mult = st.modSt.some(m => m.alive) ? 0.2 : 1;
        st.bossHp -= b.dmg * mult;
        st.bossPulse = 0.14;
        burst(b.x, b.z, mult >= 1 ? 4 : 2, mult >= 1 ? AMBER : 0x666666, 3, b.y);
        return true;
      }
      return false;
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

      if (st.vicT >= 0) {
        st.vicT -= rdt;
        if (st.vicT <= 0) {
          st.timeScale = 1;
          st.fightActive = false;
          st.cleared = st.fightZone + 1;
          st.php = 100;
          onEventRef.current("victory", st.fightZone);
        }
        return;
      }
      if (st.deadT >= 0) {
        st.deadT -= rdt;
        st.blackT = Math.min(1, st.blackT + rdt * 1.4);
        if (st.deadT <= 0) {
          // respawn at the entrance of the fight zone; the boss resets
          const zone = st.fightZone;
          st.timeScale = 1;
          st.fightActive = false;
          st.php = 100;
          st.invuln = 2;
          st.px = 0; st.pz = ZC[zone] + 9.3;
          st.eb = []; st.pb = []; st.minions = [];
          st.blackT = 0;
          note("respawned — the boss awaits", 2);
        }
        return;
      }
      if (st.cineT >= 0) {
        st.cineT += rdt;
        st.eb = []; st.pb = [];
        if (st.cineT > 0.5 && Math.random() < 0.25) burst(st.bossX + (Math.random() - 0.5) * 2, st.bossZ + (Math.random() - 0.5) * 2, 8, Math.random() < 0.5 ? GREENC : AMBER, 4, 1.5);
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
      if (!st.locked) return;

      if (st.invuln > 0) st.invuln -= dt;

      // ── movement (camera-relative) ──
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
        const nx = st.px + dx * 8.6 * dt;
        const nz = st.pz + dz * 8.6 * dt;
        if (canStand(nx, nz)) { st.px = nx; st.pz = nz; }
        else if (canStand(nx, st.pz)) st.px = nx;
        else if (canStand(st.px, nz)) st.pz = nz;
        st.bobT += dt * 11;
      }

      // ── zone entry: banner + boss trigger ──
      for (let i = 0; i < 6; i++) {
        const inRoom = Math.abs(st.px) < ROOM_HW && Math.abs(st.pz - ZC[i]) < ROOM_HD;
        if (inRoom && !st.entered.has(i)) {
          st.entered.add(i);
          st.bannerT = 3.2;
          if (bannerRef.current) {
            bannerRef.current.textContent = `CHAPTER ${ROMAN[i]} · ${CHAPTERS[i].year} — ${CHAPTERS[i].org}`;
          }
        }
        if (i < 5 && inRoom && st.cleared === i && !st.fightActive && st.pz < ZC[i] + 7.5) {
          initFight(i);
        }
      }

      // ── the final meeting ──
      if (st.cleared >= 5) {
        const dAn = Math.hypot(st.px - 0, st.pz - ZC[5]);
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

      // ── fire ──
      const wp = WEAPONS[Math.min(st.cleared, WEAPONS.length - 1)];
      st.fireCd -= dt;
      if (st.firing && st.fireCd <= 0 && st.pb.length < MAX_PB - 6) {
        st.fireCd = 1 / wp.rate;
        st.muzzleT = 0.06;
        for (let i = 0; i < wp.shots; i++) {
          const off = wp.shots === 1 ? 0 : (i / (wp.shots - 1) - 0.5) * wp.spread * 0.55;
          const ya = st.yaw + off;
          const dx = -Math.sin(ya), dz = -Math.cos(ya);
          st.pb.push({
            x: st.px + dx * 0.7, y: 1.25, z: st.pz + dz * 0.7,
            vx: dx * 24, vy: 0, vz: dz * 24,
            dmg: wp.dmg, pierce: wp.pierce, dead: false,
          });
        }
      }

      if (st.fightActive) updBoss(dt);

      // ── player bullets ──
      for (const b of st.pb) {
        if (b.dead) continue;
        b.x += b.vx * dt; b.y += b.vy * dt; b.z += b.vz * dt;
        const range2 = (b.x - st.px) ** 2 + (b.z - st.pz) ** 2;
        if (range2 > 1600 || !insideWorld(b.x, b.z)) { b.dead = true; burst(b.x, b.z, 2, AMBER, 1.5, b.y); continue; }
        for (const m of st.minions) {
          if (m.dead) continue;
          const d3 = Math.sqrt((b.x - m.x) ** 2 + (b.y - 1.1) ** 2 + (b.z - m.z) ** 2);
          if (d3 < 0.6) {
            m.hp -= b.dmg;
            if (m.hp <= 0) { m.dead = true; burst(m.x, m.z, 8, AMBER, 4, 1.1); }
            if (b.pierce > 0) b.pierce--; else { b.dead = true; break; }
          }
        }
        if (b.dead) continue;
        if (st.fightActive && hitBoss(b)) { b.dead = true; continue; }
        // shooting Anshul is futile
        if (st.cleared >= 5 && Math.hypot(b.x - 0, b.z - ZC[5]) < 1.55 && b.y > 0 && b.y < 3.2) {
          floatTxt(IMMUNE_TEXTS[(Math.random() * IMMUNE_TEXTS.length) | 0], "#999999", b.x, b.z, 0.42, b.y);
          burst(b.x, b.z, 3, 0x777777, 2.5, b.y);
          b.dead = true;
        }
      }

      // ── enemy bullets ──
      for (const b of st.eb) {
        if (b.dead) continue;
        b.x += b.vx * dt; b.z += b.vz * dt;
        if (!insideWorld(b.x, b.z)) { b.dead = true; continue; }
        if (st.invuln <= 0 && Math.hypot(b.x - st.px, b.z - st.pz) < b.r + 0.38) {
          b.dead = true;
          st.php -= 9; st.invuln = 1;
          st.shake = 1;
          burst(st.px, st.pz, 10, REDC, 4, 1.2);
        }
      }

      for (const m of st.minions) {
        if (m.dead || st.invuln > 0) continue;
        if (Math.hypot(m.x - st.px, m.z - st.pz) < 0.7) {
          m.dead = true; st.php -= 12; st.invuln = 1; st.shake = 1.2; burst(st.px, st.pz, 10, REDC, 4, 1.2);
        }
      }

      if (st.fightActive && st.fightZone === 4) {
        for (const z of st.dzones) {
          if (z.warm <= 0 && Math.hypot(z.x - st.px, z.z - st.pz) < 1.9) st.php -= 18 * dt;
        }
      }

      if (st.fightActive && st.invuln <= 0 && Math.hypot(st.bossX - st.px, st.bossZ - st.pz) < 1.9) {
        st.php -= 14; st.invuln = 1.1; st.shake = 1.3; burst(st.px, st.pz, 12, REDC, 5, 1.2);
      }

      st.pb = st.pb.filter(b => !b.dead);
      st.eb = st.eb.filter(b => !b.dead);
      st.minions = st.minions.filter(m => !m.dead);

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
        burst(st.bossX, st.bossZ, 60, AMBER, 8, 1.5);
        burst(st.bossX, st.bossZ, 40, 0xffffff, 5, 1.5);
        document.exitPointerLock();
      }
    }

    function insideWorld(x: number, z: number): boolean {
      for (const r of ROOMS) if (x > r.x1 - 1 && x < r.x2 + 1 && z > r.z1 - 1 && z < r.z2 + 1) return true;
      for (const c of CORRS) if (x > c.x1 - 1 && x < c.x2 + 1 && z > c.z1 - 1 && z < c.z2 + 1) return true;
      return false;
    }

    // ── Visual sync ────────────────────────────────────────────────────────
    const camPos = new THREE.Vector3();
    const camLook = new THREE.Vector3();
    const tmpA = new THREE.Vector3();
    const tmpB = new THREE.Vector3();

    function syncVisuals() {
      // character — faces movement direction while running, camera direction while firing/idle
      player.position.set(st.px, 0, st.pz);
      if (st.moving && !st.firing) {
        let mx = 0, mz = 0;
        if (st.keys.has("w") || st.keys.has("arrowup")) mz += 1;
        if (st.keys.has("s") || st.keys.has("arrowdown")) mz -= 1;
        if (st.keys.has("a") || st.keys.has("arrowleft")) mx -= 1;
        if (st.keys.has("d") || st.keys.has("arrowright")) mx += 1;
        const fx = -Math.sin(st.yaw), fz = -Math.cos(st.yaw);
        const rx = -fz, rz = fx;
        const dx = fx * mz + rx * mx, dz = fz * mz + rz * mx;
        if (dx || dz) player.rotation.y = Math.atan2(dx, dz) + Math.PI;
      } else {
        player.rotation.y = st.yaw + Math.PI;
      }
      player.position.y = st.moving ? Math.abs(Math.sin(st.bobT)) * 0.07 : 0;
      player.visible = !(st.invuln > 0 && ((st.t * 14) | 0) % 2 === 0) && st.deadT < 0;
      muzzleMat.opacity = st.muzzleT > 0 ? 0.9 : 0;

      // bullets
      let n = 0;
      for (const b of st.pb) { m4.setPosition(b.x, b.y, b.z); pbMesh.setMatrixAt(n++, m4); }
      pbMesh.count = n; pbMesh.instanceMatrix.needsUpdate = true;
      n = 0;
      for (const b of st.eb) { m4.setPosition(b.x, EB_Y, b.z); ebMesh.setMatrixAt(n++, m4); }
      ebMesh.count = n; ebMesh.instanceMatrix.needsUpdate = true;

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

      for (let i = 0; i < MINN; i++) {
        const m = st.minions[i];
        const sp = minionVis[i];
        if (m && !m.dead) {
          sp.visible = true;
          sp.position.set(m.x, 1.1, m.z);
          (sp.material as THREE.SpriteMaterial).color.setHex(m.diving ? REDC : AMBER);
        } else sp.visible = false;
      }

      for (let i = 0; i < 3; i++) {
        const z = st.dzones[i];
        const v = zoneVis[i];
        if (z && st.fightActive && st.fightZone === 4) {
          v.g.visible = true;
          v.g.position.set(z.x, 0, z.z);
          if (z.warm > 0) { v.fill.opacity = 0.04; v.rim.opacity = 0.4 + Math.sin(st.t * 12) * 0.3; }
          else { v.fill.opacity = 0.16; v.rim.opacity = 0.8; }
        } else v.g.visible = false;
      }

      // gates
      gates.forEach((g, i) => {
        const openGate = st.cleared >= i + 1;
        g.g.visible = !openGate;
        if (!openGate) g.plane.opacity = 0.1 + Math.sin(st.t * 3 + i) * 0.05;
      });

      // ── bosses ──
      for (let zi = 0; zi < 6; zi++) {
        const v = bossVis[zi];
        const defeated = zi < 5 && st.cleared > zi;
        const activeFight = st.fightActive && st.fightZone === zi;
        if (defeated) {
          v.group.visible = false;
          v.shields?.forEach(s => (s.visible = false));
          v.ghosts?.forEach(g => (g.visible = false));
          if (v.hash) v.hash.visible = false;
          if (v.pin) v.pin.visible = false;
          v.mods?.forEach(m => (m.visible = false));
          continue;
        }
        v.group.visible = true;
        const oz = ZC[zi];
        const bx = activeFight ? st.bossX : 0;
        const bz = activeFight ? st.bossZ : (zi === 5 ? oz : oz - 2);
        if (zi !== 3) v.group.position.set(bx, 0, bz);

        const pulse = 1 + (activeFight && st.bossPulse > 0 ? st.bossPulse * 0.5 : 0);
        v.group.scale.setScalar(pulse);
        if (activeFight && st.vicT >= 0) v.group.scale.setScalar(Math.max(0.01, st.vicT / 1.5));

        if (zi === 0) {
          v.slabEdges!.forEach(e => (e.material as THREE.LineBasicMaterial).color.setHex(activeFight && st.vented ? AMBER : 0x4a3828));
          if (v.vent) (v.vent.material as THREE.MeshBasicMaterial).opacity = activeFight && st.vented ? 0.25 + Math.sin(st.t * 10) * 0.12 : 0;
          v.group.rotation.y = Math.sin(st.t * 0.7) * 0.08;
        } else if (zi === 1) {
          const open = activeFight && st.shieldSt.every(s => !s.alive);
          if (v.faceEdges) (v.faceEdges.material as THREE.LineBasicMaterial).color.setHex(open ? AMBER : 0x4a3828);
          if (v.check) (v.check.material as THREE.SpriteMaterial).map = textTexture(open ? "☑" : "☐", open ? "#ffb000" : "#c8b08a", 56);
          v.group.rotation.y = Math.atan2(st.px - bx, st.pz - bz);
          const firstAlive = activeFight ? st.shieldSt.findIndex(s => s.alive) : -2;
          v.shields!.forEach((sp, i) => {
            const aliveNow = activeFight ? st.shieldSt[i]?.alive : true;
            if (!aliveNow) { sp.visible = false; return; }
            sp.visible = true;
            const ang = (activeFight ? st.shieldSt[i].ang : (i / 5) * Math.PI * 2) + st.t * (activeFight ? 1 : 0.4);
            sp.position.set(bx + Math.cos(ang) * 2.6, 1.4, bz + Math.sin(ang) * 2.6);
            (sp.material as THREE.SpriteMaterial).color.setHex(i === firstAlive ? AMBER : 0x555555);
            sp.scale.setScalar(0.85 * (i === firstAlive ? 1 + Math.sin(st.t * 6) * 0.1 : 0.8));
          });
        } else if (zi === 2) {
          v.deco!.forEach((sp, i) => {
            const a = (i / 10) * Math.PI * 2 + st.t;
            const rr = 0.7 + Math.sin(st.t * 3 + i) * 0.4;
            sp.position.set(Math.cos(a) * rr, 1.5 + Math.sin(st.t * 2 + i) * 0.4, Math.sin(a) * rr);
          });
        } else if (zi === 3) {
          if (activeFight) {
            v.ghosts!.forEach((g, i) => {
              const gh = st.ghosts[i];
              if (!gh) { g.visible = false; return; }
              g.visible = true;
              g.position.set(gh.x, 0, gh.z);
              g.rotation.y = st.t * (0.6 + i * 0.2);
              g.rotation.x = st.t * 0.3;
              const real = i === st.realIdx;
              g.children.forEach(c => {
                const mm = (c as THREE.Mesh).material as THREE.MeshBasicMaterial;
                if (mm.wireframe) mm.opacity = real ? 1 : 0.22 + Math.random() * 0.08;
                else mm.opacity = real ? 0.16 : 0.04;
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
                v.hash.position.set(st.ghosts[st.realIdx].x, 0.5, st.ghosts[st.realIdx].z + 1.7);
              }
            }
          } else {
            // idle: one polyhedron at rest
            v.ghosts!.forEach((g, i) => {
              g.visible = i === 0;
              if (i === 0) { g.position.set(0, 0, oz - 2); g.rotation.y = st.t * 0.4; g.rotation.x = st.t * 0.2; }
            });
            if (v.hash) v.hash.visible = false;
            if (v.pin) v.pin.visible = false;
          }
          // ghost zone name sprite rides on group — place group for the label
          v.group.visible = true;
          v.group.position.set(0, 0, oz - 2);
        } else if (zi === 4) {
          const exposed = activeFight && !st.modSt.some(m => m.alive);
          if (v.coreEdge) (v.coreEdge.material as THREE.LineBasicMaterial).color.setHex(exposed ? AMBER : REDC);
          v.group.rotation.y = st.t * 0.5;
          v.mods!.forEach((mg, i) => {
            const aliveNow = activeFight ? st.modSt[i]?.alive : true;
            if (!aliveNow) { mg.visible = false; return; }
            mg.visible = true;
            const ang = (activeFight ? st.modSt[i].ang : (i / 4) * Math.PI * 2 + st.t * 0.15);
            mg.position.set(bx + Math.cos(ang) * 5, 0.6, bz + Math.sin(ang) * 5);
            mg.rotation.y = -ang;
          });
        } else {
          // Anshul waits at the end
          v.group.position.y = Math.sin(st.t * 2) * 0.08;
          v.group.rotation.y = Math.atan2(st.px - bx, st.pz - bz);
          if (v.screen) v.screen.opacity = 0.5 + Math.sin(st.t * 8) * 0.25;
          if (v.aura) v.aura.opacity = 0.1 + Math.sin(st.t * 3) * 0.06;
          if (st.cineT >= 0 && v.screen) v.screen.opacity = 1;
        }
      }

      // ── camera: third person orbit ──
      const cosP = Math.cos(st.pitch), sinP = Math.sin(st.pitch);
      const dist = 5.4;
      camPos.set(
        st.px + Math.sin(st.yaw) * cosP * dist,
        1.5 + sinP * dist,
        st.pz + Math.cos(st.yaw) * cosP * dist
      );
      const fx = -Math.sin(st.yaw), fz = -Math.cos(st.yaw);
      camLook.set(st.px + fx * 2.2, 1.55, st.pz + fz * 2.2);

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
        tmpA.set(3.4, 2.2, ZC[5] + 5.2);
        tmpB.set(0, 1.6, ZC[5]);
        camPos.lerpVectors(camPos, tmpA, e);
        camLook.lerpVectors(camLook, tmpB, e);
      }
      if (st.shake > 0) {
        camPos.x += (Math.random() - 0.5) * st.shake * 0.22;
        camPos.y += (Math.random() - 0.5) * st.shake * 0.16;
      }
      camera.position.copy(camPos);
      camera.lookAt(camLook);

      // ── HUD ──
      if (hpFillRef.current) {
        const f = Math.max(0, st.php) / 100;
        hpFillRef.current.style.width = `${f * 100}%`;
        hpFillRef.current.style.background = f > 0.5 ? "#4ade80" : f > 0.25 ? "#ffb000" : "#ff5555";
      }
      if (bossWrapRef.current) bossWrapRef.current.style.opacity = st.fightActive ? "1" : "0";
      if (bossFillRef.current && st.fightActive) {
        bossFillRef.current.style.width = `${Math.max(0, st.bossHp / st.bossMax) * 100}%`;
      }
      if (noteRef.current) noteRef.current.style.opacity = String(Math.max(0, Math.min(1, st.noteT)));
      if (flashRef.current) flashRef.current.style.opacity = String(Math.max(0, (st.invuln - 0.45)) * 0.5);
      if (blackRef.current) blackRef.current.style.opacity = String(st.blackT);
      if (introRef.current) introRef.current.style.opacity = st.introT > 0.25 && st.fightActive ? "1" : "0";
      if (crossRef.current) crossRef.current.style.opacity = st.locked && st.cineT < 0 && st.introT <= 0 ? "1" : "0";
      if (lockHintRef.current) lockHintRef.current.style.opacity = !st.locked && !seqActive() && !pausedRef.current ? "1" : "0";
      if (bannerRef.current) bannerRef.current.style.opacity = st.bannerT > 0.4 ? "1" : "0";
      if (promptRef.current) promptRef.current.style.opacity = st.canOffer && st.cineT < 0 ? "1" : "0";
      if (weaponRef.current) weaponRef.current.textContent = WEAPONS[Math.min(st.cleared, WEAPONS.length - 1)].name;
      if (zoneRef.current) {
        const zi = Math.max(0, Math.min(5, Math.round(-st.pz / ZONE_GAP)));
        const dots = Array.from({ length: 6 }, (_, i) => (i < st.cleared ? "◆" : i === 5 ? "☠" : "◇")).join(" ");
        zoneRef.current.textContent = `${dots}   zone ${ROMAN[zi]} — ${CHAPTERS[zi].bossName}`;
      }
      if (objRef.current) {
        objRef.current.textContent = st.fightActive
          ? `defeat ${CHAPTERS[st.fightZone].bossName}`
          : st.cleared >= 5
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
      }
      syncVisuals();
      renderer.render(scene, camera);
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
      for (const d of disposables) d.dispose();
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
          <span className="absolute left-1/2 top-0 w-px h-[7px] bg-accent -translate-x-1/2" />
          <span className="absolute left-1/2 bottom-0 w-px h-[7px] bg-accent -translate-x-1/2" />
          <span className="absolute top-1/2 left-0 h-px w-[7px] bg-accent -translate-y-1/2" />
          <span className="absolute top-1/2 right-0 h-px w-[7px] bg-accent -translate-y-1/2" />
          <span className="absolute left-1/2 top-1/2 w-[2px] h-[2px] bg-accent -translate-x-1/2 -translate-y-1/2" />
        </div>
      </div>

      <div ref={lockHintRef} className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 pointer-events-none" style={{ opacity: 0 }}>
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent border border-amber-500/40 bg-[#0d0a08]/80 px-6 py-3 animate-pulse">
          click to take control
        </p>
      </div>

      {/* zone banner */}
      <div
        ref={bannerRef}
        className="absolute top-[18%] inset-x-0 text-center font-display text-3xl text-accent pointer-events-none transition-opacity duration-700"
        style={{ opacity: 0, textShadow: "0 0 24px rgba(255,176,0,0.35)" }}
      />

      {/* E prompt */}
      <div ref={promptRef} className="absolute bottom-[22%] inset-x-0 flex justify-center pointer-events-none transition-opacity duration-300" style={{ opacity: 0 }}>
        <p className="font-mono text-[12px] uppercase tracking-[0.25em] text-green-400 border border-green-500/50 bg-[#0d0a08]/85 px-5 py-2.5 animate-pulse">
          [ E ] extend the job offer
        </p>
      </div>

      {/* HUD */}
      <div ref={zoneRef} className="absolute top-2.5 left-4 font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-500 pointer-events-none" />
      <div ref={bossWrapRef} className="absolute top-2.5 inset-x-0 flex flex-col items-center pointer-events-none transition-opacity duration-300" style={{ opacity: 0 }}>
        <p ref={bossNameRef} className="font-mono text-[10px] font-bold tracking-[0.25em] text-[#c8b08a] mb-1.5" />
        <div className="w-[340px] max-w-[50vw] h-[7px] bg-[#241a10] border border-black/40">
          <div ref={bossFillRef} className="h-full" style={{ width: "100%", background: "#ffb000" }} />
        </div>
      </div>
      <div ref={noteRef} className="absolute top-16 inset-x-0 text-center font-mono text-[12px] font-bold text-[#ffc43c] pointer-events-none px-8" style={{ opacity: 0, textShadow: "0 0 12px rgba(255,176,0,0.5)" }} />
      <div className="absolute bottom-3 left-4 pointer-events-none">
        <p className="font-mono text-[8px] uppercase tracking-[0.25em] text-zinc-600 mb-1">HP</p>
        <div className="w-[150px] h-[8px] bg-[#241a10] border border-black/40">
          <div ref={hpFillRef} className="h-full" style={{ width: "100%", background: "#4ade80" }} />
        </div>
      </div>
      <div ref={weaponRef} className="absolute bottom-3 right-4 font-mono text-[10px] font-bold tracking-[0.2em] text-accent pointer-events-none" />
      <div ref={objRef} className="absolute bottom-3 inset-x-0 text-center font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-600 pointer-events-none" />

      {/* boss intro splash */}
      <div ref={introRef} className="absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-500 pointer-events-none" style={{ opacity: 0 }}>
        <div className="absolute top-0 inset-x-0 h-[12%] bg-black/80" />
        <div className="absolute bottom-0 inset-x-0 h-[12%] bg-black/80" />
        <p className="font-mono text-[10px] uppercase tracking-[0.5em] text-red-400 mb-3 animate-pulse">⚠ warning ⚠</p>
        <h3 ref={introNameRef} className="font-display text-5xl md:text-6xl text-accent mb-2" style={{ textShadow: "0 0 30px rgba(255,176,0,0.4)" }} />
        <p ref={introSubRef} className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500" />
      </div>
    </div>
  );
}
