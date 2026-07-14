"use client";

import Link from "next/link";
import Social from "../shared/Social";
import { Slide } from "../../animation/Slide";
import { motion } from "framer-motion";
import { profile, availability } from "@/lib/data";

export default function Hero() {
  return (
    <section className="pt-4 pb-16 md:pb-24">
      {/* Meta row */}
      <Slide>
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 pb-5 mb-8 border-b dark:border-zinc-800 border-zinc-300 font-mono text-xs uppercase tracking-[0.2em] dark:text-zinc-500 text-zinc-400">
          <span>Portfolio &middot; {profile.location}</span>
          {availability.open && (
            <span className="inline-flex items-center gap-2 dark:text-zinc-300 text-zinc-700 normal-case tracking-normal">
              {/* Ripple ring instead of CSS pulse */}
              <span className="relative inline-flex w-2 h-2 shrink-0" aria-hidden="true">
                <motion.span
                  className="absolute inset-0 rounded-full dark:bg-emerald-400 bg-emerald-600"
                  animate={{ scale: [1, 2.8], opacity: [0.55, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                />
                <span className="relative w-2 h-2 rounded-full dark:bg-emerald-400 bg-emerald-600" />
              </span>
              {availability.label}
            </span>
          )}
        </div>
      </Slide>

      {/* Masthead — each word slides up from an overflow-hidden mask */}
      <h1
        className="font-black tracking-tight leading-[0.95] mb-8"
        style={{ fontSize: "clamp(2.2rem, 5.5vw, 5rem)" }}
      >
        {profile.fullName.split(" ").map((word, i) => (
          <span key={i} className="inline-block overflow-hidden mr-[0.3em] last:mr-0">
            <motion.span
              className="inline-block"
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{
                duration: 0.75,
                delay: 0.06 + i * 0.11,
                ease: [0.33, 1, 0.68, 1],
              }}
            >
              {word}
            </motion.span>
          </span>
        ))}
      </h1>

      {/* Divider — draws left to right */}
      <motion.div
        className="border-t dark:border-zinc-800 border-zinc-300 mb-8"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.9, ease: [0.25, 1, 0.5, 1], delay: 0.28 }}
        style={{ transformOrigin: "left" }}
      />

      {/* Role + bio */}
      <Slide delay={0.15}>
        <div className="grid lg:grid-cols-[1fr_1.5fr] gap-6 lg:gap-16">
          <p className="font-mono text-sm uppercase tracking-widest dark:text-zinc-400 text-zinc-500 leading-relaxed">
            {profile.headline}
          </p>
          <p className="text-lg lg:text-xl leading-relaxed dark:text-zinc-300 text-zinc-700 max-w-2xl">
            {profile.shortBio}
          </p>
        </div>
      </Slide>

      {/* CTA row */}
      <Slide delay={0.2}>
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3 mt-12">
          <Link
            href="/#featured-work"
            className="group dark:text-white text-zinc-900 font-semibold border-b-2 dark:border-accent border-accent pb-0.5 hover:opacity-75 transition-opacity duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-zinc-300 focus-visible:ring-zinc-700 rounded-sm"
          >
            View my work{" "}
            <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
              &rarr;
            </span>
          </Link>
          <a
            href={profile.resumeURL}
            download
            className="text-sm dark:text-zinc-400 text-zinc-500 border-b border-transparent pb-0.5 dark:hover:text-zinc-100 hover:text-zinc-900 dark:hover:border-zinc-700 hover:border-zinc-400 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-zinc-400 focus-visible:ring-zinc-600 rounded-sm"
          >
            R&eacute;sum&eacute;
          </a>
          <Link
            href="/#contact"
            className="text-sm dark:text-zinc-400 text-zinc-500 border-b border-transparent pb-0.5 dark:hover:text-zinc-100 hover:text-zinc-900 dark:hover:border-zinc-700 hover:border-zinc-400 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-zinc-400 focus-visible:ring-zinc-600 rounded-sm"
          >
            Contact
          </Link>
        </div>

        <Social type="social" />
      </Slide>
    </section>
  );
}
