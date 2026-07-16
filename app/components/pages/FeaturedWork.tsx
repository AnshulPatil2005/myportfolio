import { products } from "@/lib/data";
import { Slide } from "../../animation/Slide";
import ProjectGraphic from "./ProjectGraphic";
import ScrambleIndex from "../global/ScrambleIndex";
import StratumSignalAnimation from "./StratumSignalAnimation";

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
        <p className="text-sm dark:text-zinc-500 text-zinc-500 max-w-xl mb-16">
          One product built end-to-end, from a blank repo to a deployed multi-tenant SaaS.
        </p>
      </Slide>

      <Slide delay={0.08}>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs uppercase tracking-widest font-mono dark:text-zinc-500 text-zinc-400 mb-3">
            Flagship MVP · Live on Vercel
          </p>
          <h3 className="text-3xl sm:text-4xl font-bold tracking-tight mb-5">
            {stratum.name}
          </h3>
          <p className="dark:text-zinc-400 text-zinc-600 leading-relaxed max-w-xl mx-auto text-sm mb-10">
            Stratum sits between your GitHub and your production stack. It reviews every PR with
            risk scores and typed findings, flags semantic conflicts between PRs before you
            batch-deploy them, tracks how your architecture drifts over weeks of commits, and when
            something breaks in prod it pinpoints exactly which PR caused it.
          </p>

          {/* Stage pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {[
              { label: "Review", desc: "Risk-score every PR" },
              { label: "Deploy", desc: "Catch semantic conflicts" },
              { label: "Drift", desc: "Track architecture health" },
              { label: "Incident", desc: "Correlate prod errors to PRs" },
            ].map((stage) => (
              <div
                key={stage.label}
                className="border dark:border-zinc-700 border-zinc-300 px-4 py-2.5 text-left"
              >
                <p className="font-mono text-xs uppercase tracking-widest dark:text-zinc-400 text-zinc-600">
                  {stage.label}
                </p>
                <p className="text-xs dark:text-zinc-500 text-zinc-500 mt-0.5">{stage.desc}</p>
              </div>
            ))}
          </div>

          <StratumSignalAnimation />

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

          {/* CTA */}
          <a
            href={stratum.projectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-semibold dark:text-white text-zinc-900 border-b-2 dark:border-accent border-accent pb-0.5 hover:opacity-70 transition-opacity duration-150 mb-12"
          >
            Check it out
            <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
              &rarr;
            </span>
          </a>

          <div className="aspect-[16/9] w-full max-w-2xl mx-auto mt-2">
            <ProjectGraphic variant="network" className="w-full h-full" />
          </div>
        </div>
      </Slide>
    </section>
  );
}
