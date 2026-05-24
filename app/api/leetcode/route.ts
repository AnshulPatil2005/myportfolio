import { NextResponse } from "next/server";

const LEETCODE_GRAPHQL = "https://leetcode.com/graphql/";

const query = `
  query getUserProfile($username: String!) {
    matchedUser(username: $username) {
      submitStats {
        acSubmissionNum {
          difficulty
          count
        }
      }
      profile {
        ranking
      }
      userCalendar {
        streak
        totalActiveDays
        submissionCalendar
      }
    }
  }
`;

export async function GET() {
  const username = process.env.NEXT_PUBLIC_LEETCODE_USERNAME;
  if (!username) {
    return NextResponse.json({ error: "LeetCode username not configured" }, { status: 400 });
  }

  try {
    const res = await fetch(LEETCODE_GRAPHQL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Referer: "https://leetcode.com",
        "User-Agent": "Mozilla/5.0 (compatible)",
      },
      body: JSON.stringify({ query, variables: { username } }),
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "LeetCode API error" }, { status: 500 });
    }

    const data = await res.json();
    const user = data?.data?.matchedUser;

    if (!user) {
      return NextResponse.json({ error: "LeetCode user not found" }, { status: 404 });
    }

    const stats = user.submitStats.acSubmissionNum as { difficulty: string; count: number }[];
    const total = stats.find((s) => s.difficulty === "All")?.count ?? 0;
    const easy = stats.find((s) => s.difficulty === "Easy")?.count ?? 0;
    const medium = stats.find((s) => s.difficulty === "Medium")?.count ?? 0;
    const hard = stats.find((s) => s.difficulty === "Hard")?.count ?? 0;

    const calendar = user.userCalendar ?? {};

    return NextResponse.json({
      total,
      easy,
      medium,
      hard,
      ranking: user.profile.ranking ?? 0,
      streak: calendar.streak ?? 0,
      totalActiveDays: calendar.totalActiveDays ?? 0,
      submissionCalendar: calendar.submissionCalendar ?? "",
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch LeetCode stats" }, { status: 500 });
  }
}
