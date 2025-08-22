// src/components/StarsBackground.jsx

import React from 'react';
// Canvas is the root element for rendering 3D scenes with react-three-fiber
import { Canvas } from '@react-three/fiber';
// Stars is a helper component from drei that generates a starfield
import { Stars } from '@react-three/drei';

const StarsBackground = () => {
  return (
    // Full-screen fixed container for the star background
    // - `fixed top-0 left-0 w-full h-8xl` makes it cover the screen
    // - `-z-10` ensures it stays behind all other elements
    // - `pointer-events-none` prevents blocking clicks on UI elements
    <div className="fixed top-0 left-0 w-full h-8xl -z-10 pointer-events-none">
      {/* 3D canvas for rendering */}
      <Canvas>
        <Stars
          radius={100}   // Radius of the star sphere (how spread out stars are)
          depth={50}     // Depth of the starfield along z-axis
          count={5000}   // Number of stars to render
          factor={4}     // Controls star size (bigger factor = bigger stars)
          saturation={0} // 0 = grayscale (white stars), 1 = colorful
          fade           // Enables fading edges for a more realistic look
          speed={1}      // Rotation/animation speed of stars
        />
      </Canvas>
    </div>
  );
};

export default StarsBackground;
