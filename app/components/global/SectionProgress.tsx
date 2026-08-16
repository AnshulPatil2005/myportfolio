"use client";

import { useActiveSection } from "@/app/hooks/useActiveSection";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII"];

const SECTIONS = [
  { id: "jobs",          label: "Experience"  },
  { id: "featured-work", label: "Flagship"    },
  { id: "projects",      label: "Projects"    },
  { id: "open-source",   label: "Open Source" },
  { id: "research",      label: "Research"    },
  { id: "about",         label: "About"       },
  { id: "contact",       label: "Contact"     },
];

export default function SectionProgress() {
  const active = useActiveSection(SECTIONS.map((s) => s.id));
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="hidden lg:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col items-end gap-5">
      {SECTIONS.map((section, i) => {
        const isActive  = active === section.id;
        const isHovered = hovered === section.id;
        const showLabel = isActive || isHovered;

        return (
          <a
            key={section.id}
            href={`#${section.id}`}
            aria-label={`Go to ${section.label}`}
            onMouseEnter={() => setHovered(section.id)}
            onMouseLeave={() => setHovered(null)}
            className="flex items-center gap-3"
          >
            {/* Label slides in when active or hovered */}
            <AnimatePresence>
              {showLabel && (
                <motion.span
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.15 }}
                  className="text-[10px] font-mono uppercase tracking-[0.2em] dark:text-accent text-amber-600 whitespace-nowrap"
                >
                  {section.label}
                </motion.span>
              )}
            </AnimatePresence>

            {/* Roman numeral */}
            <motion.span
              animate={{
                opacity: isActive ? 1 : 0.18,
                scale:   isActive ? 1 : 0.9,
              }}
              transition={{ duration: 0.2 }}
              className={`font-mono text-[11px] font-bold min-w-[18px] text-right select-none transition-colors duration-200 ${
                isActive
                  ? "dark:text-accent text-amber-600"
                  : "dark:text-zinc-500 text-zinc-400"
              }`}
            >
              {ROMAN[i]}
            </motion.span>
          </a>
        );
      })}
    </div>
  );
}
