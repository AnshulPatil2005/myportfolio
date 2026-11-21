import Link from "next/link";
import Social from "../shared/Social";
import EngravingImage from "../shared/EngravingImage";
import CareerButton from "../shared/CareerButton";
import { profile, availability, products } from "@/lib/data";

const ENGRAVING_SRC = "/engraving-melencolia.jpg";
const stratum = products.find((p) => p._id === "stratum");

// A title page and its frontispiece: the name set large in the text block,
// Dürer's Melencolia printed as the facing plate.
export default function Hero() {
  return (
    <section className="pt-6 md:pt-10 pb-20 md:pb-28">
      {/* Meta row */}
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 pb-3 border-b border-line font-mono text-meta text-muted">
        <span>Portfolio &middot; {profile.location}</span>
        {availability.open && <span className="text-fg">{availability.label}</span>}
      </div>

      {/* Stratum spotlight */}
      {stratum && (
        <a
          href={stratum.projectUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group folio items-baseline gap-y-1.5 py-4 border-b border-line"
        >
          <span className="lg:col-span-3 flex items-center gap-2.5 font-mono text-meta text-fg">
            <span aria-hidden="true" className="inline-block w-1.5 h-1.5 rounded-full bg-fg" />
            Live now
          </span>
          <span className="block lg:col-span-8 text-body text-muted">
            <span className="text-fg">{stratum.name}</span>
            <span> &mdash; </span>
            PR review that traces production incidents back to the PR that caused them.
          </span>
          <span className="block lg:col-span-1 lg:text-right whitespace-nowrap font-mono text-meta text-fg">
            <span className="underline decoration-line underline-offset-[0.3em] group-hover:decoration-fg">
              Try it
            </span>{" "}
            <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
              &rarr;
            </span>
          </span>
        </a>
      )}

      <div className="folio mt-12 md:mt-16 lg:items-start">
        {/* Title block */}
        <div className="lg:col-span-7 lg:pr-6">
          {/* Name */}
          <h1
            className="leading-[0.92] tracking-[-0.025em] mb-8"
            style={{ fontSize: "clamp(4.25rem, 1.5rem + 7.4vw, 8.75rem)" }}
          >
            {profile.fullName.split(" ").map((word, i, arr) =>
              i === arr.length - 1 ? (
                <span key={i} className="italic block [font-family:var(--font-serif-italic),'Newsreader_Italic_Fallback',Georgia,serif]">
                  {word}
                </span>
              ) : (
                <span key={i} className="block">
                  {word}
                </span>
              )
            )}
          </h1>

          {/* Credentials */}
          <p className="font-mono text-meta text-muted mb-8 flex flex-wrap gap-x-2 gap-y-1">
            {stratum && (
              <>
                <a
                  href={stratum.projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link whitespace-nowrap"
                >
                  Founder @ Stratum
                </a>
                <span aria-hidden="true">&middot;</span>
              </>
            )}
            <span className="whitespace-nowrap">LFX @ CNCF OpenKruise</span>
            <span aria-hidden="true">&middot;</span>
            <span className="whitespace-nowrap">Kubescape Member</span>
            <span aria-hidden="true">&middot;</span>
            <span className="whitespace-nowrap">GSoC @ BRL-CAD</span>
          </p>

          <div className="border-t border-line mb-8" />

          {/* Role + bio */}
          <div className="mb-10 space-y-3">
            <p className="font-mono text-meta text-muted">{profile.headline}</p>
            <p className="text-lead text-fg max-w-[34rem]">{profile.shortBio}</p>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-baseline gap-x-8 gap-y-3 mb-8 text-body">
            <Link href="/#featured-work" className="group link">
              View my work
              <span className="inline-block ml-1.5 no-underline transition-transform duration-200 group-hover:translate-x-1">
                &rarr;
              </span>
            </Link>
            <CareerButton className="hidden md:inline-flex items-baseline gap-2 link">
              <span className="text-[0.7em]">▶</span> Play Career Mode
            </CareerButton>
            <a href={profile.resumeURL} download className="link-muted">
              R&eacute;sum&eacute;
            </a>
            <Link href="/#contact" className="link-muted">
              Contact
            </Link>
          </div>

          <Social type="social" />

          <p className="mt-6 font-mono text-meta text-muted select-none hidden md:flex items-center gap-3">
            <span>
              <kbd className="border border-line px-1.5 py-0.5 mr-1.5">C</kbd> career mode
            </span>
            <span aria-hidden="true">·</span>
            <span>
              <kbd className="border border-line px-1.5 py-0.5 mr-1.5">⌘K</kbd> commands
            </span>
          </p>
        </div>

        {/* Frontispiece */}
        <div className="lg:col-span-5 mt-14 lg:mt-3 max-w-[28rem] lg:max-w-none">
          <EngravingImage
            src={ENGRAVING_SRC}
            alt=""
            priority
            sizes="(max-width: 1024px) 92vw, 466px"
            position="50% 30%"
            className="w-full aspect-[4/5] lg:aspect-[3/4]"
          />
        </div>
      </div>
    </section>
  );
}
