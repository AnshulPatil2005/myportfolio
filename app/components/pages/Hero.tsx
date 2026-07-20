"use client";

import Link from "next/link";
import Social from "../shared/Social";
import { motion } from "framer-motion";
import { profile, availability } from "@/lib/data";

export default function Hero() {
  return (
    <section className="pt-4 pb-16 md:pb-24">
      {/* Meta row — instant, it's context not content */}
      <motion.div
        className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 pb-5 mb-10 border-b dark:border-zinc-800 border-zinc-300 font-mono text-xs uppercase tracking-[0.2em] dark:text-zinc-500 text-zinc-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <span>Portfolio &middot; {profile.location}</span>
        {availability.open && (
          <span className="dark:text-zinc-300 text-zinc-700 normal-case tracking-normal text-xs">
            {availability.label}
          </span>
        )}
      </motion.div>

      {/* Name */}
      <motion.h1
        className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight mb-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1, ease: [0.25, 1, 0.5, 1] }}
      >
        {profile.fullName}
      </motion.h1>

      {/* Credentials */}
      <motion.p
        className="font-mono text-xs dark:text-zinc-500 text-zinc-400 uppercase tracking-widest mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.22, ease: "easeOut" }}
      >
        GSoC @ BRL-CAD&nbsp;&nbsp;/&nbsp;&nbsp;Amazon ML Summer School
      </motion.p>

      {/* Divider — draws left to right, like opening a curtain */}
      <motion.div
        className="border-t dark:border-zinc-800 border-zinc-300 mb-8"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.7, delay: 0.18, ease: [0.25, 1, 0.5, 1] }}
        style={{ transformOrigin: "left" }}
      />

      {/* Role + bio */}
      <motion.div
        className="grid lg:grid-cols-[1fr_1.5fr] gap-6 lg:gap-16 mb-12"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.36, ease: "easeOut" }}
      >
        <p className="font-mono text-sm uppercase tracking-widest dark:text-zinc-400 text-zinc-500 leading-relaxed">
          {profile.headline}
        </p>
        <p className="text-base leading-relaxed dark:text-zinc-300 text-zinc-700 max-w-2xl">
          {profile.shortBio}
        </p>
      </motion.div>

      {/* CTAs */}
      <motion.div
        className="flex flex-wrap items-center gap-x-8 gap-y-3 mb-8"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.48, ease: "easeOut" }}
      >
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
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.58, ease: "easeOut" }}
      >
        <Social type="social" />
      </motion.div>
    </section>
  );
}
