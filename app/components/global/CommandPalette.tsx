"use client";

import { useEffect, useState, useCallback } from "react";
import { Command } from "cmdk";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { showcaseProjects, researchProjects, profile } from "@/lib/data";
import { socialLinks } from "@/app/data/social";

type EasterEgg = { query: string; response: string };

const EASTER_EGGS: EasterEgg[] = [
  { query: "sudo make me a sandwich", response: "You're not root. Permission denied." },
  { query: "git blame anshul", response: "fatal: blame history is too impressive to display." },
  { query: "rm -rf /", response: "Nice try. Running in a sandboxed environment." },
  { query: "hello world", response: "Hello, visitor! Nice to meet you 👋" },
];

export function CommandPalette({ autoOpen = false }: { autoOpen?: boolean }) {
  const [open, setOpen] = useState(autoOpen);
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
      {open && (
        <>
          <div
            className="fixed inset-0 z-[100] bg-fg/40 motion-safe:animate-[palette-fade_150ms_ease-out]"
            onClick={close}
          />
          <div className="fixed top-[20%] left-1/2 -translate-x-1/2 z-[101] w-full max-w-xl px-4 motion-safe:animate-[palette-fade_150ms_ease-out]">
            <Command
              label="Command Palette"
              className="border border-fg bg-page overflow-hidden"
              onKeyDown={(e) => {
                if (e.key === "Escape") close();
              }}
            >
              {/* Search input */}
              <div className="flex items-center gap-3 px-4 border-b border-line">
                <span className="font-mono text-muted text-meta shrink-0">/</span>
                <Command.Input
                  value={search}
                  onValueChange={handleSearch}
                  placeholder="Search or type a command..."
                  autoFocus
                  className="flex-1 bg-transparent py-4 text-body text-fg placeholder:text-muted outline-none"
                />
                <kbd className="hidden sm:inline-flex text-meta font-mono text-muted border border-line px-1.5 py-0.5">
                  ESC
                </kbd>
              </div>

              {/* Easter egg response */}
              {easterEgg && (
                <div className="px-4 py-3 text-meta text-fg font-mono border-b border-line">
                  $ {easterEgg}
                </div>
              )}

              {/* Results list */}
              <Command.List className="max-h-80 overflow-y-auto py-2 [&::-webkit-scrollbar]:hidden">
                <Command.Empty className="py-8 text-center text-small text-muted">
                  No results for &ldquo;{search}&rdquo;
                </Command.Empty>

                {/* Navigate */}
                <Command.Group
                  heading="Navigate"
                  className="[&_[cmdk-group-heading]]:px-4 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-meta [&_[cmdk-group-heading]]:text-muted"
                >
                  {[
                    { label: "Go to Products", href: "/#featured-work" },
                    { label: "Go to About", href: "/#about" },
                    { label: "Go to Projects", href: "/#projects" },
                    { label: "Go to Open Source", href: "/#open-source" },
                    { label: "Go to Research", href: "/#research" },
                    { label: "Go to Blog", href: "/blog" },
                  ].map((item) => (
                    <Command.Item
                      key={item.label}
                      value={item.label}
                      onSelect={() => navigate(item.href)}
                      className="flex items-center gap-3 px-4 py-2 text-body cursor-pointer text-fg aria-selected:bg-wash mx-1"
                    >
                      <span className="font-mono text-meta text-muted shrink-0">&rarr;</span>
                      {item.label}
                    </Command.Item>
                  ))}
                </Command.Group>

                {/* Projects */}
                <Command.Group
                  heading="Projects"
                  className="[&_[cmdk-group-heading]]:px-4 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-meta [&_[cmdk-group-heading]]:text-muted"
                >
                  {showcaseProjects.map((p) => (
                    <Command.Item
                      key={p._id}
                      value={`${p.name} ${p.tagline}`}
                      onSelect={() => navigate(`/projects/${p.slug}`)}
                      className="flex items-center gap-3 px-4 py-2 text-body cursor-pointer text-fg aria-selected:bg-wash mx-1"
                    >
                      <span className="font-mono text-meta text-muted shrink-0">
                        {"{}"}
                      </span>
                      {p.name}
                    </Command.Item>
                  ))}
                </Command.Group>

                {/* Research */}
                <Command.Group
                  heading="Research"
                  className="[&_[cmdk-group-heading]]:px-4 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-meta [&_[cmdk-group-heading]]:text-muted"
                >
                  {researchProjects.map((r) => (
                    <Command.Item
                      key={r._id}
                      value={`${r.title} ${r.tags.join(" ")}`}
                      onSelect={() => navigate(`/research/${r._id}`)}
                      className="flex items-center gap-3 px-4 py-2 text-body cursor-pointer text-fg aria-selected:bg-wash mx-1"
                    >
                      <span className="font-mono text-meta text-muted shrink-0">
                        ¶
                      </span>
                      <span className="truncate">{r.title.split(" ").slice(0, 6).join(" ")}…</span>
                    </Command.Item>
                  ))}
                </Command.Group>

                {/* Links */}
                <Command.Group
                  heading="Links"
                  className="[&_[cmdk-group-heading]]:px-4 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-meta [&_[cmdk-group-heading]]:text-muted"
                >
                  {socialLinks
                    .filter((l) => l.name !== "Email")
                    .map((l) => ({ label: `Open ${l.name}`, href: l.url }))
                    .map((item) => (
                    <Command.Item
                      key={item.label}
                      value={item.label}
                      onSelect={() => {
                        window.open(item.href, "_blank", "noopener,noreferrer");
                        close();
                      }}
                      className="flex items-center gap-3 px-4 py-2 text-body cursor-pointer text-fg aria-selected:bg-wash mx-1"
                    >
                      <span className="font-mono text-meta text-muted shrink-0">&rarr;</span>
                      {item.label}
                    </Command.Item>
                  ))}
                </Command.Group>

                {/* Actions */}
                <Command.Group
                  heading="Actions"
                  className="[&_[cmdk-group-heading]]:px-4 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-meta [&_[cmdk-group-heading]]:text-muted"
                >
                  <Command.Item
                    value="Toggle Theme dark light mode"
                    onSelect={() => {
                      setTheme(currentTheme === "dark" ? "light" : "dark");
                      close();
                    }}
                    className="flex items-center gap-3 px-4 py-2 text-body cursor-pointer text-fg aria-selected:bg-wash mx-1"
                  >
                    <span className="font-mono text-meta text-muted shrink-0">
                      {currentTheme === "dark" ? "Light" : "Dark"}
                    </span>
                    Toggle Theme
                  </Command.Item>
                  <Command.Item
                    value="Download Resume CV"
                    onSelect={downloadResume}
                    className="flex items-center gap-3 px-4 py-2 text-body cursor-pointer text-fg aria-selected:bg-wash mx-1"
                  >
                    <span className="font-mono text-meta text-muted shrink-0">&darr;</span>
                    Download Résumé
                  </Command.Item>
                  <Command.Item
                    value="Career Mode play game C"
                    onSelect={() => {
                      close();
                      window.dispatchEvent(new CustomEvent("career-mode:open"));
                    }}
                    className="flex items-center gap-3 px-4 py-2 text-body cursor-pointer text-fg aria-selected:bg-wash mx-1"
                  >
                    <span className="font-mono text-meta text-muted shrink-0">C</span>
                    Play Career Mode
                  </Command.Item>
                </Command.Group>
              </Command.List>

              {/* Footer hint */}
              <div className="px-4 py-2.5 border-t border-line flex items-center gap-4 text-meta text-muted font-mono">
                <span>
                  <kbd className="border border-line px-1 py-0.5">↑↓</kbd>
                  {" "}navigate
                </span>
                <span>
                  <kbd className="border border-line px-1 py-0.5">↵</kbd>
                  {" "}select
                </span>
                <span>
                  <kbd className="border border-line px-1 py-0.5">esc</kbd>
                  {" "}close
                </span>
              </div>
            </Command>
          </div>
          <style>{`@keyframes palette-fade { from { opacity: 0; } to { opacity: 1; } }`}</style>
        </>
      )}
    </>
  );
}
