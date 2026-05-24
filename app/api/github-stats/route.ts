import { NextResponse } from "next/server";

export async function GET() {
  const username = process.env.NEXT_PUBLIC_GITHUB_USERNAME;
  if (!username) {
    return NextResponse.json({ error: "GitHub username not configured" }, { status: 400 });
  }

  try {
    const headers: HeadersInit = { Accept: "application/vnd.github.v3+json" };
    if (process.env.GITHUB_TOKEN) {
      headers["Authorization"] = `token ${process.env.GITHUB_TOKEN}`;
    }

    const [profileRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, {
        headers,
        next: { revalidate: 3600 },
      }),
      fetch(
        `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
        { headers, next: { revalidate: 3600 } }
      ),
    ]);

    if (!profileRes.ok || !reposRes.ok) {
      return NextResponse.json({ error: "GitHub API error" }, { status: 500 });
    }

    const profile = await profileRes.json();
    const repos = await reposRes.json();

    const totalStars = Array.isArray(repos)
      ? repos.reduce(
          (acc: number, repo: { stargazers_count: number; fork: boolean }) =>
            repo.fork ? acc : acc + repo.stargazers_count,
          0
        )
      : 0;

    return NextResponse.json({
      followers: profile.followers ?? 0,
      following: profile.following ?? 0,
      publicRepos: profile.public_repos ?? 0,
      totalStars,
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch GitHub stats" }, { status: 500 });
  }
}
