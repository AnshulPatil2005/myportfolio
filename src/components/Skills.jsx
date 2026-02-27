const skillCategories = [
  {
    label: 'Frontend',
    skills: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'HTML5', 'CSS3'],
  },
  {
    label: 'Backend',
    skills: ['Node.js', 'Express.js', 'Python', 'FastAPI'],
  },
  {
    label: 'Databases',
    skills: ['MongoDB', 'PostgreSQL', 'MySQL', 'Firebase'],
  },
  {
    label: 'DevOps and Cloud',
    skills: ['AWS', 'Docker', 'Kubernetes', 'Git', 'GitHub'],
  },
  {
    label: 'Design',
    skills: ['Figma'],
  },
];

export default function Skills() {
  return (
    <section id="skills" className="classic-section mb-10 px-6 py-10 sm:px-8">
      <h3 className="section-title mb-6 text-2xl font-semibold">Skills</h3>
      <p className="classic-muted mb-8">
        Technologies and tools I use across product development, deployment,
        and maintenance.
      </p>

      <div className="space-y-6">
        {skillCategories.map(({ label, skills }) => (
          <div key={label}>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-stone-600">{label}</p>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="classic-pill px-3 py-1.5 text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}