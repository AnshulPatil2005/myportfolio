"use client";
import { useEffect, useState } from "react";
import { Slide } from "@/app/animation/Slide";

type GitHubStatsData = {
  followers: number;
  following: number;
  publicRepos: number;
  totalStars: number;
};

export default function GitHubStats() {
  const [stats, setStats] = useState<GitHubStatsData | null>(null);

  useEffect(() => {
    fetch("/api/github-stats")
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) setStats(data);
      })
      .catch(() => null);
  }, []);

  if (!stats) return null;

  const statItems = [
    { label: "Repositories", value: stats.publicRepos },
    { label: "Stars Earned", value: stats.totalStars },
    { label: "Followers", value: stats.followers },
    { label: "Following", value: stats.following },
  ];

  return (
    <Slide delay={0.2}>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
        {statItems.map(({ label, value }) => (
          <div
            key={label}
            className="border dark:border-zinc-800 border-zinc-300 p-4 text-center"
          >
            <p className="text-2xl font-bold font-incognito">{value}</p>
            <p className="text-sm dark:text-zinc-400 text-zinc-600 mt-1">{label}</p>
          </div>
        ))}
      </div>
    </Slide>
  );
}
