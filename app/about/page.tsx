import Image from "next/image";
import { Metadata } from "next";
import Heroes from "../components/pages/Heroes";
import Usage from "../components/pages/Usage";
import Achievements from "../components/pages/Achievements";
import { profile } from "@/lib/data";

export const metadata: Metadata = {
  title: "About | Anshul Patil",
  metadataBase: new URL("https://anshulpatil.dev/about"),
  description:
    "Learn more about Anshul Patil's skills, experience and technical background",
  openGraph: {
    title: "About | Anshul Patil",
    url: "https://anshulpatil.dev/about",
    description:
      "Learn more about Anshul Patil's skills, experience and technical background",
  },
};

export default function About() {
  return (
    <main id="main" className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
      <section className="folio pt-10 md:pt-16 mb-24 md:mb-32">
        <h1
          className="lg:col-span-10 lg:row-start-1 leading-[1.02] tracking-[-0.02em] mb-12 max-w-[22ch]"
          style={{ fontSize: "clamp(2.75rem, 1.4rem + 3.8vw, 5rem)" }}
        >
          I&apos;m {profile.fullName}. I live in{" "}
          {profile.location}, where I build the future.
        </h1>

        <div className="lg:col-start-4 lg:col-span-6 lg:row-start-2 text-lead text-fg space-y-6">
          {profile.fullBio.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        <aside className="lg:col-start-1 lg:col-span-3 lg:row-start-2 mt-12 lg:mt-1.5">
          <div className="lg:sticky lg:top-24 flex flex-col gap-y-4">
            {profile.profileImage.image && (
              <Image
                className="object-cover aspect-square bg-top border border-line"
                src={profile.profileImage.image}
                width={400}
                height={400}
                quality={100}
                alt={profile.profileImage.alt}
                priority
              />
            )}
            <a href={profile.resumeURL} download className="link text-body self-start">
              Download R&eacute;sum&eacute; &darr;
            </a>
            <a href={`mailto:${profile.email}`} className="font-mono text-meta link-muted self-start">
              {profile.email}
            </a>
          </div>
        </aside>
      </section>

      <Usage />
      <Achievements />
      <Heroes />
    </main>
  );
}
