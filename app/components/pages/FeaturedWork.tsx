import { products } from "@/lib/data";
import { Slide } from "../../animation/Slide";
import ProjectGraphic from "./ProjectGraphic";
import ScrambleIndex from "../global/ScrambleIndex";

const stratum = products.find((p) => p._id === "stratum");

export default function FeaturedWork() {
  if (!stratum) return null;

  const stack =
    stratum.details?.find((d) => d.label === "Stack")?.value.split(",").map((s) => s.trim()) ?? [];

  return (
    <section id="featured-work" className="scroll-mt-20 mt-32 md:mt-40">
      <Slide delay={0.1}>
        <div className="flex items-baseline gap-4 mb-4">
          <span className="font-mono text-xs dark:text-zinc-600 text-zinc-400">
            <ScrambleIndex target="01" />
          </span>
          <h2 className="text-4xl font-bold tracking-tight">Flagship Product</h2>
        </div>
        <p className="dark:text-zinc-400 text-zinc-600 max-w-2xl mb-16">
          One product built end-to-end — from a blank repo to a deployed, multi-tenant SaaS with 178 passing tests.
        </p>
      </Slide>

      <Slide delay={0.08}>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs uppercase tracking-widest font-mono dark:text-zinc-500 text-zinc-400 mb-3">
            Flagship MVP · Live on Render
          </p>
          <h3 className="text-4xl sm:text-6xl font-black tracking-tight mb-6">
            {stratum.name}
          </h3>
          <p className="dark:text-zinc-300 text-zinc-700 leading-relaxed max-w-2xl mx-auto text-lg">
            A living intelligence layer for engineering teams. Stratum intercepts every PR, scores
            its risk, flags semantic conflicts before deploy, tracks architectural drift, and
            correlates production incidents back to the exact commits that caused them — four
            stages, one unified product.
          </p>

          {/* Metrics */}
          <div className="flex justify-center gap-10 mt-10 mb-8">
            {stratum.metrics?.map((m) => (
              <div key={m.label} className="text-center">
                <p className="text-3xl font-black tracking-tight dark:text-white text-zinc-900">
                  {m.value}
                </p>
                <p className="text-xs font-mono uppercase tracking-widest dark:text-zinc-500 text-zinc-500 mt-1">
                  {m.label}
                </p>
              </div>
            ))}
          </div>

          {/* Stack */}
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-1.5 mb-8 font-mono text-xs dark:text-zinc-500 text-zinc-500">
            {stack.map((tech, i) => (
              <span key={tech}>
                {tech}
                {i < stack.length - 1 && (
                  <span className="ml-3 dark:text-zinc-700 text-zinc-300">/</span>
                )}
              </span>
            ))}
          </div>

          {/* Links */}
          <div className="flex justify-center flex-wrap items-center gap-x-6 gap-y-2 font-mono text-sm mb-12">
            <a
              href={stratum.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="dark:text-white text-zinc-900 hover:underline"
            >
              Live &rarr;
            </a>
            <a
              href={stratum.repository}
              target="_blank"
              rel="noopener noreferrer"
              className="dark:text-zinc-400 text-zinc-500 dark:hover:text-white hover:text-zinc-900 transition-colors duration-150"
            >
              Repository
            </a>
          </div>

          <div className="aspect-[16/9] w-full max-w-2xl mx-auto">
            <ProjectGraphic variant="network" className="w-full h-full" />
          </div>
        </div>
      </Slide>
    </section>
  );
}
