import { FadeIn, StaggerContainer, StaggerItem } from './ScrollReveal';

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
    <section id="skills" className="apple-section mx-auto max-w-7xl">
      <FadeIn>
        <h3 className="section-title">Skills</h3>
        <p className="mx-auto mb-16 max-w-2xl text-center text-lg text-[#86868b]">
          Technologies and tools I use across product development, deployment,
          and maintenance.
        </p>
      </FadeIn>

      <StaggerContainer>
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {skillCategories.map(({ label, skills }) => (
            <StaggerItem key={label}>
              <div className="apple-card h-full p-8">
                <p className="mb-6 text-sm font-bold uppercase tracking-[0.2em] text-[#86868b]">
                  {label}
                </p>
                <div className="flex flex-wrap gap-3">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-white px-4 py-2 text-sm font-medium text-[#1d1d1f] shadow-sm transition-transform hover:scale-110"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </StaggerItem>
          ))}
        </div>
      </StaggerContainer>
    </section>
  );
}
