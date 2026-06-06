import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { researchProjects } from "@/lib/data";
import { Slide } from "@/app/animation/Slide";
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
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${
        status === "Ongoing"
          ? "dark:bg-emerald-950 bg-emerald-50 dark:border-emerald-800 border-emerald-200 dark:text-emerald-400 text-emerald-700"
          : "dark:bg-zinc-800 bg-zinc-100 dark:border-zinc-700 border-zinc-200 dark:text-zinc-400 text-zinc-600"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          status === "Ongoing" ? "bg-emerald-500 animate-pulse" : "bg-zinc-400"
        }`}
      />
      {status}
    </span>
  );
}

export default function ResearchDetail({ params }: Props) {
  const project = researchProjects.find((p) => p._id === params.slug);
  if (!project) notFound();

  return (
    <main className="max-w-6xl mx-auto lg:px-16 px-8 mb-20">
      <Slide>
        {/* Back link */}
        <Link
          href="/#research"
          className="inline-flex items-center gap-1.5 text-sm dark:text-zinc-400 text-zinc-500 hover:dark:text-zinc-200 hover:text-zinc-800 mb-8 transition-colors duration-150"
        >
          ← Research
        </Link>

        <div className="max-w-3xl">
          {/* Title + status */}
          <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
            <h1 className="font-incognito font-black tracking-tight sm:text-4xl text-2xl leading-tight max-w-2xl">
              {project.title}
            </h1>
            <StatusBadge status={project.status} />
          </div>

          {/* Short description */}
          <p className="text-base dark:text-zinc-400 text-zinc-600 leading-relaxed mb-6 max-w-2xl">
            {project.shortDescription}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-10">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs dark:bg-zinc-800 bg-zinc-100 dark:text-zinc-300 text-zinc-700 px-2.5 py-1 rounded-md"
              >
                {tag}
              </span>
            ))}
          </div>

          <hr className="dark:border-zinc-800 border-zinc-200 mb-10" />

          {/* Overview paragraphs */}
          <section className="mb-12">
            <h2 className="font-incognito text-sm font-semibold uppercase tracking-widest dark:text-zinc-500 text-zinc-400 mb-4">
              Overview
            </h2>
            <div className="dark:text-zinc-400 text-zinc-600 leading-relaxed space-y-4">
              {project.fullDescription.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </section>

          {/* Detailed sections */}
          {project.sections && project.sections.length > 0 && (
            <div className="space-y-10 mb-12">
              {project.sections.map((section, i) => (
                <section key={i}>
                  <h2 className="font-incognito text-xl font-semibold tracking-tight mb-3 dark:text-zinc-100 text-zinc-900">
                    {section.heading}
                  </h2>
                  <p className="dark:text-zinc-400 text-zinc-600 leading-relaxed mb-3">
                    {section.body}
                  </p>
                  {section.bullets && section.bullets.length > 0 && (
                    <ul className="space-y-1.5 ml-1">
                      {section.bullets.map((b, bi) => (
                        <li
                          key={bi}
                          className="flex items-start gap-2.5 text-sm dark:text-zinc-400 text-zinc-600"
                        >
                          <span className="mt-2 w-1.5 h-1.5 rounded-full dark:bg-zinc-500 bg-zinc-400 shrink-0" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </div>
          )}

          {/* Pipeline */}
          {project.pipeline && project.pipeline.length > 0 && (
            <section>
              <h2 className="font-incognito text-xl font-semibold tracking-tight mb-4 dark:text-zinc-100 text-zinc-900">
                {project._id === "cxr-generalization"
                  ? "Implementation Pipeline"
                  : "ML Workflow"}
              </h2>
              <ol className="space-y-3">
                {project.pipeline.map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="shrink-0 w-6 h-6 rounded-full dark:bg-zinc-800 bg-zinc-100 dark:text-zinc-400 text-zinc-500 text-xs font-medium flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-sm dark:text-zinc-400 text-zinc-600 leading-relaxed pt-0.5">
                      {step}
                    </p>
                  </li>
                ))}
              </ol>
            </section>
          )}
        </div>
      </Slide>
    </main>
  );
}
