"use client";

import { useActiveSection } from "@/app/hooks/useActiveSection";
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

// Section numerals in the outer margin. The current section's numeral is
// rubricated; its name shows on hover, and beside the active numeral only on
// screens wide enough that it cannot sit on top of the page.
export default function SectionProgress() {
  const active = useActiveSection(SECTIONS.map((s) => s.id));
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="hidden lg:flex fixed right-4 top-1/2 -translate-y-1/2 z-40 flex-col items-end gap-4">
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
            onFocus={() => setHovered(section.id)}
            onBlur={() => setHovered(null)}
            className="flex items-center gap-3 py-0.5"
          >
            {showLabel && (
              <span
                className={`font-mono text-meta text-fg bg-page px-1 whitespace-nowrap ${
                  isHovered ? "" : "hidden 2xl:inline"
                }`}
              >
                {section.label}
              </span>
            )}

            <span
              className={`font-mono text-meta min-w-[1.5rem] text-right select-none transition-colors duration-200 ${
                isActive ? "text-rubric" : "text-muted/60 hover:text-fg"
              }`}
            >
              {ROMAN[i]}
            </span>
          </a>
        );
      })}
    </div>
  );
}
