"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const SKILLS = ["Python", "C++", "FastAPI", "PyTorch", "PostgreSQL", "Docker", "NLP", "Golang"];

const CARD = "border dark:border-zinc-800 border-zinc-300 p-5 overflow-hidden";

function Cell({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.008, transition: { duration: 0.15 } }}
      className={`${CARD} ${className}`}
    >
      {children}
    </motion.div>
  );
}

export default function BentoGrid() {
  return (
    <section className="mt-16 mb-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* ── Currently Building (tall on sm+) ───────────────────────────── */}
        <Cell className="sm:row-span-2 flex flex-col justify-between min-h-[200px]">
          <div>
            <p className="text-xs uppercase tracking-widest dark:text-zinc-500 text-zinc-400 mb-3 font-mono">
              currently building
            </p>
            <p className="font-incognito text-xl font-semibold leading-snug mb-1">
              GSoC @ BRL-CAD
            </p>
            <p className="text-sm dark:text-zinc-400 text-zinc-600 leading-relaxed">
              Manifold C++ geometry library — CI reliability, cross-platform determinism &amp; benchmarking infrastructure.
            </p>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-xs dark:text-zinc-500 text-zinc-500">
            {["C++", "CI/CD", "Open Source"].map((t, i) => (
              <span key={t}>
                {i > 0 && <span className="mr-3 dark:text-zinc-700 text-zinc-300">/</span>}
                {t}
              </span>
            ))}
            <Link
              href="/#projects"
              className="dark:text-zinc-300 text-zinc-700 hover:underline ml-auto"
            >
              see projects &rarr;
            </Link>
          </div>
        </Cell>

        {/* ── Availability cell ──────────────────────────────────────────── */}
        <Cell className="flex flex-col gap-1">
          <p className="text-xs uppercase tracking-widest dark:text-zinc-500 text-zinc-400 font-mono">
            availability
          </p>
          <p className="font-incognito text-xl font-semibold mt-1 leading-snug">
            Open to Internships
          </p>
          <p className="text-sm dark:text-zinc-400 text-zinc-500">
            Summer 2026 · Backend / Systems / AI
          </p>
          <div className="mt-2 flex items-center gap-2 text-xs font-mono">
            <span className="w-2 h-2 dark:bg-zinc-100 bg-zinc-900 shrink-0" aria-hidden="true" />
            <span className="dark:text-zinc-300 text-zinc-600">Actively looking</span>
          </div>
          <a
            href="mailto:anshulpatil1022@gmail.com"
            className="mt-2 text-xs font-mono dark:text-zinc-300 text-zinc-700 hover:underline"
          >
            reach out &rarr;
          </a>
        </Cell>

        {/* ── Location cell ──────────────────────────────────────────────── */}
        <Cell className="flex items-center">
          <div>
            <p className="font-incognito font-semibold">Mumbai, India</p>
            <p className="text-xs dark:text-zinc-500 text-zinc-400 mt-0.5 font-mono">UTC +5:30</p>
          </div>
        </Cell>

        {/* ── Skills cell (spans 2 cols to fill the row) ─────────────────── */}
        <Cell className="sm:col-span-2 flex flex-col gap-2">
          <p className="text-xs uppercase tracking-widest dark:text-zinc-500 text-zinc-400 font-mono mb-1">
            top skills
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 font-mono text-xs dark:text-zinc-300 text-zinc-700">
            {SKILLS.map((s, i) => (
              <span key={s}>
                {i > 0 && <span className="mr-4 dark:text-zinc-700 text-zinc-300">/</span>}
                {s}
              </span>
            ))}
          </div>
        </Cell>
      </div>
    </section>
  );
}
