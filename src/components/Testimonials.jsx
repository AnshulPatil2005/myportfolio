import React, { useRef, useState } from 'react';
import { FaBriefcase, FaGraduationCap } from 'react-icons/fa';
import useScrollReveal from '../hooks/useScrollReveal';
import Modal from './Modal';
import './Timeline.css'; // Import your custom styles for the timeline
const timelineData = [
  {
    id: '2024',
    year: 'May 2024',
    title: 'B.Tech in ECE – IIIT Surat',
    description:
      'Started undergraduate studies in Computer Science, with focus on AI, systems, and scalable web applications.',
    icon: <FaGraduationCap />,
  },
  {
    id: '2025',
    year: 'Jun 2025',
    title: 'Intern – Ecube Solutions',
    description:
      'Built real-time traffic dashboard using Django and AWS. Focused on accident detection, video analytics, and cloud deployment.',
    icon: <FaBriefcase />,
  },
];

export default function Timeline() {
  const sectionRefs = useRef({});
  const [modalData, setModalData] = useState(null);
  const [ref, visible] = useScrollReveal();

  const handleScrollTo = (id) => {
    const section = sectionRefs.current[id];
    if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section
      id="timeline"
      ref={ref}
      className={`py-20 px-6 bg-gradient-to-b from-black to-gray-900 text-white transition-all duration-700 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      {/* Year Tabs */}
      <div className="flex justify-center gap-6 mb-12 flex-wrap">
        {timelineData.map((item) => (
          <button
            key={item.id}
            onClick={() => handleScrollTo(item.id)}
            className="px-4 py-2 rounded-full text-sm font-medium bg-gray-800 text-white 
                       hover:bg-gradient-to-r hover:from-blue-500 hover:to-cyan-400 
                       transition-all duration-300 hover:scale-105"
          >
            {item.year}
          </button>
        ))}
      </div>

      <div className="relative max-w-5xl mx-auto timeline-line">
        {timelineData.map((item, index) => {
          const fromSide =
            index % 2 === 0 ? 'translate-x-8 md:-translate-x-12' : 'translate-x-8 md:translate-x-12';
          const toSide = 'translate-x-0';
          const base =
            'mb-20 flex flex-col md:flex-row items-center relative transition-all duration-700 ease-out';
          return (
            <div
              key={item.id}
              ref={(el) => (sectionRefs.current[item.id] = el)}
              className={`${base} ${visible ? toSide : fromSide}`}
              style={{ transitionDelay: visible ? `${index * 120}ms` : '0ms' }}
            >
              {/* Card */}
              <div
                className={`w-full md:w-1/2 px-6 ${
                  index % 2 === 0 ? 'order-1' : 'order-1 md:order-2'
                }`}
              >
                <div
                  onClick={() => setModalData(item)}
                  className={`bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 cursor-pointer 
                              hover:scale-105 hover:border-blue-500/50 hover:shadow-blue-500/20 
                              transition-all duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
                  style={{ transitionDelay: visible ? `${index * 150 + 100}ms` : '0ms' }}
                >
                  <h4 className="text-xl font-semibold mb-2 flex items-center gap-2 text-blue-400">
                    {item.icon}
                    {item.title}
                  </h4>
                  <p className="text-sm text-gray-300">{item.description}</p>
                </div>
              </div>

              {/* Timeline dot */}
              <div
                className={`absolute left-1/2 -translate-x-1/2 z-10 ${
                  visible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                } transition-all duration-500`}
                style={{ transitionDelay: visible ? `${index * 150 + 50}ms` : '0ms' }}
              >
                <div className="timeline-dot w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {item.year.split(' ')[1]}
                </div>
              </div>

              {/* Spacer for alternating layout */}
              <div className="w-0 md:w-1/2 h-0" />
            </div>
          );
        })}
      </div>

      {/* Modal Popup */}
      <Modal
        isOpen={!!modalData}
        title={modalData?.title}
        description={modalData?.description}
        onClose={() => setModalData(null)}
      />
    </section>
  );
}
