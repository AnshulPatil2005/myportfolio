import React from 'react';
import { Typewriter } from 'react-simple-typewriter';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import resume from '../assets/resume.pdf';

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative w-full h-screen flex items-center justify-center text-center overflow-hidden bg-black"
    >
      {/* ⭐ Three.js Stars Canvas */}
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <Canvas camera={{ position: [0, 0, 1] }}>
          <Stars
            radius={80}
            depth={50}
            count={5000}
            factor={4}
            saturation={0}
            fade
            speed={1}
          />
        </Canvas>
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
