// src/components/About.jsx
import React from 'react';
import profile from '../assets/profile.jpg';
import useScrollReveal from '../hooks/useScrollReveal';
import CountUp from 'react-countup';
import { Tooltip } from 'react-tooltip';

export default function About() {
  const [ref, visible] = useScrollReveal();

  const funFacts = [
    {
      front: '👨‍💻',
      back: 'Optimized APIs to be 4x faster using async queues & caching.',
      tooltip: 'Backend wizardry!',
    },
    {
      front: '🌍',
      back: 'Spent 263+ hours perfecting this portfolio with Vite + Tailwind.',
      tooltip: 'Crafted with love!',
    },
    {
      front: '🎮',
      back: 'Gaming taught me real-time debugging and strategic thinking.',
      tooltip: 'Gamedev vibes!',
    },
    {
      front: '📚',
      back: 'Self-taught 10+ tools & frameworks via open-source contributions.',
      tooltip: 'Lifelong learner!',
    },
  ];

  return (
    <section
      id="about"
      ref={ref}
      className={`relative py-20 px-6 overflow-hidden bg-black transition-all duration-700 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      {/* 🔹 About Content */}
      <div className="relative z-10 h-8xl max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
        {/* 🖼 Profile Image */}
        <div className="w-full md:w-1/3">
          <img
            src={profile}
            alt="Profile"
            className="rounded-xl shadow-lg w-64 h-64 object-cover mx-auto border-4 border-blue-500 dark:border-white"
          />
        </div>

        {/* 📄 Text Content */}
        <div className="w-full md:w-2/3 text-white text-center md:text-left">
          <h3 className="text-3xl font-bold mb-4 text-blue-400">About Me</h3>
          <p className="text-lg text-gray-200 mb-4">
            Hey! I'm <span className="font-semibold text-blue-300">Anshul</span>, a passionate{' '}
            <span className="font-semibold text-blue-300">Full-Stack Developer</span> who thrives on building blazing-fast web apps using React, Node.js, AWS, and Tailwind CSS.
          </p>
          <p className="text-md text-gray-300 mb-6">
            I focus on clean architecture, delightful user experiences, and solving meaningful problems through thoughtful engineering.
          </p>

          {/* 🔢 Counters */}
          <div className="flex flex-wrap justify-center md:justify-start gap-6 mt-8">
            <div className="text-center">
              <p className="text-4xl font-bold text-blue-400">
                <CountUp end={5} duration={2} />+
              </p>
              <p className="text-sm text-gray-200">Projects Built</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-blue-400">
                <CountUp end={100} duration={2} />+
              </p>
              <p className="text-sm text-gray-200">GitHub Commits</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-blue-400">
                <CountUp end={10} duration={2} />+
              </p>
              <p className="text-sm text-gray-200">Technologies Mastered</p>
            </div>
          </div>

          {/* 🔄 Fun Facts */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
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
                <Tooltip id={`tooltip-${idx}`} place="top" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
