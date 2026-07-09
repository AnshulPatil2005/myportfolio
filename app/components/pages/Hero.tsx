"use client";

import Link from "next/link";
import Social from "../shared/Social";
import { profile, availability } from "@/lib/data";

export default function Hero() {
  return (
    <section className="pt-2 mb-24 md:mb-36">
      {/* Meta row */}
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 pb-5 mb-10 border-b dark:border-zinc-800 border-zinc-300 font-mono text-xs uppercase tracking-[0.2em] dark:text-zinc-500 text-zinc-400">
        <span>Portfolio &middot; {profile.location}</span>
        {availability.open && (
          <span className="inline-flex items-center gap-2 dark:text-zinc-300 text-zinc-700 normal-case tracking-normal">
            <span className="w-2 h-2 dark:bg-zinc-100 bg-zinc-900 shrink-0" aria-hidden="true" />
            {availability.label}
          </span>
        )}
      </div>

      {/* Masthead name */}
      <h1 className="font-incognito font-black tracking-tight leading-[0.92] text-6xl sm:text-7xl lg:text-8xl mb-8">
        {profile.fullName}
      </h1>

      <div className="border-t dark:border-zinc-800 border-zinc-300 mb-8" />

      {/* Role + bio */}
      <div className="grid lg:grid-cols-[1fr_1.5fr] gap-6 lg:gap-16">
        <p className="font-mono text-sm uppercase tracking-widest dark:text-zinc-400 text-zinc-500 leading-relaxed">
          {profile.headline}
        </p>
        <p className="font-body text-lg lg:text-xl leading-relaxed dark:text-zinc-300 text-zinc-700 max-w-2xl">
          {profile.shortBio}
        </p>
      </div>

      {/* CTA row */}
      <div className="flex flex-wrap items-center gap-x-8 gap-y-3 mt-12 font-mono text-sm">
        <a
          href={profile.resumeURL}
          download
          className="dark:text-zinc-100 text-zinc-900 border-b dark:border-zinc-700 border-zinc-400 pb-0.5 dark:hover:border-zinc-300 hover:border-zinc-700 transition-colors duration-150"
        >
          ( R&eacute;sum&eacute; &darr; )
        </a>
        <Link
          href="/#products"
          className="dark:text-zinc-400 text-zinc-500 border-b border-transparent pb-0.5 dark:hover:text-zinc-100 hover:text-zinc-900 dark:hover:border-zinc-700 hover:border-zinc-400 transition-colors duration-150"
        >
          ( Products &rarr; )
        </Link>
        <Link
          href="/#contact"
          className="dark:text-zinc-400 text-zinc-500 border-b border-transparent pb-0.5 dark:hover:text-zinc-100 hover:text-zinc-900 dark:hover:border-zinc-700 hover:border-zinc-400 transition-colors duration-150"
        >
          ( Contact &rarr; )
        </Link>
      </div>

      <Social type="social" />
    </section>
  );
}
