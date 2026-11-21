import type { Metadata } from "next";
import { resume } from "@/lib/resume";

export const metadata: Metadata = {
  title: "Résumé | Anshul Patil",
  description: "Anshul Patil — backend and systems developer. Founder @ Stratum, LFX @ CNCF OpenKruise, Kubescape member.",
};

// A print-first résumé rendered from the same data as the site, so the two can
// never disagree. Ctrl/Cmd-P here produces the PDF; /api/resume is the same
// content as plain text for ATS forms.
export default function ResumePage() {
  return (
    <main className="max-w-3xl mx-auto px-6 md:px-12 py-10 md:py-16 print:py-0 print:max-w-none">
      <div className="print:hidden mb-8 flex flex-wrap items-center gap-3 border border-line p-4">
        <p className="font-mono text-meta text-muted mr-auto">
          Generated from the same data as this site — it cannot drift.
        </p>
        <a
          href="/api/resume"
          className="font-mono text-meta text-fg border border-line px-3 py-2 hover:border-fg transition-colors"
        >
          Plain text (ATS)
        </a>
        <a
          href={"/AnshulPatil.pdf"}
          download
          className="font-mono text-meta text-fg border border-line px-3 py-2 hover:border-fg transition-colors"
        >
          PDF
        </a>
      </div>

      <header className="mb-8">
        <h1 className="text-[3rem] sm:text-[3.75rem] leading-none tracking-[-0.02em] mb-3 print:text-3xl">{resume.name}</h1>
        <p className="text-lead text-fg mb-2">{resume.headline}</p>
        <p className="font-mono text-meta text-muted">
          {resume.location} · <a href={`mailto:${resume.email}`} className="link">{resume.email}</a>
          {" · "}
          <a href={resume.github} className="link">GitHub</a>
          {" · "}
          <a href={resume.linkedin} className="link">LinkedIn</a>
        </p>
      </header>

      <Section title="Summary">
        <p className="text-body text-fg">{resume.summary}</p>
      </Section>

      <Section title="Education">
        <p className="text-body text-fg">
          <span className="font-medium">{resume.education.degree}</span>, {resume.education.school}
        </p>
        <p className="font-mono text-meta text-muted">{resume.education.dates}</p>
      </Section>

      <Section title="Experience">
        {resume.experience.map(e => (
          <article key={e.org} className="mb-5 break-inside-avoid">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4">
              <h3 className="text-lead font-medium text-fg">
                {e.title} — {e.url ? <a href={e.url} className="link">{e.org}</a> : e.org}
              </h3>
              <span className="font-mono text-meta text-muted">{e.dates}</span>
            </div>
            <ul className="mt-1.5 space-y-1">
              {e.bullets.map(b => (
                <li key={b} className="text-small text-fg pl-4 relative">
                  <span className="absolute left-0 text-muted">▸</span>
                  {b}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </Section>

      <Section title="Products">
        {resume.products.map(p => (
          <article key={p.name} className="mb-5 break-inside-avoid">
            <h3 className="text-lead font-medium text-fg">
              {p.url ? <a href={p.url} className="link">{p.name}</a> : p.name}
              <span className="font-normal text-muted"> — {p.tagline}</span>
            </h3>
            <ul className="mt-1.5 space-y-1">
              {p.bullets.slice(0, 3).map(b => (
                <li key={b} className="text-small text-fg pl-4 relative">
                  <span className="absolute left-0 text-muted">▸</span>
                  {b}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </Section>

      <Section title="Selected projects">
        {resume.projects.slice(0, 4).map(p => (
          <article key={p.name} className="mb-3.5 break-inside-avoid">
            <h3 className="text-body font-medium text-fg">
              {p.url ? <a href={p.url} className="link">{p.name}</a> : p.name}
              <span className="font-normal text-muted"> — {p.tagline}</span>
            </h3>
            <p className="text-small text-fg">{p.description}</p>
          </article>
        ))}
      </Section>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-7 break-inside-avoid">
      <h2 className="font-mono text-meta text-muted border-b border-line pb-1.5 mb-3">
        {title}
      </h2>
      {children}
    </section>
  );
}
