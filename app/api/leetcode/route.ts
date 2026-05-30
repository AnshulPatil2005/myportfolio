import { NextResponse } from "next/server";

const BASE = "https://alfa-leetcode-api.onrender.com";

export async function GET() {
  const username = process.env.NEXT_PUBLIC_LEETCODE_USERNAME;
  if (!username) {
    return NextResponse.json({ error: "LeetCode username not configured" }, { status: 400 });
  }

  try {
    const [profileRes, solvedRes, calendarRes] = await Promise.all([
      fetch(`${BASE}/${username}`, { next: { revalidate: 3600 } }),
      fetch(`${BASE}/${username}/solved`, { next: { revalidate: 3600 } }),
      fetch(`${BASE}/${username}/calendar`, { next: { revalidate: 3600 } }),
    ]);

    if (!solvedRes.ok) {
      return NextResponse.json({ error: "LeetCode user not found" }, { status: 404 });
    }

    const profile = profileRes.ok ? await profileRes.json() : {};
    const solved = await solvedRes.json();
    const calendar = calendarRes.ok ? await calendarRes.json() : {};

    return NextResponse.json({
      total: solved.solvedProblem ?? 0,
      easy: solved.easySolved ?? 0,
      medium: solved.mediumSolved ?? 0,
      hard: solved.hardSolved ?? 0,
      ranking: profile.ranking ?? 0,
      streak: calendar.streak ?? 0,
      totalActiveDays: calendar.totalActiveDays ?? 0,
      // Serialize as string so the client-side heatmap parser stays unchanged
      submissionCalendar: JSON.stringify(calendar.submissionCalendar ?? {}),
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch LeetCode stats" }, { status: 500 });
  }
}
