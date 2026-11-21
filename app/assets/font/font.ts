import { Newsreader, JetBrains_Mono } from "next/font/google";

// One serif family for every size: Newsreader's optical-size axis gives the
// headings a display cut and the body a text cut, the way a book face would.
export const serif = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-serif",
  display: "swap",
});

// Mono only where the content is code or data: dates, hashes, PR numbers.
export const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});
