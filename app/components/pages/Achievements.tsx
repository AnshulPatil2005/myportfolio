import { Slide } from "../../animation/Slide";

const achievements: { title: string; description: string; link?: string }[] = [
  {
    title: "Google Summer of Code 2026",
    description:
      "Selected contributor for BRL-CAD Manifold open-source subproject — improving C++ geometry processing CI and benchmarking infrastructure.",
  },
  {
    title: "Winner — Agentic AI Strategy Hackathon",
    description:
      "First place for designing a multi-agent automation system with workflow orchestration.",
  },
  {
    title: "3rd Place — Speed Coding, IIIT Surat",
    description: "Placed 3rd among 100+ participants in a competitive speed coding event.",
  },
];

export default function Achievements() {
  return (
    <section className="max-w-2xl mt-16">
      <Slide delay={0.14}>
        <div className="mb-8">
          <h2 className="text-4xl mb-4 font-bold tracking-tight">Achievements</h2>
        </div>
        <div className="border-t dark:border-zinc-800 border-zinc-200">
          {achievements.map(({ title, description, link }, i) => (
            <div
              key={title}
              className="flex items-start gap-x-5 py-5 border-b dark:border-zinc-800 border-zinc-200 last:border-b-0"
            >
              <span className="font-mono text-xs dark:text-zinc-600 text-zinc-400 pt-0.5 shrink-0">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                {link ? (
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold hover:underline"
                  >
                    {title}
                  </a>
                ) : (
                  <p className="font-semibold">{title}</p>
                )}
                <p className="text-sm dark:text-zinc-400 text-zinc-600 mt-1">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Slide>
    </section>
  );
}
