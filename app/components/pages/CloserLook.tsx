"use client";

import { useRef } from "react";
import Link from "next/link";
import { showcaseProjects } from "@/lib/data";
import ProjectGraphic, { GraphicVariant } from "./ProjectGraphic";
import ScrambleIndex from "../global/ScrambleIndex";
import SectionHead from "../shared/SectionHead";

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

  const controls = (
    <div className="hidden sm:flex items-center gap-2 shrink-0 pt-2">
      <button
        type="button"
        aria-label="Scroll to previous project"
        onClick={() => scrollByPanel(-1)}
        className="w-11 h-11 grid place-items-center border border-line text-muted hover:border-fg hover:text-fg transition-colors duration-150"
      >
        &larr;
      </button>
      <button
        type="button"
        aria-label="Scroll to next project"
        onClick={() => scrollByPanel(1)}
        className="w-11 h-11 grid place-items-center border border-line text-muted hover:border-fg hover:text-fg transition-colors duration-150"
      >
        &rarr;
      </button>
    </div>
  );

  return (
    <section id="projects" className="scroll-mt-20 mt-28 md:mt-40">
      <SectionHead
        index={<>#<ScrambleIndex target="02" /></>}
        title="Take a closer look"
        aside={controls}
        lead="A broader set of repositories spanning scraping, systems, dashboards, and research experimentation."
      />

      <div
        ref={trackRef}
        onKeyDown={onKeyDown}
        className="flex overflow-x-auto snap-x snap-mandatory pb-4 -mr-6 md:-mr-12 lg:-mr-16 xl:mr-[calc((80rem-100vw)/2-4rem)] [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none" }}
      >
        {items.map((project) => (
          <article
            key={project._id}
            data-panel
            tabIndex={0}
            className="snap-start shrink-0 w-[82vw] sm:w-[25rem] flex flex-col pr-6 mr-6 border-r border-line last:border-r-0"
          >
            <div className="aspect-[4/3] w-full mb-6 border border-line text-muted">
              <ProjectGraphic
                variant={GRAPHICS[project._id] ?? "network"}
                className="w-full h-full"
              />
            </div>
            <h3 className="text-h3 mb-2">{project.name}</h3>
            <p className="text-body text-muted mb-6">
              {project.description.split(". ")[0] + "."}
            </p>
            <div className="mt-auto flex items-baseline gap-5 font-mono text-meta">
              {project.projectUrl && (
                <a
                  href={project.projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link"
                >
                  Live &rarr;
                </a>
              )}
              {project.repository && (
                <a
                  href={project.repository}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-muted"
                >
                  GitHub
                </a>
              )}
              <Link href={`/projects/${project.slug}`} className="ml-auto link">
                Details &rarr;
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
