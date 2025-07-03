import React from 'react';
import { Typewriter } from 'react-simple-typewriter';
import resume from '../assets/resume.pdf';

export default function Hero() {
  return (
    <section
      id="hero"
      className="h-screen flex flex-col items-center justify-center text-center px-6 bg-gradient-to-b from-black via-gray-900 to-gray-800"
    >
      <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 leading-tight">
        👋 Hi, I'm <span className="text-blue-400">Anshul</span>
      </h1>

      {/* 🔹 TYPEWRITER LINE */}
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

      {/* 🔹 Description */}
      <p className="text-lg text-gray-400 max-w-2xl mb-10">
        A passionate full-stack developer building beautiful, scalable, and impactful applications.
      </p>

      {/* 🔹 Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
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
    </section>
  );
}
