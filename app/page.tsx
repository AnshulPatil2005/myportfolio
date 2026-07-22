import { profile, jobs, openSourceContributions, posts, projects } from "@/lib/data";
import { socialLinks } from "@/app/data/social";
import Job from "./components/pages/Job";
import ContributionGraph from "./components/pages/GithubCalendarComponent";
import LeetCodeStats from "./components/pages/LeetCodeStats";
import Usage from "./components/pages/Usage";
import Achievements from "./components/pages/Achievements";
import Posts from "./components/pages/Posts";
import ResearchSection from "./components/pages/ResearchSection";
import Hero from "./components/pages/Hero";
import BentoGrid from "./components/pages/BentoGrid";
import FeaturedWork from "./components/pages/FeaturedWork";
import CloserLook from "./components/pages/CloserLook";
import ScrambleIndex from "./components/global/ScrambleIndex";

const aboutSummary =
  "I'm a B.Tech student at IIIT Surat who has interned at Techvisio Design building analytics dashboards that cut API latency by 40%, and I contribute to open-source projects like Extralit and BRL-CAD's Manifold library. My focus is distributed systems, AI infrastructure, and developer tooling.";

const gsocJob = jobs.find((j) => j._id === "gsoc-2026");
const manifold = openSourceContributions.find((r) => r._id === "manifold");
const otherRepos = openSourceContributions.filter((r) => r._id !== "manifold");
const githubLink = socialLinks.find((l) => l.name === "GitHub");
const linkedinLink = socialLinks.find((l) => l.name === "LinkedIn");
const aiPrReviewer = projects.find((p) => p._id === "ai-pr-reviewer");
const docRag = projects.find((p) => p._id === "intelligent-doc-processing");

function SectionHeading({ index, title }: { index: string; title: string }) {
  return (
    <div className="flex items-baseline gap-4 mb-4">
      <span className="font-mono text-xs dark:text-zinc-600 text-zinc-400">
        <ScrambleIndex target={index} />
      </span>
      <h2 className="font-display font-normal text-4xl tracking-tight">{title}</h2>
    </div>
  );
}

export default function Home() {
  return (
    <main className="max-w-7xl mx-auto md:px-16 px-6 mt-4">
      <Hero />

      <p className="max-w-2xl text-base dark:text-zinc-400 text-zinc-600 leading-relaxed mb-16 md:mb-20">
        {aboutSummary}
      </p>

      <BentoGrid />

      <Job />

      <FeaturedWork />

      <CloserLook />

      {/* Open Source */}
      <section id="open-source" className="scroll-mt-20 mt-32 md:mt-40">
        <SectionHeading index="03" title="My Open Source" />

        <div className="border-t dark:border-zinc-800 border-zinc-300 pt-10 mt-6">
          <h3 className="text-3xl sm:text-4xl font-bold tracking-tight max-w-2xl mb-6">
            Making geometry infrastructure more reliable.
          </h3>
          {gsocJob && (
            <p className="dark:text-zinc-400 text-zinc-600 leading-relaxed max-w-2xl mb-4">
              {gsocJob.description}
            </p>
          )}
          {manifold && (
            <p className="dark:text-zinc-400 text-zinc-600 leading-relaxed max-w-2xl mb-8">
              {manifold.focus}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-sm mb-8">
            {manifold && (
              <a
                href={manifold.repository}
                target="_blank"
                rel="noopener noreferrer"
                className="dark:text-white text-zinc-900 hover:underline"
              >
                elalish/manifold &rarr;
              </a>
            )}
            {gsocJob && (
              <a
                href={gsocJob.url}
                target="_blank"
                rel="noopener noreferrer"
                className="dark:text-zinc-400 text-zinc-500 dark:hover:text-white hover:text-zinc-900 transition-colors duration-150"
              >
                Google Summer of Code
              </a>
            )}
          </div>
          {manifold?.pullRequests && manifold.pullRequests.length > 0 && (
            <ul className="space-y-2 max-w-2xl">
              {manifold.pullRequests.map((pr) => (
                <li key={pr.number}>
                  <a
                    href={pr.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 text-sm dark:text-zinc-300 text-zinc-700 hover:underline"
                  >
                    <span className="font-mono text-xs dark:text-zinc-500 text-zinc-400 pt-0.5 shrink-0">
                      #{pr.number}
                    </span>
                    <span className="flex-1">{pr.title}</span>
                    <span className="text-[10px] uppercase font-mono dark:text-zinc-500 text-zinc-500 shrink-0 pt-0.5">
                      {pr.state}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t dark:border-zinc-800 border-zinc-300 mt-16 pt-10">
          <p className="text-xs uppercase tracking-widest font-mono dark:text-zinc-500 text-zinc-400 mb-6">
            My projects
          </p>
          <div className="grid sm:grid-cols-2 gap-x-10 gap-y-8">
            {aiPrReviewer && (
              <div>
                <div className="flex items-baseline justify-between gap-3 mb-1">
                  <h4 className="font-semibold">{aiPrReviewer.name}</h4>
                  <a
                    href={aiPrReviewer.repository}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs dark:text-zinc-500 text-zinc-400 dark:hover:text-white hover:text-zinc-900 shrink-0"
                  >
                    Repo &rarr;
                  </a>
                </div>
                <p className="text-sm dark:text-zinc-400 text-zinc-600 leading-relaxed">
                  {aiPrReviewer.description}
                </p>
                <p className="font-mono text-xs dark:text-zinc-600 text-zinc-400 mt-2">
                  {aiPrReviewer.tagline}
                </p>
              </div>
            )}
            {docRag && (
              <div>
                <div className="flex items-baseline justify-between gap-3 mb-1">
                  <h4 className="font-semibold">{docRag.name}</h4>
                  <a
                    href={docRag.repository}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs dark:text-zinc-500 text-zinc-400 dark:hover:text-white hover:text-zinc-900 shrink-0"
                  >
                    Repo &rarr;
                  </a>
                </div>
                <p className="text-sm dark:text-zinc-400 text-zinc-600 leading-relaxed">
                  {docRag.description}
                </p>
                <p className="font-mono text-xs dark:text-zinc-600 text-zinc-400 mt-2">
                  {docRag.tagline}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="border-t dark:border-zinc-800 border-zinc-300 mt-16 pt-10">
          <p className="text-xs uppercase tracking-widest font-mono dark:text-zinc-500 text-zinc-400 mb-6">
            Also contributing to
          </p>
          <div className="grid sm:grid-cols-2 gap-x-10 gap-y-6">
            {otherRepos.map((repo) => (
              <div key={repo._id}>
                <div className="flex items-baseline justify-between gap-3">
                  <h4 className="font-semibold">{repo.name}</h4>
                  <a
                    href={repo.repository}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs dark:text-zinc-500 text-zinc-400 dark:hover:text-white hover:text-zinc-900 shrink-0"
                  >
                    Repo &rarr;
                  </a>
                </div>
                <p className="text-sm dark:text-zinc-400 text-zinc-600 mt-1">{repo.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ContributionGraph />

      <ResearchSection />

      {/* About */}
      <section id="about" className="scroll-mt-20 mt-32 md:mt-40">
        <SectionHeading index="05" title="About" />
        <Usage />
        <Achievements />
      </section>

      <LeetCodeStats />

      {/* Contact */}
      <section id="contact" className="scroll-mt-20 mt-32 md:mt-40 mb-16">
        <SectionHeading index="06" title="Get In Touch" />
        <h3 className="text-3xl sm:text-5xl font-bold tracking-tight max-w-xl mt-6 mb-5">
          Let&rsquo;s build something useful.
        </h3>
        <p className="dark:text-zinc-400 text-zinc-600 max-w-xl mb-10">
          Available for backend and systems internships, Summer 2026. Open to remote and hybrid roles.
        </p>
        <div className="flex flex-wrap items-center gap-x-10 gap-y-4 font-mono text-sm">
          <a
            href={`mailto:${profile.email}`}
            className="dark:text-white text-zinc-900 border-b dark:border-zinc-700 border-zinc-400 pb-0.5 dark:hover:border-accent hover:border-accent transition-colors duration-150"
          >
            Email
          </a>
          {githubLink && (
            <a
              href={githubLink.url}
              target="_blank"
              rel="noopener noreferrer"
              className="dark:text-zinc-400 text-zinc-500 border-b border-transparent pb-0.5 dark:hover:text-white hover:text-zinc-900 dark:hover:border-zinc-700 hover:border-zinc-400 transition-colors duration-150"
            >
              GitHub
            </a>
          )}
          {linkedinLink && (
            <a
              href={linkedinLink.url}
              target="_blank"
              rel="noopener noreferrer"
              className="dark:text-zinc-400 text-zinc-500 border-b border-transparent pb-0.5 dark:hover:text-white hover:text-zinc-900 dark:hover:border-zinc-700 hover:border-zinc-400 transition-colors duration-150"
            >
              LinkedIn
            </a>
          )}
          <a
            href={profile.resumeURL}
            download
            className="dark:text-zinc-400 text-zinc-500 border-b border-transparent pb-0.5 dark:hover:text-white hover:text-zinc-900 dark:hover:border-zinc-700 hover:border-zinc-400 transition-colors duration-150"
          >
            R&eacute;sum&eacute;
          </a>
        </div>
        <p className="mt-8 text-xs font-mono dark:text-zinc-600 text-zinc-400">
          Currently at IIIT Surat &middot; Mumbai, India &middot; Open to remote and hybrid roles
        </p>
      </section>

      {posts.length > 0 && (
        <section id="blog" className="scroll-mt-20 mt-32 md:mt-40 mb-16">
          <SectionHeading index="07" title="Blog" />
          <p className="dark:text-zinc-400 text-zinc-600 max-w-xl mb-10">
            Personal stories about things I&apos;ve learned, projects I&apos;m working on, and general findings.
          </p>
          <Posts />
        </section>
      )}
    </main>
  );
}
