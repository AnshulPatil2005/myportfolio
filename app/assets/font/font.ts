import { Newsreader, JetBrains_Mono } from "next/font/google";

// One serif family for the whole site. Two weights cover everything (text at
// 400, the odd emphasis at 500); the optical-size axis is left out because it
// more than doubles the download for a difference few readers would see.
export const serif = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal"],
  variable: "--font-serif",
  display: "swap",
});

// The italic is only used for the surname in the hero.
export const serifItalic = Newsreader({
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic"],
  variable: "--font-serif-italic",
  display: "swap",
});

// Mono only where the content is code or data: dates, hashes, PR numbers.
export const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
  // its generated fallback is a resized Arial, which is proportional and
  // rewraps data lines on swap; globals.css supplies a monospaced one
  adjustFontFallback: false,
});
