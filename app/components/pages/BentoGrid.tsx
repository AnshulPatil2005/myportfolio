"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const SKILLS = ["Python", "C++", "FastAPI", "PyTorch", "PostgreSQL", "Docker", "NLP", "Golang"];

const CARD = "rounded-xl border dark:border-zinc-800 border-zinc-200 dark:bg-primary-bg bg-zinc-50 p-5 overflow-hidden";

function Cell({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.015, transition: { duration: 0.15 } }}
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
          <div className="mt-4 flex flex-wrap gap-2">
            {["C++", "CI/CD", "Open Source"].map((t) => (
              <span
                key={t}
                className="text-xs font-mono dark:bg-zinc-800 bg-zinc-200 dark:text-zinc-300 text-zinc-700 px-2 py-0.5 rounded-full"
              >
                {t}
              </span>
            ))}
            <Link
              href="/#projects"
              className="text-xs font-mono dark:text-primary-color text-tertiary-color hover:underline ml-auto"
            >
              see projects →
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
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="dark:text-zinc-300 text-zinc-600">Actively looking</span>
          </div>
          <a
            href="mailto:anshulpatil1022@gmail.com"
            className="mt-2 text-xs font-mono dark:text-primary-color text-tertiary-color hover:underline"
          >
            reach out →
          </a>
        </Cell>

        {/* ── Location cell ──────────────────────────────────────────────── */}
        <Cell className="flex items-center gap-4">
          <div className="text-3xl leading-none select-none">🇮🇳</div>
          <div>
            <p className="font-incognito font-semibold">Mumbai, India</p>
            <p className="text-xs dark:text-zinc-500 text-zinc-400 mt-0.5">UTC +5:30</p>
          </div>
        </Cell>

        {/* ── Skills cell (spans 2 cols to fill the row) ─────────────────── */}
        <Cell className="sm:col-span-2 flex flex-col gap-2">
          <p className="text-xs uppercase tracking-widest dark:text-zinc-500 text-zinc-400 font-mono mb-1">
            top skills
          </p>
          <div className="flex flex-wrap gap-1.5">
            {SKILLS.map((s) => (
              <span
                key={s}
                className="text-xs font-mono dark:bg-zinc-800 bg-zinc-200 dark:text-zinc-300 text-zinc-700 px-2 py-0.5 rounded"
              >
                {s}
              </span>
            ))}
          </div>
        </Cell>
      </div>
    </section>
  );
}
