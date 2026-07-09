import Link from "next/link";
import { profile, products, showcaseProjects, openSourceContributions, posts } from "@/lib/data";
import Job from "./components/pages/Job";
import { Slide } from "./animation/Slide";
import ContributionGraph from "./components/pages/GithubCalendarComponent";
import LeetCodeStats from "./components/pages/LeetCodeStats";
import Usage from "./components/pages/Usage";
import Achievements from "./components/pages/Achievements";
import Posts from "./components/pages/Posts";
import ResearchSection from "./components/pages/ResearchSection";
import EmptyState from "./components/shared/EmptyState";
import Hero from "./components/pages/Hero";
import BentoGrid from "./components/pages/BentoGrid";

function SectionHeading({ index, title }: { index: string; title: string }) {
  return (
    <div className="flex items-baseline gap-4 mb-4">
      <span className="font-mono text-xs dark:text-zinc-600 text-zinc-400">{index}</span>
      <h2 className="font-incognito text-4xl font-bold tracking-tight">{title}</h2>
    </div>
  );
}

export default function Home() {
  return (
    <main className="max-w-7xl mx-auto md:px-16 px-6 lg:mt-32 mt-20">
      {/* Hero — Editorial masthead */}
      <Hero />

      {/* Bento Grid — Quick Stats */}
      <BentoGrid />

      {/* Work Experience */}
      <Job />

      {/* Products */}
      <section id="products" className="scroll-mt-28 mt-40">
        <Slide delay={0.1}>
          <SectionHeading index="01" title="Products" />
          <p className="dark:text-zinc-400 text-zinc-600 max-w-2xl mb-10">
            Buyer-facing products built around AI code intelligence, document search, and research workflows.
          </p>
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-6">
            {products.map((product) => (
              <article
                key={product._id}
                className="flex flex-col border dark:border-zinc-800 border-zinc-300 dark:hover:border-zinc-600 hover:border-zinc-400 p-6 transition-colors duration-200"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <p className="text-xs uppercase tracking-widest font-mono dark:text-zinc-500 text-zinc-400 mb-2">
                      {product.status}
                    </p>
                    <h3 className="font-incognito text-2xl font-semibold tracking-tight">
                      {product.name}
                    </h3>
                  </div>
                  <span className="text-xs font-mono border dark:border-zinc-700 border-zinc-300 dark:text-zinc-400 text-zinc-500 px-2 py-1 shrink-0">
                    Product
                  </span>
                </div>
                <p className="text-sm dark:text-zinc-400 text-zinc-600 leading-relaxed mb-4">
                  {product.description}
                </p>
                <div className="grid sm:grid-cols-3 grid-cols-1 gap-2 mb-4">
                  {product.metrics?.map((metric) => (
                    <div
                      key={metric.label}
                      className="border dark:border-zinc-800 border-zinc-200 px-3 py-2"
                    >
                      <p className="font-incognito text-lg font-bold">{metric.value}</p>
                      <p className="text-xs dark:text-zinc-500 text-zinc-400">{metric.label}</p>
                    </div>
                  ))}
                </div>
                <ul className="space-y-2 mb-5">
                  {product.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-2.5 text-sm dark:text-zinc-400 text-zinc-600">
                      <span className="mt-1.5 h-1.5 w-1.5 dark:bg-zinc-500 bg-zinc-400 shrink-0" />
                      {bullet}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-4 border-t dark:border-zinc-800 border-zinc-200 flex flex-wrap items-center gap-3">
                  <span className="text-xs dark:text-zinc-500 text-zinc-400">
                    For: {product.audience}
                  </span>
                  <a
                    href={product.repository}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto text-xs font-mono dark:text-zinc-300 text-zinc-700 hover:underline"
                  >
                    Repository &rarr;
                  </a>
                </div>
              </article>
            ))}
          </div>
        </Slide>
      </section>

      {/* Projects */}
      <section id="projects" className="scroll-mt-28 mt-40">
        <Slide delay={0.1}>
          <SectionHeading index="02" title="Projects" />
          <p className="dark:text-zinc-400 text-zinc-600 max-w-xl mb-10">
            Focused repositories that show backend, AI, systems, scraping, frontend, and research experimentation.
          </p>
          {showcaseProjects.length > 0 ? (
            <div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6 mb-12">
              {showcaseProjects.map((project) => (
                <div
                  key={project._id}
                  className="flex flex-col border dark:border-zinc-800 border-zinc-300 dark:hover:border-zinc-600 hover:border-zinc-400 p-5 transition-colors duration-200"
                >
                  {/* Header */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="border dark:border-zinc-700 border-zinc-300 p-2.5 text-base shrink-0 font-mono dark:text-zinc-400 text-zinc-500">
                      {"{}"}
                    </div>
                    <h3 className="font-incognito text-base font-semibold leading-snug tracking-tight pt-0.5">
                      {project.name}
                    </h3>
                  </div>

                  {/* Description — first sentence only */}
                  <p className="text-sm dark:text-zinc-400 text-zinc-600 leading-relaxed mb-4 flex-1">
                    {project.description.split(". ")[0] + "."}
                  </p>

                  {/* Tech tags */}
                  <div className="flex flex-wrap gap-x-3 gap-y-1.5 mb-4 font-mono text-xs dark:text-zinc-500 text-zinc-500">
                    {project.tagline.split(",").map((t) => t.trim()).map((tag, i, arr) => (
                      <span key={tag}>
                        {tag}
                        {i < arr.length - 1 && <span className="ml-3 dark:text-zinc-700 text-zinc-300">/</span>}
                      </span>
                    ))}
                  </div>

                  {/* Action links */}
                  <div className="flex items-center gap-4 mt-auto pt-3 border-t dark:border-zinc-800 border-zinc-200 font-mono text-xs">
                    {project.projectUrl && (
                      <a
                        href={project.projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="dark:text-zinc-200 text-zinc-800 hover:underline"
                      >
                        Live &rarr;
                      </a>
                    )}
                    {project.repository && (
                      <a
                        href={project.repository}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="dark:text-zinc-400 text-zinc-500 hover:dark:text-zinc-200 hover:text-zinc-800 transition-colors duration-150"
                      >
                        GitHub
                      </a>
                    )}
                    <Link
                      href={`/projects/${project.slug}`}
                      className="ml-auto dark:text-zinc-400 text-zinc-500 hover:dark:text-zinc-200 hover:text-zinc-800 transition-colors duration-150"
                    >
                      Details &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState value="Projects" />
          )}
        </Slide>
      </section>

      {/* Open Source */}
      <section id="open-source" className="scroll-mt-28 mt-40">
        <Slide delay={0.1}>
          <SectionHeading index="03" title="Open Source" />
          <p className="dark:text-zinc-400 text-zinc-600 max-w-2xl mb-10">
            Contribution work across AI tooling, document intelligence, infrastructure, protocol, and C++ geometry repositories.
          </p>
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-6">
            {openSourceContributions.map((repo) => (
              <article
                key={repo._id}
                className="border dark:border-zinc-800 border-zinc-300 p-5"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h3 className="font-incognito text-lg font-semibold tracking-tight">
                      {repo.name}
                    </h3>
                    <p className="text-sm dark:text-zinc-400 text-zinc-600 mt-1">
                      {repo.description}
                    </p>
                  </div>
                  <a
                    href={repo.repository}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${repo.name} repository`}
                    className="font-mono text-xs dark:text-zinc-400 text-zinc-500 hover:dark:text-zinc-200 hover:text-zinc-800 shrink-0"
                  >
                    Repo &rarr;
                  </a>
                </div>
                <p className="text-xs font-mono dark:text-zinc-500 text-zinc-400 mb-4">
                  {repo.focus}
                </p>
                {repo.pullRequests && repo.pullRequests.length > 0 && (
                  <div className="space-y-2">
                    {repo.pullRequests.slice(0, 5).map((pr) => (
                      <a
                        key={`${repo._id}-${pr.number}`}
                        href={pr.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start gap-2 text-sm dark:text-zinc-300 text-zinc-700 hover:underline"
                      >
                        <span className="font-mono text-xs dark:text-zinc-500 text-zinc-400 pt-0.5">
                          #{pr.number}
                        </span>
                        <span className="flex-1">{pr.title}</span>
                        <span className="text-[10px] uppercase font-mono border dark:border-zinc-700 border-zinc-300 dark:text-zinc-400 text-zinc-600 px-1.5 py-0.5">
                          {pr.state}
                        </span>
                      </a>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        </Slide>
      </section>

      {/* Research */}
      <ResearchSection />

      {/* About */}
      <section id="about" className="scroll-mt-28 mt-40">
        <Slide>
          <SectionHeading index="05" title="About" />
          <div className="dark:text-zinc-400 text-zinc-600 leading-relaxed space-y-4 max-w-2xl mt-6">
            {profile.fullBio.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </Slide>
        <Usage />
        <Achievements />
      </section>

      {/* GitHub Activity */}
      <ContributionGraph />

      {/* LeetCode */}
      <LeetCodeStats />

      {/* Contact */}
      <section id="contact" className="scroll-mt-28 mt-40 mb-16">
        <Slide delay={0.1}>
          <SectionHeading index="06" title="Get In Touch" />
          <p className="dark:text-zinc-400 text-zinc-600 max-w-xl mb-10">
            Available for backend and systems internships — Summer 2026. Open to remote and hybrid roles.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl">
            <a
              href={`mailto:${profile.email}`}
              className="flex flex-col gap-3 border dark:border-zinc-800 border-zinc-300 dark:hover:border-zinc-600 hover:border-zinc-400 p-5 transition-colors duration-200"
            >
              <p className="font-semibold text-sm mb-0.5">Email</p>
              <p className="text-xs dark:text-zinc-500 text-zinc-400 break-all">{profile.email}</p>
            </a>
            <a
              href="https://www.linkedin.com/in/anshul-patil-575006280/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col gap-3 border dark:border-zinc-800 border-zinc-300 dark:hover:border-zinc-600 hover:border-zinc-400 p-5 transition-colors duration-200"
            >
              <p className="font-semibold text-sm mb-0.5">LinkedIn</p>
              <p className="text-xs dark:text-zinc-500 text-zinc-400">Anshul Patil</p>
            </a>
            <a
              href={profile.resumeURL}
              download
              className="flex flex-col gap-3 border dark:border-zinc-700 border-zinc-400 dark:hover:border-zinc-500 hover:border-zinc-600 p-5 transition-colors duration-200"
            >
              <p className="font-semibold text-sm mb-0.5">R&eacute;sum&eacute;</p>
              <p className="text-xs dark:text-zinc-500 text-zinc-400">Download PDF</p>
            </a>
          </div>
          <p className="mt-6 text-xs font-mono dark:text-zinc-600 text-zinc-400">
            Currently at IIIT Surat · Mumbai, India · Open to remote and hybrid roles
          </p>
        </Slide>
      </section>

      {/* Blog — hidden until posts exist */}
      {posts.length > 0 && (
        <section id="blog" className="scroll-mt-28 mt-40 mb-16">
          <Slide delay={0.1}>
            <SectionHeading index="07" title="Blog" />
            <p className="dark:text-zinc-400 text-zinc-600 max-w-xl mb-10">
              Personal stories about things I&apos;ve learned, projects I&apos;m working on, and general findings.
            </p>
            <Posts />
          </Slide>
        </section>
      )}
    </main>
  );
}
