import { Typewriter } from 'react-simple-typewriter';
import { FiArrowDown } from 'react-icons/fi';
import resume from '../assets/AnshulPatil.pdf';
import './Hero.css';

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative flex h-screen w-full items-center justify-center overflow-hidden text-center"
    >
      {/* Aurora blob background — defined in Hero.css */}
      <div className="aurora-bg">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
        <div className="blob blob-4"></div>
      </div>

      <div className="relative z-10 px-4">
        {/* Status badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-sm text-blue-300 backdrop-blur-sm">
          <span className="h-2 w-2 animate-pulse rounded-full bg-green-400"></span>
          Available for opportunities
        </div>

        <h1 className="mb-4 text-5xl font-extrabold md:text-7xl">
          <span className="text-white">Anshul </span>
          <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Patil
          </span>
        </h1>

        <div className="mb-4 h-10 text-xl font-semibold text-cyan-300 md:text-2xl">
          <Typewriter
            words={[
              'Full-Stack Developer',
              'System Designer',
              'React and Node.js Engineer',
              'Cloud-Focused Builder',
            ]}
            loop
            cursor
            cursorStyle="|"
            typeSpeed={70}
            deleteSpeed={50}
            delaySpeed={1500}
          />
        </div>

        <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-300/90">
          Full-stack developer building reliable, scalable applications with a focus on performance and clarity.
        </p>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <a
            href="#projects"
            className="rounded-full bg-blue-600 px-8 py-3 font-medium text-white shadow-lg transition-all duration-300 hover:bg-blue-500 hover:shadow-[0_0_25px_rgba(59,130,246,0.5)]"
          >
            View Work
          </a>
          <a
            href={resume}
            download
            className="rounded-full border border-white/30 bg-white/5 px-8 py-3 font-medium text-white backdrop-blur-sm transition-all duration-300 hover:bg-white hover:text-black"
          >
            Download Resume
          </a>
        </div>
      </div>

      {/* Scroll down indicator */}
      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 animate-bounce flex-col items-center gap-1 text-gray-400">
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <FiArrowDown size={18} />
      </div>
    </section>
  );
}
