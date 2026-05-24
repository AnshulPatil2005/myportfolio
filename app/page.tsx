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
import EmptyState from "./components/shared/EmptyState";
import { BiSolidDownload, BiEnvelope } from "react-icons/bi";

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
                <Link
                  href={`/projects/${project.slug}`}
                  key={project._id}
                  className="flex items-center gap-x-4 dark:bg-primary-bg bg-zinc-50 border border-transparent dark:hover:border-zinc-700 hover:border-zinc-200 p-4 rounded-lg"
                >
                  {project.logo ? (
                    <Image
                      src={project.logo}
                      width={60}
                      height={60}
                      alt={project.name}
                      className="dark:bg-zinc-800 bg-zinc-100 rounded-md p-2"
                    />
                  ) : (
                    <div className="dark:bg-primary-bg bg-zinc-100 border dark:border-zinc-800 border-zinc-200 p-3 rounded-lg text-xl shrink-0">
                      {"{}"}
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg tracking-wide mb-1">{project.name}</h3>
                    <p className="text-sm dark:text-zinc-400 text-zinc-600">
                      {project.tagline}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState value="Projects" />
          )}
        </Slide>
      </section>

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
