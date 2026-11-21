import SectionHead from "../shared/SectionHead";

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

// `nested` when it sits inside the homepage's About section, so its title
// ranks below that section's heading.
export default function Usage({ nested = false }: { nested?: boolean }) {
  return (
    <section className="mt-4">
      <SectionHead
        as={nested ? "h3" : "h2"}
        size={nested ? "sub" : "section"}
        title={<>Stack &amp; Tools</>}
        lead="Technologies and tools I use across product development, deployment, and maintenance."
        rule={!nested}
      />
      <div className="folio">
        <div className="lg:col-start-4 lg:col-span-9 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-x-8 gap-y-10">
          {skillGroups.map(({ category, items }) => (
            <div key={category}>
              <p className="font-mono text-meta text-muted pb-2 mb-3 border-b border-line">
                {category}
              </p>
              <ul className="space-y-1">
                {items.map((item) => (
                  <li key={item} className="text-body leading-snug text-fg">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
