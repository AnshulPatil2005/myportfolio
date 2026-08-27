"use client";

// Small client island so the case study page can stay a server component.
export default function PlayCareerButton({ label = "▶ Launch Career Mode" }: { label?: string }) {
  return (
    <button
      onClick={() => window.dispatchEvent(new CustomEvent("career-mode:open"))}
      className="hidden md:inline-flex items-center font-mono text-[12px] uppercase tracking-[0.18em] text-ink bg-accent px-6 py-3 hover:opacity-85 transition-opacity"
    >
      {label}
    </button>
  );
}
