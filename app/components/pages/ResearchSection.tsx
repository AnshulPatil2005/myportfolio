import Link from "next/link";
import { researchProjects } from "@/lib/data";
import { Slide } from "@/app/animation/Slide";
import { ResearchProjectType } from "@/types";

function ResearchRow({ project }: { project: ResearchProjectType }) {
  return (
    <div className="py-8 first:pt-0 border-b dark:border-zinc-800 border-zinc-200 last:border-b-0">
      <div className="flex items-start justify-between gap-4 mb-2">
        <h3 className="text-xl font-semibold leading-snug tracking-tight max-w-2xl">
          {project.title}
        </h3>
        <span className="text-xs font-mono uppercase tracking-wider dark:text-zinc-500 text-zinc-400 shrink-0 pt-1">
          {project.status}
        </span>
      </div>

      <p className="text-sm dark:text-zinc-400 text-zinc-600 leading-relaxed max-w-2xl mb-4">
        {project.shortDescription}
      </p>

      <div className="flex flex-wrap gap-x-3 gap-y-1.5 mb-4 font-mono text-xs dark:text-zinc-500 text-zinc-500">
        {project.tags.map((tag, i) => (
          <span key={tag}>
            {i > 0 && <span className="mr-3 dark:text-zinc-700 text-zinc-300">/</span>}
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-5 font-mono text-xs">
        {project.links?.map((link) => (
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
        <Link
          href={`/research/${project._id}`}
          className="dark:text-zinc-400 text-zinc-500 dark:hover:text-white hover:text-zinc-900 transition-colors duration-150"
        >
          Read more &rarr;
        </Link>
      </div>
    </div>
  );
}

export default function ResearchSection() {
  return (
    <section id="research" className="scroll-mt-20 mt-32 md:mt-40">
      <Slide delay={0.1}>
        <div className="flex items-baseline gap-4 mb-4">
          <span className="font-mono text-xs dark:text-zinc-600 text-zinc-400">04</span>
          <h2 className="text-4xl font-bold tracking-tight">Research</h2>
        </div>
        <p className="dark:text-zinc-400 text-zinc-600 max-w-xl mb-6">
          Academic and applied research projects at the intersection of NLP, medical imaging, and machine learning systems.
        </p>
        <div className="border-t dark:border-zinc-800 border-zinc-200">
          {researchProjects.map((project) => (
            <ResearchRow key={project._id} project={project} />
          ))}
        </div>
      </Slide>
    </section>
  );
}
