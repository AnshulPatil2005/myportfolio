"use client";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

export default function Theme() {
  const { systemTheme, theme, setTheme } = useTheme();
  const [hasMounted, setHasMounted] = useState(false);
  const currentTheme = theme === "system" ? systemTheme : theme;

  function toggleTheme() {
    return currentTheme === "light" ? setTheme("dark") : setTheme("light");
  }
  useEffect(() => setHasMounted(true), []);

  // reserve the button's footprint so the header does not shift on hydration
  if (!hasMounted)
    return <span className="inline-block min-w-[3.75rem] h-[1.875rem] border border-line" />;

  return (
    <button
      onClick={toggleTheme}
      className="min-w-[3.75rem] font-mono text-meta text-muted hover:text-fg border border-line hover:border-muted px-2 py-1 transition-colors duration-150"
      aria-label="Toggle Theme"
    >
      {currentTheme === "light" ? "Dark" : "Light"}
    </button>
  );
}
