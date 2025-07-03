import React from 'react';

export default function Footer() {
  return (
    <footer className="py-6 px-4 bg-white dark:bg-gray-900 text-center border-t dark:border-gray-700">
      <p className="text-gray-600 dark:text-gray-400 mb-2">© 2025 Anshul. All rights reserved.</p>
      <div className="flex justify-center space-x-4">
        <a href="https://github.com/AnshulPatil2005" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href="https://www.linkedin.com/in/anshul-patil-575006280/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a href="anshulpatil1022@gmail.com">Email</a>
      </div>
    </footer>
  );
}
