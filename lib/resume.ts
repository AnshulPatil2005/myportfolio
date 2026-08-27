import { profile, jobs, products, showcaseProjects, openSourceContributions } from "@/lib/data";
import { socialLinks } from "@/app/data/social";

// One résumé, built from the same data the site renders. The web page, the
// printable version and the ATS-friendly text file all read from here, so
// they cannot drift apart the way a hand-maintained PDF does.

const link = (name: string) => socialLinks.find(s => s.name === name)?.url ?? "";

export const resume = {
  name: profile.fullName,
  headline: profile.headline,
  location: profile.location,
  email: profile.email,
  github: link("GitHub"),
  linkedin: link("LinkedIn"),
  summary: profile.shortBio,
  education: {
    school: "Indian Institute of Information Technology, Surat",
    degree: "B.Tech",
    dates: "2024 – 2028",
  },
  experience: jobs.map(j => ({
    org: j.name,
    title: j.jobTitle,
    url: j.url,
    dates: formatRange(j.startDate, j.endDate),
    bullets: j.bullets ?? [],
  })),
  products: products.map(p => ({
    name: p.name,
    tagline: p.tagline,
    url: p.projectUrl || p.repository,
    bullets: p.bullets ?? [],
  })),
  projects: showcaseProjects.map(p => ({
    name: p.name,
    tagline: p.tagline,
    url: p.projectUrl || p.repository,
    description: p.description,
  })),
  openSource: openSourceContributions.map(o => ({
    name: o.name,
    url: o.repository,
    description: o.description,
  })),
};

function formatRange(start?: string, end?: string) {
  const f = (d?: string) => {
    if (!d) return "";
    const dt = new Date(d);
    if (Number.isNaN(dt.getTime())) return "";
    return dt.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };
  const a = f(start);
  const b = f(end);
  if (!a && !b) return "Present";
  return `${a || "—"} – ${b || "Present"}`;
}

// Plain text, wrapped for the terminal-width readers and ATS parsers that
// mangle PDF layout into nonsense.
export function resumeText(): string {
  const L: string[] = [];
  const rule = (c = "=") => L.push(c.repeat(72));
  const wrap = (text: string, indent = "  ") => {
    const words = text.split(/\s+/);
    let line = indent;
    for (const w of words) {
      if ((line + w).length > 72) { L.push(line.trimEnd()); line = indent; }
      line += w + " ";
    }
    if (line.trim()) L.push(line.trimEnd());
  };

  L.push(resume.name.toUpperCase());
  L.push(resume.headline);
  L.push(`${resume.location}  |  ${resume.email}`);
  L.push(`${resume.github}  |  ${resume.linkedin}`);
  L.push("");
  rule();
  L.push("SUMMARY");
  rule();
  wrap(resume.summary, "");
  L.push("");

  rule();
  L.push("EDUCATION");
  rule();
  L.push(`${resume.education.degree}, ${resume.education.school}`);
  L.push(resume.education.dates);
  L.push("");

  rule();
  L.push("EXPERIENCE");
  rule();
  for (const e of resume.experience) {
    L.push(`${e.title} — ${e.org}`);
    L.push(`${e.dates}${e.url ? `  |  ${e.url}` : ""}`);
    for (const b of e.bullets) wrap(`- ${b}`, "  ");
    L.push("");
  }

  rule();
  L.push("PRODUCTS");
  rule();
  for (const p of resume.products) {
    L.push(`${p.name} — ${p.tagline}`);
    if (p.url) L.push(`  ${p.url}`);
    for (const b of p.bullets) wrap(`- ${b}`, "  ");
    L.push("");
  }

  rule();
  L.push("SELECTED PROJECTS");
  rule();
  for (const p of resume.projects) {
    L.push(`${p.name} — ${p.tagline}`);
    if (p.url) L.push(`  ${p.url}`);
    wrap(p.description, "  ");
    L.push("");
  }

  if (resume.openSource.length) {
    rule();
    L.push("OPEN SOURCE");
    rule();
    for (const o of resume.openSource) {
      L.push(`${o.name}${o.url ? `  |  ${o.url}` : ""}`);
      if (o.description) wrap(o.description, "  ");
      L.push("");
    }
  }

  L.push("Generated from anshulpatil.is-a.dev — the site and this file share one source.");
  return L.join("\n");
}
