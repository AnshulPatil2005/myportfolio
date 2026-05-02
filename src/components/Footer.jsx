import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-[#f5f5f7] px-6 py-12 md:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="text-center md:text-left">
            <h2 className="mb-2 text-2xl font-bold tracking-tight text-[#1d1d1f]">Anshul Patil</h2>
            <p className="text-[#86868b]">Full-Stack Developer & Product Engineer</p>
          </div>

          <div className="flex gap-6">
            <a
              href="https://github.com/AnshulPatil2005"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#1d1d1f] shadow-sm transition-all hover:-translate-y-1 hover:text-[#0066cc]"
              aria-label="GitHub"
            >
              <FiGithub size={20} />
            </a>
            <a
              href="https://www.linkedin.com/in/anshul-patil-575006280/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#1d1d1f] shadow-sm transition-all hover:-translate-y-1 hover:text-[#0066cc]"
              aria-label="LinkedIn"
            >
              <FiLinkedin size={20} />
            </a>
            <a
              href="mailto:anshulpatil1022@gmail.com"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#1d1d1f] shadow-sm transition-all hover:-translate-y-1 hover:text-[#0066cc]"
              aria-label="Email"
            >
              <FiMail size={20} />
            </a>
          </div>
        </div>

        <div className="mt-12 border-t border-[#d2d2d7] pt-8 text-center text-xs font-medium text-[#86868b]">
          <p>© 2026 Anshul Patil. Built with React, Framer Motion and Tailwind CSS.</p>
        </div>
      </div>
    </footer>
  );
}
