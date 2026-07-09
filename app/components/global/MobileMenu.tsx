"use client";
import Link from "next/link";
import { useState } from "react";

const data = [
  { title: "Products", href: "/#products" },
  { title: "About", href: "/#about" },
  { title: "Projects", href: "/#projects" },
  { title: "Open Source", href: "/#open-source" },
  { title: "Research", href: "/#research" },
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
        className="md:hidden flex flex-col justify-center items-end gap-[5px] border dark:border-zinc-800 border-zinc-300 p-2.5 w-9 h-9"
      >
        <span className="block w-4 h-px dark:bg-zinc-200 bg-zinc-800" />
        <span className="block w-4 h-px dark:bg-zinc-200 bg-zinc-800" />
        <span className="block w-2.5 h-px dark:bg-zinc-200 bg-zinc-800" />
      </button>
      <div
        className={`md:hidden fixed left-0 top-0 z-10 h-full w-full transform duration-[600ms] ease-[cubic-bezier(0.7,0,0,1)] dark:bg-ink bg-paper ${
          navShow ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between mt-6 px-8">
          <Link
            href="/"
            onClick={onToggleNav}
            className="font-incognito font-bold text-xl dark:text-white text-zinc-900"
          >
            AP
          </Link>

          <button
            aria-label="Toggle Menu"
            onClick={onToggleNav}
            className="md:hidden border dark:border-zinc-800 border-zinc-300 w-9 h-9 grid place-items-center font-mono text-lg dark:text-zinc-200 text-zinc-800"
          >
            &times;
          </button>
        </div>
        <nav className="flex flex-col mt-6">
          {data.map((link, i) => (
            <Link
              key={link.title}
              href={link.href}
              className="flex items-center gap-x-4 font-incognito font-semibold text-lg border-b dark:border-zinc-800 border-zinc-200 p-6 group"
              onClick={onToggleNav}
            >
              <span className="font-mono text-xs dark:text-zinc-600 text-zinc-400">
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
