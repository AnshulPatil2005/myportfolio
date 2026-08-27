import type { Metadata } from "next";
import { resume } from "@/lib/resume";

export const metadata: Metadata = {
  title: "Résumé | Anshul Patil",
  description: "Anshul Patil — backend and systems developer. GSoC @ BRL-CAD.",
};

// A print-first résumé rendered from the same data as the site, so the two can
// never disagree. Ctrl/Cmd-P here produces the PDF; /api/resume is the same
// content as plain text for ATS forms.
export default function ResumePage() {
  return (
    <main className="max-w-3xl mx-auto px-6 md:px-16 py-10 print:py-0 print:max-w-none">
      <div className="print:hidden mb-8 flex flex-wrap items-center gap-3 border dark:border-zinc-800 border-zinc-200 p-4">
        <p className="font-mono text-[11px] dark:text-zinc-400 text-zinc-600 mr-auto">
          Generated from the same data as this site — it cannot drift.
        </p>
        <a
          href="/api/resume"
          className="font-mono text-[10px] uppercase tracking-[0.18em] dark:text-zinc-300 text-zinc-700 border dark:border-zinc-700 border-zinc-300 px-3 py-2 hover:dark:border-zinc-500 hover:border-zinc-400 transition-colors"
        >
          Plain text (ATS)
        </a>
        <a
          href={"/AnshulPatil.pdf"}
          download
          className="font-mono text-[10px] uppercase tracking-[0.18em] dark:text-zinc-300 text-zinc-700 border dark:border-zinc-700 border-zinc-300 px-3 py-2 hover:dark:border-zinc-500 hover:border-zinc-400 transition-colors"
        >
          PDF
        </a>
      </div>

      <header className="mb-8">
        <h1 className="font-display text-4xl mb-1 print:text-3xl">{resume.name}</h1>
        <p className="text-[15px] dark:text-zinc-300 text-zinc-700 mb-2">{resume.headline}</p>
        <p className="font-mono text-[12px] dark:text-zinc-400 text-zinc-600">
          {resume.location} · <a href={`mailto:${resume.email}`} className="underline underline-offset-2">{resume.email}</a>
          {" · "}
          <a href={resume.github} className="underline underline-offset-2">GitHub</a>
          {" · "}
          <a href={resume.linkedin} className="underline underline-offset-2">LinkedIn</a>
        </p>
      </header>

      <Section title="Summary">
        <p className="text-[14px] leading-relaxed dark:text-zinc-300 text-zinc-700">{resume.summary}</p>
      </Section>

      <Section title="Education">
        <p className="text-[14px] dark:text-zinc-200 text-zinc-800">
          <span className="font-semibold">{resume.education.degree}</span>, {resume.education.school}
        </p>
        <p className="font-mono text-[12px] dark:text-zinc-500 text-zinc-500">{resume.education.dates}</p>
      </Section>

      <Section title="Experience">
        {resume.experience.map(e => (
          <article key={e.org} className="mb-5 break-inside-avoid">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4">
              <h3 className="text-[15px] font-semibold dark:text-zinc-100 text-zinc-900">
                {e.title} — {e.url ? <a href={e.url} className="underline underline-offset-2">{e.org}</a> : e.org}
              </h3>
              <span className="font-mono text-[11px] dark:text-zinc-500 text-zinc-500">{e.dates}</span>
            </div>
            <ul className="mt-1.5 space-y-1">
              {e.bullets.map(b => (
                <li key={b} className="text-[13.5px] leading-relaxed dark:text-zinc-300 text-zinc-700 pl-4 relative">
                  <span className="absolute left-0 dark:text-zinc-600 text-zinc-400">▸</span>
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
            <h3 className="text-[15px] font-semibold dark:text-zinc-100 text-zinc-900">
              {p.url ? <a href={p.url} className="underline underline-offset-2">{p.name}</a> : p.name}
              <span className="font-normal dark:text-zinc-400 text-zinc-600"> — {p.tagline}</span>
            </h3>
            <ul className="mt-1.5 space-y-1">
              {p.bullets.slice(0, 3).map(b => (
                <li key={b} className="text-[13.5px] leading-relaxed dark:text-zinc-300 text-zinc-700 pl-4 relative">
                  <span className="absolute left-0 dark:text-zinc-600 text-zinc-400">▸</span>
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
            <h3 className="text-[14px] font-semibold dark:text-zinc-100 text-zinc-900">
              {p.url ? <a href={p.url} className="underline underline-offset-2">{p.name}</a> : p.name}
              <span className="font-normal dark:text-zinc-400 text-zinc-600"> — {p.tagline}</span>
            </h3>
            <p className="text-[13px] leading-relaxed dark:text-zinc-300 text-zinc-700">{p.description}</p>
          </article>
        ))}
      </Section>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-7 break-inside-avoid">
      <h2 className="font-mono text-[11px] uppercase tracking-[0.22em] dark:text-zinc-500 text-zinc-500 border-b dark:border-zinc-800 border-zinc-300 pb-1.5 mb-3">
        {title}
      </h2>
      {children}
    </section>
  );
}
