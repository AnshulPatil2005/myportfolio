// src/components/SocialLinks.jsx
import React from 'react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

const SocialLinks = () => {
  return (
    <div className="fixed top-[35%] left-0 z-50 flex flex-col">
      <ul>
        <li className="group w-40 h-12 flex justify-between items-center ml-[-100px] hover:ml-[-10px] duration-300 bg-blue-600">
          <a
            href="https://www.linkedin.com/in/anshul-patil-575006280/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex justify-between items-center w-full text-white px-4"
          >
            LinkedIn <FaLinkedin size={25} />
          </a>
        </li>
        <li className="group w-40 h-12 flex justify-between items-center ml-[-100px] hover:ml-[-10px] duration-300 bg-gray-800">
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
