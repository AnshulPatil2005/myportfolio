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

  if (!hasMounted)
    return (
      <span className="min-w-[52px] min-h-[28px] px-2.5 py-1 dark:bg-zinc-800 bg-zinc-100 border dark:border-zinc-700 border-zinc-300" />
    );

  return (
    <button
      onClick={toggleTheme}
      className="font-mono text-xs uppercase tracking-wide dark:text-zinc-300 text-zinc-600 border dark:border-zinc-700 border-zinc-300 px-2.5 py-1 dark:hover:border-zinc-500 hover:border-zinc-400 transition-colors duration-150"
      aria-label="Toggle Theme"
    >
      {currentTheme === "light" ? "Dark" : "Light"}
    </button>
  );
}
