"use client";
import { useEffect, useState } from "react";

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
    <div className="grid grid-cols-2 sm:grid-cols-4 mt-8 border-t border-line">
      {statItems.map(({ label, value }) => (
        <div key={label} className="pt-4 pb-5 pr-4 border-b border-line">
          <p className="text-h3 lining-nums">{value}</p>
          <p className="font-mono text-meta text-muted mt-1">{label}</p>
        </div>
      ))}
    </div>
  );
}
