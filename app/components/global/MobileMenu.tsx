"use client";
import Link from "next/link";
import { useState } from "react";

const data = [
  { title: "Products", href: "/#featured-work" },
  { title: "About", href: "/#about" },
  { title: "Projects", href: "/#projects" },
  { title: "Open Source", href: "/#open-source" },
  { title: "Research", href: "/#research" },
  { title: "Résumé", href: "/resume" },
  { title: "Contact", href: "/#contact" },
];

export default function MobileMenu() {
  const [navShow, setNavShow] = useState(false);

  const onToggleNav = () => {
    setNavShow((status) => {
      if (status) {
        document.body.style.overflow = "auto";
      } else {
        document.body.style.overflow = "hidden";
      }
      return !status;
    });
  };

  return (
    <>
      <button
        aria-label="Toggle Menu"
        onClick={onToggleNav}
        className="md:hidden flex flex-col justify-center items-end gap-[5px] border border-line w-10 h-10 px-2.5"
      >
        <span className="block w-[18px] h-px bg-fg" />
        <span className="block w-[18px] h-px bg-fg" />
        <span className="block w-3 h-px bg-fg" />
      </button>
      {/* off-screen panels stay out of the tab order until opened */}
      <div
        className={`md:hidden fixed left-0 top-0 z-10 h-full w-full bg-page transition-[transform,visibility] duration-[500ms] ease-[cubic-bezier(0.7,0,0,1)] ${
          navShow ? "translate-x-0 visible" : "translate-x-full invisible"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-line">
          <Link
            href="/"
            onClick={onToggleNav}
            className="text-[1.375rem] leading-none tracking-tight text-fg"
          >
            AP
          </Link>

          <button
            aria-label="Toggle Menu"
            onClick={onToggleNav}
            className="border border-line w-10 h-10 grid place-items-center font-mono text-lg text-fg"
          >
            &times;
          </button>
        </div>
        <nav className="flex flex-col px-6 pt-4">
          {data.map((link, i) => (
            <Link
              key={link.title}
              href={link.href}
              className="flex items-baseline gap-x-5 border-b border-line py-4 text-[1.75rem] leading-tight text-fg"
              onClick={onToggleNav}
            >
              <span className="w-6 shrink-0 font-mono text-meta text-muted">
                {String(i + 1).padStart(2, "0")}
              </span>
              {link.title}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
