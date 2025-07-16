import React, { useRef, useState } from 'react';
import { FaBriefcase, FaGraduationCap } from 'react-icons/fa';
import useScrollReveal from '../hooks/useScrollReveal';
import Modal from './Modal';

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
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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
      <div className="flex justify-center gap-6 mb-12">
        {timelineData.map((item) => (
          <button
            key={item.id}
            onClick={() => handleScrollTo(item.id)}
            className="px-4 py-2 rounded-full text-sm font-medium bg-gray-700 text-white hover:bg-blue-600 transition"
          >
            {item.year}
          </button>
        ))}
      </div>

      <div className="relative max-w-4xl mx-auto before:content-[''] before:absolute before:left-1/2 before:top-0 before:h-full before:w-[2px] before:-translate-x-1/2 before:bg-blue-500">
        {timelineData.map((item, index) => (
          <div
            key={item.id}
            ref={(el) => {
              sectionRefs.current[item.id] = el;
            }}
            className="mb-20 flex flex-col md:flex-row items-center relative"
          >
            {/* Card */}
            <div className={`w-full md:w-1/2 px-6 ${index % 2 === 0 ? 'order-1' : 'order-1 md:order-2'}`}>
              <div
                onClick={() => setModalData(item)}
                className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 cursor-pointer hover:scale-105 hover:shadow-xl transition-all"
              >
                <h4 className="text-xl font-semibold mb-2 flex items-center gap-2 text-blue-400">
                  {item.icon}
                  {item.title}
                </h4>
                <p className="text-sm text-gray-300 line-clamp-2">{item.description}</p>
              </div>
            </div>

            {/* Timeline dot */}
            <div className="absolute left-1/2 -translate-x-1/2 w-10 h-10 bg-blue-600 rounded-full border-4 border-black z-10 flex items-center justify-center text-xs font-bold text-white shadow-md">
              {item.year.split(' ')[1]}
            </div>

            {/* Spacer for alternating layout */}
            <div className="w-0 md:w-1/2 h-0"></div>
          </div>
        ))}
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
