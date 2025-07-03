import React from 'react';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-white/60 dark:bg-gray-900/60 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white tracking-tight">
          Anshul<span className="text-blue-500">.dev</span>
        </h1>

        <ul className="flex space-x-6 font-medium text-gray-700 dark:text-gray-300">
          <li>
            <a href="#about" className="hover:text-blue-500 transition-colors duration-200">
              About
            </a>
          </li>
          <li>
            <a href="#projects" className="hover:text-blue-500 transition-colors duration-200">
              Projects
            </a>
          </li>
          <li>
            <a href="#skills" className="hover:text-blue-500 transition-colors duration-200">
              Skills
            </a>
          </li>
          <li>
            <a href="#contact" className="hover:text-blue-500 transition-colors duration-200">
              Contact
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
