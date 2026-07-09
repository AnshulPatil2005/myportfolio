import Link from "next/link";
import { researchProjects } from "@/lib/data";
import { Slide } from "@/app/animation/Slide";
import { ResearchProjectType } from "@/types";

function StatusBadge({ status }: { status: ResearchProjectType["status"] }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider px-2.5 py-1 border dark:border-zinc-700 border-zinc-300 dark:text-zinc-400 text-zinc-600">
      <span
        className={`w-1.5 h-1.5 shrink-0 ${
          status === "Ongoing" ? "dark:bg-zinc-100 bg-zinc-900" : "dark:bg-zinc-600 bg-zinc-400"
        }`}
      />
      {status}
    </span>
  );
}

function ResearchCard({ project }: { project: ResearchProjectType }) {
  return (
    <div className="border dark:border-zinc-800 border-zinc-300 p-6 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-incognito text-lg font-semibold leading-snug tracking-tight">
          {project.title}
        </h3>
        <StatusBadge status={project.status} />
      </div>

      <p className="text-sm dark:text-zinc-400 text-zinc-600 leading-relaxed">
        {project.shortDescription}
      </p>

      {project.metrics && project.metrics.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {project.metrics.map((m) => (
            <div
              key={m.label}
              className="border dark:border-zinc-800 border-zinc-200 px-3 py-2 text-center"
            >
              <p className="font-incognito text-sm font-bold dark:text-zinc-100 text-zinc-800 leading-tight">
                {m.value}
              </p>
              <p className="text-xs dark:text-zinc-500 text-zinc-500 mt-0.5">{m.label}</p>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-x-3 gap-y-1.5 font-mono text-xs dark:text-zinc-500 text-zinc-500">
        {project.tags.map((tag, i) => (
          <span key={tag}>
            {i > 0 && <span className="mr-3 dark:text-zinc-700 text-zinc-300">/</span>}
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-3 border-t dark:border-zinc-800 border-zinc-200 font-mono text-xs">
        <div className="flex gap-4">
          {project.links && project.links.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="dark:text-zinc-400 text-zinc-600 hover:underline"
            >
              {link.label}
            </a>
          ))}
        </div>
        <Link
          href={`/research/${project._id}`}
          className="dark:text-zinc-400 text-zinc-500 hover:dark:text-zinc-200 hover:text-zinc-800 transition-colors duration-150"
        >
          Read More &rarr;
        </Link>
      </div>
    </div>
  );
}

export default function ResearchSection() {
  return (
    <section id="research" className="scroll-mt-28 mt-40">
      <Slide delay={0.1}>
        <div className="flex items-baseline gap-4 mb-4">
          <span className="font-mono text-xs dark:text-zinc-600 text-zinc-400">04</span>
          <h2 className="font-incognito text-4xl font-bold tracking-tight">Research</h2>
        </div>
        <p className="dark:text-zinc-400 text-zinc-600 max-w-xl mb-10">
          Academic and applied research projects at the intersection of NLP, medical imaging, and machine learning systems.
        </p>
        <div className="flex flex-col gap-6">
          {researchProjects.map((project) => (
            <ResearchCard key={project._id} project={project} />
          ))}
        </div>
      </Slide>
    </section>
  );
}
