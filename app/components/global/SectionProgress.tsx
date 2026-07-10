"use client";

import { useActiveSection } from "@/app/hooks/useActiveSection";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const SECTIONS = [
  { id: "featured-work", label: "Products" },
  { id: "projects", label: "Projects" },
  { id: "open-source", label: "Open Source" },
  { id: "research", label: "Research" },
  { id: "about", label: "About" },
  { id: "blog", label: "Blog" },
];

export default function SectionProgress() {
  const active = useActiveSection(SECTIONS.map((s) => s.id));
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    // Desktop only: hidden on md and below
    <div className="hidden lg:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col items-end gap-4">
      {SECTIONS.map((section) => {
        const isActive = active === section.id;
        const isHovered = hovered === section.id;

        return (
          <a
            key={section.id}
            href={`#${section.id}`}
            aria-label={`Go to ${section.label}`}
            onMouseEnter={() => setHovered(section.id)}
            onMouseLeave={() => setHovered(null)}
            className="group flex items-center gap-2"
          >
            {/* Tooltip label */}
            <AnimatePresence>
              {isHovered && (
                <motion.span
                  initial={{ opacity: 0, x: 6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 6 }}
                  transition={{ duration: 0.15 }}
                  className="text-xs font-mono dark:text-zinc-300 text-zinc-600 dark:bg-ink bg-paper border dark:border-zinc-700 border-zinc-300 px-2 py-1 whitespace-nowrap"
                >
                  {section.label}
                </motion.span>
              )}
            </AnimatePresence>

            {/* Dot */}
            <motion.div
              animate={
                isActive
                  ? { width: 10, height: 10, opacity: 1 }
                  : { width: 6, height: 6, opacity: 0.4 }
              }
              transition={{ duration: 0.2 }}
              className={`transition-colors duration-200 ${
                isActive
                  ? "dark:bg-zinc-100 bg-zinc-900"
                  : "dark:bg-zinc-600 bg-zinc-300 group-hover:opacity-70"
              }`}
            />
          </a>
        );
      })}
    </div>
  );
}
