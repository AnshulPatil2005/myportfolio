"use client";

import ContributionGraph from "./ContributionGraph";
import GitHubStats from "./GitHubStats";
import SnakeGame from "./SnakeGame";
import { Slide } from "@/app/animation/Slide";
import { useState } from "react";

const USERNAME = process.env.NEXT_PUBLIC_GITHUB_USERNAME || "AnshulPatil2005";

type Mode = "calendar" | "snake";

export default function GithubCalendarComponent() {
  const [mode, setMode] = useState<Mode>("calendar");

  return (
    <section className="mt-32 md:mt-40">
      <Slide delay={0.16} className="mb-8">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h2 className="font-incognito text-4xl font-bold tracking-tight">
            GitHub Activity
          </h2>
          <button
            onClick={() => setMode(m => m === "calendar" ? "snake" : "calendar")}
            className={`font-mono text-[11px] uppercase tracking-[0.18em] px-3 py-1.5 border transition-colors duration-150 ${
              mode === "snake"
                ? "dark:border-accent border-amber-500 dark:text-accent text-amber-600"
                : "dark:border-zinc-700 border-zinc-300 dark:text-zinc-500 text-zinc-400 dark:hover:border-zinc-500 hover:border-zinc-400"
            }`}
          >
            {mode === "calendar" ? "▶ Play Snake" : "← Calendar"}
          </button>
        </div>
      </Slide>

      <Slide delay={0.18}>
        {mode === "calendar" ? (
          <>
            <ContributionGraph />
            <GitHubStats />
          </>
        ) : (
          <div className="overflow-x-auto">
            <SnakeGame username={USERNAME} />
          </div>
        )}
      </Slide>
    </section>
  );
}
