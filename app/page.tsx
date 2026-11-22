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
import EngravingImage from "./components/shared/EngravingImage";
import SectionHead from "./components/shared/SectionHead";

const aboutSummary =
  "Now: LFX mentee at CNCF OpenKruise and a Kubescape project member with 90+ merged PRs. Before: Google Summer of Code 2026 at BRL-CAD, and an internship at Techvisio Design where I cut API latency 40%. B.Tech at IIIT Surat, class of 2028.";

const gsocJob = jobs.find((j) => j._id === "gsoc-2026");
const manifold = openSourceContributions.find((r) => r._id === "manifold");
const otherRepos = openSourceContributions.filter((r) => r._id !== "manifold");
const githubLink = socialLinks.find((l) => l.name === "GitHub");
const linkedinLink = socialLinks.find((l) => l.name === "LinkedIn");
const aiPrReviewer = projects.find((p) => p._id === "ai-pr-reviewer");
const docRag = projects.find((p) => p._id === "intelligent-doc-processing");

function SectionHeading({ index, title }: { index: string; title: string }) {
  return <SectionHead index={<>#<ScrambleIndex target={index} /></>} title={title} />;
}

// A margin label beside a block of entries (e.g. "My projects").
function Shelf({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="folio border-t border-line mt-16 pt-6">
      <p className="lg:col-span-3 font-mono text-meta text-muted mb-6 lg:mb-0">{label}</p>
      <div className="lg:col-span-9 grid sm:grid-cols-2 gap-x-10 gap-y-8">{children}</div>
    </div>
  );
}

function Entry({ name, href, children }: { name: string; href: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 mb-1">
        <h4 className="text-lead leading-snug">{name}</h4>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-meta link-muted shrink-0"
        >
          Repo &rarr;
        </a>
      </div>
      {children}
    </div>
  );
}

export default function Home() {
  return (
    <main id="main" className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
      <Hero />

      <div className="folio mb-14 md:mb-16">
        <p className="lg:col-start-4 lg:col-span-6 text-lead text-fg">
          {aboutSummary}
        </p>
      </div>

      <BentoGrid />

      <Job />

      <FeaturedWork />

      <CloserLook />

      {/* Open Source */}
      <section id="open-source" className="scroll-mt-20 mt-28 md:mt-40">
        <SectionHeading index="03" title="My Open Source" />

        <div className="folio lg:items-start">
          <div className="lg:col-start-4 lg:col-span-6">
            <h3 className="text-[2rem] sm:text-[2.375rem] leading-[1.1] tracking-[-0.01em] mb-6">
              Making open-source infrastructure more reliable.
            </h3>
            {gsocJob && (
              <p className="text-body text-fg mb-4">
                {gsocJob.description}
              </p>
            )}
            {manifold && (
              <p className="text-body text-muted mb-8">
                {manifold.focus}
              </p>
            )}
            <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 font-mono text-meta mb-8">
              {manifold && (
                <a
                  href={manifold.repository}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link"
                >
                  elalish/manifold &rarr;
                </a>
              )}
              {gsocJob && (
                <a
                  href={gsocJob.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-muted"
                >
                  Google Summer of Code
                </a>
              )}
            </div>
            {manifold?.pullRequests && manifold.pullRequests.length > 0 && (
              <ul className="border-t border-line">
                {manifold.pullRequests.map((pr) => (
                  <li key={pr.number} className="border-b border-line">
                    <a
                      href={pr.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-baseline gap-4 py-2.5"
                    >
                      <span className="font-mono text-meta text-muted w-14 shrink-0">
                        #{pr.number}
                      </span>
                      <span className="flex-1 text-body text-fg underline decoration-transparent underline-offset-[0.2em] group-hover:decoration-line">
                        {pr.title}
                      </span>
                      <span className="font-mono text-meta text-muted shrink-0">
                        {pr.state}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="hidden lg:block lg:col-start-10 lg:col-span-3 lg:sticky lg:top-24">
            <EngravingImage
              src="/engraving-dore-paradise.jpg"
              alt=""
              sizes="270px"
              className="w-full aspect-[3/4]"
            />
          </div>
        </div>

        <Shelf label="My projects">
          {aiPrReviewer && (
            <Entry name={aiPrReviewer.name} href={aiPrReviewer.repository}>
              <p className="text-small text-muted">{aiPrReviewer.description}</p>
              <p className="font-mono text-meta text-muted mt-2">{aiPrReviewer.tagline}</p>
            </Entry>
          )}
          {docRag && (
            <Entry name={docRag.name} href={docRag.repository}>
              <p className="text-small text-muted">{docRag.description}</p>
              <p className="font-mono text-meta text-muted mt-2">{docRag.tagline}</p>
            </Entry>
          )}
        </Shelf>

        <Shelf label="Also contributing to">
          {otherRepos.map((repo) => (
            <Entry key={repo._id} name={repo.name} href={repo.repository}>
              <p className="text-small text-muted">{repo.description}</p>
            </Entry>
          ))}
        </Shelf>
      </section>

      <ContributionGraph />

      <ResearchSection />

      {/* About */}
      <section id="about" className="scroll-mt-20 mt-28 md:mt-40">
        <SectionHeading index="05" title="About" />
        <Usage nested />
        <Achievements nested />
      </section>

      <LeetCodeStats />

      {/* Contact */}
      <section id="contact" className="scroll-mt-20 mt-28 md:mt-40 mb-16">
        <SectionHeading index="06" title="Get In Touch" />
        <div className="folio">
          <div className="lg:col-start-4 lg:col-span-7">
            <h3 className="text-[2.5rem] sm:text-[3.5rem] leading-[1.02] tracking-[-0.02em] mb-6">
              Let&rsquo;s build something useful.
            </h3>
            <p className="text-lead text-muted max-w-measure mb-10">
              Available for backend, systems, and AI infrastructure internships. Open to remote and hybrid roles.
            </p>
            <div className="flex flex-wrap items-baseline gap-x-8 gap-y-3 text-lead">
              <a href={`mailto:${profile.email}`} className="link">
                Email
              </a>
              {githubLink && (
                <a href={githubLink.url} target="_blank" rel="noopener noreferrer" className="link-muted">
                  GitHub
                </a>
              )}
              {linkedinLink && (
                <a href={linkedinLink.url} target="_blank" rel="noopener noreferrer" className="link-muted">
                  LinkedIn
                </a>
              )}
              <a href={profile.resumeURL} download className="link-muted">
                R&eacute;sum&eacute;
              </a>
            </div>
            <p className="mt-10 font-mono text-meta text-muted">
              Currently at IIIT Surat &middot; Mumbai, Maharashtra &middot; Open to remote and hybrid roles
            </p>
          </div>
        </div>
      </section>

      {posts.length > 0 && (
        <section id="blog" className="scroll-mt-20 mt-28 md:mt-40 mb-16">
          <SectionHeading index="07" title="Blog" />
          <p className="text-body text-muted max-w-measure mb-10">
            Personal stories about things I&apos;ve learned, projects I&apos;m working on, and general findings.
          </p>
          <Posts />
        </section>
      )}
    </main>
  );
}
