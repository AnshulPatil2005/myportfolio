import { Slide } from "../../animation/Slide";

const skillGroups = [
  {
    category: "Languages",
    items: ["Python", "C++", "Golang", "SQL", "Bash", "JavaScript"],
  },
  {
    category: "Backend & Systems",
    items: [
      "FastAPI",
      "Django REST Framework",
      "REST APIs",
      "Microservices",
      "Distributed Systems",
      "System Design",
      "Data Structures & Algorithms",
      "Operating Systems",
    ],
  },
  {
    category: "AI & Machine Learning",
    items: ["PyTorch", "TensorFlow", "Transformers", "OpenCV", "NumPy", "Pandas", "OCR", "LLM APIs"],
  },
  {
    category: "Infrastructure & Databases",
    items: ["PostgreSQL", "Redis", "Celery", "Vector Databases", "AWS EC2", "AWS S3", "Docker", "CI/CD", "Linux", "Git"],
  },
];

export default function Usage() {
  return (
    <section className="max-w-4xl mt-32">
      <Slide delay={0.14}>
        <div className="mb-10">
          <h2 className="text-4xl mb-4 font-bold tracking-tight">Stack &amp; Tools</h2>
          <p className="dark:text-zinc-400 text-zinc-600 max-w-xl">
            Technologies and tools I use across product development, deployment, and maintenance.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-8">
          {skillGroups.map(({ category, items }) => (
            <div key={category}>
              <p className="text-xs font-mono uppercase tracking-widest dark:text-zinc-500 text-zinc-400 mb-3">
                {category}
              </p>
              <ul className="space-y-1.5">
                {items.map((item) => (
                  <li key={item} className="text-sm dark:text-zinc-300 text-zinc-700">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Slide>
    </section>
  );
}
