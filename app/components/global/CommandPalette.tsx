"use client";

import { useEffect, useState, useCallback } from "react";
import { Command } from "cmdk";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { showcaseProjects, researchProjects, profile } from "@/lib/data";
import {
  HiArrowRight,
  HiOutlineGlobeAlt,
  HiOutlineMoon,
  HiOutlineSun,
  HiOutlineDownload,
  HiOutlineSearch,
} from "react-icons/hi";

type EasterEgg = { query: string; response: string };

const EASTER_EGGS: EasterEgg[] = [
  { query: "sudo make me a sandwich", response: "You're not root. Permission denied." },
  { query: "git blame anshul", response: "fatal: blame history is too impressive to display." },
  { query: "rm -rf /", response: "Nice try. Running in a sandboxed environment." },
  { query: "hello world", response: "Hello, visitor! Nice to meet you 👋" },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [easterEgg, setEasterEgg] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const { theme, setTheme, systemTheme } = useTheme();
  const router = useRouter();

  const currentTheme = theme === "system" ? systemTheme : theme;

  // Global keyboard shortcut: ⌘K / Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    setSearch("");
    setEasterEgg(null);
  }, []);

  const navigate = (href: string) => {
    close();
    router.push(href);
  };

  const handleSearch = (val: string) => {
    setSearch(val);
    const egg = EASTER_EGGS.find((e) => e.query === val.toLowerCase().trim());
    setEasterEgg(egg ? egg.response : null);
  };

  const downloadResume = () => {
    const a = document.createElement("a");
    a.href = profile.resumeURL;
    a.download = "AnshulPatil.pdf";
    a.click();
    close();
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            key="palette-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
            onClick={close}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            key="palette-panel"
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 z-[101] w-full max-w-xl px-4"
          >
            <Command
              label="Command Palette"
              className="rounded-xl border dark:border-zinc-700 border-zinc-200 dark:bg-zinc-900 bg-white shadow-2xl overflow-hidden"
              onKeyDown={(e) => {
                if (e.key === "Escape") close();
              }}
            >
              {/* Search input */}
              <div className="flex items-center gap-3 px-4 border-b dark:border-zinc-800 border-zinc-200">
                <HiOutlineSearch className="dark:text-zinc-400 text-zinc-500 text-lg shrink-0" />
                <Command.Input
                  value={search}
                  onValueChange={handleSearch}
                  placeholder="Search or type a command..."
                  autoFocus
                  className="flex-1 bg-transparent py-4 text-sm dark:text-white text-zinc-900 placeholder:dark:text-zinc-500 placeholder:text-zinc-400 outline-none"
                />
                <kbd className="hidden sm:inline-flex text-[10px] font-mono dark:text-zinc-500 text-zinc-400 border dark:border-zinc-700 border-zinc-200 rounded px-1.5 py-0.5">
                  ESC
                </kbd>
              </div>

              {/* Easter egg response */}
              {easterEgg && (
                <div className="px-4 py-3 text-sm dark:text-primary-color text-tertiary-color font-mono border-b dark:border-zinc-800 border-zinc-200">
                  $ {easterEgg}
                </div>
              )}

              {/* Results list */}
              <Command.List className="max-h-80 overflow-y-auto py-2 [&::-webkit-scrollbar]:hidden">
                <Command.Empty className="py-8 text-center text-sm dark:text-zinc-500 text-zinc-400">
                  No results for &ldquo;{search}&rdquo;
                </Command.Empty>

                {/* Navigate */}
                <Command.Group
                  heading="Navigate"
                  className="[&_[cmdk-group-heading]]:px-4 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:dark:text-zinc-500 [&_[cmdk-group-heading]]:text-zinc-400"
                >
                  {[
                    { label: "Go to Products", href: "/#products" },
                    { label: "Go to About", href: "/#about" },
                    { label: "Go to Projects", href: "/#projects" },
                    { label: "Go to Open Source", href: "/#open-source" },
                    { label: "Go to Research", href: "/#research" },
                    { label: "Go to Blog", href: "/#blog" },
                  ].map((item) => (
                    <Command.Item
                      key={item.label}
                      value={item.label}
                      onSelect={() => navigate(item.href)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer aria-selected:dark:bg-zinc-800 aria-selected:bg-zinc-50 dark:text-zinc-300 text-zinc-700 rounded mx-1"
                    >
                      <HiArrowRight className="dark:text-zinc-500 text-zinc-400 shrink-0" />
                      {item.label}
                    </Command.Item>
                  ))}
                </Command.Group>

                {/* Projects */}
                <Command.Group
                  heading="Projects"
                  className="[&_[cmdk-group-heading]]:px-4 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:dark:text-zinc-500 [&_[cmdk-group-heading]]:text-zinc-400"
                >
                  {showcaseProjects.map((p) => (
                    <Command.Item
                      key={p._id}
                      value={`${p.name} ${p.tagline}`}
                      onSelect={() => navigate(`/projects/${p.slug}`)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer aria-selected:dark:bg-zinc-800 aria-selected:bg-zinc-50 dark:text-zinc-300 text-zinc-700 rounded mx-1"
                    >
                      <span className="font-mono text-xs dark:text-zinc-500 text-zinc-400 shrink-0">
                        {"{}"}
                      </span>
                      {p.name}
                    </Command.Item>
                  ))}
                </Command.Group>

                {/* Research */}
                <Command.Group
                  heading="Research"
                  className="[&_[cmdk-group-heading]]:px-4 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:dark:text-zinc-500 [&_[cmdk-group-heading]]:text-zinc-400"
                >
                  {researchProjects.map((r) => (
                    <Command.Item
                      key={r._id}
                      value={`${r.title} ${r.tags.join(" ")}`}
                      onSelect={() => navigate(`/research/${r._id}`)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer aria-selected:dark:bg-zinc-800 aria-selected:bg-zinc-50 dark:text-zinc-300 text-zinc-700 rounded mx-1"
                    >
                      <span className="font-mono text-xs dark:text-zinc-500 text-zinc-400 shrink-0">
                        📄
                      </span>
                      <span className="truncate">{r.title.split(" ").slice(0, 6).join(" ")}…</span>
                    </Command.Item>
                  ))}
                </Command.Group>

                {/* Links */}
                <Command.Group
                  heading="Links"
                  className="[&_[cmdk-group-heading]]:px-4 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:dark:text-zinc-500 [&_[cmdk-group-heading]]:text-zinc-400"
                >
                  {[
                    { label: "Open GitHub", href: "https://github.com/AnshulPatil2005" },
                    { label: "Open LinkedIn", href: "https://linkedin.com/in/anshulpatil2005" },
                    {
                      label: "Open LeetCode",
                      href: "https://leetcode.com/u/Anshulpatil2011",
                    },
                  ].map((item) => (
                    <Command.Item
                      key={item.label}
                      value={item.label}
                      onSelect={() => {
                        window.open(item.href, "_blank", "noopener,noreferrer");
                        close();
                      }}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer aria-selected:dark:bg-zinc-800 aria-selected:bg-zinc-50 dark:text-zinc-300 text-zinc-700 rounded mx-1"
                    >
                      <HiOutlineGlobeAlt className="dark:text-zinc-500 text-zinc-400 shrink-0" />
                      {item.label}
                    </Command.Item>
                  ))}
                </Command.Group>

                {/* Actions */}
                <Command.Group
                  heading="Actions"
                  className="[&_[cmdk-group-heading]]:px-4 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:dark:text-zinc-500 [&_[cmdk-group-heading]]:text-zinc-400"
                >
                  <Command.Item
                    value="Toggle Theme dark light mode"
                    onSelect={() => {
                      setTheme(currentTheme === "dark" ? "light" : "dark");
                      close();
                    }}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer aria-selected:dark:bg-zinc-800 aria-selected:bg-zinc-50 dark:text-zinc-300 text-zinc-700 rounded mx-1"
                  >
                    {currentTheme === "dark" ? (
                      <HiOutlineSun className="dark:text-zinc-500 text-zinc-400 shrink-0" />
                    ) : (
                      <HiOutlineMoon className="dark:text-zinc-500 text-zinc-400 shrink-0" />
                    )}
                    Toggle Theme
                  </Command.Item>
                  <Command.Item
                    value="Download Resume CV"
                    onSelect={downloadResume}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer aria-selected:dark:bg-zinc-800 aria-selected:bg-zinc-50 dark:text-zinc-300 text-zinc-700 rounded mx-1"
                  >
                    <HiOutlineDownload className="dark:text-zinc-500 text-zinc-400 shrink-0" />
                    Download Résumé
                  </Command.Item>
                </Command.Group>
              </Command.List>

              {/* Footer hint */}
              <div className="px-4 py-2.5 border-t dark:border-zinc-800 border-zinc-200 flex items-center gap-4 text-xs dark:text-zinc-500 text-zinc-400 font-mono">
                <span>
                  <kbd className="border dark:border-zinc-700 border-zinc-200 rounded px-1 py-0.5">↑↓</kbd>
                  {" "}navigate
                </span>
                <span>
                  <kbd className="border dark:border-zinc-700 border-zinc-200 rounded px-1 py-0.5">↵</kbd>
                  {" "}select
                </span>
                <span>
                  <kbd className="border dark:border-zinc-700 border-zinc-200 rounded px-1 py-0.5">esc</kbd>
                  {" "}close
                </span>
              </div>
            </Command>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
