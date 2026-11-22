"use client";

import { usePathname } from "next/navigation";
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

// Section numerals in the outer margin of the homepage, the only page that
// has these sections. The current section's numeral is rubricated; its name
// shows on hover, and beside the active numeral only on screens wide enough
// that it cannot sit on top of the page. Hidden names stay in the link for
// screen readers, so each link reads as "Experience I".
export default function SectionProgress() {
  const pathname = usePathname();
  const active = useActiveSection(SECTIONS.map((s) => s.id));
  const [hovered, setHovered] = useState<string | null>(null);

  if (pathname !== "/") return null;

  return (
    <nav aria-label="Sections" className="hidden lg:flex fixed right-4 top-1/2 -translate-y-1/2 z-40 flex-col items-end gap-4">
      {SECTIONS.map((section, i) => {
        const isActive  = active === section.id;
        const isHovered = hovered === section.id;

        const labelClass = isHovered
          ? ""
          : isActive
          ? "sr-only 2xl:not-sr-only"
          : "sr-only";

        return (
          <a
            key={section.id}
            href={`#${section.id}`}
            onMouseEnter={() => setHovered(section.id)}
            onMouseLeave={() => setHovered(null)}
            onFocus={() => setHovered(section.id)}
            onBlur={() => setHovered(null)}
            className="flex items-center gap-3 py-0.5"
          >
            <span className={`font-mono text-meta text-fg bg-page px-1 whitespace-nowrap ${labelClass}`}>
              {section.label}
            </span>

            <span
              className={`font-mono text-meta min-w-[1.5rem] text-right select-none transition-colors duration-200 ${
                isActive ? "text-rubric" : "text-muted hover:text-fg"
              }`}
            >
              {ROMAN[i]}
            </span>
          </a>
        );
      })}
    </nav>
  );
}
