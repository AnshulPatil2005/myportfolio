"use client";

import { motion } from "framer-motion";

const credentials = [
  {
    index: "01",
    category: "OPEN SOURCE",
    year: "",
    title: "Claude for Open Source Program",
    org: "Anthropic · Selected",
    description:
      "Selected by Anthropic.",
  },
  {
    index: "02",
    category: "MENTORSHIP",
    year: "2026",
    title: "LFX Mentorship",
    org: "CNCF · OpenKruise Agents",
    description:
      "Selected to build token-based sign-in in Go for a Kubernetes platform that runs AI agents.",
  },
  {
    index: "03",
    category: "OPEN SOURCE",
    year: "2026",
    title: "Google Summer of Code",
    org: "BRL-CAD · Manifold",
    description:
      "Selected contributor to the Manifold C++ geometry library, with 25+ merged PRs.",
  },
  {
    index: "04",
    category: "ACADEMIC",
    year: "2026",
    title: "Amazon ML Summer School",
    org: "Amazon · Selected",
    description:
      "Selected for a competitive applied ML program led by Amazon scientists.",
  },
  {
    index: "05",
    category: "COMPETITIVE",
    year: "2026",
    title: "Finalist, Flipkart GRiD",
    org: "Flipkart · GRiD 2026",
    description:
      "Finalist in Flipkart GRiD 2026, Flipkart's engineering challenge for students.",
  },
  {
    index: "06",
    category: "COMPETITIVE",
    year: "2024",
    title: "3rd Place, Speed Coding",
    org: "IIIT Surat · 100+ participants",
    description:
      "Placed third of 100+ in a timed competitive programming event.",
  },
];

export default function Achievements() {
  return (
    <section className="mt-16">
      <div className="mb-10">
        <p className="font-mono text-xs uppercase tracking-[0.22em] dark:text-zinc-500 text-zinc-500 mb-3">
          Credentials
        </p>
        <h2 className="font-display font-normal text-4xl sm:text-5xl tracking-[-0.02em] leading-none">
          Recognition
        </h2>
      </div>

      <div className="grid sm:grid-cols-2 gap-px dark:bg-zinc-800 bg-zinc-200">
        {credentials.map((c, i) => (
          <motion.div
            key={c.index}
            className="relative overflow-hidden dark:bg-ink bg-paper p-7 group"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, delay: i * 0.08, ease: "easeOut" }}
          >
            {/* Giant ambient index number */}
            <span
              className="absolute -right-2 -bottom-4 font-display font-normal leading-none dark:text-zinc-900 text-zinc-100 select-none pointer-events-none"
              style={{ fontSize: "clamp(6rem, 12vw, 9rem)" }}
            >
              {c.index}
            </span>

            <div className="relative">
              {/* Header row */}
              <div className="flex items-center justify-between gap-3 mb-5">
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] dark:text-zinc-400 text-zinc-500 border dark:border-zinc-700 border-zinc-300 px-2 py-0.5">
                  {c.category}
                </span>
                <span className="font-mono text-[10px] dark:text-zinc-600 text-zinc-400 shrink-0">
                  {c.year}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-sans font-bold text-lg sm:text-xl tracking-tight leading-tight mb-1.5">
                {c.title}
              </h3>

              {/* Org */}
              <p className="font-mono text-[11px] dark:text-zinc-500 text-zinc-500 uppercase tracking-[0.14em] mb-4">
                {c.org}
              </p>

              {/* Description */}
              <p className="text-sm dark:text-zinc-400 text-zinc-600 leading-relaxed">
                {c.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
