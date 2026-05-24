"use client";
import { useEffect, useState } from "react";
import { Slide } from "@/app/animation/Slide";

type LeetCodeData = {
  total: number;
  easy: number;
  medium: number;
  hard: number;
  ranking: number;
};

export default function LeetCodeStats() {
  const [stats, setStats] = useState<LeetCodeData | null>(null);

  useEffect(() => {
    fetch("/api/leetcode")
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) setStats(data);
      })
      .catch(() => null);
  }, []);

  if (!stats) return null;

  const username = process.env.NEXT_PUBLIC_LEETCODE_USERNAME;
  const profileUrl = username
    ? `https://leetcode.com/u/${username}`
    : "https://leetcode.com";

  return (
    <section className="mt-16">
      <Slide delay={0.16}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-incognito text-4xl font-bold tracking-tight">
            LeetCode
          </h2>
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm dark:text-zinc-400 text-zinc-600 hover:underline"
          >
            View Profile
          </a>
        </div>
        <div className="dark:bg-primary-bg bg-zinc-50 border dark:border-zinc-800 border-zinc-200 p-6 rounded-lg inline-flex flex-wrap gap-8 items-center">
          <div className="text-center">
            <p className="text-5xl font-bold font-incognito">{stats.total}</p>
            <p className="text-sm dark:text-zinc-400 text-zinc-600 mt-2">
              Problems Solved
            </p>
          </div>
          <div className="flex gap-6">
            {[
              { label: "Easy", value: stats.easy, color: "text-green-500" },
              { label: "Medium", value: stats.medium, color: "text-yellow-500" },
              { label: "Hard", value: stats.hard, color: "text-red-500" },
            ].map(({ label, value, color }) => (
              <div key={label} className="text-center">
                <p className={`text-2xl font-bold font-incognito ${color}`}>
                  {value}
                </p>
                <p className="text-sm dark:text-zinc-400 text-zinc-600 mt-1">
                  {label}
                </p>
              </div>
            ))}
          </div>
          {stats.ranking > 0 && (
            <div className="text-center">
              <p className="text-2xl font-bold font-incognito">
                #{stats.ranking.toLocaleString()}
              </p>
              <p className="text-sm dark:text-zinc-400 text-zinc-600 mt-1">
                Global Rank
              </p>
            </div>
          )}
        </div>
      </Slide>
    </section>
  );
}
