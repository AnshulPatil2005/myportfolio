import { useEffect, useState } from 'react';

const sections = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'achievements', label: 'Highlights' },
  { id: 'projects', label: 'Projects' },
  { id: 'opensource', label: 'Open Source' },
  { id: 'skills', label: 'Skills' },
  { id: 'research', label: 'Research' },
  { id: 'testimonials', label: 'Experience' },
];

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );

    sections.forEach(({ id }) => {
      const section = document.getElementById(id);
      if (section) {
        observer.observe(section);
      }
    });

    return () => observer.disconnect();
  }, []);

  return (
    <nav className="classic-nav fixed left-0 right-0 top-0 z-50 border-b border-amber-200 bg-amber-50/95">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <h1 className="text-lg font-semibold tracking-wide text-stone-900">
          Anshul Patil
        </h1>

        <ul className="flex max-w-[74%] items-center gap-2 overflow-x-auto text-sm text-stone-600 md:max-w-none md:gap-4">
          {sections.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className={`rounded px-2 py-1 transition-colors ${
                  activeSection === section.id
                    ? 'bg-amber-200 text-stone-900'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {section.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}