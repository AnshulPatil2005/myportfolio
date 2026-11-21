import { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects, showcaseProjects } from "@/lib/data";

type Props = {
  params: {
    project: string;
  };
};

// `projects` carries richer detail (fullDescription/metrics) for slugs it defines;
// `showcaseProjects` fills in the rest. Merge so every showcased slug resolves.
const projectsBySlug = new Map(
  [...showcaseProjects, ...projects].map((p) => [p.slug, p])
);
const allProjects = Array.from(projectsBySlug.values());

export function generateStaticParams() {
  return allProjects.map((project) => ({ project: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = projectsBySlug.get(params.project);
  if (!project) return { title: "Project Not Found" };

  return {
    title: `${project.name} | Project`,
    description: project.tagline,
  };
}

export default function Project({ params }: Props) {
  const project = projectsBySlug.get(params.project);
  if (!project) notFound();

  const tags = project.tagline.split(",").map((t) => t.trim());

  return (
    <main className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 mb-16">
      <article className="pt-10 md:pt-16">
        <h1
          className="leading-[0.95] tracking-[-0.025em] max-w-[16ch]"
          style={{ fontSize: "clamp(3rem, 1.5rem + 4.6vw, 6rem)" }}
        >
          {project.name}
        </h1>

        <div className="folio mt-10 md:mt-14 border-t border-line pt-6 lg:items-start">
          {/* margin: links and the project's particulars */}
          <div className="lg:col-span-3 lg:sticky lg:top-24 space-y-7 mb-12 lg:mb-0">
            <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2 font-mono text-meta">
              <a
                href={project.projectUrl || undefined}
                rel="noreferrer noopener"
                target="_blank"
                aria-disabled={!project.projectUrl || undefined}
                className={project.projectUrl ? "link" : "text-muted cursor-not-allowed"}
              >
                {project.projectUrl ? "Live Demo ↗" : "Coming Soon"}
              </a>
              <a
                href={project.repository || undefined}
                rel="noreferrer noopener"
                target="_blank"
                aria-disabled={!project.repository || undefined}
                className={project.repository ? "link" : "text-muted cursor-not-allowed"}
              >
                GitHub
              </a>
            </div>

            {/* Tech tags */}
            <p className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-meta text-muted">
              {tags.map((tag, i) => (
                <span key={tag}>
                  {i > 0 && <span className="mr-3" aria-hidden="true">/</span>}
                  {tag}
                </span>
              ))}
            </p>

            {/* Metadata details */}
            {project.details && project.details.length > 0 && (
              <dl className="border-t border-line">
                {project.details.map((d) => (
                  <div key={d.label} className="py-3 border-b border-line">
                    <dt className="font-mono text-meta text-muted">{d.label}</dt>
                    <dd className="text-small text-fg mt-0.5">{d.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            {/* Metrics */}
            {project.metrics && project.metrics.length > 0 && (
              <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                {project.metrics.map((m) => (
                  <div key={m.label}>
                    <p className="text-h3 lining-nums leading-none">{m.value}</p>
                    <p className="font-mono text-meta text-muted mt-1.5">{m.label}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* text column */}
          <div className="lg:col-start-4 lg:col-span-6">
            <div className="text-lead text-fg space-y-6 mb-12">
              {project.fullDescription
                ? project.fullDescription.map((para, i) => <p key={i}>{para}</p>)
                : <p>{project.description}</p>
              }
            </div>

            {/* Key highlights */}
            {project.bullets && project.bullets.length > 0 && (
              <section className="border-t border-line pt-6">
                <h2 className="text-h3 rubricate mb-5">Key Highlights</h2>
                <ul className="space-y-3">
                  {project.bullets.map((b, i) => (
                    <li key={i} className="flex items-baseline gap-3 text-body text-fg">
                      <span className="w-1.5 h-1.5 bg-muted shrink-0 -translate-y-[0.2em]" />
                      {b}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>
      </article>
    </main>
  );
}
