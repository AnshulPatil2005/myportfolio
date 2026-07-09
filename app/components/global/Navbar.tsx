"use client";

import Link from "next/link";
import Theme from "./Theme";
import UnmountStudio from "./Unmount";
import MobileMenu from "./MobileMenu";
import { useScroll } from "framer-motion";
import { useEffect, useState } from "react";

const navLinks = [
  { title: "Products", href: "/#products" },
  { title: "About", href: "/#about" },
  { title: "Projects", href: "/#projects" },
  { title: "Open Source", href: "/#open-source" },
  { title: "Research", href: "/#research" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    return scrollY.on("change", (y) => setScrolled(y > 80));
  }, [scrollY]);

  return (
    <UnmountStudio>
      {/*
        Spacer: steps in immediately when the header leaves document flow (fixed),
        preserving the exact same vertical space so the page content doesn't jump.
      */}
      <div
        aria-hidden="true"
        style={{ transition: "none" }}
        className={scrolled ? "h-16 md:mb-28 mb-10" : ""}
      />

      <header
        className={`text-sm z-50 transition-[padding,background-color,box-shadow,border-color] duration-300 ease-in-out ${
          scrolled
            ? "fixed top-4 left-0 right-0 mx-auto w-fit px-6 py-2.5 border dark:border-zinc-700/70 border-zinc-300 dark:bg-ink/95 bg-paper/95 backdrop-blur-md shadow-lg shadow-zinc-300/30"
            : "py-6 md:px-16 px-6 border-b dark:border-zinc-800 border-zinc-300 md:mb-28 mb-10"
        }`}
      >
        <div
          className={`flex items-center justify-between gap-x-6 ${
            scrolled ? "" : "max-w-6xl mx-auto"
          }`}
        >
          <Link
            href="/"
            className="font-incognito font-bold text-xl dark:text-white text-zinc-900 tracking-tight"
          >
            AP
          </Link>

          <nav className="md:block hidden">
            <ul className="flex items-center gap-x-8">
              {navLinks.map((link, id) => (
                <li key={id}>
                  <Link
                    href={link.href}
                    className="font-mono text-sm dark:text-zinc-400 text-zinc-600 dark:hover:text-zinc-100 hover:text-zinc-900 duration-200"
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
