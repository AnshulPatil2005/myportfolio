import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Slide } from "../../animation/Slide";
import { showcaseProjects } from "@/lib/data";

type Props = {
  params: {
    project: string;
  };
};

export function generateStaticParams() {
  return showcaseProjects.map((project) => ({ project: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = showcaseProjects.find((p) => p.slug === params.project);
  if (!project) return { title: "Project Not Found" };

  return {
    title: `${project.name} | Project`,
    description: project.tagline,
  };
}

export default function Project({ params }: Props) {
  const project = showcaseProjects.find((p) => p.slug === params.project);
  if (!project) notFound();

  const tags = project.tagline.split(",").map((t) => t.trim());

  return (
    <main className="max-w-6xl mx-auto lg:px-16 px-8 mb-16">
      <Slide>
        <div className="max-w-3xl mx-auto">

          {/* Title + action buttons */}
          <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
            <h1 className="font-incognito font-black tracking-tight sm:text-5xl text-3xl max-w-xl leading-tight">
              {project.name}
            </h1>
            <div className="flex items-center gap-x-2 font-mono text-sm">
              <a
                href={project.projectUrl || undefined}
                rel="noreferrer noopener"
                target="_blank"
                className={`border dark:border-zinc-700 border-zinc-300 dark:text-zinc-200 text-zinc-700 px-4 py-2 duration-200 ${
                  !project.projectUrl
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer dark:hover:border-zinc-500 hover:border-zinc-500"
                }`}
              >
                {project.projectUrl ? "Live Demo ↗" : "Coming Soon"}
              </a>
              <a
                href={project.repository || undefined}
                rel="noreferrer noopener"
                target="_blank"
                className={`border dark:border-zinc-700 border-zinc-300 dark:text-zinc-200 text-zinc-700 px-4 py-2 duration-200 ${
                  !project.repository
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer dark:hover:border-zinc-500 hover:border-zinc-500"
                }`}
              >
                GitHub
              </a>
            </div>
          </div>

          {/* Tech tags */}
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 mb-8 font-mono text-xs dark:text-zinc-500 text-zinc-500">
            {tags.map((tag, i) => (
              <span key={tag}>
                {i > 0 && <span className="mr-4 dark:text-zinc-700 text-zinc-300">/</span>}
                {tag}
              </span>
            ))}
          </div>

          {/* Metadata details grid */}
          {project.details && project.details.length > 0 && (
            <div className="border dark:border-zinc-800 border-zinc-300 p-5 mb-6">
              <dl className="grid sm:grid-cols-2 grid-cols-1 gap-x-8 gap-y-3">
                {project.details.map((d) => (
                  <div key={d.label}>
                    <dt className="text-xs dark:text-zinc-500 text-zinc-400 uppercase tracking-wider mb-0.5">
                      {d.label}
                    </dt>
                    <dd className="text-sm dark:text-zinc-200 text-zinc-800">
                      {d.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {/* Metrics grid */}
          {project.metrics && project.metrics.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              {project.metrics.map((m) => (
                <div
                  key={m.label}
                  className="border dark:border-zinc-800 border-zinc-300 px-4 py-3 text-center"
                >
                  <p className="font-incognito text-xl font-bold dark:text-zinc-100 text-zinc-800 leading-tight">
                    {m.value}
                  </p>
                  <p className="text-xs dark:text-zinc-500 text-zinc-500 mt-1">{m.label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Description */}
          <div className="dark:text-zinc-400 text-zinc-600 leading-relaxed space-y-4 mb-8">
            {project.fullDescription
              ? project.fullDescription.map((para, i) => <p key={i}>{para}</p>)
              : <p>{project.description}</p>
            }
          </div>

          {/* Key highlights / resume bullets */}
          {project.bullets && project.bullets.length > 0 && (
            <div className="border dark:border-zinc-800 border-zinc-300 p-5">
              <h2 className="font-incognito text-sm font-semibold uppercase tracking-widest dark:text-zinc-400 text-zinc-500 mb-3">
                Key Highlights
              </h2>
              <ul className="space-y-2">
                {project.bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm dark:text-zinc-300 text-zinc-700">
                    <span className="mt-1.5 w-1.5 h-1.5 dark:bg-zinc-500 bg-zinc-400 shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>
      </Slide>
    </main>
  );
}
