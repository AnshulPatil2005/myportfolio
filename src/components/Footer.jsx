import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950/70 px-4 py-6 text-center">
      <p className="mb-2 text-gray-400">© 2026 Anshul Patil. All rights reserved.</p>
      <div className="flex justify-center space-x-4 text-sm text-slate-300">
        <a
          href="https://github.com/AnshulPatil2005"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white"
        >
          GitHub
        </a>
        <a
          href="https://www.linkedin.com/in/anshul-patil-575006280/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white"
        >
          LinkedIn
        </a>
        <a href="mailto:anshulpatil1022@gmail.com" className="hover:text-white">
          Email
        </a>
      </div>
    </footer>
  );
}
