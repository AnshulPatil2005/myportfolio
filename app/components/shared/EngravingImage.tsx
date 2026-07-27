"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const GRAIN_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

interface Props {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  /** false = no clip-path wipe (use for hero where the parent already animates in) */
  animate?: boolean;
}

export default function EngravingImage({
  src,
  alt,
  className = "",
  priority,
  animate = true,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // Subtle parallax: image drifts ±7% relative to scroll
  const y = useTransform(scrollYProgress, [0, 1], ["-7%", "7%"]);

  return (
    <motion.div
      ref={ref}
      className={`relative overflow-hidden select-none ${className}`}
      aria-hidden="true"
      // Clip-path wipe reveal (bottom → top) for section images
      initial={animate ? { clipPath: "inset(0 0 100% 0)" } : false}
      whileInView={animate ? { clipPath: "inset(0 0 0% 0)" } : undefined}
      viewport={animate ? { once: true, margin: "-80px" } : undefined}
      transition={{ duration: 1.3, ease: [0.76, 0, 0.24, 1] }}
    >
      {/* Parallax scroll layer */}
      <motion.div className="absolute inset-0" style={{ y }}>
        {/* Inner div scaled 115% so parallax movement never exposes background */}
        <div className="group/eng absolute inset-0">
          <div className="absolute inset-0 scale-[1.15] transition-transform duration-[1100ms] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover/eng:scale-[1.22]">
            <Image
              src={src}
              alt={alt}
              fill
              priority={priority}
              sizes="(max-width: 1024px) 100vw, 520px"
              className="object-cover object-center"
              style={{ filter: "url(#amber-duotone)" }}
            />
          </div>
        </div>
      </motion.div>

      {/* Animated film grain — gives physical, aged texture */}
      <div
        className="absolute inset-[-20%] pointer-events-none opacity-[0.055] mix-blend-overlay animate-grain"
        style={{ backgroundImage: GRAIN_SVG, backgroundSize: "180px 180px" }}
      />

      {/* Corner bracket decorations — editorial framing device */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-3 left-3 w-5 h-5 border-t border-l dark:border-accent/35 border-amber-500/35" />
        <div className="absolute top-3 right-3 w-5 h-5 border-t border-r dark:border-accent/35 border-amber-500/35" />
        <div className="absolute bottom-3 left-3 w-5 h-5 border-b border-l dark:border-accent/35 border-amber-500/35" />
        <div className="absolute bottom-3 right-3 w-5 h-5 border-b border-r dark:border-accent/35 border-amber-500/35" />
      </div>
    </motion.div>
  );
}
