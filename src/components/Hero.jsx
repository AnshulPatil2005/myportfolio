// src/components/Hero.jsx
import React from 'react';
import { Typewriter } from 'react-simple-typewriter';
import resume from '../assets/resume.pdf';
import './Hero.css'; // <-- add this

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative w-full h-screen flex items-center justify-center text-center overflow-hidden bg-black"
    >
      {/* 🌌 Aurora background (pure CSS, no Three.js) */}
      <div className="aurora-bg" aria-hidden="true">
        <span className="blob blob-1" />
        <span className="blob blob-2" />
        <span className="blob blob-3" />
        <span className="blob blob-4" />
      </div>

      {/* 💬 Hero Content */}
      <div className="relative z-10 px-4">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4">
          👋 Hi, I'm <span className="text-blue-400">Anshul</span>
        </h1>

        <div className="text-xl md:text-2xl text-cyan-300 font-semibold h-10 mb-2">
          <Typewriter
            words={[
              'Full-Stack Developer',
              'System Designer',
              'React & Node.js Engineer',
              'AWS Cloud Enthusiast',
            ]}
            loop
            cursor
            cursorStyle="|"
            typeSpeed={70}
            deleteSpeed={50}
            delaySpeed={1500}
          />
        </div>

        <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
          A passionate full-stack developer building beautiful, scalable, and impactful applications.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#projects"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition duration-300"
          >
            View My Work
          </a>
          <a
            href={resume}
            download
            className="px-6 py-3 border border-white text-white rounded-full hover:bg-white hover:text-black transition duration-300"
          >
            Download Resume
          </a>
        </div>
      </div>
    </section>
  );
}
