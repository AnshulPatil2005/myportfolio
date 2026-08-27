import type { Metadata } from "next";
import Link from "next/link";
import { Slide } from "@/app/animation/Slide";
import GameTrailer from "@/app/components/pages/GameTrailer";
import PlayCareerButton from "@/app/components/pages/PlayCareerButton";

export const metadata: Metadata = {
  title: "Career Mode — a browser FPS in 2.0 MB | Anshul Patil",
  description:
    "Engineering write-up: a first-person 3D game running inside a Next.js portfolio, with GTAO, a custom depth-Sobel outline shader, instanced level geometry, and a lossless glTF pipeline — adding zero kilobytes to the site bundle.",
  openGraph: {
    title: "Career Mode — a browser FPS in 2.0 MB",
    description:
      "A first-person 3D game built into a portfolio: GTAO, a custom outline shader, instanced dungeon tiles, and a model pipeline that cut 19.6 MB to 2.0 MB losslessly.",
  },
};

const NUMBERS: [string, string, string][] = [
  ["0 kB", "added to first load", "the engine is a dynamic import — the site is still 87 kB"],
  ["19.6 → 2.0 MB", "model payload", "unused animation clips stripped and pruned, verified lossless"],
  ["2", "draw calls for the level", "every floor tile and every wall is one InstancedMesh"],
  ["~1,900", "lines in the engine", "no game framework — three.js and the DOM"],
];

const STACK: [string, string][] = [
  ["Rendering", "three.js · EffectComposer · GTAO · UnrealBloom · custom ShaderPasses · FXAA"],
  ["Level", "CC0 modular tiles on a 4-unit grid, instanced, with a total floor-height function for verticality"],
  ["Characters", "glTF skinned meshes, an animation state machine, and one-shot clip blending"],
  ["Audio", "Web Audio oscillators — footsteps, weapon report, and an ambient bed that swells during a fight"],
  ["Pipeline", "gltf-transform scripts that strip and then verify models, run with npm run optimize:models"],
];

export default function CareerModeCaseStudy() {
  return (
    <main className="max-w-3xl mx-auto md:px-16 px-6 pb-24">
      <Slide>
        <p className="font-mono text-xs uppercase tracking-[0.22em] dark:text-zinc-500 text-zinc-500 mb-3">
          Case study · Interactive
        </p>
        <h1 className="font-display text-4xl sm:text-5xl leading-tight mb-5">
          Career Mode: a first-person game inside a résumé
        </h1>
        <p className="text-lg leading-relaxed dark:text-zinc-300 text-zinc-700 mb-4">
          My portfolio ships a real 3D game. You walk a dungeon built from two
          chapters of my career, fight the technical problems I solved as bosses,
          and meet me at the end — where the only thing that beats me is a job
          offer.
        </p>
        <p className="text-base leading-relaxed dark:text-zinc-400 text-zinc-600 mb-8">
          A novelty on the surface, a systems problem underneath: run a renderer,
          a level, animated characters and an audio bed in a browser tab without
          slowing down the portfolio it lives in. This page is about the second
          part.
        </p>
      </Slide>

      <Slide delay={0.06}>
        <GameTrailer />
      </Slide>

      <Slide delay={0.1}>
        <div className="grid sm:grid-cols-2 gap-px dark:bg-zinc-800 bg-zinc-200 border dark:border-zinc-800 border-zinc-200 my-12">
          {NUMBERS.map(([n, label, note]) => (
            <div key={label} className="dark:bg-ink bg-paper p-5">
              <p className="font-mono text-2xl dark:text-zinc-100 text-zinc-900 mb-1">{n}</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] dark:text-zinc-500 text-zinc-500 mb-2">
                {label}
              </p>
              <p className="text-[13px] leading-relaxed dark:text-zinc-400 text-zinc-600">{note}</p>
            </div>
          ))}
        </div>
      </Slide>

      <Slide delay={0.14}>
        <h2 className="font-display text-2xl mb-4">Free for everyone who never plays</h2>
        <p className="text-base leading-relaxed dark:text-zinc-300 text-zinc-700 mb-4">
          The constraint that shaped everything: someone who never opens the game
          must not pay for its existence. three.js is roughly 600 kB and the
          models another 2 MB, so none of it is imported at the top level. The
          engine is a <code className="font-mono text-[13px] dark:text-zinc-200">next/dynamic</code>{" "}
          import behind a user action, and models are fetched at runtime from{" "}
          <code className="font-mono text-[13px] dark:text-zinc-200">/public</code>.
          First-load JS is unchanged at 87 kB, checked in the build output before
          and after.
        </p>
        <p className="text-base leading-relaxed dark:text-zinc-300 text-zinc-700 mb-10">
          The same reasoning drove the mobile path. The game needs pointer lock
          and a keyboard, so on a coarse-pointer device it is never mounted at
          all — those visitors get a note instead of a broken world and a
          pointless download.
        </p>
      </Slide>

      <Slide delay={0.18}>
        <h2 className="font-display text-2xl mb-4">The model pipeline</h2>
        <p className="text-base leading-relaxed dark:text-zinc-300 text-zinc-700 mb-4">
          The character rigs ship with 76–95 animation clips each. The game plays
          four. A <code className="font-mono text-[13px] dark:text-zinc-200">gltf-transform</code>{" "}
          script keeps the clips the engine actually asks for, drops the rest and
          prunes what that orphans: 19.6 MB down to 2.0 MB, a 90% reduction.
        </p>
        <p className="text-base leading-relaxed dark:text-zinc-300 text-zinc-700 mb-4">
          The part I am happier about is the verifier. Optimisation you cannot
          check is optimisation you should not trust, so a second script compares
          rendered geometry against a backup — and it caught a real subtlety.
          Counting the mesh table reported two models as damaged, when in fact
          de-duplication had merged identical weapon meshes and both nodes still
          resolved correctly. Counting node→mesh references instead of table
          entries made the check honest.
        </p>
        <p className="text-base leading-relaxed dark:text-zinc-400 text-zinc-600 mb-10">
          It also surfaced a bug I would never have found by eye: those rigs
          attach every weapon variant at once, so the knight was wearing four
          shields and three swords stacked in the same place.
        </p>
      </Slide>

      <Slide delay={0.22}>
        <h2 className="font-display text-2xl mb-4">Art direction as a rendering problem</h2>
        <p className="text-base leading-relaxed dark:text-zinc-300 text-zinc-700 mb-4">
          Stylised assets rendered realistically just look like assets. The post
          stack adds GTAO for contact shadows, split-tone grading, a rim light,
          and a custom depth-Sobel pass that draws ink outlines around geometry.
        </p>
        <p className="text-base leading-relaxed dark:text-zinc-400 text-zinc-600 mb-10">
          The outline needs linear depth, so each frame runs a cheap depth-only
          prepass with an override material. It also had to be distance-aware — a
          fixed threshold turns far walls solid black and makes near edges
          shimmer, so both the sampling width and the threshold scale with depth.
        </p>
      </Slide>

      <Slide delay={0.26}>
        <h2 className="font-display text-2xl mb-4">Stack</h2>
        <dl className="border-t dark:border-zinc-800 border-zinc-200 mb-12">
          {STACK.map(([k, v]) => (
            <div
              key={k}
              className="grid sm:grid-cols-[130px_1fr] gap-1 sm:gap-6 py-3.5 border-b dark:border-zinc-800 border-zinc-200"
            >
              <dt className="font-mono text-[11px] uppercase tracking-[0.16em] dark:text-zinc-500 text-zinc-500">
                {k}
              </dt>
              <dd className="text-[14px] leading-relaxed dark:text-zinc-300 text-zinc-700">{v}</dd>
            </div>
          ))}
        </dl>
      </Slide>

      <Slide delay={0.3}>
        <div className="border dark:border-zinc-800 border-zinc-200 p-6">
          <h2 className="font-display text-xl mb-2">Play it</h2>
          <p className="text-[14px] leading-relaxed dark:text-zinc-400 text-zinc-600 mb-5">
            Two minutes, desktop only. Everything it covers is also written out
            on the{" "}
            <Link href="/#jobs" className="underline underline-offset-4 dark:hover:text-zinc-200 hover:text-zinc-900">
              experience
            </Link>{" "}
            and{" "}
            <Link href="/#featured-work" className="underline underline-offset-4 dark:hover:text-zinc-200 hover:text-zinc-900">
              products
            </Link>{" "}
            sections.
          </p>
          <PlayCareerButton />
        </div>
      </Slide>
    </main>
  );
}
