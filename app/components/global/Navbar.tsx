"use client";

import Link from "next/link";
import Theme from "./Theme";
import UnmountStudio from "./Unmount";
import MobileMenu from "./MobileMenu";
import { useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { profile } from "@/lib/data";

const navLinks = [
  { title: "Products", href: "/#featured-work" },
  { title: "About", href: "/#about" },
  { title: "Projects", href: "/#projects" },
  { title: "Open Source", href: "/#open-source" },
  { title: "Research", href: "/#research" },
  { title: "Résumé", href: profile.resumeURL },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    return scrollY.on("change", (y) => setScrolled(y > 40));
  }, [scrollY]);

  return (
    <UnmountStudio>
      {/* Spacer preserves layout height beneath the always-fixed header. */}
      <div aria-hidden="true" className="h-16" />

      <header
        className={`fixed top-0 inset-x-0 z-50 h-16 transition-[background-color,border-color] duration-300 ease-in-out ${
          scrolled
            ? "dark:bg-ink/80 bg-paper/90 backdrop-blur-sm border-b dark:border-zinc-800/80 border-zinc-300"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="h-full max-w-7xl mx-auto md:px-16 px-6 flex items-center justify-between gap-x-6">
          <Link
            href="/"
            className="font-semibold text-lg dark:text-white text-zinc-900 tracking-tight"
          >
            AP
          </Link>

          <nav className="md:block hidden">
            <ul className="flex items-center gap-x-8">
              {navLinks.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    {...(link.title === "Résumé" ? { download: true } : {})}
                    className="text-sm dark:text-zinc-400 text-zinc-600 dark:hover:text-white hover:text-zinc-900 transition-colors duration-200"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-x-3">
            <button
              onClick={() =>
                document.dispatchEvent(
                  new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true })
                )
              }
              className="hidden md:flex items-center gap-1 text-xs font-mono dark:text-zinc-500 text-zinc-400 border dark:border-zinc-700 border-zinc-300 px-2 py-1 dark:hover:border-zinc-500 hover:border-zinc-400 transition-colors duration-150"
              aria-label="Open command palette"
            >
              <kbd>⌘K</kbd>
            </button>
            <Theme />
            <MobileMenu />
          </div>
        </div>
      </header>
    </UnmountStudio>
  );
}
