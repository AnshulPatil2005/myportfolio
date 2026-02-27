import resume from '../assets/AnshulPatil.pdf';

export default function Hero() {
  return (
    <section
      id="hero"
      className="classic-section mb-10 px-6 py-12 text-center sm:px-10"
    >
      <p className="mb-3 text-sm font-medium uppercase tracking-wide text-stone-600">
        Full-Stack Developer
      </p>

      <h2 className="mb-4 text-3xl font-semibold text-stone-900 sm:text-4xl">
        Anshul Patil
      </h2>

      <p className="mx-auto mb-8 max-w-2xl text-base leading-7 text-stone-700">
        I build reliable, maintainable web applications with a strong focus on clean
        architecture, performance, and product quality.
      </p>

      <div className="flex flex-col justify-center gap-3 sm:flex-row">
        <a
          href="#projects"
          className="rounded border border-amber-700 bg-amber-100 px-6 py-2.5 text-sm font-medium text-stone-900 transition-colors hover:bg-amber-200"
        >
          View Projects
        </a>
        <a
          href={resume}
          download
          className="rounded border border-amber-300 bg-amber-50 px-6 py-2.5 text-sm font-medium text-stone-800 transition-colors hover:bg-amber-100"
        >
          Download Resume
        </a>
      </div>
    </section>
  );
}