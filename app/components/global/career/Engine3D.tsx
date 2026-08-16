"use client";

import * as THREE from "three";
import { useEffect, useRef } from "react";
import { CHAPTERS, WEAPONS, GLYPHS, IMMUNE_TEXTS, ANSHUL_TAUNTS } from "./data";

// First-person boss arena. 1 unit ≈ 30px of the original 2D layout.
const AR_X = 15.5; // half-width
const AR_Z = 8.8;  // half-depth
const RW = 960, RH = 540;
const EYE = 1.55;

const AMBER = 0xffb000;
const AMBER_HI = 0xffcf60;
const REDC = 0xff5555;
const GREENC = 0x4ade80;
const DARK = 0x1c1512;

interface Props {
  chapter: number;
  paused: boolean;
  onEvent: (e: "victory" | "dead" | "cine" | "ending" | "pause") => void;
}

interface PB { x: number; y: number; z: number; vx: number; vy: number; vz: number; dmg: number; pierce: number; dead: boolean }
interface EB { x: number; z: number; vx: number; vz: number; r: number; dead: boolean }
interface MinionS { x: number; z: number; vx: number; vz: number; hp: number; t: number; ang: number; diving: boolean; dead: boolean; si: number }
interface Part { x: number; y: number; z: number; vx: number; vy: number; vz: number; t: number; max: number; r: number; g: number; b: number }

export default function Engine3D({ chapter, paused, onEvent }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(paused);
  const onEventRef = useRef(onEvent);
  pausedRef.current = paused;
  onEventRef.current = onEvent;

  // HUD refs
  const hpFillRef = useRef<HTMLDivElement>(null);
  const bossFillRef = useRef<HTMLDivElement>(null);
  const noteRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const crossRef = useRef<HTMLDivElement>(null);
  const lockHintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const ch = chapter;
    const tier = Math.min(ch, WEAPONS.length - 1);
    const wp = WEAPONS[tier];

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
    scene.fog = new THREE.Fog(0x0d0a08, 16, 46);

    const camera = new THREE.PerspectiveCamera(72, RW / RH, 0.05, 120);
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

    // ── Arena ──────────────────────────────────────────────────────────────
    const ground = new THREE.Mesh(track(new THREE.PlaneGeometry(90, 60)), bmat(0x0b0908));
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.02;
    scene.add(ground);

    const grid = new THREE.GridHelper(64, 64, 0x3a2a18, 0x211710);
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.55;
    scene.add(grid);

    // arena walls — dark slabs with amber rims so the space reads in first person
    const wallH = 2.4;
    const mkWall = (w: number, d: number, x: number, z: number) => {
      const geo = track(new THREE.BoxGeometry(w, wallH, d));
      const mesh = new THREE.Mesh(geo, bmat(0x0f0c0a));
      mesh.position.set(x, wallH / 2, z);
      const e = edgesOf(geo, AMBER, 0.35);
      e.position.copy(mesh.position);
      scene.add(mesh, e);
    };
    mkWall(AR_X * 2 + 1, 0.5, 0, -AR_Z - 0.25);
    mkWall(AR_X * 2 + 1, 0.5, 0, AR_Z + 0.25);
    mkWall(0.5, AR_Z * 2 + 1, -AR_X - 0.25, 0);
    mkWall(0.5, AR_Z * 2 + 1, AR_X + 0.25, 0);
    const postGeo = track(new THREE.CylinderGeometry(0.09, 0.09, 3.4, 6));
    for (const [px2, pz2] of [[-AR_X, -AR_Z], [AR_X, -AR_Z], [AR_X, AR_Z], [-AR_X, AR_Z]] as [number, number][]) {
      const post = new THREE.Mesh(postGeo, bmat(AMBER, { transparent: true, opacity: 0.85 }));
      post.position.set(px2, 1.7, pz2);
      scene.add(post);
    }

    // distant monoliths for depth
    for (let i = 0; i < 9; i++) {
      const h = 4 + Math.random() * 9;
      const geo = track(new THREE.BoxGeometry(1.4 + Math.random() * 2, h, 1.4 + Math.random() * 2));
      const ang = (i / 9) * Math.PI * 2 + Math.random() * 0.4;
      const dist = 26 + Math.random() * 12;
      const e = edgesOf(geo, 0x4a3520, 0.5);
      e.position.set(Math.cos(ang) * dist, h / 2, Math.sin(ang) * dist);
      scene.add(e);
    }

    // floating dust
    {
      const n = 240;
      const pos = new Float32Array(n * 3);
      for (let i = 0; i < n; i++) {
        pos[i * 3] = (Math.random() - 0.5) * 70;
        pos[i * 3 + 1] = Math.random() * 12 + 0.5;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 50;
      }
      const g = track(new THREE.BufferGeometry());
      g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      const ptsm = track(new THREE.PointsMaterial({ color: 0x6a5030, size: 0.09, transparent: true, opacity: 0.6, depthWrite: false }));
      const pts = new THREE.Points(g, ptsm);
      pts.frustumCulled = false;
      scene.add(pts);
    }

    // ── Viewmodel gun ──────────────────────────────────────────────────────
    const gun = new THREE.Group();
    {
      const bodyGeo = track(new THREE.BoxGeometry(0.15, 0.15, 0.5));
      const body = new THREE.Mesh(bodyGeo, bmat(0x241c14));
      const bodyE = edgesOf(bodyGeo, AMBER, 0.8);
      const barrelGeo = track(new THREE.BoxGeometry(0.065, 0.065, 0.46));
      const barrel = new THREE.Mesh(barrelGeo, bmat(0x38281a));
      barrel.position.set(0, 0.035, -0.42);
      const barrelE = edgesOf(barrelGeo, AMBER, 0.5);
      barrelE.position.copy(barrel.position);
      gun.add(body, bodyE, barrel, barrelE);
    }
    gun.position.set(0.32, -0.27, -0.65);
    camera.add(gun);
    const muzzleMat = track(new THREE.SpriteMaterial({ map: textTexture("✦", "#ffcf60", 64), transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }));
    const muzzle = new THREE.Sprite(muzzleMat);
    muzzle.scale.setScalar(0.3);
    muzzle.position.set(0.32, -0.22, -1.05);
    camera.add(muzzle);

    // ── Bullets (instanced) ────────────────────────────────────────────────
    const MAX_PB = 160, MAX_EB = 340;
    const pbMesh = new THREE.InstancedMesh(track(new THREE.SphereGeometry(0.11, 8, 8)), bmat(AMBER_HI), MAX_PB);
    const ebMesh = new THREE.InstancedMesh(track(new THREE.SphereGeometry(0.17, 8, 8)), bmat(REDC), MAX_EB);
    pbMesh.frustumCulled = false; ebMesh.frustumCulled = false;
    pbMesh.count = 0; ebMesh.count = 0;
    scene.add(pbMesh, ebMesh);
    const m4 = new THREE.Matrix4();
    const EB_Y = 1.25; // enemy fire flies at chest height

    // ── Particles ──────────────────────────────────────────────────────────
    const MAXP = 500;
    const partPos = new Float32Array(MAXP * 3);
    const partCol = new Float32Array(MAXP * 3);
    const partGeo = track(new THREE.BufferGeometry());
    partGeo.setAttribute("position", new THREE.BufferAttribute(partPos, 3));
    partGeo.setAttribute("color", new THREE.BufferAttribute(partCol, 3));
    const partMat = track(new THREE.PointsMaterial({ size: 0.24, vertexColors: true, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false }));
    const partMesh = new THREE.Points(partGeo, partMat);
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

    // ── Floaters ───────────────────────────────────────────────────────────
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

    // ── Zones ──────────────────────────────────────────────────────────────
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

    // ── Minions ────────────────────────────────────────────────────────────
    const MINN = 8;
    const minionVis = Array.from({ length: MINN }, (_, i) => {
      const s = textSprite(GLYPHS[i % GLYPHS.length], "#ffffff", 0.8);
      s.visible = false;
      scene.add(s);
      return s;
    });

    // ── State ──────────────────────────────────────────────────────────────
    const st = {
      t: 0, introT: 2.6, vicT: -1, deadT: -1, cineT: -1, timeScale: 1,
      px: 0, pz: 6.5, php: 100, invuln: 1.4, fireCd: 0,
      yaw: 0, pitch: 0, locked: false, firing: false,
      gunKick: 0, muzzleT: 0, bobT: 0,
      keys: new Set<string>(),
      pb: [] as PB[], eb: [] as EB[], minions: [] as MinionS[],
      bossX: 0, bossZ: -4.3,
      bossHp: [300, 340, 380, 420, 500, 999][ch],
      bossMax: [300, 340, 380, 420, 500, 999][ch],
      shake: 0, bossPulse: 0,
      noteT: 0,
      vented: false, ventT: 4, cdA: 1.2, cdB: 3.5, cdC: 6, burstN: 0,
      shields: GLYPHS.slice(0, 5).map((g, i) => ({ ang: (i / 5) * Math.PI * 2, hp: 24, ch: g, alive: true })),
      openT: 0, spiralA: 0,
      ghosts: [] as { x: number; z: number }[], realIdx: 0, pinHits: 0, pinT: 0, shuffleT: 0,
      mods: ["auth", "api", "billing", "config"].map((label, i) => ({ ang: (i / 4) * Math.PI * 2, hp: 55, label, cd: 1 + i * 0.6, alive: true })),
      exposedT: 0,
      zones: [] as { x: number; z: number; warm: number; life: number }[],
      finalT: 0, tauntIdx: 0, offer: null as { x: number; z: number } | null, offerT: 0,
      fired: false,
    };
    // face the boss on spawn
    st.yaw = Math.atan2(-(st.bossX - st.px), -(st.bossZ - st.pz));

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

    // ── Boss visuals (same builds as before) ───────────────────────────────
    const bossGroup = new THREE.Group();
    scene.add(bossGroup);
    let slabEdges: THREE.LineSegments[] = [];
    let ventMesh: THREE.Mesh | null = null;
    let faceEdges: THREE.LineSegments | null = null;
    let checkSprite: THREE.Sprite | null = null;
    let shieldSprites: THREE.Sprite[] = [];
    let coreSprite: THREE.Sprite | null = null;
    let decoSprites: THREE.Sprite[] = [];
    let ghostGroups: THREE.Group[] = [];
    let hashSprite: THREE.Sprite | null = null;
    let pinRing: THREE.Mesh | null = null;
    let coreEdge: THREE.LineSegments | null = null;
    let modGroups: { g: THREE.Group; edge: THREE.LineSegments }[] = [];
    let screenMat: THREE.MeshBasicMaterial | null = null;
    let auraMat: THREE.MeshBasicMaterial | null = null;
    const offerGroup = new THREE.Group();
    offerGroup.visible = false;
    scene.add(offerGroup);

    if (ch === 0) {
      for (let i = 0; i < 5; i++) {
        const geo = track(new THREE.BoxGeometry(4 - i * 0.27, 0.85, 2.3));
        const slab = new THREE.Mesh(geo, bmat(DARK));
        slab.position.y = 0.46 + i * 0.9;
        const e = edgesOf(geo, 0x4a3828);
        e.position.y = slab.position.y;
        bossGroup.add(slab, e);
        slabEdges.push(e);
      }
      ventMesh = new THREE.Mesh(track(new THREE.BoxGeometry(2.6, 1.9, 2.45)), bmat(AMBER, { transparent: true, opacity: 0.0 }));
      ventMesh.position.y = 1.8;
      bossGroup.add(ventMesh);
      const db = textSprite("DB", "#8a7050", 0.55);
      db.position.y = 5.1;
      bossGroup.add(db);
    } else if (ch === 1) {
      const faceGeo = track(new THREE.BoxGeometry(2.5, 2.5, 0.55));
      const face = new THREE.Mesh(faceGeo, bmat(DARK));
      face.position.y = 1.6;
      faceEdges = edgesOf(faceGeo, 0x4a3828);
      faceEdges.position.y = 1.6;
      const label = textSprite("I'M NOT A ROBOT", "#c8b08a", 0.34);
      label.position.set(0, 2.15, 0.4);
      checkSprite = textSprite("☐", "#c8b08a", 0.6);
      checkSprite.position.set(0, 1.2, 0.4);
      bossGroup.add(face, faceEdges, label, checkSprite);
      shieldSprites = st.shields.map(s => {
        const sp = textSprite(s.ch, "#ffffff", 0.85);
        sp.position.y = 1.4;
        scene.add(sp);
        return sp;
      });
    } else if (ch === 2) {
      coreSprite = textSprite("�", "#ffffff", 2.0);
      coreSprite.position.y = 1.5;
      bossGroup.add(coreSprite);
      decoSprites = Array.from({ length: 10 }, (_, i) => {
        const sp = textSprite(GLYPHS[i % GLYPHS.length], i % 3 === 0 ? "#ff5555" : "#ffb000", 0.55);
        bossGroup.add(sp);
        return sp;
      });
    } else if (ch === 3) {
      ghostGroups = [0, 1, 2].map(() => {
        const g = new THREE.Group();
        const outer = new THREE.Mesh(track(new THREE.IcosahedronGeometry(1.35, 0)), bmat(AMBER, { wireframe: true, transparent: true, opacity: 1 }));
        outer.position.y = 1.5;
        const inner = new THREE.Mesh(track(new THREE.IcosahedronGeometry(0.72, 0)), bmat(AMBER, { transparent: true, opacity: 0.14 }));
        inner.position.y = 1.5;
        g.add(outer, inner);
        scene.add(g);
        return g;
      });
      hashSprite = textSprite("sha256: a3f9…", "#ffb000", 0.3);
      scene.add(hashSprite);
      pinRing = new THREE.Mesh(track(new THREE.RingGeometry(1.7, 1.85, 32)), bmat(GREENC, { transparent: true, opacity: 0.8, side: THREE.DoubleSide }));
      pinRing.rotation.x = -Math.PI / 2;
      pinRing.position.y = 0.04;
      pinRing.visible = false;
      scene.add(pinRing);
      bossGroup.visible = false;
    } else if (ch === 4) {
      const coreGeo = track(new THREE.IcosahedronGeometry(1.4, 1));
      const core = new THREE.Mesh(coreGeo, bmat(0x140e0c));
      core.position.y = 1.6;
      coreEdge = new THREE.LineSegments(track(new THREE.WireframeGeometry(coreGeo)), lmat(REDC, 0.9));
      coreEdge.position.y = 1.6;
      const lbl = textSprite("DRIFT", "#ff5555", 0.4);
      lbl.position.y = 3.4;
      bossGroup.add(core, coreEdge, lbl);
      modGroups = st.mods.map(mo => {
        const g = new THREE.Group();
        const geo = track(new THREE.BoxGeometry(1.6, 0.75, 1.0));
        const box = new THREE.Mesh(geo, bmat(0x140e0c));
        const edge = edgesOf(geo, REDC);
        const lb = textSprite(mo.label, "#ff5555", 0.34);
        lb.position.y = 0.85;
        g.add(box, edge, lb);
        g.position.y = 0.6;
        scene.add(g);
        return { g, edge };
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
      screenMat = bmat(AMBER, { transparent: true, opacity: 0.7 });
      const screen = new THREE.Mesh(track(new THREE.PlaneGeometry(1.32, 0.62)), screenMat);
      screen.position.set(0, 1.5, 1.1);
      screen.rotation.x = -0.5;
      const name = textSprite("ANSHUL PATIL", "#ffb000", 0.5);
      name.position.y = 3.6;
      const sub = textSprite("FULL-STACK DEVELOPER · FINAL BOSS", "#8a7050", 0.26);
      sub.position.y = 3.15;
      auraMat = bmat(AMBER, { transparent: true, opacity: 0.15, side: THREE.DoubleSide });
      const aura = new THREE.Mesh(track(new THREE.RingGeometry(1.6, 1.85, 40)), auraMat);
      aura.rotation.x = -Math.PI / 2;
      aura.position.y = 0.03;
      bossGroup.add(head, headE, body, bodyE, laptop, lapE, screen, name, sub, aura);

      const envGeo = track(new THREE.BoxGeometry(0.95, 0.6, 0.09));
      const env = new THREE.Mesh(envGeo, bmat(0x10160f));
      env.position.y = 0.95;
      const envE = edgesOf(envGeo, GREENC);
      envE.position.y = 0.95;
      const ring = new THREE.Mesh(track(new THREE.RingGeometry(0.95, 1.08, 32)), bmat(GREENC, { transparent: true, opacity: 0.6, side: THREE.DoubleSide }));
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.04;
      const olbl = textSprite("[ JOB OFFER ]", "#4ade80", 0.34);
      olbl.position.y = 1.7;
      const olbl2 = textSprite("DELIVER IT", "#4ade80", 0.26);
      olbl2.position.y = 2.05;
      offerGroup.add(env, envE, ring, olbl, olbl2);
    }

    // ── Input: pointer lock FPS controls ───────────────────────────────────
    const seqActive = () => st.vicT >= 0 || st.deadT >= 0 || st.cineT >= 0;

    const onLockChange = () => {
      st.locked = document.pointerLockElement === canvas;
      if (!st.locked && st.introT <= 0 && !seqActive() && !pausedRef.current) {
        // player pressed Esc — browser released the lock
        onEventRef.current("pause");
      }
    };
    const onCanvasClick = () => {
      if (!st.locked && st.introT <= 0 && !seqActive() && !pausedRef.current) {
        canvas.requestPointerLock();
      }
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!st.locked) return;
      st.yaw -= e.movementX * 0.0022;
      st.pitch = Math.max(-1.35, Math.min(1.35, st.pitch - e.movementY * 0.0022));
    };
    const onDown = (e: MouseEvent) => { if (st.locked && e.button === 0) st.firing = true; };
    const onUp = () => { st.firing = false; };
    const onKeyDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(k)) st.keys.add(k);
    };
    const onKeyUp = (e: KeyboardEvent) => st.keys.delete(e.key.toLowerCase());

    document.addEventListener("pointerlockchange", onLockChange);
    canvas.addEventListener("click", onCanvasClick);
    document.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    // ── Boss updates (identical mechanics) ─────────────────────────────────
    function updBoss(dt: number) {
      if (ch === 0) {
        st.bossX = Math.sin(st.t * 0.5) * 4.7;
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
      } else if (ch === 1) {
        st.bossX = Math.sin(st.t * 0.7) * 6;
        st.bossZ = -4.3 + Math.sin(st.t * 1.4) * 1.1;
        const alive = st.shields.filter(s => s.alive);
        if (alive.length === 0) {
          if (st.openT <= 0) { st.openT = 6; note("GATE OPEN", 1.4); }
          st.openT -= dt;
          if (st.openT <= 0) { st.shields.forEach(s => { s.alive = true; s.hp = 24; }); note("SHIELDS RESTORED", 1.2); }
        }
        st.cdA -= dt;
        if (st.cdA <= 0) {
          st.cdA = 1.5;
          for (let i = 0; i < 3; i++) aimShot(st.bossX, st.bossZ, 6.3, 0.2, (i - 1) * 0.14);
        }
        st.cdB -= dt;
        if (st.cdB <= 0) { st.cdB = 4.4; ringShot(st.bossX, st.bossZ, 12, 4.3, st.t); }
      } else if (ch === 2) {
        st.cdC -= dt;
        if (st.cdC <= 0) { st.cdC = 2; st.bossX = (Math.random() - 0.5) * 12; st.bossZ = -5 + Math.random() * 3; burst(st.bossX, st.bossZ, 8, AMBER, 3, 1.5); }
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
          st.minions.push({ x: st.bossX, z: st.bossZ, vx: 0, vz: 0, hp: 10, t: 0, ang: Math.random() * Math.PI * 2, diving: false, dead: false, si: -1 });
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
            if (Math.abs(m.x) > AR_X + 2 || Math.abs(m.z) > AR_Z + 2) m.dead = true;
          }
        }
      } else if (ch === 3) {
        if (st.pinT > 0) {
          st.pinT -= dt;
          st.ghosts = [{ x: 0, z: -4.3 }];
          st.realIdx = 0;
          st.bossX = 0; st.bossZ = -4.3;
          if (st.pinT <= 0) { st.pinHits = 0; st.shuffleT = 0; }
          return;
        }
        st.shuffleT -= dt;
        if (st.shuffleT <= 0 || st.ghosts.length < 3) {
          st.shuffleT = 3;
          const base = st.t * 0.4;
          const old = st.ghosts[st.realIdx] || { x: 0, z: -4.3 };
          st.ghosts = [0, 1, 2].map(i => ({
            x: Math.cos(base + (i / 3) * Math.PI * 2) * 5.6,
            z: -4.3 + Math.sin(base + (i / 3) * Math.PI * 2) * 2.1,
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
      } else if (ch === 4) {
        st.bossX = Math.sin(st.t * 0.6) * 3;
        st.bossZ = -4.16 + Math.cos(st.t * 0.8) * 0.87;
        const anyMod = st.mods.some(m => m.alive);
        if (!anyMod) {
          if (st.exposedT <= 0) { st.exposedT = 8; note("CORE EXPOSED", 1.5); }
          st.exposedT -= dt;
          if (st.exposedT <= 0) { st.mods.forEach(m => { m.alive = true; m.hp = 55; }); note("MODULES REDEPLOYED", 1.4); }
        }
        for (const mo of st.mods) {
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
          st.zones = Array.from({ length: 3 }, () => ({
            x: Math.max(-AR_X + 2, Math.min(AR_X - 2, st.px + (Math.random() - 0.5) * 17)),
            z: Math.max(-AR_Z + 2, Math.min(AR_Z - 2, st.pz + (Math.random() - 0.5) * 13)),
            warm: 1, life: 4,
          }));
        }
        for (const z of st.zones) { if (z.warm > 0) z.warm -= dt; else z.life -= dt; }
        st.zones = st.zones.filter(z => z.life > 0);
        st.cdB -= dt;
        if (st.cdB <= 0) { st.cdB = 5; ringShot(st.bossX, st.bossZ, 16, 4, st.t); }
      } else {
        st.finalT += dt;
        st.bossX = Math.sin(st.t * 0.5) * 4;
        st.bossZ = -4.3 + Math.sin(st.t * 1.1) * 0.6;
        st.cdC -= dt;
        if (st.cdC <= 0) {
          st.cdC = 5;
          note(`ANSHUL: "${ANSHUL_TAUNTS[st.tauntIdx % ANSHUL_TAUNTS.length]}"`, 3.4);
          st.tauntIdx++;
        }
        const phase = Math.floor(st.finalT / 10) % 4;
        st.cdA -= dt;
        if (st.cdA <= 0) {
          if (phase === 0) { st.cdA = 1.1; ringShot(st.bossX, st.bossZ, 12, 4.3, st.t); }
          else if (phase === 1) { st.cdA = 1.3; for (let i = 0; i < 3; i++) aimShot(st.bossX, st.bossZ, 6.7, 0.2, (i - 1) * 0.15); }
          else if (phase === 2) {
            st.cdA = 0.09;
            const a = (st.spiralA += 0.42);
            if (st.eb.length < MAX_EB - 2) st.eb.push({ x: st.bossX, z: st.bossZ, vx: Math.cos(a) * 4.7, vz: Math.sin(a) * 4.7, r: 0.17, dead: false });
          } else { st.cdA = 2; for (let k = -3; k <= 3; k++) aimShot(st.bossX, st.bossZ, 5.8, 0.17, k * 0.11); }
        }
        if (!st.offer && (st.finalT > 22 || st.php <= 45)) {
          st.offer = { x: (Math.random() - 0.5) * 22, z: 3 + Math.random() * 4 };
          note("WEAKNESS FOUND: he is open to opportunities. DELIVER THE JOB OFFER.", 5);
          offerGroup.position.set(st.offer.x, 0, st.offer.z);
          offerGroup.visible = true;
        }
        if (st.offer) st.offerT += dt;
      }
    }

    // ── Player-bullet hits (3D) ────────────────────────────────────────────
    function hitBoss(b: PB): boolean {
      // vertical body extents per boss for cylinder tests
      const bodyH = [4.8, 3.0, 3.0, 3.0, 3.2, 3.2][ch];
      if (ch === 5) {
        if (Math.hypot(b.x - st.bossX, b.z - st.bossZ) < 1.55 && b.y > 0 && b.y < bodyH) {
          floatTxt(IMMUNE_TEXTS[(Math.random() * IMMUNE_TEXTS.length) | 0], "#999999", b.x, b.z, 0.42, b.y);
          burst(b.x, b.z, 3, 0x777777, 2.5, b.y);
          return true;
        }
        return false;
      }
      if (ch === 1) {
        const anyShield = st.shields.some(s => s.alive);
        if (anyShield) {
          const firstAlive = st.shields.findIndex(q => q.alive);
          for (let i = 0; i < st.shields.length; i++) {
            const s = st.shields[i];
            if (!s.alive) continue;
            const sx = st.bossX + Math.cos(s.ang + st.t) * 2.6;
            const sz = st.bossZ + Math.sin(s.ang + st.t) * 2.6;
            const d3 = Math.sqrt((b.x - sx) ** 2 + (b.y - 1.4) ** 2 + (b.z - sz) ** 2);
            if (d3 < 0.62) {
              if (i === firstAlive) {
                s.hp -= b.dmg;
                burst(sx, sz, 4, AMBER, 3, 1.3);
                if (s.hp <= 0) { s.alive = false; floatTxt(s.ch + " ✓", "#4ade80", sx, sz); burst(sx, sz, 16, AMBER, 5, 1.3); }
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
      if (ch === 3 && st.pinT <= 0) {
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
      if (ch === 4) {
        for (const mo of st.mods) {
          if (!mo.alive) continue;
          const mx = st.bossX + Math.cos(mo.ang) * 5, mz = st.bossZ + Math.sin(mo.ang) * 5;
          const d3 = Math.sqrt((b.x - mx) ** 2 + (b.y - 0.98) ** 2 + (b.z - mz) ** 2);
          if (d3 < 0.85) {
            mo.hp -= b.dmg;
            burst(mx, mz, 3, REDC, 3, 1);
            if (mo.hp <= 0) { mo.alive = false; floatTxt(mo.label + " refactored", "#4ade80", mx, mz, 0.5, 1.4); burst(mx, mz, 18, AMBER, 5, 1); }
            return true;
          }
        }
      }
      const r = [2.3, 1.4, 1.5, 1.35, 1.55][ch] || 1.5;
      if (Math.hypot(b.x - st.bossX, b.z - st.bossZ) < r && b.y > 0 && b.y < bodyH) {
        let mult = 1;
        if (ch === 0) mult = st.vented ? 1 : 0.25;
        if (ch === 3) mult = st.pinT > 0 ? 2 : 1;
        if (ch === 4) mult = st.mods.some(m => m.alive) ? 0.2 : 1;
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
      if (st.gunKick > 0) st.gunKick = Math.max(0, st.gunKick - rdt * 6);
      if (st.muzzleT > 0) st.muzzleT -= rdt;

      if (st.vicT >= 0) {
        st.vicT -= rdt;
        if (st.vicT <= 0) onEventRef.current("victory");
        return;
      }
      if (st.deadT >= 0) {
        st.deadT -= rdt;
        if (st.deadT <= 0) onEventRef.current("dead");
        return;
      }
      if (st.cineT >= 0) {
        st.cineT += rdt;
        st.eb = []; st.pb = []; st.minions.forEach(m => (m.dead = true));
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
      if (!st.locked) return; // wait for pointer lock before gameplay runs

      if (st.invuln > 0) st.invuln -= dt;

      // movement relative to look direction
      let mx = 0, mz = 0;
      if (st.keys.has("w") || st.keys.has("arrowup")) mz += 1;
      if (st.keys.has("s") || st.keys.has("arrowdown")) mz -= 1;
      if (st.keys.has("a") || st.keys.has("arrowleft")) mx -= 1;
      if (st.keys.has("d") || st.keys.has("arrowright")) mx += 1;
      const moving = mx !== 0 || mz !== 0;
      if (moving) {
        const fx = -Math.sin(st.yaw), fz = -Math.cos(st.yaw);
        const rx = -fz, rz = fx;
        let dx = fx * mz + rx * mx, dz = fz * mz + rz * mx;
        const l = Math.hypot(dx, dz);
        dx /= l; dz /= l;
        st.px = Math.max(-AR_X + 0.6, Math.min(AR_X - 0.6, st.px + dx * 8.6 * dt));
        st.pz = Math.max(-AR_Z + 0.6, Math.min(AR_Z - 0.6, st.pz + dz * 8.6 * dt));
        st.bobT += dt * 11;
      }

      // fire along the camera ray
      st.fireCd -= dt;
      if (st.firing && st.fireCd <= 0 && st.pb.length < MAX_PB - 6) {
        st.fireCd = 1 / wp.rate;
        st.gunKick = 0.16;
        st.muzzleT = 0.06;
        const cp = Math.cos(st.pitch), sp2 = Math.sin(st.pitch);
        for (let i = 0; i < wp.shots; i++) {
          const off = wp.shots === 1 ? 0 : (i / (wp.shots - 1) - 0.5) * wp.spread * 0.55;
          const ya = st.yaw + off;
          const dx = -Math.sin(ya) * cp, dy = sp2, dz = -Math.cos(ya) * cp;
          st.pb.push({
            x: st.px + dx * 0.7, y: EYE - 0.12 + dy * 0.7, z: st.pz + dz * 0.7,
            vx: dx * 24, vy: dy * 24, vz: dz * 24,
            dmg: wp.dmg, pierce: wp.pierce, dead: false,
          });
        }
      }

      updBoss(dt);

      // player bullets
      for (const b of st.pb) {
        if (b.dead) continue;
        b.x += b.vx * dt; b.y += b.vy * dt; b.z += b.vz * dt;
        if (b.y <= 0) { b.dead = true; burst(b.x, b.z, 2, AMBER, 1.5, 0.1); continue; }
        if (b.y > 8 || Math.abs(b.x) > AR_X + 0.4 || Math.abs(b.z) > AR_Z + 0.4) { b.dead = true; burst(b.x, Math.max(-AR_Z, Math.min(AR_Z, b.z)), 2, AMBER, 1.5, b.y); continue; }
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
        if (hitBoss(b)) b.dead = true;
      }

      // enemy bullets (chest height, dodge by strafing)
      for (const b of st.eb) {
        if (b.dead) continue;
        b.x += b.vx * dt; b.z += b.vz * dt;
        if (Math.abs(b.x) > AR_X + 1 || Math.abs(b.z) > AR_Z + 1) { b.dead = true; continue; }
        if (st.invuln <= 0 && Math.hypot(b.x - st.px, b.z - st.pz) < b.r + 0.38) {
          b.dead = true;
          st.php -= 9; st.invuln = 1;
          st.shake = 1;
          burst(st.px, st.pz, 10, REDC, 4, 1.2);
        }
      }

      // minion contact
      for (const m of st.minions) {
        if (m.dead || st.invuln > 0) continue;
        if (Math.hypot(m.x - st.px, m.z - st.pz) < 0.7) {
          m.dead = true; st.php -= 12; st.invuln = 1; st.shake = 1.2; burst(st.px, st.pz, 10, REDC, 4, 1.2);
        }
      }

      // zones
      if (ch === 4) {
        for (const z of st.zones) {
          if (z.warm <= 0 && Math.hypot(z.x - st.px, z.z - st.pz) < 1.9) st.php -= 18 * dt;
        }
      }

      // boss contact
      if (st.invuln <= 0 && Math.hypot(st.bossX - st.px, st.bossZ - st.pz) < 1.9) {
        st.php -= 14; st.invuln = 1.1; st.shake = 1.3; burst(st.px, st.pz, 12, REDC, 5, 1.2);
      }

      // the offer
      if (ch === 5 && st.offer && Math.hypot(st.offer.x - st.px, st.offer.z - st.pz) < 1.15) {
        st.cineT = 0;
        st.timeScale = 1;
        st.shake = 0;
        if (!st.fired) { st.fired = true; onEventRef.current("cine"); }
        burst(st.offer.x, st.offer.z, 30, GREENC, 6, 1);
        offerGroup.visible = false;
        document.exitPointerLock();
      }

      st.pb = st.pb.filter(b => !b.dead);
      st.eb = st.eb.filter(b => !b.dead);
      st.minions = st.minions.filter(m => !m.dead);

      if (st.php <= 0) {
        st.php = 0;
        st.deadT = 1.0;
        st.timeScale = 0.3;
        burst(st.px, st.pz, 40, REDC, 7, 1.2);
        document.exitPointerLock();
        return;
      }
      if (ch < 5 && st.bossHp <= 0) {
        st.bossHp = 0;
        st.vicT = 1.5;
        st.timeScale = 0.22;
        st.shake = 2;
        burst(st.bossX, st.bossZ, 60, AMBER, 8, 1.5);
        burst(st.bossX, st.bossZ, 40, 0xffffff, 5, 1.5);
        document.exitPointerLock();
      }
    }

    // ── Visual sync ────────────────────────────────────────────────────────
    const camPos = new THREE.Vector3();
    const camLook = new THREE.Vector3();
    const tmpA = new THREE.Vector3();
    const tmpB = new THREE.Vector3();

    function syncVisuals() {
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

      // floaters
      for (const f of floaters) {
        if (!f.live) continue;
        f.t += 0.016;
        f.s.position.y += 0.022;
        f.m.opacity = Math.max(0, 1 - f.t / f.max);
        if (f.t >= f.max) { f.live = false; f.s.visible = false; }
      }

      // minions
      for (let i = 0; i < MINN; i++) {
        const m = st.minions[i];
        const sp = minionVis[i];
        if (m && !m.dead) {
          sp.visible = true;
          sp.position.set(m.x, 1.1, m.z);
          (sp.material as THREE.SpriteMaterial).color.setHex(m.diving ? REDC : AMBER);
        } else sp.visible = false;
      }

      // zones
      for (let i = 0; i < 3; i++) {
        const z = st.zones[i];
        const v = zoneVis[i];
        if (z && ch === 4) {
          v.g.visible = true;
          v.g.position.set(z.x, 0, z.z);
          if (z.warm > 0) { v.fill.opacity = 0.04; v.rim.opacity = 0.4 + Math.sin(st.t * 12) * 0.3; }
          else { v.fill.opacity = 0.16; v.rim.opacity = 0.8; }
        } else v.g.visible = false;
      }

      // boss
      const pulse = 1 + (st.bossPulse > 0 ? st.bossPulse * 0.5 : 0);
      bossGroup.position.set(st.bossX, 0, st.bossZ);
      bossGroup.scale.setScalar(pulse);
      if (st.vicT >= 0) bossGroup.scale.setScalar(Math.max(0.01, st.vicT / 1.5));

      if (ch === 0) {
        for (const e of slabEdges) (e.material as THREE.LineBasicMaterial).color.setHex(st.vented ? AMBER : 0x4a3828);
        if (ventMesh) (ventMesh.material as THREE.MeshBasicMaterial).opacity = st.vented ? 0.25 + Math.sin(st.t * 10) * 0.12 : 0;
        bossGroup.rotation.y = Math.sin(st.t * 0.7) * 0.08;
      } else if (ch === 1) {
        const open = st.shields.every(s => !s.alive);
        if (faceEdges) (faceEdges.material as THREE.LineBasicMaterial).color.setHex(open ? AMBER : 0x4a3828);
        if (checkSprite) (checkSprite.material as THREE.SpriteMaterial).map = textTexture(open ? "☑" : "☐", open ? "#ffb000" : "#c8b08a", 56);
        // face the player
        bossGroup.rotation.y = Math.atan2(st.px - st.bossX, st.pz - st.bossZ);
        const firstAlive = st.shields.findIndex(s => s.alive);
        st.shields.forEach((s, i) => {
          const sp = shieldSprites[i];
          if (!s.alive) { sp.visible = false; return; }
          sp.visible = true;
          sp.position.set(st.bossX + Math.cos(s.ang + st.t) * 2.6, 1.4, st.bossZ + Math.sin(s.ang + st.t) * 2.6);
          (sp.material as THREE.SpriteMaterial).color.setHex(i === firstAlive ? AMBER : 0x555555);
          const sc = i === firstAlive ? 1 + Math.sin(st.t * 6) * 0.1 : 0.8;
          sp.scale.setScalar(0.85 * sc);
        });
      } else if (ch === 2) {
        decoSprites.forEach((sp, i) => {
          const a = (i / 10) * Math.PI * 2 + st.t;
          const rr = 0.7 + Math.sin(st.t * 3 + i) * 0.4;
          sp.position.set(Math.cos(a) * rr + (Math.random() - 0.5) * 0.15, 1.5 + Math.sin(st.t * 2 + i) * 0.4, Math.sin(a) * rr + (Math.random() - 0.5) * 0.15);
        });
        if (coreSprite) coreSprite.position.x = (Math.random() - 0.5) * 0.1;
      } else if (ch === 3) {
        ghostGroups.forEach((g, i) => {
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
          ghostGroups[1].visible = false; ghostGroups[2].visible = false;
          if (pinRing) { pinRing.visible = true; pinRing.position.set(st.bossX, 0.04, st.bossZ); }
          if (hashSprite) hashSprite.visible = false;
        } else {
          if (pinRing) pinRing.visible = false;
          if (hashSprite && st.ghosts[st.realIdx]) {
            hashSprite.visible = true;
            hashSprite.position.set(st.ghosts[st.realIdx].x, 0.5, st.ghosts[st.realIdx].z + 1.7);
          }
        }
      } else if (ch === 4) {
        const exposed = !st.mods.some(m => m.alive);
        if (coreEdge) (coreEdge.material as THREE.LineBasicMaterial).color.setHex(exposed ? AMBER : REDC);
        bossGroup.rotation.y = st.t * 0.5;
        st.mods.forEach((mo, i) => {
          const v = modGroups[i];
          if (!mo.alive) { v.g.visible = false; return; }
          v.g.visible = true;
          v.g.position.set(st.bossX + Math.cos(mo.ang) * 5, 0.6, st.bossZ + Math.sin(mo.ang) * 5);
          v.g.rotation.y = -mo.ang;
        });
      } else {
        bossGroup.position.y = Math.sin(st.t * 2) * 0.08;
        bossGroup.rotation.y = Math.atan2(st.px - st.bossX, st.pz - st.bossZ);
        if (screenMat) screenMat.opacity = 0.5 + Math.sin(st.t * 8) * 0.25;
        if (auraMat) auraMat.opacity = 0.1 + Math.sin(st.t * 3) * 0.06;
        if (offerGroup.visible) {
          offerGroup.rotation.y = st.t * 1.2;
          const p2 = 1 + Math.sin(st.offerT * 5) * 0.08;
          offerGroup.scale.setScalar(p2);
        }
        if (st.cineT >= 0) {
          bossGroup.rotation.y = 0;
          if (screenMat) screenMat.opacity = 1;
        }
      }

      // ── camera: first person ──
      const cp = Math.cos(st.pitch), sp2 = Math.sin(st.pitch);
      const dirX = -Math.sin(st.yaw) * cp, dirY = sp2, dirZ = -Math.cos(st.yaw) * cp;
      const bob = Math.sin(st.bobT) * 0.035;
      camPos.set(st.px, EYE + bob, st.pz);
      camLook.set(st.px + dirX, EYE + bob + dirY, st.pz + dirZ);

      if (st.introT > 0) {
        const k = 1 - Math.max(0, Math.min(1, st.introT / 2.6));
        const e = k * k * (3 - 2 * k);
        tmpA.set(st.bossX + 2.5, 2.4, st.bossZ + 6);
        tmpB.set(st.bossX, 1.6, st.bossZ);
        camPos.lerpVectors(tmpA, camPos, e);
        camLook.lerpVectors(tmpB, camLook, e);
      }
      if (st.cineT >= 0) {
        const k = Math.min(1, st.cineT / 1.2);
        const e = k * k * (3 - 2 * k);
        tmpA.set(st.bossX + 3.4, 2.2, st.bossZ + 5.2);
        tmpB.set(st.bossX, 1.6, st.bossZ);
        camPos.lerpVectors(camPos, tmpA, e);
        camLook.lerpVectors(camLook, tmpB, e);
      }
      if (st.deadT >= 0) {
        const k = Math.min(1, (1.0 - st.deadT) * 1.6);
        camPos.y = EYE - k * 0.9;
      }
      if (st.shake > 0) {
        camPos.x += (Math.random() - 0.5) * st.shake * 0.22;
        camPos.y += (Math.random() - 0.5) * st.shake * 0.16;
      }
      camera.position.copy(camPos);
      camera.lookAt(camLook);
      if (st.deadT >= 0) camera.rotation.z = (1.0 - st.deadT) * 0.35;

      // gun
      gun.position.z = -0.65 + st.gunKick * 0.9;
      gun.position.y = -0.27 + bob * 0.4;
      gun.rotation.x = st.gunKick * 0.8;
      muzzleMat.opacity = st.muzzleT > 0 ? 0.9 : 0;
      gun.visible = st.cineT < 0 && st.introT <= 0;
      muzzle.visible = gun.visible;

      // ── HUD ──
      if (hpFillRef.current) {
        const f = Math.max(0, st.php) / 100;
        hpFillRef.current.style.width = `${f * 100}%`;
        hpFillRef.current.style.background = f > 0.5 ? "#4ade80" : f > 0.25 ? "#ffb000" : "#ff5555";
      }
      if (bossFillRef.current) {
        let f = ch === 5 ? 1 : Math.max(0, st.bossHp) / st.bossMax;
        if (ch === 5 && st.cineT >= 0) f = Math.max(0, 1 - st.cineT / 2.4);
        bossFillRef.current.style.width = `${f * 100}%`;
        bossFillRef.current.style.background = ch === 5 && st.cineT >= 0 ? "#4ade80" : "#ffb000";
      }
      if (noteRef.current) noteRef.current.style.opacity = String(Math.max(0, Math.min(1, st.noteT)));
      if (flashRef.current) flashRef.current.style.opacity = String(Math.max(0, (st.invuln - 0.45)) * 0.5);
      if (introRef.current) introRef.current.style.opacity = st.introT > 0.25 ? "1" : "0";
      if (crossRef.current) {
        const spread = 1 + (st.firing ? 0.45 : 0) + (st.gunKick > 0.08 ? 0.25 : 0);
        crossRef.current.style.transform = `translate(-50%, -50%) scale(${spread})`;
        crossRef.current.style.opacity = st.locked && st.cineT < 0 && st.introT <= 0 ? "1" : "0";
      }
      if (lockHintRef.current) {
        const show = !st.locked && st.introT <= 0 && !seqActive() && !pausedRef.current;
        lockHintRef.current.style.opacity = show ? "1" : "0";
        lockHintRef.current.style.pointerEvents = "none";
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
  }, [chapter]);

  const chData = CHAPTERS[chapter];
  return (
    <div className="relative w-full h-full select-none">
      <div ref={mountRef} className="absolute inset-0" />

      {/* damage vignette */}
      <div
        ref={flashRef}
        className="absolute inset-0 pointer-events-none transition-opacity duration-150"
        style={{ opacity: 0, background: "radial-gradient(ellipse at center, transparent 45%, rgba(220,40,40,0.55) 100%)" }}
      />

      {/* crosshair */}
      <div
        ref={crossRef}
        className="absolute left-1/2 top-1/2 pointer-events-none transition-opacity duration-200"
        style={{ transform: "translate(-50%, -50%)", opacity: 0 }}
      >
        <div className="relative w-[26px] h-[26px]">
          <span className="absolute left-1/2 top-0 w-px h-[7px] bg-accent -translate-x-1/2" />
          <span className="absolute left-1/2 bottom-0 w-px h-[7px] bg-accent -translate-x-1/2" />
          <span className="absolute top-1/2 left-0 h-px w-[7px] bg-accent -translate-y-1/2" />
          <span className="absolute top-1/2 right-0 h-px w-[7px] bg-accent -translate-y-1/2" />
          <span className="absolute left-1/2 top-1/2 w-[2px] h-[2px] bg-accent -translate-x-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* click-to-aim hint */}
      <div
        ref={lockHintRef}
        className="absolute inset-0 flex items-center justify-center transition-opacity duration-300"
        style={{ opacity: 0 }}
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent border border-amber-500/40 bg-[#0d0a08]/80 px-6 py-3 animate-pulse">
          click to take aim
        </p>
      </div>

      {/* HUD */}
      <div className="absolute top-2.5 left-4 font-mono text-[9px] uppercase tracking-[0.25em] text-zinc-600 pointer-events-none">
        Chapter {["I", "II", "III", "IV", "V", "VI"][chapter]} · {chData.year}
      </div>
      <div className="absolute top-2.5 inset-x-0 flex flex-col items-center pointer-events-none">
        <p className="font-mono text-[10px] font-bold tracking-[0.25em] text-[#c8b08a] mb-1.5">{chData.bossName}{chapter === 5 ? " · ∞" : ""}</p>
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
      <div className="absolute bottom-3 right-4 font-mono text-[10px] font-bold tracking-[0.2em] text-accent pointer-events-none">
        {WEAPONS[Math.min(chapter, WEAPONS.length - 1)].name}
      </div>

      {/* boss intro splash */}
      <div ref={introRef} className="absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-500 pointer-events-none" style={{ opacity: 1 }}>
        <div className="absolute top-0 inset-x-0 h-[12%] bg-black/80" />
        <div className="absolute bottom-0 inset-x-0 h-[12%] bg-black/80" />
        <p className="font-mono text-[10px] uppercase tracking-[0.5em] text-red-400 mb-3 animate-pulse">⚠ warning ⚠</p>
        <h3 className="font-display text-5xl md:text-6xl text-accent mb-2" style={{ textShadow: "0 0 30px rgba(255,176,0,0.4)" }}>{chData.bossName}</h3>
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">{chData.bossSub}</p>
      </div>
    </div>
  );
}
