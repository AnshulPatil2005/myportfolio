import React from 'react';
// Custom hook that reveals elements with fade/slide animation when scrolled into view
import useScrollReveal from '../hooks/useScrollReveal';

// List of skills/technologies to render
const skills = [
  'React', 'Next.js', 'Tailwind CSS', 'JavaScript', 'TypeScript',
  'HTML5', 'CSS3', 'Node.js', 'Express.js', 'Python',
  'MongoDB', 'PostgreSQL', 'MySQL', 'AWS', 'Firebase',
  'Docker', 'Kubernetes', 'Git', 'GitHub', 'Figma'
];

export default function Skills() {
  // Hook returns a ref (to attach to section) and a boolean for reveal animation
  const [ref, visible] = useScrollReveal();

  return (
    <section
      id="skills"       // Anchor ID for navigation (used in Navbar)
      ref={ref}         // Connects this section to scroll reveal observer
      className={`py-20 px-6 transition-all duration-700 ${
        // Conditional classes: fade/slide in when "visible" is true
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      {/* Section heading */}
      <h3 className="text-3xl font-bold mb-6 text-center text-blue-600 dark:text-blue-400">
        Skills
      </h3>

      {/* Introductory text */}
      <p className="text-gray-500 dark:text-gray-300 text-center max-w-2xl mx-auto mb-10">
        A collection of technologies, tools, and frameworks I have experience with
        in frontend, backend, databases, cloud services, and design.
      </p>

      {/* Grid of skill "pills" */}
      <div className="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto">
        {skills.map((skill, idx) => (
          <span
            key={idx} // Unique key for each skill item
            className="px-5 py-2 rounded-full 
                       bg-gradient-to-r from-blue-600 to-cyan-500  // Gradient background
                       text-white font-medium 
                       shadow-lg hover:shadow-xl hover:shadow-blue-400/40 // Stronger shadow on hover
                       hover:from-cyan-500 hover:to-blue-600           // Gradient flips on hover
                       hover:scale-110                                 // Slight grow effect
                       transition-all duration-300 cursor-default"     // Smooth animation
          >
            {skill}
          </span>
        ))}
      </div>
    </section>
  );
}
