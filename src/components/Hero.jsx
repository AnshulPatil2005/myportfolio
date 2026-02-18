import React from 'react';
import { Typewriter } from 'react-simple-typewriter';
import resume from '../assets/AnshulPatil.pdf';
import './Hero.css';

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative flex h-screen w-full items-center justify-center overflow-hidden text-center"
    >
      <div className="relative z-10 px-4">
        <h1 className="mb-4 text-5xl font-extrabold text-white md:text-6xl">
          Anshul <span className="text-blue-400">Patil</span>
        </h1>

        <div className="mb-2 h-10 text-xl font-semibold text-cyan-300 md:text-2xl">
          <Typewriter
            words={[
              'Full-Stack Developer',
              'System Designer',
              'React and Node.js Engineer',
              'Cloud-Focused Builder',
            ]}
            loop
            cursor
            cursorStyle="|"
            typeSpeed={70}
            deleteSpeed={50}
            delaySpeed={1500}
          />
        </div>

        <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-300">
          Full-stack developer building reliable, scalable applications with a focus on performance and clarity.
        </p>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <a
            href="#projects"
            className="rounded-full bg-blue-600 px-6 py-3 text-white transition duration-300 hover:bg-blue-700"
          >
            View Work
          </a>
          <a
            href={resume}
            download
            className="rounded-full border border-white px-6 py-3 text-white transition duration-300 hover:bg-white hover:text-black"
          >
            Download Resume
          </a>
        </div>
      </div>
    </section>
  );
}
