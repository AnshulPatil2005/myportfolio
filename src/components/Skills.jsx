import React from 'react';
import useScrollReveal from '../hooks/useScrollReveal';

const skills = ['React', 'Tailwind CSS', 'Node.js', 'MongoDB', 'AWS', 'Docker', 'Git'];

export default function Skills() {
  const [ref, visible] = useScrollReveal();

  return (
    <section
      id="skills"
      ref={ref}
      className={`py-20 px-6 text-center transition-all duration-700 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <h3 className="text-3xl font-bold mb-10 text-blue-600 dark:text-blue-400">Skills</h3>
      <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
        {skills.map((skill, idx) => (
          <span
            key={idx}
            className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-2 rounded-full shadow-md hover:scale-105 transition-transform duration-300"
          >
            {skill}
          </span>
        ))}
      </div>
    </section>
  );
}
