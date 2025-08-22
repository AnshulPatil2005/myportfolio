import React, { useRef, useState } from 'react';
// Icons for education and work entries
import { FaBriefcase, FaGraduationCap } from 'react-icons/fa';
// Hook to reveal section with fade/slide when scrolled into view
import useScrollReveal from '../hooks/useScrollReveal';
// Modal component for showing details when timeline cards are clicked
import Modal from './Modal';
// Custom CSS file (likely defines the line and dot styles for the timeline)
import './Timeline.css';

// Timeline data (each entry represents an event/experience)
const timelineData = [
  {
    id: '2024',
    year: 'May 2024',
    title: 'B.Tech in ECE – IIIT Surat',
    description:
      'Started undergraduate studies in Computer Science, with focus on AI, systems, and scalable web applications.',
    icon: <FaGraduationCap />, // Graduation cap icon for education
  },
  {
    id: '2025',
    year: 'Jun 2025',
    title: 'Intern – Ecube Solutions',
    description:
      'Built real-time traffic dashboard using Django and AWS. Focused on accident detection, video analytics, and cloud deployment.',
    icon: <FaBriefcase />, // Briefcase icon for work experience
  },
];

export default function Timeline() {
  // Store references to each timeline card (for smooth scrolling)
  const sectionRefs = useRef({});
  // Store the data for the modal (null if closed)
  const [modalData, setModalData] = useState(null);
  // Hook to animate section when scrolled into view
  const [ref, visible] = useScrollReveal();

  // Scroll to a timeline card when its year button is clicked
  const handleScrollTo = (id) => {
    const section = sectionRefs.current[id];
    if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section
      id="timeline"
      ref={ref} // Attach ref for scroll reveal animation
      className={`py-20 px-6 bg-gradient-to-b from-black to-gray-900 text-white transition-all duration-700 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      {/* Year Tabs (navigation buttons at the top) */}
      <div className="flex justify-center gap-6 mb-12 flex-wrap">
        {timelineData.map((item) => (
          <button
            key={item.id}
            onClick={() => handleScrollTo(item.id)} // Scroll to card
            className="px-4 py-2 rounded-full text-sm font-medium bg-gray-800 text-white 
                       hover:bg-gradient-to-r hover:from-blue-500 hover:to-cyan-400 
                       transition-all duration-300 hover:scale-105"
          >
            {item.year}
          </button>
        ))}
      </div>

      {/* Timeline container */}
      <div className="relative max-w-5xl mx-auto timeline-line">
        {timelineData.map((item, index) => {
          // Animate cards alternating left/right
          const fromSide =
            index % 2 === 0 ? 'translate-x-8 md:-translate-x-12' : 'translate-x-8 md:translate-x-12';
          const toSide = 'translate-x-0';
          const base =
            'mb-20 flex flex-col md:flex-row items-center relative transition-all duration-700 ease-out';

          return (
            <div
              key={item.id}
              ref={(el) => (sectionRefs.current[item.id] = el)} // Save card ref
              className={`${base} ${visible ? toSide : fromSide}`} // Slide in effect
              style={{ transitionDelay: visible ? `${index * 120}ms` : '0ms' }} // Staggered reveal
            >
              {/* Timeline Card */}
              <div
                className={`w-full md:w-1/2 px-6 ${
                  index % 2 === 0 ? 'order-1' : 'order-1 md:order-2'
                }`}
              >
                <div
                  onClick={() => setModalData(item)} // Open modal on click
                  className={`bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 cursor-pointer 
                              hover:scale-105 hover:border-blue-500/50 hover:shadow-blue-500/20 
                              transition-all duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
                  style={{ transitionDelay: visible ? `${index * 150 + 100}ms` : '0ms' }}
                >
                  {/* Card title with icon */}
                  <h4 className="text-xl font-semibold mb-2 flex items-center gap-2 text-blue-400">
                    {item.icon}
                    {item.title}
                  </h4>
                  {/* Short description */}
                  <p className="text-sm text-gray-300">{item.description}</p>
                </div>
              </div>

              {/* Timeline dot in the middle line */}
              <div
                className={`absolute left-1/2 -translate-x-1/2 z-10 ${
                  visible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                } transition-all duration-500`}
                style={{ transitionDelay: visible ? `${index * 150 + 50}ms` : '0ms' }}
              >
                <div className="timeline-dot w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {/* Show only the month (e.g., "2024" → "2024", "Jun 2025" → "2025") */}
                  {item.year.split(' ')[1]}
                </div>
              </div>

              {/* Spacer: keeps alternating layout balanced */}
              <div className="w-0 md:w-1/2 h-0" />
            </div>
          );
        })}
      </div>

      {/* Modal Popup (shows details when a card is clicked) */}
      <Modal
        isOpen={!!modalData}              // Open if modalData is not null
        title={modalData?.title}          // Pass title
        description={modalData?.description} // Pass description
        onClose={() => setModalData(null)}   // Close modal
      />
    </section>
  );
}
