import { products } from "@/lib/data";
import ProjectGraphic from "./ProjectGraphic";
import ScrambleIndex from "../global/ScrambleIndex";
import StratumSignalAnimation from "./StratumSignalAnimation";
import EngravingImage from "../shared/EngravingImage";

const stratum = products.find((p) => p._id === "stratum");

export default function FeaturedWork() {
  if (!stratum) return null;

  const stack =
    stratum.details?.find((d) => d.label === "Stack")?.value.split(",").map((s) => s.trim()) ?? [];

  return (
    <section id="featured-work" className="scroll-mt-20 mt-32 md:mt-40">
      <div className="mb-10">
        <p className="font-mono text-xs uppercase tracking-[0.22em] dark:text-accent text-amber-600 mb-3">
          #<ScrambleIndex target="01" />
        </p>
        <h2 className="font-display font-normal text-5xl sm:text-7xl tracking-[-0.02em] leading-none mb-5">
          Flagship Product
        </h2>
        <p className="text-sm dark:text-zinc-500 text-zinc-500 max-w-xl">
          One product built end-to-end, from a blank repo to a deployed multi-tenant SaaS.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_420px] gap-12 lg:gap-16 items-start">
        {/* Left — product info */}
        <div>
          <p className="text-xs uppercase tracking-widest font-mono dark:text-zinc-500 text-zinc-400 mb-3">
            Flagship MVP · Live on Vercel
          </p>
          <h3 className="font-sans font-bold text-3xl sm:text-4xl tracking-tight mb-5">
            {stratum.name}
          </h3>
          <p className="dark:text-zinc-400 text-zinc-600 leading-relaxed text-sm mb-10 max-w-xl">
            Stratum sits between your GitHub and your production stack. It reviews every PR with
            risk scores and typed findings, flags semantic conflicts between PRs before you
            batch-deploy them, tracks how your architecture drifts over weeks of commits, and when
            something breaks in prod it pinpoints exactly which PR caused it.
          </p>

          {/* Stage pills */}
          <div className="flex flex-wrap gap-3 mb-10">
            {[
              { label: "Review", desc: "Risk-score every PR" },
              { label: "Deploy", desc: "Catch semantic conflicts" },
              { label: "Drift", desc: "Track architecture health" },
              { label: "Incident", desc: "Correlate prod errors to PRs" },
            ].map((stage) => (
              <div
                key={stage.label}
                className="border dark:border-zinc-700 border-zinc-300 px-4 py-2.5"
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
          <div className="flex flex-wrap gap-x-3 gap-y-1.5 mb-8 font-mono text-xs dark:text-zinc-500 text-zinc-500">
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
            className="inline-flex items-center gap-2 font-semibold dark:text-white text-zinc-900 border-b-2 dark:border-accent border-accent pb-0.5 hover:opacity-70 transition-opacity duration-150"
          >
            Check it out &rarr;
          </a>
        </div>

        {/* Right — engraving */}
        <div className="hidden lg:block">
          <EngravingImage
            src="/engraving-ruins.jpg"
            alt=""
            className="w-full aspect-[2/3]"
          />
        </div>
      </div>
    </section>
  );
}
