import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { researchProjects } from "@/lib/data";
import { ResearchProjectType } from "@/types";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return researchProjects.map((p) => ({ slug: p._id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = researchProjects.find((p) => p._id === params.slug);
  if (!project) return { title: "Research Not Found" };
  return {
    title: `${project.title} | Research`,
    description: project.shortDescription,
  };
}

function StatusBadge({ status }: { status: ResearchProjectType["status"] }) {
  return (
    <span className="inline-flex items-center gap-2.5 font-mono text-meta text-fg">
      <span
        className={`w-1.5 h-1.5 shrink-0 ${status === "Ongoing" ? "bg-fg" : "bg-muted"}`}
      />
      {status}
    </span>
  );
}

export default function ResearchDetail({ params }: Props) {
  const project = researchProjects.find((p) => p._id === params.slug);
  if (!project) notFound();

  return (
    <main className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 mb-20">
      {/* Back link */}
      <Link href="/#research" className="inline-block mt-8 font-mono text-meta link-muted">
        ← Research
      </Link>

      <h1
        className="mt-8 md:mt-12 mb-10 md:mb-14 leading-[1.02] tracking-[-0.02em] max-w-[24ch]"
        style={{ fontSize: "clamp(2.5rem, 1.35rem + 3.4vw, 4.5rem)" }}
      >
        {project.title}
      </h1>

      <div className="folio lg:grid-rows-[auto_1fr] border-t border-line pt-6 mb-16">
        <div className="lg:col-span-3 lg:row-start-1 mb-5 lg:mb-0">
          <StatusBadge status={project.status} />
        </div>

        {/* Short description */}
        <p className="lg:col-start-4 lg:col-span-6 lg:row-start-1 text-lead text-fg mb-6">
          {project.shortDescription}
        </p>

        {/* Tags */}
        <p className="lg:col-start-4 lg:col-span-6 lg:row-start-2 flex flex-wrap gap-x-3 gap-y-1 font-mono text-meta text-muted">
          {project.tags.map((tag, i) => (
            <span key={tag}>
              {i > 0 && <span className="mr-3" aria-hidden="true">/</span>}
              {tag}
            </span>
          ))}
        </p>
      </div>

      {/* Overview paragraphs */}
      <section className="folio border-t border-line pt-6 mb-16">
        <h2 className="lg:col-span-3 font-mono text-meta text-muted mb-5 lg:mb-0 lg:pt-1.5">
          Overview
        </h2>
        <div className="lg:col-start-4 lg:col-span-6 text-body text-fg space-y-5">
          {project.fullDescription.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </section>

      {/* Detailed sections */}
      {project.sections && project.sections.length > 0 && (
        <div className="folio mb-16">
          <div className="lg:col-start-4 lg:col-span-6 space-y-12">
            {project.sections.map((section, i) => (
              <section key={i}>
                <h2 className="text-h3 mb-3">
                  {section.heading}
                </h2>
                <p className="text-body text-fg mb-4">
                  {section.body}
                </p>
                {section.bullets && section.bullets.length > 0 && (
                  <ul className="space-y-2 border-l border-line pl-5">
                    {section.bullets.map((b, bi) => (
                      <li key={bi} className="text-body text-muted">
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>
        </div>
      )}

      {/* Pipeline */}
      {project.pipeline && project.pipeline.length > 0 && (
        <section className="border-t border-line pt-6">
          <div className="folio mb-6">
            <h2 className="lg:col-start-4 lg:col-span-6 text-h3">
              {project._id === "cxr-generalization"
                ? "Implementation Pipeline"
                : "ML Workflow"}
            </h2>
          </div>
          <ol>
            {project.pipeline.map((step, i) => (
              <li key={i} className="folio flex gap-4 items-baseline py-3 border-b border-line">
                <span className="lg:col-span-3 lg:text-right lg:pr-6 font-mono text-meta text-muted">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="lg:col-start-4 lg:col-span-6 text-body text-fg">
                  {step}
                </p>
              </li>
            ))}
          </ol>
        </section>
      )}
    </main>
  );
}
