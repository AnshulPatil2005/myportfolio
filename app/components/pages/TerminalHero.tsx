"use client";

import { TypeAnimation } from "react-type-animation";
import { useRef } from "react";
import Link from "next/link";
import Social from "../shared/Social";
import { BiSolidDownload } from "react-icons/bi";
import { profile } from "@/lib/data";

const TERMINAL_TEXT = [
  "~/anshul $ whoami",
  500,
  "~/anshul $ whoami\n  Anshul Patil — Backend & Systems Developer",
  600,
  "~/anshul $ whoami\n  Anshul Patil — Backend & Systems Developer\n\n~/anshul $ cat current_role.txt",
  400,
  "~/anshul $ whoami\n  Anshul Patil — Backend & Systems Developer\n\n~/anshul $ cat current_role.txt\n  GSoC @ BRL-CAD  ·  Extralit Contributor\n  B.Tech IIIT Surat (2024–2028)",
  700,
  "~/anshul $ whoami\n  Anshul Patil — Backend & Systems Developer\n\n~/anshul $ cat current_role.txt\n  GSoC @ BRL-CAD  ·  Extralit Contributor\n  B.Tech IIIT Surat (2024–2028)\n\n~/anshul $ ls research/",
  400,
  "~/anshul $ whoami\n  Anshul Patil — Backend & Systems Developer\n\n~/anshul $ cat current_role.txt\n  GSoC @ BRL-CAD  ·  Extralit Contributor\n  B.Tech IIIT Surat (2024–2028)\n\n~/anshul $ ls research/\n  GujaratiLegalNLP/   CXR-Generalization/\n\n~/anshul $ ",
] as const;

export default function TerminalHero() {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Feature 8: cursor spotlight — radial glow follows the mouse, dark mode only
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = sectionRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--spotlight-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--spotlight-y", `${e.clientY - rect.top}px`);
  };

  const handleMouseLeave = () => {
    sectionRef.current?.style.setProperty("--spotlight-x", "-9999px");
    sectionRef.current?.style.setProperty("--spotlight-y", "-9999px");
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex xl:flex-row flex-col xl:items-center items-start xl:justify-between gap-x-12 gap-y-10 mb-16"
      style={
        {
          "--spotlight-x": "-9999px",
          "--spotlight-y": "-9999px",
        } as React.CSSProperties
      }
    >
      {/* Cursor spotlight overlay — only visible in dark mode */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden dark:block rounded-xl"
        style={{
          background:
            "radial-gradient(circle 320px at var(--spotlight-x) var(--spotlight-y), rgba(51,224,146,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Left column: terminal + CTA */}
      <div className="relative z-10 w-full xl:max-w-xl">
        {/* Terminal window */}
        <div className="rounded-xl border dark:border-zinc-700/60 border-zinc-200 overflow-hidden shadow-xl dark:shadow-zinc-900/80 shadow-zinc-200/60 font-mono text-sm">
          {/* Window chrome */}
          <div className="flex items-center gap-1.5 px-4 py-3 dark:bg-zinc-800/80 bg-zinc-100 border-b dark:border-zinc-700/60 border-zinc-200">
            <div className="w-3 h-3 rounded-full bg-red-500/90" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/90" />
            <div className="w-3 h-3 rounded-full bg-green-500/90" />
            <span className="ml-auto text-xs dark:text-zinc-500 text-zinc-400 tracking-wide">
              ~/anshul
            </span>
          </div>

          {/* Terminal body */}
          <div className="p-5 dark:bg-zinc-900/90 bg-white min-h-[240px]">
            <TypeAnimation
              sequence={TERMINAL_TEXT as unknown as (string | number)[]}
              speed={72}
              deletionSpeed={99}
              wrapper="div"
              cursor
              repeat={0}
              style={{ whiteSpace: "pre-wrap", lineHeight: "1.7" }}
              className="dark:text-zinc-300 text-zinc-700 text-[13px] leading-relaxed"
            />
          </div>
        </div>

        {/* CTA row */}
        <div className="flex flex-wrap items-center gap-3 mt-6">
          <a
            href={profile.resumeURL}
            download
            className="flex items-center gap-x-2 dark:bg-zinc-800 bg-zinc-100 border dark:border-zinc-700 border-zinc-200 rounded-md px-4 py-2 text-sm font-incognito font-semibold dark:hover:bg-zinc-700 hover:bg-zinc-200 transition-colors duration-150"
          >
            Download Résumé <BiSolidDownload />
          </a>
          <Social type="social" />
        </div>
      </div>

      {/* Right column: headline + short bio */}
      <div className="relative z-10 xl:max-w-sm max-w-full">
        <h1 className="font-incognito font-semibold tracking-tight text-3xl sm:text-4xl mb-4 lg:leading-[2.8rem] leading-tight">
          {profile.headline}
        </h1>
        <p className="text-base dark:text-zinc-400 text-zinc-600 leading-relaxed">
          {profile.shortBio}
        </p>
        <div className="mt-6 flex flex-wrap gap-3 text-xs font-mono">
          {[
            { label: "↗ Projects", href: "/#projects" },
            { label: "↗ Research", href: "/#research" },
            { label: "↗ Blog", href: "/#blog" },
          ].map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="px-3 py-1.5 rounded-full border dark:border-zinc-700 border-zinc-200 dark:text-zinc-400 text-zinc-500 dark:hover:border-primary-color dark:hover:text-primary-color hover:border-zinc-400 hover:text-zinc-700 transition-all duration-150"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
