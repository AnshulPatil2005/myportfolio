"use client";

import { useRef } from "react";
import Link from "next/link";
import { showcaseProjects } from "@/lib/data";
import { Slide } from "../../animation/Slide";
import ProjectGraphic, { GraphicVariant } from "./ProjectGraphic";

const GRAPHICS: Record<string, GraphicVariant> = {
  "sect-scrape": "manuscript",
  "faulty-node-detection": "network",
  codeforces: "chart",
  smartfolio: "chart",
  "il-tur": "diff",
};

const items = showcaseProjects.filter((p) => p._id !== "ai-pr-reviewer");

export default function CloserLook() {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollByPanel = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const panel = track.querySelector<HTMLElement>("[data-panel]");
    const distance = panel ? panel.offsetWidth + 24 : track.clientWidth * 0.8;
    track.scrollBy({ left: direction * distance, behavior: "smooth" });
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      scrollByPanel(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      scrollByPanel(-1);
    }
  };

  return (
    <section id="projects" className="scroll-mt-20 mt-32 md:mt-40">
      <Slide delay={0.1}>
        <div className="flex items-baseline justify-between gap-4 mb-4 md:px-16 px-6">
          <div className="flex items-baseline gap-4">
            <span className="font-mono text-xs dark:text-zinc-600 text-zinc-400">02</span>
            <h2 className="text-4xl font-bold tracking-tight">Take a closer look</h2>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <button
              type="button"
              aria-label="Scroll to previous project"
              onClick={() => scrollByPanel(-1)}
              className="w-11 h-11 grid place-items-center border dark:border-zinc-700 border-zinc-300 dark:text-zinc-400 text-zinc-500 dark:hover:border-zinc-500 hover:border-zinc-500 dark:hover:text-white hover:text-zinc-900 transition-colors duration-150"
            >
              &larr;
            </button>
            <button
              type="button"
              aria-label="Scroll to next project"
              onClick={() => scrollByPanel(1)}
              className="w-11 h-11 grid place-items-center border dark:border-zinc-700 border-zinc-300 dark:text-zinc-400 text-zinc-500 dark:hover:border-zinc-500 hover:border-zinc-500 dark:hover:text-white hover:text-zinc-900 transition-colors duration-150"
            >
              &rarr;
            </button>
          </div>
        </div>
        <p className="dark:text-zinc-400 text-zinc-600 max-w-xl mb-10 md:px-16 px-6">
          A broader set of repositories spanning scraping, systems, dashboards, and research experimentation.
        </p>
      </Slide>

      <div
        ref={trackRef}
        onKeyDown={onKeyDown}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-6 px-6 md:px-16 [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none" }}
      >
        {items.map((project) => (
          <article
            key={project._id}
            data-panel
            tabIndex={0}
            className="snap-start shrink-0 w-[85vw] sm:w-[480px] border dark:border-zinc-800 border-zinc-300 p-8 flex flex-col focus:outline-none focus-visible:ring-2 dark:focus-visible:ring-zinc-500 focus-visible:ring-zinc-400"
          >
            <div className="aspect-[4/3] w-full mb-8">
              <ProjectGraphic
                variant={GRAPHICS[project._id] ?? "network"}
                className="w-full h-full"
              />
            </div>
            <h3 className="text-2xl font-bold tracking-tight mb-2">{project.name}</h3>
            <p className="text-sm dark:text-zinc-400 text-zinc-600 leading-relaxed mb-6">
              {project.description.split(". ")[0] + "."}
            </p>
            <div className="mt-auto flex items-center gap-5 font-mono text-xs">
              {project.projectUrl && (
                <a
                  href={project.projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="dark:text-white text-zinc-900 hover:underline"
                >
                  Live &rarr;
                </a>
              )}
              {project.repository && (
                <a
                  href={project.repository}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="dark:text-zinc-400 text-zinc-500 dark:hover:text-white hover:text-zinc-900 transition-colors duration-150"
                >
                  GitHub
                </a>
              )}
              <Link
                href={`/projects/${project.slug}`}
                className="ml-auto dark:text-zinc-400 text-zinc-500 dark:hover:text-white hover:text-zinc-900 transition-colors duration-150"
              >
                Details &rarr;
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
