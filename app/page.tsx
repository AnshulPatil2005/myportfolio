import Image from "next/image";
import Link from "next/link";
import { profile, projects } from "@/lib/data";
import HeroSvg from "./assets/icons/HeroSvg";
import Job from "./components/pages/Job";
import Social from "./components/shared/Social";
import { Slide } from "./animation/Slide";
import ContributionGraph from "./components/pages/GithubCalendarComponent";
import LeetCodeStats from "./components/pages/LeetCodeStats";
import Usage from "./components/pages/Usage";
import Achievements from "./components/pages/Achievements";
import Posts from "./components/pages/Posts";
import ResearchSection from "./components/pages/ResearchSection";
import EmptyState from "./components/shared/EmptyState";
import { BiSolidDownload, BiEnvelope, BiLinkExternal, BiLogoGithub } from "react-icons/bi";

export default function Home() {
  return (
    <main className="max-w-7xl mx-auto md:px-16 px-6 lg:mt-32 mt-20">
      {/* Hero */}
      <section className="flex xl:flex-row flex-col xl:items-center items-start xl:justify-center justify-between gap-x-12 mb-16">
        <div className="lg:max-w-2xl max-w-2xl">
          <Slide>
            <h1 className="font-incognito font-semibold tracking-tight text-3xl sm:text-5xl mb-6 lg:leading-[3.7rem] leading-tight lg:min-w-[700px] min-w-full">
              {profile.headline}
            </h1>
            <p className="text-base dark:text-zinc-400 text-zinc-600 leading-relaxed">
              {profile.shortBio}
            </p>
          </Slide>
          <Slide delay={0.1}>
            <Social type="social" />
          </Slide>
        </div>
        <Slide delay={0.14}>
          <HeroSvg />
        </Slide>
      </section>

      {/* GitHub Activity */}
      <ContributionGraph />

      {/* LeetCode */}
      <LeetCodeStats />

      {/* Work Experience */}
      <Job />

      {/* About */}
      <section id="about" className="scroll-mt-28 mt-32">
        <Slide>
          <h2 className="font-incognito text-4xl mb-8 font-bold tracking-tight">
            About
          </h2>
          <div className="dark:text-zinc-400 text-zinc-600 leading-relaxed space-y-4 max-w-2xl">
            {profile.fullBio.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-4 mt-6">
            <a
              href={profile.resumeURL}
              download
              className="flex items-center gap-x-2 dark:bg-primary-bg bg-zinc-100 border border-transparent dark:hover:border-zinc-700 hover:border-zinc-200 rounded-md px-4 py-2 text-sm font-incognito font-semibold"
            >
              Download Résumé <BiSolidDownload />
            </a>
            <a
              href={`mailto:${profile.email}`}
              className="flex items-center gap-x-2 text-sm hover:text-primary-color dark:text-zinc-400 text-zinc-600"
            >
              <BiEnvelope />
              {profile.email}
            </a>
          </div>
        </Slide>
        <Usage />
        <Achievements />
      </section>

      {/* Projects */}
      <section id="projects" className="scroll-mt-28 mt-32">
        <Slide delay={0.1}>
          <h2 className="font-incognito text-4xl mb-4 font-bold tracking-tight">
            Projects
          </h2>
          <p className="dark:text-zinc-400 text-zinc-600 max-w-xl mb-8">
            A selection of things I&apos;ve built. Many are open-source — check out the code and contribute if something interests you.
          </p>
          {projects.length > 0 ? (
            <div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5 mb-12">
              {projects.map((project) => (
                <div
                  key={project._id}
                  className="flex flex-col dark:bg-primary-bg bg-zinc-50 border dark:border-zinc-800 border-zinc-200 dark:hover:border-zinc-700 hover:border-zinc-300 p-5 rounded-lg transition-colors duration-200"
                >
                  {/* Header */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="dark:bg-zinc-800 bg-zinc-100 border dark:border-zinc-700 border-zinc-200 p-2.5 rounded-md text-base shrink-0 font-mono dark:text-zinc-400 text-zinc-500">
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
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.tagline.split(",").map((t) => t.trim()).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs dark:bg-zinc-800 bg-zinc-100 dark:text-zinc-300 text-zinc-600 px-2 py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Action links */}
                  <div className="flex items-center gap-3 mt-auto pt-1 border-t dark:border-zinc-800 border-zinc-200">
                    {project.projectUrl && (
                      <a
                        href={project.projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs font-medium mt-3 dark:text-zinc-200 text-zinc-800 dark:bg-zinc-800 bg-zinc-200 px-3 py-1.5 rounded-md dark:hover:bg-zinc-700 hover:bg-zinc-300 transition-colors duration-150"
                      >
                        <BiLinkExternal className="shrink-0" />
                        Live Demo
                      </a>
                    )}
                    {project.repository && (
                      <a
                        href={project.repository}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs mt-3 dark:text-zinc-400 text-zinc-500 hover:dark:text-zinc-200 hover:text-zinc-800 transition-colors duration-150"
                      >
                        <BiLogoGithub className="text-base shrink-0" />
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState value="Projects" />
          )}
        </Slide>
      </section>

      {/* Research */}
      <ResearchSection />

      {/* Blog */}
      <section id="blog" className="scroll-mt-28 mt-32 mb-16">
        <Slide delay={0.1}>
          <h2 className="font-incognito text-4xl mb-4 font-bold tracking-tight">
            Blog
          </h2>
          <p className="dark:text-zinc-400 text-zinc-600 max-w-xl mb-8">
            Personal stories about things I&apos;ve learned, projects I&apos;m working on, and general findings.
          </p>
          <Posts />
        </Slide>
      </section>
    </main>
  );
}
