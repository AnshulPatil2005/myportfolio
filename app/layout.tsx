import "@/app/styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { incognito } from "./assets/font/font";
import { gitlabmono } from "./assets/font/font";
import Navbar from "./components/global/Navbar";
import Footer from "./components/global/Footer";
import { Providers } from "./providers";
import { CommandPalette } from "./components/global/CommandPalette";
import SectionProgress from "./components/global/SectionProgress";
import ChatWidget from "./components/global/ChatWidget";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--inter",
});

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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${incognito.variable} ${inter.className} ${gitlabmono.variable} dark:bg-zinc-900 bg-white dark:text-white text-zinc-700`}
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
