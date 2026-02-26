import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-700 bg-slate-950/90 px-4 py-6 text-center backdrop-blur">
      <p className="mb-2 text-sm text-slate-400">Copyright 2026 Anshul Patil. All rights reserved.</p>
      <div className="flex justify-center gap-4 text-sm text-slate-300">
        <a
          href="https://github.com/AnshulPatil2005"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-slate-100"
        >
          GitHub
        </a>
        <a
          href="https://www.linkedin.com/in/anshul-patil-575006280/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-slate-100"
        >
          LinkedIn
        </a>
        <a href="mailto:anshulpatil1022@gmail.com" className="hover:text-slate-100">
          Email
        </a>
      </div>
    </footer>
  );
}


