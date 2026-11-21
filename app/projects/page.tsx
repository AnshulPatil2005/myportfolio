import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import EmptyState from "../components/shared/EmptyState";
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
    <main className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
      <PageHeading
        title="Projects"
        description="Focused repositories across AI code review, legal data scraping, distributed-systems reliability, competitive programming, portfolio tooling, and notebook-based ML experimentation."
      />

      {showcaseProjects.length > 0 ? (
        <section className="border-t border-line mb-12">
          {showcaseProjects.map((project) => (
            <Link
              href={`/projects/${project.slug}`}
              key={project._id}
              className="group folio items-baseline border-b border-line py-7"
            >
              <div className="lg:col-span-3 mb-3 lg:mb-0">
                {project.logo ? (
                  <Image
                    src={project.logo}
                    width={48}
                    height={48}
                    alt={project.name}
                    className="border border-line p-1.5"
                  />
                ) : (
                  <span className="font-mono text-meta text-muted">
                    {"{}"}
                  </span>
                )}
              </div>
              <div className="lg:col-span-9">
                <h2 className="text-h3 text-fg underline decoration-transparent underline-offset-[0.15em] group-hover:decoration-line transition-colors">
                  {project.name}
                </h2>
                <div className="mt-1.5 font-mono text-meta text-muted">
                  {project.tagline}
                </div>
              </div>
            </Link>
          ))}
        </section>
      ) : (
        <EmptyState value="Projects" />
      )}
    </main>
  );
}
