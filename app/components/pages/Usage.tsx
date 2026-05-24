import { Slide } from "../../animation/Slide";

const skillGroups = [
  {
    category: "Languages",
    items: ["Python", "C++", "Golang", "SQL", "Bash", "JavaScript"],
  },
  {
    category: "Backend",
    items: ["FastAPI", "Django REST Framework", "REST APIs", "Microservices", "API Design", "Authentication", "Caching"],
  },
  {
    category: "Databases & Queues",
    items: ["PostgreSQL", "Redis", "Celery", "Vector Databases", "Query Optimization"],
  },
  {
    category: "Cloud & DevOps",
    items: ["AWS EC2", "AWS S3", "Docker", "GitHub Actions", "CI/CD", "Linux", "Git"],
  },
  {
    category: "AI & Data",
    items: ["PyTorch", "TensorFlow", "Transformers", "OpenCV", "NumPy", "Pandas", "OCR", "LLM APIs"],
  },
  {
    category: "Core CS",
    items: ["Data Structures", "Algorithms", "OOP", "Distributed Systems", "System Design", "Operating Systems"],
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
