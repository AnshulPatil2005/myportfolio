// src/components/ParticlesBackground.jsx
import React from 'react';
import { loadFull } from 'tsparticles';
import { useCallback } from 'react';
import Particles from 'react-tsparticles';

const ParticlesBackground = () => {
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        fullScreen: { enable: true, zIndex: -1 }, // Places it in the background
        particles: {
          number: {
            value: 50,
            density: { enable: true, value_area: 800 },
          },
          color: { value: '#ffffff' },
          shape: { type: 'circle' },
          opacity: {
            value: 0.3,
            random: true,
            anim: { enable: false },
          },
          size: {
            value: 3,
            random: true,
          },
          move: {
            enable: true,
            speed: 0.6,
            direction: 'none',
            random: false,
            straight: false,
            outModes: { default: 'out' },
          },
        },
        background: {
          color: '#0f172a', // optional: matches dark mode Tailwind bg-slate-900
        },
      }}
    />
  );
};

export default ParticlesBackground;
