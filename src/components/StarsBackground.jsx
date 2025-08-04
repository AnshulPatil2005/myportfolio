// src/components/StarsBackground.jsx
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';

const StarsBackground = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-8xl -z-10 pointer-events-none">
      <Canvas>
        <Stars
          radius={100}       // How far stars spread
          depth={50}         // Star field depth
          count={5000}       // Number of stars
          factor={4}         // Star size factor
          saturation={0}     // Color saturation
          fade               // Fading edges for realism
          speed={1}          // Animation speed
        />
      </Canvas>
    </div>
  );
};

export default StarsBackground;
