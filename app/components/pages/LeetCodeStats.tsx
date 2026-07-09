"use client";
import { useEffect, useState } from "react";
import { Slide } from "@/app/animation/Slide";

const BASE = "https://alfa-leetcode-api.onrender.com";
const CACHE_TTL = 2 * 60 * 60 * 1000; // 2 hours

type LeetCodeData = {
  total: number;
  easy: number;
  medium: number;
  hard: number;
  ranking: number;
  streak: number;
  totalActiveDays: number;
  submissionCalendar: string;
};

// ─── Heatmap helpers ─────────────────────────────────────────────────────────

function parseCalendar(raw: string): Record<string, number> {
  const map: Record<string, number> = {};
  try {
    let data: unknown = JSON.parse(raw);
    if (typeof data === "string") data = JSON.parse(data);
    for (const [ts, cnt] of Object.entries(data as Record<string, number>)) {
      const d = new Date(Number(ts) * 1000);
      const key = d.toISOString().split("T")[0];
      map[key] = (map[key] || 0) + (cnt as number);
    }
  } catch {}
  return map;
}

function buildGrid(calMap: Record<string, number>): { date: string; count: number }[][] {
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const start = new Date(today);
  start.setUTCDate(start.getUTCDate() - start.getUTCDay() - 7 * 51);
  start.setUTCHours(0, 0, 0, 0);

  const weeks: { date: string; count: number }[][] = [];
  const cur = new Date(start);
  for (let w = 0; w < 52; w++) {
    const week: { date: string; count: number }[] = [];
    for (let d = 0; d < 7; d++) {
      const key = cur.toISOString().split("T")[0];
      week.push({ date: key, count: key > todayStr ? -1 : (calMap[key] ?? 0) });
      cur.setUTCDate(cur.getUTCDate() + 1);
    }
    weeks.push(week);
  }
  return weeks;
}

function getMonthLabels(weeks: { date: string; count: number }[][]): (string | null)[] {
  const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  let last = -1;
  return weeks.map((week) => {
    const m = new Date(week[0].date).getUTCMonth();
    if (m !== last) { last = m; return MONTHS[m]; }
    return null;
  });
}

function cellClass(count: number): string {
  if (count < 0)  return "dark:bg-zinc-900 bg-zinc-50";
  if (count === 0) return "dark:bg-zinc-800 bg-zinc-200";
  if (count <= 2)  return "bg-orange-700";
  if (count <= 5)  return "bg-orange-500";
  return "bg-orange-300";
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Heatmap({ submissionCalendar }: { submissionCalendar: string }) {
  const calMap = parseCalendar(submissionCalendar);
  const weeks = buildGrid(calMap);
  const labels = getMonthLabels(weeks);

  return (
    <div className="overflow-x-auto">
      <div className="inline-block min-w-max">
        <div className="flex gap-[3px] mb-[3px]">
          {labels.map((label, i) => (
            <div key={i} className="w-[13px] text-[9px] dark:text-zinc-400 text-zinc-500 overflow-visible whitespace-nowrap">
              {label ?? ""}
            </div>
          ))}
        </div>
        <div className="flex gap-[3px]">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((day, di) => (
                <div
                  key={di}
                  title={day.count >= 0 ? `${day.date}: ${day.count} submission${day.count !== 1 ? "s" : ""}` : ""}
                  className={`w-[13px] h-[13px] rounded-[2px] ${cellClass(day.count)}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatPill({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="text-center px-4 py-2 border dark:border-zinc-800 border-zinc-300 min-w-[72px]">
      <p className="text-lg font-bold font-incognito leading-tight">{value}</p>
      <p className="text-xs dark:text-zinc-400 text-zinc-500 mt-0.5">{label}</p>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function LeetCodeStats() {
  const [stats, setStats] = useState<LeetCodeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const username = process.env.NEXT_PUBLIC_LEETCODE_USERNAME || "Anshulpatil2011";
    const CACHE_KEY = `lc_stats_${username}`;

    // ── 1. Serve from localStorage cache immediately ──────────────────────────
    let hasCache = false;
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (raw) {
        const { data, ts } = JSON.parse(raw) as { data: LeetCodeData; ts: number };
        setStats(data);
        setLoading(false);
        hasCache = true;
        // Cache is fresh — skip the network call entirely
        if (Date.now() - ts < CACHE_TTL) return;
        // Cache is stale — show it now, refresh in background (no loading spinner)
      }
    } catch {}

    // ── 2. Fetch fresh data with a 20s timeout ────────────────────────────────
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20_000);

    const safeFetch = (url: string) =>
      fetch(url, { signal: controller.signal })
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null);

    Promise.all([
      safeFetch(`${BASE}/${username}`),
      safeFetch(`${BASE}/${username}/solved`),
      safeFetch(`${BASE}/${username}/calendar`),
    ])
      .then(([profile, solved, calendar]) => {
        if (!solved) return;
        const fresh: LeetCodeData = {
          total: solved.solvedProblem ?? 0,
          easy: solved.easySolved ?? 0,
          medium: solved.mediumSolved ?? 0,
          hard: solved.hardSolved ?? 0,
          ranking: profile?.ranking ?? 0,
          streak: calendar?.streak ?? 0,
          totalActiveDays: calendar?.totalActiveDays ?? 0,
          submissionCalendar:
            typeof calendar?.submissionCalendar === "string"
              ? calendar.submissionCalendar
              : JSON.stringify(calendar?.submissionCalendar ?? {}),
        };
        setStats(fresh);
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify({ data: fresh, ts: Date.now() }));
        } catch {}
      })
      .catch(() => {})
      .finally(() => {
        clearTimeout(timeoutId);
        // Only update loading state if we didn't already resolve from cache
        if (!hasCache) setLoading(false);
      });

    return () => {
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, []);

  const username = process.env.NEXT_PUBLIC_LEETCODE_USERNAME || "Anshulpatil2011";
  const profileUrl = `https://leetcode.com/u/${username}`;

  return (
    <section className="mt-16">
      <Slide delay={0.16}>
        {/* Heading row */}
        <div className="flex items-center justify-between mb-8">
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

        {/* Card + stat pills */}
        <div className="flex xl:flex-row flex-col gap-4">
          <div className="border dark:border-zinc-800 border-zinc-300 p-8 max-w-fit max-h-fit">
            {loading ? (
              <div className="flex gap-[3px]">
                {Array.from({ length: 52 }).map((_, wi) => (
                  <div key={wi} className="flex flex-col gap-[3px]">
                    {Array.from({ length: 7 }).map((_, di) => (
                      <div
                        key={di}
                        className="w-[13px] h-[13px] rounded-[2px] dark:bg-zinc-800 bg-zinc-200 animate-pulse"
                      />
                    ))}
                  </div>
                ))}
              </div>
            ) : stats ? (
              <Heatmap submissionCalendar={stats.submissionCalendar} />
            ) : (
              <p className="text-sm dark:text-zinc-500 text-zinc-400 py-10 px-4">
                Could not load submission data.
              </p>
            )}

            <div className="flex items-center justify-between mt-3 gap-8">
              <p className="text-sm dark:text-zinc-400 text-zinc-500">
                {stats
                  ? `${stats.totalActiveDays} active day${stats.totalActiveDays !== 1 ? "s" : ""} · ${stats.streak} day streak`
                  : loading
                  ? "Loading..."
                  : ""}
              </p>
              <div className="flex items-center gap-[3px]">
                <span className="text-xs dark:text-zinc-500 text-zinc-400 mr-1">Less</span>
                {[0, 1, 3, 6].map((n) => (
                  <div key={n} className={`w-[13px] h-[13px] rounded-[2px] ${cellClass(n)}`} />
                ))}
                <span className="text-xs dark:text-zinc-500 text-zinc-400 ml-1">More</span>
              </div>
            </div>
          </div>

          <div className="flex justify-start xl:flex-col flex-row flex-wrap gap-2">
            {stats ? (
              <>
                <StatPill label="Solved" value={stats.total} />
                <StatPill label="Easy"   value={stats.easy} />
                <StatPill label="Medium" value={stats.medium} />
                <StatPill label="Hard"   value={stats.hard} />
                {stats.ranking > 0 && (
                  <StatPill label="Rank" value={`#${stats.ranking.toLocaleString()}`} />
                )}
              </>
            ) : loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="px-4 py-2 border dark:border-zinc-800 border-zinc-300 dark:bg-zinc-800 bg-zinc-200 min-w-[72px] h-[54px] animate-pulse"
                />
              ))
            ) : null}
          </div>
        </div>
      </Slide>
    </section>
  );
}
