import React from "react";
import { Slide } from "../../animation/Slide";
import { RiTrophyFill, RiStarFill, RiFlashlightFill } from "react-icons/ri";

const achievements: { icon: React.ElementType; title: string; description: string; link?: string }[] = [
  {
    icon: RiStarFill,
    title: "Google Summer of Code 2026",
    description:
      "Selected contributor for BRL-CAD Manifold open-source subproject — improving C++ geometry processing CI and benchmarking infrastructure.",
  },
  {
    icon: RiTrophyFill,
    title: "Winner — Agentic AI Strategy Hackathon",
    description:
      "First place for designing a multi-agent automation system with workflow orchestration.",
  },
  {
    icon: RiFlashlightFill,
    title: "3rd Place — Speed Coding, IIIT Surat",
    description: "Placed 3rd among 100+ participants in a competitive speed coding event.",
  },
];

export default function Achievements() {
  return (
    <section className="max-w-2xl mt-16">
      <Slide delay={0.14}>
        <div className="mb-8">
          <h2 className="text-4xl mb-4 font-bold tracking-tight">Achievements</h2>
        </div>
        <div className="space-y-5">
          {achievements.map(({ icon: Icon, title, description, link }) => (
            <div
              key={title}
              className="flex items-start gap-x-4 dark:bg-primary-bg bg-zinc-50 border dark:border-zinc-800 border-zinc-200 rounded-lg p-4"
            >
              <div className="grid place-items-center dark:bg-zinc-800 bg-zinc-200 rounded-md p-2 shrink-0">
                <Icon className="text-lg" />
              </div>
              <div>
                {link ? (
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold hover:underline"
                  >
                    {title}
                  </a>
                ) : (
                  <p className="font-semibold">{title}</p>
                )}
                <p className="text-sm dark:text-zinc-400 text-zinc-600 mt-1">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Slide>
    </section>
  );
}
