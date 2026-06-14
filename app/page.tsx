import Link from "next/link";
import { profile, projects, posts } from "@/lib/data";
import Job from "./components/pages/Job";
import { Slide } from "./animation/Slide";
import ContributionGraph from "./components/pages/GithubCalendarComponent";
import LeetCodeStats from "./components/pages/LeetCodeStats";
import Usage from "./components/pages/Usage";
import Achievements from "./components/pages/Achievements";
import Posts from "./components/pages/Posts";
import ResearchSection from "./components/pages/ResearchSection";
import EmptyState from "./components/shared/EmptyState";
import TerminalHero from "./components/pages/TerminalHero";
import BentoGrid from "./components/pages/BentoGrid";
import { BiSolidDownload, BiEnvelope, BiLinkExternal, BiLogoGithub, BiLogoLinkedin } from "react-icons/bi";

export default function Home() {
  return (
    <main className="max-w-7xl mx-auto md:px-16 px-6 lg:mt-32 mt-20">
      {/* Hero — Terminal */}
      <TerminalHero />

      {/* Bento Grid — Quick Stats */}
      <BentoGrid />

      {/* Work Experience */}
      <Job />

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
                    <Link
                      href={`/projects/${project.slug}`}
                      className="flex items-center gap-1 text-xs mt-3 ml-auto dark:text-zinc-400 text-zinc-500 hover:dark:text-zinc-200 hover:text-zinc-800 transition-colors duration-150"
                    >
                      Details →
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

      {/* Research */}
      <ResearchSection />

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
        </Slide>
        <Usage />
        <Achievements />
      </section>

      {/* GitHub Activity */}
      <ContributionGraph />

      {/* LeetCode */}
      <LeetCodeStats />

      {/* Contact */}
      <section id="contact" className="scroll-mt-28 mt-32 mb-16">
        <Slide delay={0.1}>
          <h2 className="font-incognito text-4xl mb-4 font-bold tracking-tight">
            Get In Touch
          </h2>
          <p className="dark:text-zinc-400 text-zinc-600 max-w-xl mb-8">
            Available for backend and systems internships — Summer 2026. Open to remote and hybrid roles.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl">
            <a
              href={`mailto:${profile.email}`}
              className="flex flex-col gap-3 dark:bg-primary-bg bg-zinc-50 border dark:border-zinc-800 border-zinc-200 dark:hover:border-zinc-700 hover:border-zinc-300 rounded-xl p-5 transition-colors duration-200"
            >
              <BiEnvelope className="text-2xl dark:text-zinc-400 text-zinc-500" />
              <div>
                <p className="font-semibold text-sm mb-0.5">Email</p>
                <p className="text-xs dark:text-zinc-500 text-zinc-400 break-all">{profile.email}</p>
              </div>
            </a>
            <a
              href="https://www.linkedin.com/in/anshul-patil-575006280/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col gap-3 dark:bg-primary-bg bg-zinc-50 border dark:border-zinc-800 border-zinc-200 dark:hover:border-zinc-700 hover:border-zinc-300 rounded-xl p-5 transition-colors duration-200"
            >
              <BiLogoLinkedin className="text-2xl dark:text-zinc-400 text-zinc-500" />
              <div>
                <p className="font-semibold text-sm mb-0.5">LinkedIn</p>
                <p className="text-xs dark:text-zinc-500 text-zinc-400">Anshul Patil</p>
              </div>
            </a>
            <a
              href={profile.resumeURL}
              download
              className="flex flex-col gap-3 dark:bg-primary-bg bg-zinc-50 border dark:border-primary-color/30 border-emerald-300 dark:hover:border-primary-color/50 hover:border-emerald-400 rounded-xl p-5 transition-colors duration-200"
            >
              <BiSolidDownload className="text-2xl dark:text-primary-color text-emerald-600" />
              <div>
                <p className="font-semibold text-sm mb-0.5">Résumé</p>
                <p className="text-xs dark:text-zinc-500 text-zinc-400">Download PDF</p>
              </div>
            </a>
          </div>
          <p className="mt-6 text-xs font-mono dark:text-zinc-600 text-zinc-400">
            Currently at IIIT Surat · Mumbai, India · Open to remote and hybrid roles
          </p>
        </Slide>
      </section>

      {/* Blog — hidden until posts exist */}
      {posts.length > 0 && (
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
      )}
    </main>
  );
}
