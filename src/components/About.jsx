import React from 'react';
import useScrollReveal from '../hooks/useScrollReveal';
import profile from '../assets/profile.jpg';
import CountUp from 'react-countup';
import { Tooltip } from 'react-tooltip';

export default function About() {
  const [ref, visible] = useScrollReveal();

  const funFacts = [
    {
      front: '👨‍💻',
      back: 'I optimized an API to be 4x faster with async batch queues.',
      tooltip: 'Backend wizardry!',
    },
    {
      front: '🌍',
      back: 'It took me 263 hours to build this portfolio from scratch.',
      tooltip: 'Lightning Fast!',
    },
    {
      front: '🎮',
      back: 'Gaming honed my strategy + debugging reflexes.',
      tooltip: 'Level up!',
    },
  ];

  return (
    <section
      id="about"
      ref={ref}
      className={`py-20 px-6 bg-gradient-to-b from-gray-100 to-white dark:from-gray-900 dark:to-black transition-all duration-700 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">
        {/* Profile Image */}
        <div className="w-full md:w-1/3">
          <img
            src={profile}
            alt="Profile"
            className="rounded-xl shadow-lg w-64 h-64 object-cover mx-auto border-4 border-blue-500 dark:border-white"
          />
        </div>

        {/* About Content */}
        <div className="w-full md:w-2/3 text-center md:text-left">
          <h3 className="text-3xl font-bold mb-4 text-blue-600 dark:text-blue-400">About Me</h3>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
            I'm Anshul — a <span className="font-semibold text-blue-500">Full-Stack Developer</span> who builds fast, scalable apps using React, Node, AWS, and Tailwind.
          </p>
          <p className="text-md text-gray-600 dark:text-gray-400 mb-4">
            I care deeply about clean architecture, smooth UX, and solving real-world problems with impactful code.
          </p>

          {/* Animated Counters */}
          <div className="flex flex-wrap justify-center md:justify-start gap-6 mt-8">
            <div className="text-center">
              <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                <CountUp end={5} duration={2} />+
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Projects Built</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                <CountUp end={100} duration={2} />+
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">GitHub Commits</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                <CountUp end={6} duration={2} />+
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Technologies Mastered</p>
            </div>
          </div>

          {/* Fun Facts Flip Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {funFacts.map((fact, idx) => (
              <div
                key={idx}
                className="group perspective"
                data-tooltip-id={`tooltip-${idx}`}
                data-tooltip-content={fact.tooltip}
              >
                <div className="relative w-full h-40 transform-style-preserve-3d transition-transform duration-500 group-hover:rotate-y-180">
                  {/* Front */}
                  <div className="absolute w-full h-full flex items-center justify-center text-5xl bg-white dark:bg-gray-800 text-blue-500 rounded-xl shadow border dark:border-gray-700 backface-hidden">
                    {fact.front}
                  </div>

                  {/* Back */}
                  <div className="absolute w-full h-full flex items-center justify-center bg-blue-600 text-white p-4 rounded-xl shadow transform rotate-y-180 backface-hidden">
                    <p className="text-sm">{fact.back}</p>
                  </div>
                </div>

                {/* Tooltip for this card */}
                <Tooltip id={`tooltip-${idx}`} place="top" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
