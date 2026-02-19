import useScrollReveal from '../hooks/useScrollReveal';

const skillCategories = [
  {
    label: 'Frontend',
    color: 'blue',
    skills: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'HTML5', 'CSS3'],
  },
  {
    label: 'Backend',
    color: 'green',
    skills: ['Node.js', 'Express.js', 'Python', 'FastAPI'],
  },
  {
    label: 'Databases',
    color: 'yellow',
    skills: ['MongoDB', 'PostgreSQL', 'MySQL', 'Firebase'],
  },
  {
    label: 'DevOps & Cloud',
    color: 'purple',
    skills: ['AWS', 'Docker', 'Kubernetes', 'Git', 'GitHub'],
  },
  {
    label: 'Design',
    color: 'pink',
    skills: ['Figma'],
  },
];

const colorClasses = {
  blue:   'border-blue-500/30 bg-blue-500/10 text-blue-300 hover:border-blue-400/60 hover:bg-blue-400/20 hover:shadow-[0_0_12px_rgba(59,130,246,0.35)]',
  green:  'border-green-500/30 bg-green-500/10 text-green-300 hover:border-green-400/60 hover:bg-green-400/20 hover:shadow-[0_0_12px_rgba(34,197,94,0.35)]',
  yellow: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-300 hover:border-yellow-400/60 hover:bg-yellow-400/20 hover:shadow-[0_0_12px_rgba(234,179,8,0.35)]',
  purple: 'border-purple-500/30 bg-purple-500/10 text-purple-300 hover:border-purple-400/60 hover:bg-purple-400/20 hover:shadow-[0_0_12px_rgba(168,85,247,0.35)]',
  pink:   'border-pink-500/30 bg-pink-500/10 text-pink-300 hover:border-pink-400/60 hover:bg-pink-400/20 hover:shadow-[0_0_12px_rgba(236,72,153,0.35)]',
};

const labelColors = {
  blue: 'text-blue-400', green: 'text-green-400', yellow: 'text-yellow-400',
  purple: 'text-purple-400', pink: 'text-pink-400',
};

export default function Skills() {
  const [ref, visible] = useScrollReveal();

  return (
    <section
      id="skills"
      ref={ref}
      className={`px-6 py-20 transition-all duration-700 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <h3 className="section-title mb-4 text-center text-3xl font-bold text-white">
        Skills
      </h3>

      <p className="mx-auto mb-12 max-w-2xl text-center text-gray-400">
        A collection of technologies, tools, and frameworks I have experience with
        in frontend, backend, databases, cloud services, and design.
      </p>

      <div className="mx-auto max-w-5xl space-y-8">
        {skillCategories.map(({ label, color, skills }) => (
          <div key={label}>
            <p className={`mb-3 text-xs font-semibold uppercase tracking-widest ${labelColors[color]}`}>
              {label}
            </p>
            <div className="flex flex-wrap gap-3">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className={`cursor-default rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-105 ${colorClasses[color]}`}
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
