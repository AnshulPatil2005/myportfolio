import React, { useRef } from 'react';
import { Typewriter } from 'react-simple-typewriter';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import resume from '../assets/resume.pdf';

// 🌌 Moving & Shining Stars
function MovingStars() {
  const starsRef = useRef();

  useFrame(() => {
    if (starsRef.current) {
      starsRef.current.rotation.y += 0.0008; // Horizontal drift
      starsRef.current.rotation.x += 0.0004; // Vertical drift
    }
  });

  return (
    <Stars
      ref={starsRef}
      radius={100}      // Spread wider
      depth={80}        // More depth for realism
      count={7000}      // More stars
      factor={6}        // Larger star size → brighter appearance
      saturation={0.5}  // Slight color tint for shine
      fade              // Smooth fade with depth
      speed={1}         // Faster twinkling
    />
  );
}

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative w-full h-screen flex items-center justify-center text-center overflow-hidden bg-black"
    >
      {/* ⭐ Three.js Stars Canvas */}
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <Canvas camera={{ position: [0, 0, 1] }}>
          {/* Soft ambient light to make stars glow */}
          <ambientLight intensity={0.5} />
          {/* Faint point light for subtle shine */}
          <pointLight position={[0, 0, 2]} intensity={0.5} color="#ffffff" />
          <MovingStars />
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
