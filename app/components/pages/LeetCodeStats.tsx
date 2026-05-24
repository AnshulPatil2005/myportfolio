"use client";
import { useEffect, useState } from "react";
import { Slide } from "@/app/animation/Slide";

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

// ─── Heatmap helpers ────────────────────────────────────────────────────────

function parseCalendar(raw: string): Record<string, number> {
  const map: Record<string, number> = {};
  try {
    const parsed = JSON.parse(raw);
    for (const [ts, cnt] of Object.entries(parsed)) {
      const d = new Date(Number(ts) * 1000);
      const key = d.toISOString().split("T")[0]; // UTC date YYYY-MM-DD
      map[key] = (map[key] || 0) + (cnt as number);
    }
  } catch {}
  return map;
}

function buildGrid(
  calMap: Record<string, number>
): { date: string; count: number }[][] {
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  // Align start to the Sunday 52 weeks ago (UTC)
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

function monthLabels(weeks: { date: string; count: number }[][]): (string | null)[] {
  const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  let lastMonth = -1;
  return weeks.map((week) => {
    const d = new Date(week[0].date);
    const m = d.getUTCMonth();
    if (m !== lastMonth) { lastMonth = m; return MONTHS[m]; }
    return null;
  });
}

function cellClass(count: number): string {
  if (count < 0)  return "dark:bg-zinc-900 bg-zinc-50";
  if (count === 0) return "dark:bg-zinc-800 bg-zinc-200";
  if (count <= 2)  return "bg-orange-900";
  if (count <= 5)  return "bg-orange-600";
  return "bg-orange-400";
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function Heatmap({ submissionCalendar }: { submissionCalendar: string }) {
  const calMap = parseCalendar(submissionCalendar);
  const weeks = buildGrid(calMap);
  const labels = monthLabels(weeks);

  return (
    <div className="overflow-x-auto">
      <div className="inline-block min-w-max">
        {/* Month labels */}
        <div className="flex gap-[3px] mb-[3px]">
          {labels.map((label, i) => (
            <div key={i} className="w-[11px] text-[9px] dark:text-zinc-500 text-zinc-400 overflow-visible whitespace-nowrap">
              {label ?? ""}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="flex gap-[3px]">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((day, di) => (
                <div
                  key={di}
                  title={day.count >= 0 ? `${day.date}: ${day.count} submission${day.count !== 1 ? "s" : ""}` : day.date}
                  className={`w-[11px] h-[11px] rounded-[2px] ${cellClass(day.count)}`}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-[3px] mt-2 justify-end">
          <span className="text-[10px] dark:text-zinc-500 text-zinc-400 mr-1">Less</span>
          {[0, 1, 3, 6].map((n) => (
            <div key={n} className={`w-[11px] h-[11px] rounded-[2px] ${cellClass(n)}`} />
          ))}
          <span className="text-[10px] dark:text-zinc-500 text-zinc-400 ml-1">More</span>
        </div>
      </div>
    </div>
  );
}

function DifficultyBar({
  value,
  total,
  color,
  label,
}: {
  value: number;
  total: number;
  color: string;
  label: string;
}) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs w-14 dark:text-zinc-400 text-zinc-500">{label}</span>
      <div className="flex-1 h-1.5 rounded-full dark:bg-zinc-800 bg-zinc-200 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs w-6 text-right dark:text-zinc-400 text-zinc-500">{value}</span>
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function LeetCodeStats() {
  const [stats, setStats] = useState<LeetCodeData | null>(null);

  useEffect(() => {
    fetch("/api/leetcode")
      .then((res) => res.json())
      .then((data) => { if (!data.error) setStats(data); })
      .catch(() => null);
  }, []);

  if (!stats) return null;

  const username = process.env.NEXT_PUBLIC_LEETCODE_USERNAME;
  const profileUrl = username
    ? `https://leetcode.com/u/${username}`
    : "https://leetcode.com";

  const topStats = [
    { label: "Problems Solved", value: stats.total, size: "text-5xl" },
    ...(stats.streak > 0 ? [{ label: "Day Streak", value: stats.streak, size: "text-3xl" }] : []),
    ...(stats.totalActiveDays > 0 ? [{ label: "Active Days", value: stats.totalActiveDays, size: "text-3xl" }] : []),
    ...(stats.ranking > 0 ? [{ label: "Global Rank", value: `#${stats.ranking.toLocaleString()}`, size: "text-3xl" }] : []),
  ];

  return (
    <section className="mt-16">
      <Slide delay={0.16}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-incognito text-4xl font-bold tracking-tight">LeetCode</h2>
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm dark:text-zinc-400 text-zinc-600 hover:underline"
          >
            View Profile
          </a>
        </div>

        <div className="dark:bg-primary-bg bg-zinc-50 border dark:border-zinc-800 border-zinc-200 p-6 rounded-lg space-y-6">

          {/* Top stats row */}
          <div className="flex flex-wrap gap-8 items-end">
            {topStats.map(({ label, value, size }) => (
              <div key={label}>
                <p className={`${size} font-bold font-incognito leading-none`}>{value}</p>
                <p className="text-sm dark:text-zinc-400 text-zinc-600 mt-1">{label}</p>
              </div>
            ))}

            {/* Difficulty counts inline */}
            <div className="flex gap-5 ml-auto">
              {[
                { label: "Easy",   value: stats.easy,   color: "text-green-500" },
                { label: "Medium", value: stats.medium, color: "text-yellow-500" },
                { label: "Hard",   value: stats.hard,   color: "text-red-500" },
              ].map(({ label, value, color }) => (
                <div key={label} className="text-center">
                  <p className={`text-2xl font-bold font-incognito ${color}`}>{value}</p>
                  <p className="text-xs dark:text-zinc-400 text-zinc-600 mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Difficulty bars */}
          <div className="max-w-sm space-y-2">
            <DifficultyBar label="Easy"   value={stats.easy}   total={stats.total} color="bg-green-500" />
            <DifficultyBar label="Medium" value={stats.medium} total={stats.total} color="bg-yellow-500" />
            <DifficultyBar label="Hard"   value={stats.hard}   total={stats.total} color="bg-red-500" />
          </div>

          {/* Submission heatmap */}
          {stats.submissionCalendar && (
            <Heatmap submissionCalendar={stats.submissionCalendar} />
          )}
        </div>
      </Slide>
    </section>
  );
}
