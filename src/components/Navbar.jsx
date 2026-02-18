import React, { useEffect, useState } from 'react';

const sections = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'achievements', label: 'Highlights' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'research', label: 'Research' },
];

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );

    sections.forEach(({ id }) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });

    return () => {
      sections.forEach(({ id }) => {
        const section = document.getElementById(id);
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Anshul<span className="text-blue-500">.dev</span>
        </h1>

        <ul className="flex max-w-[70%] items-center gap-4 overflow-x-auto text-sm font-medium text-slate-300 md:max-w-none md:gap-6 md:text-base">
          {sections.map((section) => (
            <li key={section.id} className="relative">
              <a
                href={`#${section.id}`}
                className={`relative pb-1 transition-colors duration-200 hover:text-blue-400 ${
                  activeSection === section.id ? 'font-semibold text-blue-400' : ''
                }`}
              >
                {section.label}
                <span
                  className={`absolute left-0 -bottom-1 h-0.5 w-full origin-left transform bg-blue-400 transition-all duration-300 ${
                    activeSection === section.id ? 'scale-x-100' : 'scale-x-0'
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
