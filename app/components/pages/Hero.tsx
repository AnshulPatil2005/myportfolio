"use client";

import Link from "next/link";
import Social from "../shared/Social";
import { Slide } from "../../animation/Slide";
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
              <span className="w-2 h-2 rounded-full dark:bg-emerald-400 bg-emerald-600 shrink-0 animate-pulse" aria-hidden="true" />
              {availability.label}
            </span>
          )}
        </div>
      </Slide>

      {/* Masthead name */}
      <Slide delay={0.05}>
        <h1
          className="font-black tracking-tight leading-[0.95] mb-8"
          style={{ fontSize: "clamp(3rem, 9vw, 7rem)" }}
        >
          {profile.fullName}
        </h1>
      </Slide>

      <Slide delay={0.1}>
        <div className="border-t dark:border-zinc-800 border-zinc-300 mb-8" />
      </Slide>

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
            className="dark:text-white text-zinc-900 font-semibold border-b-2 dark:border-accent border-accent pb-0.5 hover:opacity-75 transition-opacity duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-zinc-300 focus-visible:ring-zinc-700 rounded-sm"
          >
            View my work &rarr;
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
