// Sanity-checks optimized GLBs against a backup copy: mesh/primitive/triangle
// counts and skins must match exactly; only animation count should drop.
// Usage: node scripts/verify-models.mjs <backup-dir>
import fs from "node:fs";
import path from "node:path";

const backup = process.argv[2];
const files = ["anshul", "knight", "skeleton_minion", "skeleton_rogue"];

function stats(p) {
  const buf = fs.readFileSync(p);
  if (buf.readUInt32LE(0) !== 0x46546c67) throw new Error("not a GLB: " + p);
  const json = JSON.parse(buf.slice(20, 20 + buf.readUInt32LE(12)).toString());
  // count what actually renders: every node -> mesh reference. Counting the
  // mesh table instead would misreport dedup (two nodes sharing one mesh).
  let prims = 0, tris = 0;
  for (const n of json.nodes || []) {
    if (n.mesh === undefined) continue;
    for (const pr of (json.meshes[n.mesh] || {}).primitives || []) {
      prims++;
      const a = json.accessors[pr.indices];
      if (a) tris += a.count / 3;
    }
  }
  return {
    meshes: (json.nodes || []).filter(n => n.mesh !== undefined).length,
    prims,
    tris: Math.round(tris),
    skins: (json.skins || []).length,
    anims: (json.animations || []).map(a => a.name).sort(),
    bytes: buf.length,
  };
}

let bad = 0;
for (const f of files) {
  const a = stats(path.join("public/models", f + ".glb"));
  const b = backup ? stats(path.join(backup, f + ".glb")) : null;
  const geomOk = !b || (a.meshes === b.meshes && a.prims === b.prims && a.tris === b.tris && a.skins === b.skins);
  if (!geomOk) bad++;
  console.log(
    (geomOk ? "OK  " : "FAIL") + " " + f.padEnd(20),
    `mesh:${a.meshes} prim:${a.prims} tri:${a.tris} skin:${a.skins}`,
    b ? `(was mesh:${b.meshes} prim:${b.prims} tri:${b.tris} skin:${b.skins})` : "",
    "| anims:", a.anims.join(",")
  );
}
process.exit(bad ? 1 : 0);
