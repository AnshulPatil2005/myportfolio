import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const sections = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
];

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('hero');
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

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

    const observeSections = () => {
      sections.forEach(({ id }) => {
        const section = document.getElementById(id);
        if (section) observer.observe(section);
      });
      // Also observe other potential sections that are in App but not in nav
      ['achievements', 'opensource', 'research', 'testimonials', 'contact'].forEach(id => {
        const section = document.getElementById(id);
        if (section) observer.observe(section);
      });
    };

    observeSections();
    window.addEventListener('scroll', handleScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'apple-glass border-b border-black/5 py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 sm:px-10">
        <a href="#hero" className="text-xl font-bold tracking-tight text-[#1d1d1f]">
          Anshul Patil
        </a>

        <ul className="hidden md:flex items-center gap-8">
          {sections.map((section) => (
            <li key={section.id} className="relative">
              <a
                href={`#${section.id}`}
                className={`text-sm font-medium transition-colors duration-300 ${
                  activeSection === section.id
                    ? 'text-[#0066cc]'
                    : 'text-[#86868b] hover:text-[#1d1d1f]'
                }`}
              >
                {section.label}
              </a>
              {activeSection === section.id && (
                <motion.div
                  layoutId="activeSection"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#0066cc]"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </li>
          ))}
        </ul>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5 focus:outline-none"
            aria-label="Toggle Menu"
          >
            <motion.span
              animate={isOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
              className="h-0.5 w-6 rounded-full bg-[#1d1d1f]"
            />
            <motion.span
              animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
              className="h-0.5 w-6 rounded-full bg-[#1d1d1f]"
            />
            <motion.span
              animate={isOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
              className="h-0.5 w-6 rounded-full bg-[#1d1d1f]"
            />
          </button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 bg-white/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex h-full flex-col items-center justify-center gap-8 p-6">
              {sections.map((section) => (
                <motion.a
                  key={section.id}
                  href={`#${section.id}`}
                  onClick={() => setIsOpen(false)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className={`text-3xl font-bold tracking-tight ${
                    activeSection === section.id ? 'text-[#0066cc]' : 'text-[#1d1d1f]'
                  }`}
                >
                  {section.label}
                </motion.a>
              ))}
              <motion.a
                href="#projects"
                onClick={() => setIsOpen(false)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-4 rounded-full bg-[#0066cc] px-8 py-4 text-lg font-medium text-white"
              >
                View Projects
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
