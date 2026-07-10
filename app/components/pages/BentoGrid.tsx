import Link from "next/link";
import { profile, availability } from "@/lib/data";

const STATS = [
  {
    label: "Currently building",
    value: "GSoC @ BRL-CAD",
    detail: "Manifold C++ geometry library",
    href: "/#open-source",
    linkLabel: "see the work",
  },
  {
    label: "Availability",
    value: availability.open ? "Open to internships" : "Not available",
    detail: "Summer 2026 · Backend / Systems / AI",
    href: `mailto:${profile.email}`,
    linkLabel: "reach out",
  },
  {
    label: "Location",
    value: profile.location,
    detail: "UTC +5:30",
  },
];

export default function BentoGrid() {
  return (
    <section className="border-y dark:border-zinc-800 border-zinc-300 py-8 md:py-10">
      <div className="grid sm:grid-cols-3 grid-cols-1 gap-8 sm:gap-6 sm:divide-x dark:divide-zinc-800 divide-zinc-300">
        {STATS.map((stat) => (
          <div key={stat.label} className="sm:pl-6 first:pl-0 flex flex-col gap-1.5">
            <p className="text-xs uppercase tracking-widest dark:text-zinc-500 text-zinc-400 font-mono">
              {stat.label}
            </p>
            <p className="text-lg font-semibold leading-snug">{stat.value}</p>
            <p className="text-sm dark:text-zinc-400 text-zinc-500">{stat.detail}</p>
            {stat.href && (
              <Link
                href={stat.href}
                className="mt-1 text-xs font-mono dark:text-zinc-400 text-zinc-500 dark:hover:text-white hover:text-zinc-900 transition-colors duration-150"
              >
                {stat.linkLabel} &rarr;
              </Link>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
