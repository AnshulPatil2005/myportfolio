import { products } from "@/lib/data";
import ScrambleIndex from "../global/ScrambleIndex";
import StratumSignalAnimation from "./StratumSignalAnimation";
import EngravingImage from "../shared/EngravingImage";
import SectionHead from "../shared/SectionHead";

const stratum = products.find((p) => p._id === "stratum");

export default function FeaturedWork() {
  if (!stratum) return null;

  const stack =
    stratum.details?.find((d) => d.label === "Stack")?.value.split(",").map((s) => s.trim()) ?? [];

  return (
    <section id="featured-work" className="scroll-mt-20 mt-28 md:mt-40">
      <SectionHead
        index={<>#<ScrambleIndex target="01" /></>}
        title="Flagship Product"
        lead="One product built end-to-end, from a blank repo to a deployed multi-tenant SaaS."
      />

      <div className="folio lg:items-start">
        {/* Product */}
        <div className="lg:col-start-4 lg:col-span-6">
          <p className="font-mono text-meta text-muted mb-3">
            Flagship MVP · Live on Vercel
          </p>
          <h3 className="text-[2.5rem] leading-none tracking-[-0.015em] mb-6">
            {stratum.name}
          </h3>
          <p className="text-body text-fg mb-10">
            Stratum connects your GitHub repo to your production stack. Every pull request gets an
            AI review for security, performance, and logic risk, plus a warning if it conflicts with
            another PR in the same deploy. It tracks how your architecture drifts over time. And
            when production breaks, it checks 6 monitoring sources and points to the PR that caused
            it.
          </p>

          {/* Stages, set as a ruled definition list */}
          <dl className="grid grid-cols-2 sm:grid-cols-4 border-t border-line mb-12">
            {[
              { label: "Review", desc: "Risk-score every PR" },
              { label: "Deploy", desc: "Catch conflicting PRs" },
              { label: "Drift", desc: "Track architecture health" },
              { label: "Incident", desc: "Trace prod errors to PRs" },
            ].map((stage) => (
              <div key={stage.label} className="pt-3 pb-4 pr-4 border-b border-line">
                <dt className="font-mono text-meta text-fg">{stage.label}</dt>
                <dd className="text-small text-muted mt-0.5">{stage.desc}</dd>
              </div>
            ))}
          </dl>

          <StratumSignalAnimation />

          {/* Stack */}
          <p className="flex flex-wrap gap-x-3 gap-y-1 mb-8 font-mono text-meta text-muted">
            {stack.map((tech, i) => (
              <span key={tech}>
                {tech}
                {i < stack.length - 1 && <span className="ml-3" aria-hidden="true">/</span>}
              </span>
            ))}
          </p>

          {/* CTA */}
          <a
            href={stratum.projectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group link text-lead"
          >
            Check it out{" "}
            <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">&rarr;</span>
          </a>
        </div>

        {/* Plate: stays beside the text while it is read */}
        <div className="hidden lg:block lg:col-start-10 lg:col-span-3 lg:sticky lg:top-24">
          <EngravingImage
            src="/engraving-ruins.jpg"
            alt=""
            sizes="270px"
            className="w-full aspect-[2/3]"
          />
        </div>
      </div>
    </section>
  );
}
