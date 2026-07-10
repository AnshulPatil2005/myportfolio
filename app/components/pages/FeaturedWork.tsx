import { products, projects, showcaseProjects } from "@/lib/data";
import { Slide } from "../../animation/Slide";
import ProjectGraphic, { GraphicVariant } from "./ProjectGraphic";

type Story = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  stack: string[];
  repository?: string;
  live?: string;
  detailsSlug?: string;
  graphic: GraphicVariant;
  eyebrow: string;
};

const prReviewer = showcaseProjects.find((p) => p._id === "ai-pr-reviewer");
const hldc = projects.find((p) => p._id === "hldc-bail-nlp");
const stratum = products.find((p) => p._id === "stratum");
const docrag = products.find((p) => p._id === "docrag-v3");

// AI Pull Request Reviewer ships first as the open-source foundation;
// Stratum immediately follows as the advanced product built on top of it.
const stories: Story[] = [
  prReviewer && {
    id: prReviewer._id,
    name: prReviewer.name,
    tagline: prReviewer.tagline,
    description: prReviewer.description,
    stack: prReviewer.tagline.split(",").map((s) => s.trim()),
    repository: prReviewer.repository || undefined,
    live: prReviewer.projectUrl || undefined,
    detailsSlug: prReviewer.slug,
    graphic: "diff",
    eyebrow: "Open source",
  },
  stratum && {
    id: stratum._id,
    name: stratum.name,
    tagline: stratum.tagline,
    description: stratum.description,
    stack: stratum.details?.find((d) => d.label === "Stack")?.value.split(",").map((s) => s.trim()) ?? [],
    repository: stratum.repository,
    live: stratum.projectUrl || undefined,
    graphic: "network",
    eyebrow: "Built on AI Pull Request Reviewer",
  },
  docrag && {
    id: docrag._id,
    name: docrag.name,
    tagline: docrag.tagline,
    description: docrag.description,
    stack: docrag.details?.find((d) => d.label === "Stack")?.value.split(",").map((s) => s.trim()) ?? [],
    repository: docrag.repository,
    live: docrag.projectUrl || undefined,
    graphic: "pipeline",
    eyebrow: "Product",
  },
  hldc && {
    id: hldc._id,
    name: hldc.name,
    tagline: hldc.tagline,
    description: hldc.description,
    stack: hldc.tagline.split(",").map((s) => s.trim()),
    repository: hldc.repository || undefined,
    live: hldc.projectUrl || undefined,
    detailsSlug: hldc.slug,
    graphic: "manuscript",
    eyebrow: "Research",
  },
].filter(Boolean) as Story[];

function StoryLinks({ story }: { story: Story }) {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-sm mt-6">
      {story.live && (
        <a
          href={story.live}
          target="_blank"
          rel="noopener noreferrer"
          className="dark:text-white text-zinc-900 hover:underline"
        >
          Live &rarr;
        </a>
      )}
      {story.repository && (
        <a
          href={story.repository}
          target="_blank"
          rel="noopener noreferrer"
          className="dark:text-zinc-400 text-zinc-500 dark:hover:text-white hover:text-zinc-900 transition-colors duration-150"
        >
          Repository
        </a>
      )}
      {story.detailsSlug && (
        <a
          href={`/projects/${story.detailsSlug}`}
          className="dark:text-zinc-400 text-zinc-500 dark:hover:text-white hover:text-zinc-900 transition-colors duration-150"
        >
          Details &rarr;
        </a>
      )}
    </div>
  );
}

function StoryStack({ stack }: { stack: string[] }) {
  return (
    <div className="flex flex-wrap gap-x-3 gap-y-1.5 mt-5 font-mono text-xs dark:text-zinc-500 text-zinc-500">
      {stack.map((tech, i) => (
        <span key={tech}>
          {tech}
          {i < stack.length - 1 && <span className="ml-3 dark:text-zinc-700 text-zinc-300">/</span>}
        </span>
      ))}
    </div>
  );
}

export default function FeaturedWork() {
  return (
    <section id="featured-work" className="scroll-mt-20 mt-32 md:mt-40">
      <Slide delay={0.1}>
        <div className="flex items-baseline gap-4 mb-4">
          <span className="font-mono text-xs dark:text-zinc-600 text-zinc-400">01</span>
          <h2 className="text-4xl font-bold tracking-tight">Featured Work</h2>
        </div>
        <p className="dark:text-zinc-400 text-zinc-600 max-w-2xl mb-16">
          Products and projects built around AI code intelligence, document search, and research workflows.
        </p>
      </Slide>

      <div className="flex flex-col gap-24 md:gap-32">
        {stories.map((story, i) => {
          const split = i % 2 === 1;
          return (
            <Slide key={story.id} delay={0.05}>
              {split ? (
                <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                  <div>
                    <p className="text-xs uppercase tracking-widest font-mono dark:text-zinc-500 text-zinc-400 mb-3">
                      {story.eyebrow}
                    </p>
                    <h3 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">{story.name}</h3>
                    <p className="dark:text-zinc-400 text-zinc-600 leading-relaxed max-w-xl">
                      {story.description}
                    </p>
                    <StoryStack stack={story.stack} />
                    <StoryLinks story={story} />
                  </div>
                  <div className="aspect-[4/3] w-full">
                    <ProjectGraphic variant={story.graphic} className="w-full h-full" />
                  </div>
                </div>
              ) : (
                <div className="max-w-3xl mx-auto text-center">
                  <p className="text-xs uppercase tracking-widest font-mono dark:text-zinc-500 text-zinc-400 mb-3">
                    {story.eyebrow}
                  </p>
                  <h3 className="text-3xl sm:text-5xl font-bold tracking-tight mb-5">{story.name}</h3>
                  <p className="dark:text-zinc-400 text-zinc-600 leading-relaxed max-w-2xl mx-auto">
                    {story.description}
                  </p>
                  <div className="flex justify-center">
                    <StoryStack stack={story.stack} />
                  </div>
                  <div className="flex justify-center">
                    <StoryLinks story={story} />
                  </div>
                  <div className="aspect-[16/9] w-full max-w-2xl mx-auto mt-12">
                    <ProjectGraphic variant={story.graphic} className="w-full h-full" />
                  </div>
                </div>
              )}
            </Slide>
          );
        })}
      </div>
    </section>
  );
}
