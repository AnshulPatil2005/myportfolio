"use client";

import Link from "next/link";
import Social from "../shared/Social";
import EngravingImage from "../shared/EngravingImage";
import ConwayCanvas from "../shared/ConwayCanvas";
import { motion } from "framer-motion";
import { profile, availability } from "@/lib/data";

const ENGRAVING_SRC = "/engraving-melencolia.jpg";

export default function Hero() {
  return (
    <section className="relative pt-4 pb-20 md:pb-28">
      <ConwayCanvas />
      {/* Meta row */}
      <motion.div
        className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 pb-5 mb-12 border-b dark:border-zinc-800 border-zinc-300 font-mono text-xs uppercase tracking-[0.2em] dark:text-zinc-500 text-zinc-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <span>Portfolio &middot; {profile.location}</span>
        {availability.open && (
          <span className="dark:text-zinc-400 text-zinc-600 normal-case tracking-normal text-xs">
            {availability.label}
          </span>
        )}
      </motion.div>

      {/* Two-column grid: text left, engraving right */}
      <div className="grid lg:grid-cols-[1fr_420px] xl:grid-cols-[1fr_520px] gap-10 lg:gap-16 items-start">
        {/* Left — text */}
        <div>
          {/* Name */}
          <motion.h1
            className="font-display font-normal leading-none tracking-[-0.03em] mb-6"
            style={{ fontSize: "clamp(4rem, 10vw, 9rem)" }}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08, ease: [0.25, 1, 0.5, 1] }}
          >
            {profile.fullName.split(" ").map((word, i, arr) =>
              i === arr.length - 1 ? (
                <span key={i} className="italic text-accent block">
                  {word}
                </span>
              ) : (
                <span key={i} className="block">
                  {word}
                </span>
              )
            )}
          </motion.h1>

          {/* Credentials */}
          <motion.p
            className="font-mono text-xs dark:text-zinc-500 text-zinc-400 uppercase tracking-[0.2em] mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.24, ease: "easeOut" }}
          >
            GSoC @ BRL-CAD&nbsp;&nbsp;&middot;&nbsp;&nbsp;Amazon ML Summer School
          </motion.p>

          {/* Divider */}
          <motion.div
            className="border-t dark:border-zinc-800 border-zinc-300 mb-10"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.75, delay: 0.18, ease: [0.25, 1, 0.5, 1] }}
            style={{ transformOrigin: "left" }}
          />

          {/* Role + bio */}
          <motion.div
            className="mb-14 space-y-4"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.34, ease: "easeOut" }}
          >
            <p className="font-mono text-xs uppercase tracking-[0.18em] dark:text-zinc-500 text-zinc-500">
              {profile.headline}
            </p>
            <p className="text-lg leading-relaxed dark:text-zinc-300 text-zinc-700 max-w-xl">
              {profile.shortBio}
            </p>
          </motion.div>

          {/* CTAs */}
          <motion.div
            className="flex flex-wrap items-center gap-x-10 gap-y-4 mb-10"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.46, ease: "easeOut" }}
          >
            <Link
              href="/#featured-work"
              className="group inline-flex items-center gap-2 font-mono text-sm uppercase tracking-widest dark:text-white text-zinc-900 border-b-2 dark:border-accent border-accent pb-0.5 hover:opacity-70 transition-opacity duration-150"
            >
              View my work
              <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
                &rarr;
              </span>
            </Link>
            <button
              onClick={() =>
                window.dispatchEvent(new KeyboardEvent("keydown", { key: "c", bubbles: true }))
              }
              className="hidden md:inline-flex items-center gap-2.5 font-mono text-sm uppercase tracking-widest dark:text-accent text-amber-600 border dark:border-amber-500/50 border-amber-500/60 px-4 py-1.5 dark:hover:bg-amber-500/10 hover:bg-amber-500/5 hover:border-amber-500 transition-colors duration-150"
            >
              <span className="text-[10px]">▶</span> Play Career Mode
            </button>
            <a
              href={profile.resumeURL}
              download
              className="font-mono text-sm uppercase tracking-widest dark:text-zinc-500 text-zinc-500 border-b border-transparent pb-0.5 dark:hover:text-zinc-200 hover:text-zinc-800 dark:hover:border-zinc-600 hover:border-zinc-400 transition-colors duration-150"
            >
              R&eacute;sum&eacute;
            </a>
            <Link
              href="/#contact"
              className="font-mono text-sm uppercase tracking-widest dark:text-zinc-500 text-zinc-500 border-b border-transparent pb-0.5 dark:hover:text-zinc-200 hover:text-zinc-800 dark:hover:border-zinc-600 hover:border-zinc-400 transition-colors duration-150"
            >
              Contact
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.56, ease: "easeOut" }}
          >
            <Social type="social" />
          </motion.div>

          <motion.p
            className="mt-6 font-mono text-[10px] uppercase tracking-[0.22em] dark:text-zinc-700 text-zinc-400 select-none flex items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 1.1, ease: "easeOut" }}
          >
            <span className="dark:text-accent text-amber-600"><kbd className="border dark:border-amber-500/50 border-amber-500/60 px-1 py-0.5 text-[9px]">C</kbd> Career Mode — fight my résumé</span>
            <span className="dark:text-zinc-800 text-zinc-300">·</span>
            <span><kbd className="border dark:border-zinc-700 border-zinc-300 px-1 py-0.5 text-[9px]">F</kbd> FPS</span>
            <span className="dark:text-zinc-800 text-zinc-300">·</span>
            <span><kbd className="border dark:border-zinc-700 border-zinc-300 px-1 py-0.5 text-[9px]">T</kbd> Tower Defense</span>
            <span className="dark:text-zinc-800 text-zinc-300">·</span>
            <span><kbd className="border dark:border-zinc-700 border-zinc-300 px-1 py-0.5 text-[9px]">G</kbd> Breakout</span>
          </motion.p>
        </div>

        {/* Right — engraving */}
        <motion.div
          className="hidden lg:block"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 1, 0.5, 1] }}
        >
          <EngravingImage
            src={ENGRAVING_SRC}
            alt=""
            priority
            animate={false}
            className="w-full aspect-[3/4]"
          />
        </motion.div>
      </div>
    </section>
  );
}
