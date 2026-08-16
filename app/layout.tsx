import "@/app/styles/globals.css";
import type { Metadata } from "next";
import { sans, mono, display } from "./assets/font/font";
import Navbar from "./components/global/Navbar";
import Footer from "./components/global/Footer";
import { Providers } from "./providers";
import { CommandPalette } from "./components/global/CommandPalette";
import SectionProgress from "./components/global/SectionProgress";
import ChatWidget from "./components/global/ChatWidget";
import BreakoutGame from "./components/global/BreakoutGame";
import BreakoutHint from "./components/global/BreakoutHint";
import FPSGame from "./components/global/FPSGame";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body
        className={`${sans.variable} ${mono.variable} ${display.variable} font-sans dark:bg-ink bg-paper dark:text-zinc-200 text-zinc-800`}
      >
        {/* Hidden SVG: amber duotone filter — dark=#100d0b, light=#ffb000 */}
        <svg xmlns="http://www.w3.org/2000/svg" style={{ position: "absolute", width: 0, height: 0 }}>
          <defs>
            <filter id="amber-duotone" colorInterpolationFilters="sRGB">
              <feColorMatrix type="saturate" values="0" />
              <feComponentTransfer>
                <feFuncR type="linear" slope="0.937" intercept="0.063" />
                <feFuncG type="linear" slope="0.639" intercept="0.051" />
                <feFuncB type="linear" slope="-0.043" intercept="0.043" />
              </feComponentTransfer>
            </filter>
          </defs>
        </svg>
        <Providers>
          <FPSGame />
          <Navbar />
          <CommandPalette />
          <SectionProgress />
          <ChatWidget />
          <BreakoutGame />
          <BreakoutHint />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
