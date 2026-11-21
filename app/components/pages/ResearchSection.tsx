import Link from "next/link";
import { researchProjects } from "@/lib/data";
import { ResearchProjectType } from "@/types";
import SectionHead from "../shared/SectionHead";

// Each study is an entry: its status in the margin, the title and summary in
// the text column. Source order is unchanged (title, status, summary, tags,
// links); the grid places the status.
function ResearchRow({ project }: { project: ResearchProjectType }) {
  return (
    <article className="folio lg:grid-rows-[auto_1fr] border-b border-line py-8">
      <h3 className="lg:col-start-4 lg:col-span-6 lg:row-start-1 text-h3 mb-2">
        {project.title}
      </h3>
      <span className="block lg:col-start-1 lg:col-span-3 lg:row-start-1 lg:pt-2 font-mono text-meta text-muted mb-3 lg:mb-0">
        {project.status}
      </span>

      <div className="lg:col-start-4 lg:col-span-6 lg:row-start-2">
        <p className="text-body text-fg mb-4">
          {project.shortDescription}
        </p>

        <p className="flex flex-wrap gap-x-3 gap-y-1 mb-5 font-mono text-meta text-muted">
          {project.tags.map((tag, i) => (
            <span key={tag}>
              {i > 0 && <span className="mr-3" aria-hidden="true">/</span>}
              {tag}
            </span>
          ))}
        </p>

        <div className="flex items-baseline gap-5 font-mono text-meta">
          {project.links?.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="link-muted"
            >
              {link.label}
            </a>
          ))}
          <Link href={`/research/${project._id}`} className="group link">
            Read more{" "}
            <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">&rarr;</span>
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function ResearchSection() {
  return (
    <section id="research" className="scroll-mt-20 mt-28 md:mt-40">
      <SectionHead
        index="04"
        title="Research"
        lead="Academic and applied research projects at the intersection of NLP, medical imaging, and machine learning systems."
      />
      <div className="border-t border-line">
        {researchProjects.map((project) => (
          <ResearchRow key={project._id} project={project} />
        ))}
      </div>
    </section>
  );
}
