import "@/app/styles/globals.css";
import type { Metadata, Viewport } from "next";
import { serif, mono } from "./assets/font/font";
import Navbar from "./components/global/Navbar";
import Footer from "./components/global/Footer";
import { Providers } from "./providers";
import SectionProgress from "./components/global/SectionProgress";
import GameHint from "./components/global/GameHint";
import OnDemand from "./components/global/OnDemand";

const options = {
  title: "Anshul Patil | Backend & Systems Developer",
  description:
    "Anshul Patil is a backend and systems developer and the founder of Stratum: LFX mentee at CNCF OpenKruise, Kubescape project member, and GSoC 2026 contributor at BRL-CAD.",
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
    { media: "(prefers-color-scheme: dark)", color: "#14120F" },
    { media: "(prefers-color-scheme: light)", color: "#F4EFE6" },
  ],
};

// Engravings are printed in the page's own ink on its own paper: luminance
// maps from ink (black lines) to paper (white ground) in each theme.
function PlateFilters() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ position: "absolute", width: 0, height: 0 }}>
      <defs>
        <filter id="plate-light" colorInterpolationFilters="sRGB">
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncR type="linear" slope="0.847" intercept="0.110" />
            <feFuncG type="linear" slope="0.839" intercept="0.098" />
            <feFuncB type="linear" slope="0.820" intercept="0.082" />
          </feComponentTransfer>
        </filter>
        <filter id="plate-dark" colorInterpolationFilters="sRGB">
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncR type="linear" slope="0.773" intercept="0.078" />
            <feFuncG type="linear" slope="0.749" intercept="0.071" />
            <feFuncB type="linear" slope="0.706" intercept="0.059" />
          </feComponentTransfer>
        </filter>
      </defs>
    </svg>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${serif.variable} ${mono.variable} bg-page text-fg overflow-x-hidden`}>
        <PlateFilters />
        {/* keyboard users should not tab through the whole nav to read */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:px-4 focus:py-2.5 focus:font-mono focus:text-meta focus:text-page focus:bg-fg"
        >
          Skip to content
        </a>
        <Providers>
          <OnDemand />
          <Navbar />
          <SectionProgress />
          <GameHint />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
