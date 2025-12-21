import React from 'react';

export default function Footer() {
  return (
    <footer className="py-6 px-4 text-center border-t border-gray-700" style={{ backgroundColor: 'rgba(18, 24, 38, 0.8)' }}>
      <p className="text-gray-400 mb-2">© 2025 Anshul. All rights reserved.</p>
      <div className="flex justify-center space-x-4">
        <a href="https://github.com/AnshulPatil2005" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href="https://www.linkedin.com/in/anshul-patil-575006280/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a href="anshulpatil1022@gmail.com">Email</a>
      </div>
    </footer>
  );
}
