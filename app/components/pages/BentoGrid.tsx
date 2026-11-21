import Link from "next/link";
import { profile, availability } from "@/lib/data";

const STATS = [
  {
    label: "Currently building",
    value: "LFX @ CNCF OpenKruise",
    detail: "Sign-in for AI agents on Kubernetes",
    href: "/#jobs",
    linkLabel: "see the work",
  },
  {
    label: "Availability",
    value: availability.open ? "Available" : "Not available",
    detail: "Internships · Backend / Systems / AI",
    href: `mailto:${profile.email}`,
    linkLabel: "reach out",
  },
  {
    label: "Location",
    value: profile.location,
    detail: "UTC +5:30",
  },
];

// Three facts set as one ruled line under the summary, aligned to the text
// column; on a phone they stack, each under its own rule.
export default function BentoGrid() {
  return (
    <section className="folio">
      <div className="lg:col-start-4 lg:col-span-9 grid sm:grid-cols-3 grid-cols-1 border-y border-line divide-y sm:divide-y-0 sm:divide-x divide-line">
        {STATS.map((stat) => (
          <div key={stat.label} className="py-5 sm:px-6 sm:first:pl-0 flex flex-col gap-1">
            <p className="font-mono text-meta text-muted">{stat.label}</p>
            <p className="text-lead leading-snug text-fg">{stat.value}</p>
            <p className="text-small text-muted">{stat.detail}</p>
            {stat.href && (
              <Link href={stat.href} className="mt-1 font-mono text-meta link-muted self-start">
                {stat.linkLabel} &rarr;
              </Link>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
