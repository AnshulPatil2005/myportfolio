import React, { useEffect, useState } from 'react';

// Define the section IDs that exist in the page (must match <section id="..."> in the DOM)
const sections = ['about', 'projects', 'skills', 'contact'];

export default function Navbar() {
  // Track which section is currently visible (used to highlight active link)
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    // Create an IntersectionObserver to detect when sections scroll into view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          // If a section is at least 60% visible in the viewport
          if (entry.isIntersecting) {
            // Update activeSection state with the section's id
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.6 } // 60% of the section must be visible to trigger
    );

    // Attach the observer to each section in the list
    sections.forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });

    // Cleanup: unobserve all sections when component unmounts
    return () => {
      sections.forEach((id) => {
        const section = document.getElementById(id);
        if (section) observer.unobserve(section);
      });
    };
  }, []); // Empty dependency → run only once when component mounts

  return (
    // Sticky navigation bar at top of screen with blur + light/dark support
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-white/60 dark:bg-gray-900/60 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        
        {/* Branding / Logo */}
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white tracking-tight">
          Anshul<span className="text-blue-500">.dev</span>
        </h1>

        {/* Navigation links */}
        <ul className="flex space-x-6 font-medium text-gray-700 dark:text-gray-300">
          {sections.map((section) => (
            <li key={section} className="relative">
              <a
                href={`#${section}`} // Jump to section on click
                className={`relative pb-1 transition-colors duration-200 hover:text-blue-500 ${
                  // Highlight active section with color + bold text
                  activeSection === section ? 'text-blue-500 font-semibold' : ''
                }`}
              >
                {/* Capitalize first letter for display */}
                {section.charAt(0).toUpperCase() + section.slice(1)}
                
                {/* Animated underline that expands when active */}
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
