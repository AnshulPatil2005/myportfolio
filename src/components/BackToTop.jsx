// src/components/BackToTop.jsx

// Import React and hooks for state and lifecycle
import React, { useEffect, useState } from 'react';

// Import an up-arrow icon from react-icons
import { FaArrowUp } from 'react-icons/fa';

const BackToTop = () => {
  // Local state to track whether the button should be visible or not
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Function to run whenever the user scrolls
    const handleScroll = () => {
      // Show button only if the scroll position is greater than 300px
      setShow(window.scrollY > 300);
    };

    // Attach scroll listener when component mounts
    window.addEventListener('scroll', handleScroll);

    // Cleanup: remove listener when component unmounts
    return () => window.removeEventListener('scroll', handleScroll);
  }, []); // Empty dependency array ensures this runs only once

  // Smoothly scroll the page back to the top when button is clicked
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render: only show the button if "show" is true
  return show ? (
    <button
      onClick={scrollToTop} // Attach scroll-to-top handler
      className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition"
      aria-label="Back to top" // Accessibility label
    >
      {/* Up arrow icon inside the button */}
      <FaArrowUp />
    </button>
  ) : null; // If "show" is false, render nothing
};

// Export the component so it can be used in other files
export default BackToTop;
