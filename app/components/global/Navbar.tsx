"use client";

import Link from "next/link";
import Theme from "./Theme";
import UnmountStudio from "./Unmount";
import MobileMenu from "./MobileMenu";
import { useEffect, useState } from "react";

const navLinks = [
  { title: "Products", href: "/#featured-work" },
  { title: "About", href: "/#about" },
  { title: "Projects", href: "/#projects" },
  { title: "Open Source", href: "/#open-source" },
  { title: "Research", href: "/#research" },
  { title: "Résumé", href: "/resume" },
];

// The running head: a single ruled line across the top of every page.
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <UnmountStudio>
      {/* Spacer preserves layout height beneath the always-fixed header. */}
      <div aria-hidden="true" className="h-16" />

      <header
        className={`fixed top-0 inset-x-0 z-50 h-16 bg-page transition-[border-color] duration-200 border-b ${
          scrolled ? "border-line" : "border-transparent"
        }`}
      >
        <div className="h-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16 flex items-center justify-between gap-x-6">
          <Link href="/" className="text-[1.375rem] leading-none tracking-tight text-fg no-underline">
            AP
          </Link>

          <nav className="md:block hidden">
            <ul className="flex items-center gap-x-7">
              {navLinks.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className="text-[1.0625rem] text-muted underline decoration-transparent underline-offset-[0.3em] hover:text-fg hover:decoration-line transition-colors duration-150"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-x-2">
            <button
              onClick={() =>
                window.dispatchEvent(new CustomEvent("career-mode:open"))
              }
              className="hidden md:flex items-center gap-1.5 font-mono text-meta text-muted hover:text-fg px-2 py-1.5 transition-colors duration-150 cursor-pointer"
              aria-label="Play Career Mode game"
            >
              <span className="text-[0.625rem]">▶</span> Play as a game
            </button>
            <button
              onClick={() =>
                document.dispatchEvent(
                  new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true })
                )
              }
              className="hidden md:flex items-center font-mono text-meta text-muted hover:text-fg border border-line hover:border-muted px-2 py-1 transition-colors duration-150 cursor-pointer"
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
