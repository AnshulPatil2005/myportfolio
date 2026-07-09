import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import type { ProjectType } from "@/types";
import EmptyState from "../components/shared/EmptyState";
import { Slide } from "../animation/Slide";
import PageHeading from "../components/shared/PageHeading";
import { showcaseProjects } from "@/lib/data";

export const metadata: Metadata = {
  title: "Projects | Anshul Patil",
  metadataBase: new URL("https://anshulpatil.dev/projects"),
  description: "Explore projects built by Anshul Patil",
  openGraph: {
    title: "Projects | Anshul Patil",
    url: "https://anshulpatil.dev/projects",
    description: "Explore projects built by Anshul Patil",
  },
};

export default function Project() {
  return (
    <main className="max-w-7xl mx-auto md:px-16 px-6">
      <PageHeading
        title="Projects"
        description="Focused repositories across AI code review, legal data scraping, distributed-systems reliability, competitive programming, portfolio tooling, and notebook-based ML experimentation."
      />

      <Slide delay={0.1}>
        {showcaseProjects.length > 0 ? (
          <section className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5 mb-12">
            {showcaseProjects.map((project) => (
              <Link
                href={`/projects/${project.slug}`}
                key={project._id}
                className="flex items-center gap-x-4 border dark:border-zinc-800 border-zinc-300 dark:hover:border-zinc-600 hover:border-zinc-400 p-4 transition-colors duration-150"
              >
                {project.logo ? (
                  <Image
                    src={project.logo}
                    width={60}
                    height={60}
                    alt={project.name}
                    className="border dark:border-zinc-700 border-zinc-300 p-2"
                  />
                ) : (
                  <div className="border dark:border-zinc-700 border-zinc-300 w-[60px] h-[60px] shrink-0 grid place-items-center font-mono text-xs dark:text-zinc-500 text-zinc-400">
                    {"{}"}
                  </div>
                )}
                <div>
                  <h2 className="text-lg tracking-wide mb-1">{project.name}</h2>
                  <div className="text-sm dark:text-zinc-400 text-zinc-600">
                    {project.tagline}
                  </div>
                </div>
              </Link>
            ))}
          </section>
        ) : (
          <EmptyState value="Projects" />
        )}
      </Slide>
    </main>
  );
}
