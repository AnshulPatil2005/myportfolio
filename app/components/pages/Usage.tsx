import { Slide } from "../../animation/Slide";

const skillGroups = [
  {
    category: "Frontend",
    items: ["React", "Next.js", "TypeScript", "JavaScript", "Tailwind CSS", "HTML5", "CSS3"],
  },
  {
    category: "Backend",
    items: ["Node.js", "Express.js", "Python", "FastAPI"],
  },
  {
    category: "Databases",
    items: ["MongoDB", "PostgreSQL", "MySQL", "Firebase"],
  },
  {
    category: "DevOps & Cloud",
    items: ["AWS", "Docker", "Kubernetes", "GitHub Actions"],
  },
  {
    category: "Tools",
    items: ["Git", "GitHub", "VS Code", "Figma", "Postman"],
  },
];

export default function Usage() {
  return (
    <section className="max-w-2xl mt-32">
      <Slide delay={0.14}>
        <div className="mb-8">
          <h2 className="text-4xl mb-4 font-bold tracking-tight">Stack &amp; Tools</h2>
          <p className="dark:text-zinc-400 text-zinc-600 max-w-xl">
            Technologies and tools I use across product development, deployment,
            and maintenance.
          </p>
        </div>
        <div className="space-y-8">
          {skillGroups.map(({ category, items }) => (
            <div key={category}>
              <p className="text-sm font-semibold uppercase tracking-widest dark:text-zinc-400 text-zinc-500 mb-3">
                {category}
              </p>
              <div className="flex flex-wrap gap-2">
                {items.map((item) => (
                  <span
                    key={item}
                    className="dark:bg-primary-bg bg-zinc-100 border dark:border-zinc-800 border-zinc-200 rounded-md px-3 py-1 text-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Slide>
    </section>
  );
}
