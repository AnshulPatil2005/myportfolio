"use client";

import Link from "next/link";
import Theme from "./Theme";
import UnmountStudio from "./Unmount";
import MobileMenu from "./MobileMenu";
import { useScroll } from "framer-motion";
import { useEffect, useState } from "react";

const navLinks = [
  { title: "About", href: "/#about" },
  { title: "Projects", href: "/#projects" },
  { title: "Research", href: "/#research" },
  { title: "Blog", href: "/#blog" },
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
        className={`text-sm z-50 transition-[padding,border-radius,background-color,box-shadow,border-color] duration-300 ease-in-out ${
          scrolled
            ? "fixed top-4 left-0 right-0 mx-auto w-fit px-6 py-2.5 rounded-full border dark:border-zinc-700/70 border-zinc-200/80 dark:bg-zinc-900/85 bg-white/85 backdrop-blur-md shadow-lg dark:shadow-[0_0_24px_rgba(51,224,146,0.07)] shadow-zinc-300/40"
            : "py-6 md:px-16 px-6 border-b dark:border-zinc-800 border-zinc-200 md:mb-28 mb-10"
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
                    className="font-incognito dark:text-white text-zinc-600 dark:hover:text-primary-color hover:text-zinc-900 duration-300 text-base"
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
              className="hidden md:flex items-center gap-1 text-xs font-mono dark:text-zinc-500 text-zinc-400 border dark:border-zinc-700 border-zinc-200 rounded-md px-2 py-1 dark:hover:border-zinc-500 hover:border-zinc-300 transition-colors duration-150"
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
