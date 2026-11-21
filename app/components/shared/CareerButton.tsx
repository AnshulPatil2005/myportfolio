"use client";

import type { ReactNode } from "react";

// A button that opens Career Mode, so the pages around it can stay server-rendered.
export default function CareerButton({
  children,
  className,
  ariaLabel,
}: {
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <button
      onClick={() => window.dispatchEvent(new CustomEvent("career-mode:open"))}
      className={className}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
