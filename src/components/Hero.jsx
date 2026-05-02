import { motion, useScroll, useTransform } from 'framer-motion';
import resume from '../assets/AnshulPatil.pdf';
import { FadeIn } from './ScrollReveal';

export default function Hero() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-20 text-center sm:px-10"
    >
      <motion.div style={{ y: y1, opacity }} className="z-10">
        <FadeIn delay={0.2}>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#86868b]">
            Full-Stack Developer
          </p>
        </FadeIn>

        <FadeIn delay={0.4}>
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-[#1d1d1f] sm:text-7xl lg:text-8xl">
            Anshul Patil
          </h1>
        </FadeIn>

        <FadeIn delay={0.6}>
          <p className="mx-auto mb-10 max-w-2xl text-xl leading-relaxed text-[#86868b] sm:text-2xl">
            I build reliable, maintainable web applications with a strong focus on clean
            architecture, performance, and product quality.
          </p>
        </FadeIn>

        <FadeIn delay={0.8}>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="#projects"
              className="rounded-full bg-[#0066cc] px-8 py-4 text-sm font-medium text-white transition-all hover:bg-[#0077ed] hover:shadow-lg active:scale-95"
            >
              View Projects
            </a>
            <a
              href={resume}
              download
              className="rounded-full border border-[#d2d2d7] bg-white px-8 py-4 text-sm font-medium text-[#1d1d1f] transition-all hover:bg-[#f5f5f7] active:scale-95"
            >
              Download Resume
            </a>
          </div>
        </FadeIn>
      </motion.div>

      {/* Subtle Background Element */}
      <motion.div
        className="absolute bottom-0 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 translate-y-1/2 rounded-full bg-blue-50/50 blur-[120px]"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </section>
  );
}
