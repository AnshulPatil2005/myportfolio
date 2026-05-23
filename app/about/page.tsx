import Image from "next/image";
import { Metadata } from "next";
import type { ProfileType } from "@/types";
import { BiEnvelope, BiSolidDownload } from "react-icons/bi";
import Heroes from "../components/pages/Heroes";
import Usage from "../components/pages/Usage";
import { Slide } from "../animation/Slide";
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
    <main className="relative lg:max-w-7xl mx-auto max-w-3xl md:px-16 px-6">
      <div>
        <section className="relative grid lg:grid-cols-custom grid-cols-1 gap-x-6 justify-items-center">
          <div className="order-2 lg:order-none">
            <Slide>
              <h1 className="font-incognito font-semibold tracking-tight sm:text-5xl text-3xl lg:leading-tight basis-1/2 mb-8">
                I&apos;m {profile.fullName}. I live in{" "}
                {profile.location}, where I build the future.
              </h1>

              <div className="dark:text-zinc-400 text-zinc-600 leading-relaxed space-y-4">
                {profile.fullBio.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </Slide>
          </div>

          <aside className="flex flex-col lg:justify-self-center justify-self-start gap-y-8 lg:order-1 order-none mb-12">
            <Slide delay={0.1}>
              <div className="sticky top-10">
                {profile.profileImage.image ? (
                  <Image
                    className="rounded-2xl mb-4 object-cover max-h-96 min-h-96 bg-top"
                    src={profile.profileImage.image}
                    width={400}
                    height={400}
                    quality={100}
                    alt={profile.profileImage.alt}
                    priority
                  />
                ) : (
                  <div className="h-96 w-[400px] bg-zinc-500 mb-4 rounded-2xl"></div>
                )}

                <div className="flex flex-col text-center gap-y-4">
                  <a
                    href={profile.resumeURL}
                    download
                    className="flex items-center justify-center text-center gap-x-2 dark:bg-primary-bg bg-zinc-100 border border-transparent dark:hover:border-zinc-700 hover:border-zinc-200 rounded-md py-2 text-lg font-incognito font-semibold"
                  >
                    Download Résumé <BiSolidDownload className="text-base" />
                  </a>

                  <a
                    href={`mailto:${profile.email}`}
                    className="flex items-center gap-x-2 hover:text-primary-color"
                  >
                    <BiEnvelope className="text-lg" />
                    {profile.email}
                  </a>
                </div>
              </div>
            </Slide>
          </aside>
        </section>
        <Slide delay={0.14}>
          <Usage />
        </Slide>
        <Heroes />
      </div>
    </main>
  );
}
