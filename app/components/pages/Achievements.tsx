import SectionHead from "../shared/SectionHead";

const credentials = [
  {
    index: "01",
    category: "OPEN SOURCE",
    year: "",
    title: "Claude for Open Source Program",
    org: "Anthropic · Selected",
    description:
      "Selected by Anthropic.",
  },
  {
    index: "02",
    category: "MENTORSHIP",
    year: "2026",
    title: "LFX Mentorship",
    org: "CNCF · OpenKruise Agents",
    description:
      "Selected to build token-based sign-in in Go for a Kubernetes platform that runs AI agents.",
  },
  {
    index: "03",
    category: "OPEN SOURCE",
    year: "2026",
    title: "Google Summer of Code",
    org: "BRL-CAD · Manifold",
    description:
      "Selected contributor to the Manifold C++ geometry library, with 25+ merged PRs.",
  },
  {
    index: "04",
    category: "ACADEMIC",
    year: "2026",
    title: "Amazon ML Summer School",
    org: "Amazon · Selected",
    description:
      "Selected for a competitive applied ML program led by Amazon scientists.",
  },
  {
    index: "05",
    category: "COMPETITIVE",
    year: "2026",
    title: "Finalist, Flipkart GRiD",
    org: "Flipkart · GRiD 2026",
    description:
      "Finalist in Flipkart GRiD 2026, Flipkart's engineering challenge for students.",
  },
  {
    index: "06",
    category: "COMPETITIVE",
    year: "2024",
    title: "3rd Place, Speed Coding",
    org: "IIIT Surat · 100+ participants",
    description:
      "Placed third of 100+ in a timed competitive programming event.",
  },
];

// A ruled list of credentials. Each entry's number, category and year sit in
// the margin; the title, organisation and description in the text column.
// Source order is unchanged; the grid places the margin notes.
export default function Achievements({ nested = false }: { nested?: boolean }) {
  const EntryTitle = nested ? "h4" : "h3";
  return (
    <section className="mt-20 md:mt-24">
      <SectionHead
        as={nested ? "h3" : "h2"}
        size={nested ? "sub" : "section"}
        kicker="Credentials"
        title="Recognition"
      />

      <ol className="border-t border-line">
        {credentials.map((c) => (
          <li key={c.index} className="folio border-b border-line py-7">
            <div className="lg:col-span-3 flex lg:grid lg:grid-cols-[2.5rem_1fr] gap-x-3 font-mono text-meta text-muted">
              <span>{c.index}</span>
              <span>{c.category}</span>
              {c.year && <span className="ml-auto lg:ml-0 lg:col-start-2">{c.year}</span>}
            </div>
            <div className="lg:col-start-4 lg:col-span-6 mt-3 lg:mt-0">
              <EntryTitle className="text-h3 mb-1">{c.title}</EntryTitle>
              <p className="font-mono text-meta text-muted mb-3">{c.org}</p>
              <p className="text-body text-fg">{c.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
