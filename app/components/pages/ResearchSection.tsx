import { researchProjects } from "@/lib/data";
import { Slide } from "@/app/animation/Slide";
import { ResearchProjectType } from "@/types";

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

function ResearchCard({ project }: { project: ResearchProjectType }) {
  return (
    <div className="dark:bg-primary-bg bg-zinc-50 border dark:border-zinc-800 border-zinc-200 rounded-lg p-6 flex flex-col gap-4">
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
              className="dark:bg-zinc-800/60 bg-zinc-100 rounded-md px-3 py-2 text-center"
            >
              <p className="font-incognito text-sm font-bold dark:text-zinc-100 text-zinc-800 leading-tight">
                {m.value}
              </p>
              <p className="text-xs dark:text-zinc-500 text-zinc-500 mt-0.5">{m.label}</p>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs dark:bg-zinc-800 bg-zinc-100 dark:text-zinc-300 text-zinc-700 px-2 py-0.5 rounded"
          >
            {tag}
          </span>
        ))}
      </div>

      {project.links && project.links.length > 0 && (
        <div className="flex gap-4 mt-1">
          {project.links.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium dark:text-zinc-400 text-zinc-600 hover:text-primary-color dark:hover:text-primary-color underline underline-offset-2"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ResearchSection() {
  return (
    <section id="research" className="scroll-mt-28 mt-32">
      <Slide delay={0.1}>
        <h2 className="font-incognito text-4xl mb-4 font-bold tracking-tight">
          Research
        </h2>
        <p className="dark:text-zinc-400 text-zinc-600 max-w-xl mb-8">
          Academic and applied research projects at the intersection of NLP, medical imaging, and machine learning systems.
        </p>
        <div className="flex flex-col gap-5">
          {researchProjects.map((project) => (
            <ResearchCard key={project._id} project={project} />
          ))}
        </div>
      </Slide>
    </section>
  );
}
