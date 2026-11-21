"use client";
import { useEffect, useState } from "react";
import SectionHead from "../shared/SectionHead";
import WhenVisible from "../shared/WhenVisible";

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

// ink density, as in the GitHub calendar
function cellClass(count: number): string {
  if (count < 0)  return "bg-transparent";
  if (count === 0) return "bg-line";
  if (count <= 2)  return "bg-fg/40";
  if (count <= 5)  return "bg-fg/70";
  return "bg-fg";
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
            <div key={i} className="w-[13px] font-mono text-meta leading-tight text-muted overflow-visible whitespace-nowrap">
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
                  className={`w-[13px] h-[13px] ${cellClass(day.count)}`}
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
    <div className="pt-4 pb-5 pr-6 border-b border-line min-w-[6rem]">
      <p className="text-h3 lining-nums leading-tight">{value}</p>
      <p className="font-mono text-meta text-muted mt-1">{label}</p>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

function LeetCodeCard() {
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

  return (
    <div>
      <div className="border border-line p-5 sm:p-6 max-w-fit max-w-full">
        {loading ? (
          <div className="flex gap-[3px] overflow-hidden">
            {Array.from({ length: 52 }).map((_, wi) => (
              <div key={wi} className="flex flex-col gap-[3px]">
                {Array.from({ length: 7 }).map((_, di) => (
                  <div
                    key={di}
                    className="w-[13px] h-[13px] bg-line animate-pulse"
                  />
                ))}
              </div>
            ))}
          </div>
        ) : stats ? (
          <Heatmap submissionCalendar={stats.submissionCalendar} />
        ) : (
          <p className="text-small text-muted py-10 px-4">
            Could not load submission data.
          </p>
        )}

        <div className="flex flex-wrap items-center justify-between mt-4 gap-x-8 gap-y-2">
          <p className="font-mono text-meta text-muted">
            {stats
              ? `${stats.totalActiveDays} active day${stats.totalActiveDays !== 1 ? "s" : ""} · ${stats.streak} day streak`
              : loading
              ? "Loading..."
              : ""}
          </p>
          <div className="flex items-center gap-[3px] shrink-0 whitespace-nowrap">
            <span className="font-mono text-meta text-muted mr-1.5">Less</span>
            {[0, 1, 3, 6].map((n) => (
              <div key={n} className={`w-[13px] h-[13px] ${cellClass(n)}`} />
            ))}
            <span className="font-mono text-meta text-muted ml-1.5">More</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-x-2 mt-6 border-t border-line">
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
              className="mt-4 mr-6 w-20 h-[3.25rem] bg-line animate-pulse"
            />
          ))
        ) : null}
      </div>
    </div>
  );
}

export default function LeetCodeStats() {
  const username = process.env.NEXT_PUBLIC_LEETCODE_USERNAME || "Anshulpatil2011";
  const profileUrl = `https://leetcode.com/u/${username}`;

  return (
    <section className="mt-28 md:mt-40">
      <SectionHead
        title="LeetCode"
        aside={
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 pt-3 font-mono text-meta link-muted"
          >
            View Profile
          </a>
        }
      />
      <div className="folio">
        <div className="lg:col-start-4 lg:col-span-9">
          {/* the stats come from a slow third-party API; ask only when needed */}
          <WhenVisible minHeight="19rem">
            <LeetCodeCard />
          </WhenVisible>
        </div>
      </div>
    </section>
  );
}
