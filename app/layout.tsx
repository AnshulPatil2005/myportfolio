import "@/app/styles/globals.css";
import type { Metadata, Viewport } from "next";
import { sans, mono, display } from "./assets/font/font";
import Navbar from "./components/global/Navbar";
import Footer from "./components/global/Footer";
import { Providers } from "./providers";
import { CommandPalette } from "./components/global/CommandPalette";
import SectionProgress from "./components/global/SectionProgress";
import GameHint from "./components/global/GameHint";
import CareerMode from "./components/global/CareerMode";

const options = {
  title: "Anshul Patil | Full-Stack Developer",
  description:
    "Anshul Patil is a Full-Stack Developer who builds reliable, maintainable web applications with a strong focus on clean architecture, performance, and product quality.",
  url: "https://anshulpatil.dev",
};

export const metadata: Metadata = {
  title: options.title,
  metadataBase: new URL(options.url),
  description: options.description,
  openGraph: {
    title: options.title,
    url: options.url,
    siteName: "anshulpatil.dev",
    locale: "en-US",
    type: "website",
    description: options.description,
  },
  alternates: {
    canonical: options.url,
  },
};

// explicit so phones lay the page out at device width and can still zoom
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#100d0b" },
    { media: "(prefers-color-scheme: light)", color: "#faf9f7" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body
        className={`${sans.variable} ${mono.variable} ${display.variable} font-sans dark:bg-ink bg-paper dark:text-zinc-200 text-zinc-800 overflow-x-hidden`}
      >
        {/* Hidden SVG: duotone filter — warm stone, deliberately low-chroma */}
        <svg xmlns="http://www.w3.org/2000/svg" style={{ position: "absolute", width: 0, height: 0 }}>
          <defs>
            <filter id="amber-duotone" colorInterpolationFilters="sRGB">
              <feColorMatrix type="saturate" values="0" />
              <feComponentTransfer>
                <feFuncR type="linear" slope="0.734" intercept="0.078" />
                <feFuncG type="linear" slope="0.702" intercept="0.067" />
                <feFuncB type="linear" slope="0.651" intercept="0.055" />
              </feComponentTransfer>
            </filter>
          </defs>
        </svg>
        <Providers>
          <CareerMode />
          <Navbar />
          <CommandPalette />
          <SectionProgress />
          <GameHint />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
