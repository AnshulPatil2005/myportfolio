import { Slide } from "../../animation/Slide";

const skillGroups = [
  {
    category: "Languages",
    items: ["Python", "C++", "Go", "SQL", "Bash", "JavaScript / TypeScript"],
  },
  {
    category: "Machine Learning",
    items: [
      "PyTorch",
      "Lightning",
      "TensorFlow",
      "Transformers",
      "NumPy",
      "Pandas",
      "LLM APIs",
      "Evaluation & benchmarking",
      "Reproducibility",
    ],
  },
  {
    category: "Backend & Data",
    items: [
      "FastAPI",
      "Django REST Framework",
      "REST APIs",
      "PostgreSQL",
      "Redis",
      "Celery",
      "Caching",
      "Vector databases",
    ],
  },
  {
    category: "Cloud & Infrastructure",
    items: [
      "Docker",
      "Kubernetes",
      "CRDs & operators",
      "controller-runtime",
      "AWS",
      "GitHub Actions",
      "CI/CD",
      "Linux",
      "MLflow",
    ],
  },
  {
    category: "Security",
    items: ["JWT", "OIDC", "JWKS", "Key rotation", "RSA / ECDSA", "X.509"],
  },
];

export default function Usage() {
  return (
    <section className="max-w-5xl mt-8">
      <Slide delay={0.14}>
        <div className="mb-10">
          <h2 className="text-4xl mb-4 font-bold tracking-tight">Stack &amp; Tools</h2>
          <p className="dark:text-zinc-400 text-zinc-600 max-w-xl">
            Technologies and tools I use across product development, deployment, and maintenance.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-x-8 gap-y-8">
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
