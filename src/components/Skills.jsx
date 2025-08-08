import React from 'react';
import useScrollReveal from '../hooks/useScrollReveal';

const skills = [
  'React', 'Next.js', 'Tailwind CSS', 'JavaScript', 'TypeScript',
  'HTML5', 'CSS3', 'Node.js', 'Express.js', 'Python',
  'MongoDB', 'PostgreSQL', 'MySQL', 'AWS', 'Firebase',
  'Docker', 'Kubernetes', 'Git', 'GitHub', 'Figma'
];

export default function Skills() {
  const [ref, visible] = useScrollReveal();

  return (
    <section
      id="skills"
      ref={ref}
      className={`py-20 px-6 transition-all duration-700 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <h3 className="text-3xl font-bold mb-6 text-center text-blue-600 dark:text-blue-400">
        Skills
      </h3>
      <p className="text-gray-500 dark:text-gray-300 text-center max-w-2xl mx-auto mb-10">
        A collection of technologies, tools, and frameworks I have experience with
        in frontend, backend, databases, cloud services, and design.
      </p>

      <div className="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto">
        {skills.map((skill, idx) => (
          <span
            key={idx}
            className="px-5 py-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 
                       text-white font-medium shadow-lg hover:shadow-xl hover:shadow-blue-400/40 
                       hover:from-cyan-500 hover:to-blue-600 hover:scale-110 
                       transition-all duration-300 cursor-default"
          >
            {skill}
          </span>
        ))}
      </div>
    </section>
  );
}
