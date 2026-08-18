// Strips unused animations from the Career Mode character models and prunes
// whatever that orphans. The KayKit rigs ship with 76–95 clips each; the game
// plays four. Run with: node scripts/optimize-models.mjs
import { NodeIO } from "@gltf-transform/core";
import { prune, dedup } from "@gltf-transform/functions";
import fs from "node:fs";
import path from "node:path";

const DIR = "public/models";

// clips the engine actually asks for, per model
const KEEP = {
  "anshul.glb": ["Idle", "Cheer"],
  "knight.glb": ["Idle", "Walking_A"],
  "barbarian.glb": ["Idle", "Walking_A"],
  "skeleton_minion.glb": ["Idle", "Walking_A", "Running_A", "Jump_Idle"],
  "skeleton_rogue.glb": ["Idle", "Walking_A", "Running_A", "Jump_Idle"],
};

const io = new NodeIO();
let totalBefore = 0, totalAfter = 0;

for (const [file, keep] of Object.entries(KEEP)) {
  const p = path.join(DIR, file);
  if (!fs.existsSync(p)) { console.log("skip (missing):", file); continue; }
  const before = fs.statSync(p).size;

  const doc = await io.read(p);
  const root = doc.getRoot();

  const kept = [];
  for (const anim of root.listAnimations()) {
    if (keep.includes(anim.getName())) { kept.push(anim.getName()); continue; }
    // detach the clip's samplers/channels, then the clip itself
    for (const ch of anim.listChannels()) ch.dispose();
    for (const s of anim.listSamplers()) s.dispose();
    anim.dispose();
  }

  await doc.transform(dedup(), prune());
  await io.write(p, doc);

  const after = fs.statSync(p).size;
  totalBefore += before; totalAfter += after;
  console.log(
    file.padEnd(22),
    (before / 1048576).toFixed(2) + "MB ->",
    (after / 1048576).toFixed(2) + "MB",
    "| kept:", kept.join(", ") || "(none)"
  );
}

console.log(
  "\ntotal:", (totalBefore / 1048576).toFixed(1) + "MB ->",
  (totalAfter / 1048576).toFixed(1) + "MB",
  `(${Math.round((1 - totalAfter / totalBefore) * 100)}% smaller)`
);
