"use client";

import Link from "next/link";
import Social from "../shared/Social";
import { profile, availability } from "@/lib/data";

export default function Hero() {
  return (
    <section className="pt-4 pb-16 md:pb-24">
      {/* Meta row */}
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 pb-5 mb-10 border-b dark:border-zinc-800 border-zinc-300 font-mono text-xs uppercase tracking-[0.2em] dark:text-zinc-500 text-zinc-400">
        <span>Portfolio &middot; {profile.location}</span>
        {availability.open && (
          <span className="dark:text-zinc-300 text-zinc-700 normal-case tracking-normal text-xs">
            {availability.label}
          </span>
        )}
      </div>

      {/* Name */}
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight mb-3">
        {profile.fullName}
      </h1>

      {/* Credentials — inline mono, no borders, no pills */}
      <p className="font-mono text-xs dark:text-zinc-500 text-zinc-400 uppercase tracking-widest mb-10">
        GSoC @ BRL-CAD&nbsp;&nbsp;/&nbsp;&nbsp;Amazon ML Summer School
      </p>

      {/* Divider */}
      <div className="border-t dark:border-zinc-800 border-zinc-300 mb-8" />

      {/* Role + bio */}
      <div className="grid lg:grid-cols-[1fr_1.5fr] gap-6 lg:gap-16 mb-12">
        <p className="font-mono text-sm uppercase tracking-widest dark:text-zinc-400 text-zinc-500 leading-relaxed">
          {profile.headline}
        </p>
        <p className="text-base leading-relaxed dark:text-zinc-300 text-zinc-700 max-w-2xl">
          {profile.shortBio}
        </p>
      </div>

      {/* CTAs */}
      <div className="flex flex-wrap items-center gap-x-8 gap-y-3 mb-8">
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
    </section>
  );
}
