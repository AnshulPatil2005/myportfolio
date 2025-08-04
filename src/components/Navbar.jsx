import React, { useEffect, useState } from 'react';

const sections = ['about', 'projects', 'skills', 'contact'];

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.6 }
    );

    sections.forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });

    return () => {
      sections.forEach((id) => {
        const section = document.getElementById(id);
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-white/60 dark:bg-gray-900/60 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white tracking-tight">
          Anshul<span className="text-blue-500">.dev</span>
        </h1>

        <ul className="flex space-x-6 font-medium text-gray-700 dark:text-gray-300">
          {sections.map((section) => (
            <li key={section} className="relative">
              <a
                href={`#${section}`}
                className={`relative pb-1 transition-colors duration-200 hover:text-blue-500 ${
                  activeSection === section ? 'text-blue-500 font-semibold' : ''
                }`}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
                <span
                  className={`absolute left-0 -bottom-1 h-0.5 w-full bg-blue-500 transform transition-all duration-300 origin-left ${
                    activeSection === section ? 'scale-x-100' : 'scale-x-0'
                  }`}
                ></span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
