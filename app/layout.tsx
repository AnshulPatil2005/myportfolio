import "@/app/styles/globals.css";
import type { Metadata } from "next";
import { sans, mono } from "./assets/font/font";
import Navbar from "./components/global/Navbar";
import Footer from "./components/global/Footer";
import { Providers } from "./providers";
import { CommandPalette } from "./components/global/CommandPalette";
import SectionProgress from "./components/global/SectionProgress";
import ChatWidget from "./components/global/ChatWidget";

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
        className={`${sans.variable} ${mono.variable} font-sans dark:bg-ink bg-paper dark:text-zinc-200 text-zinc-800`}
      >
        <Providers>
          <Navbar />
          <CommandPalette />
          <SectionProgress />
          <ChatWidget />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
