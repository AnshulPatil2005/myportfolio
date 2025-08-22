// src/components/SocialLinks.jsx

import React from 'react';
// Import LinkedIn and GitHub icons from react-icons
import { FaGithub, FaLinkedin } from 'react-icons/fa';

const SocialLinks = () => {
  return (
    // Fixed vertical container positioned on the left side of the screen
    <div className="fixed top-[35%] left-0 z-50 flex flex-col">
      <ul>
        {/* LinkedIn link item */}
        <li
          className="group w-40 h-12 flex justify-between items-center 
                     ml-[-100px] hover:ml-[-10px] duration-300 bg-blue-600"
        >
          <a
            href="https://www.linkedin.com/in/anshul-patil-575006280/"
            target="_blank"            // Open in new tab
            rel="noopener noreferrer"  // Security best practice
            className="flex justify-between items-center w-full text-white px-4"
          >
            {/* Label + Icon */}
            LinkedIn <FaLinkedin size={25} />
          </a>
        </li>

        {/* GitHub link item */}
        <li
          className="group w-40 h-12 flex justify-between items-center 
                     ml-[-100px] hover:ml-[-10px] duration-300 bg-gray-800"
        >
          <a
            href="https://github.com/AnshulPatil2005"
            target="_blank"
            rel="noopener noreferrer"
            className="flex justify-between items-center w-full text-white px-4"
          >
            GitHub <FaGithub size={25} />
          </a>
        </li>
      </ul>
    </div>
  );
};

export default SocialLinks;
