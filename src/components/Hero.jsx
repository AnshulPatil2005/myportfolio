import resume from '../assets/AnshulPatil.pdf';

export default function Hero() {
  return (
    <section
      id="hero"
      className="mb-10 rounded-lg border border-slate-700 bg-slate-900/85 shadow-xl shadow-black/25 backdrop-blur-sm px-6 py-12 text-center sm:px-10"
    >
      <p className="mb-3 text-sm font-medium uppercase tracking-wide text-slate-400">
        Full-Stack Developer
      </p>

      <h2 className="mb-4 text-3xl font-semibold text-slate-100 sm:text-4xl">
        Anshul Patil
      </h2>

      <p className="mx-auto mb-8 max-w-2xl text-base leading-7 text-slate-300">
        I build reliable, maintainable web applications with a strong focus on clean
        architecture, performance, and long-term product quality.
      </p>

      <div className="flex flex-col justify-center gap-3 sm:flex-row">
        <a
          href="#projects"
          className="rounded border border-slate-200 bg-slate-100 px-6 py-2.5 text-sm font-medium text-slate-900 transition-colors hover:bg-white"
        >
          View Projects
        </a>
        <a
          href={resume}
          download
          className="rounded border border-slate-600 bg-slate-950 px-6 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:border-slate-500 hover:bg-slate-900"
        >
          Download Resume
        </a>
      </div>
    </section>
  );
}


