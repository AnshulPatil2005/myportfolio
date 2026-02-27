const GITHUB_REST_API = 'https://api.github.com';
const GITHUB_GRAPHQL_API = 'https://api.github.com/graphql';
const LEETCODE_API = 'https://leetcode-api-faisalshohag.vercel.app';

export const githubUsername = (import.meta.env.VITE_GITHUB_USERNAME || '').trim();
export const githubToken = (import.meta.env.VITE_GITHUB_TOKEN || '').trim();
export const leetcodeUsername = (import.meta.env.VITE_LEETCODE_USERNAME || '').trim();

function buildGithubHeaders() {
  const headers = {
    Accept: 'application/vnd.github+json',
  };

  if (githubToken) {
    headers.Authorization = `Bearer ${githubToken}`;
  }

  return headers;
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);

  if (!response.ok) {
    let message = `${response.status} ${response.statusText}`;

    try {
      const payload = await response.json();
      if (payload?.message) {
        message = payload.message;
      }
    } catch {
      // Keep fallback message.
    }

    throw new Error(message);
  }

  return response.json();
}

export async function fetchAllGithubRepos() {
  if (!githubUsername) {
    throw new Error('Set VITE_GITHUB_USERNAME to load repositories.');
  }

  const repos = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const endpoint = githubToken
      ? `${GITHUB_REST_API}/user/repos?visibility=all&affiliation=owner&sort=updated&direction=desc&per_page=100&page=${page}`
      : `${GITHUB_REST_API}/users/${githubUsername}/repos?type=owner&sort=updated&direction=desc&per_page=100&page=${page}`;

    const batch = await fetchJson(endpoint, {
      headers: buildGithubHeaders(),
    });

    repos.push(...batch);
    hasMore = batch.length === 100;
    page += 1;
  }

  return repos.map((repo) => ({
    id: repo.id,
    name: repo.name,
    description: repo.description,
    language: repo.language,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    openIssues: repo.open_issues_count,
    htmlUrl: repo.html_url,
    homepage: repo.homepage,
    updatedAt: repo.updated_at,
    archived: repo.archived,
    private: repo.private,
    isFork: repo.fork,
    topics: repo.topics || [],
  }));
}

export async function fetchGithubContributionData() {
  if (!githubUsername) {
    throw new Error('Set VITE_GITHUB_USERNAME to load GitHub contribution data.');
  }

  if (!githubToken) {
    throw new Error('Set VITE_GITHUB_TOKEN to load live GitHub contributions.');
  }

  const to = new Date();
  const from = new Date();
  from.setFullYear(from.getFullYear() - 1);

  const query = `
    query PortfolioGitHubData($login: String!, $from: DateTime!, $to: DateTime!, $count: Int!) {
      user(login: $login) {
        contributionsCollection(from: $from, to: $to) {
          totalCommitContributions
          totalIssueContributions
          totalPullRequestContributions
          totalPullRequestReviewContributions
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
                weekday
              }
            }
          }
        }
        repositoriesContributedTo(
          first: $count
          includeUserRepositories: false
          contributionTypes: [COMMIT, ISSUE, PULL_REQUEST, PULL_REQUEST_REVIEW]
          orderBy: { field: UPDATED_AT, direction: DESC }
        ) {
          totalCount
          nodes {
            name
            description
            url
            stargazerCount
            forkCount
            updatedAt
            primaryLanguage {
              name
            }
            owner {
              login
            }
          }
        }
      }
    }
  `;

  const response = await fetchJson(GITHUB_GRAPHQL_API, {
    method: 'POST',
    headers: {
      ...buildGithubHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables: {
        login: githubUsername,
        from: from.toISOString(),
        to: to.toISOString(),
        count: 20,
      },
    }),
  });

  if (response.errors?.length) {
    const message = response.errors.map((error) => error.message).join(', ');
    throw new Error(message);
  }

  const user = response.data?.user;

  if (!user) {
    throw new Error('GitHub user not found.');
  }

  const contributions = user.contributionsCollection;
  const openSourceNodes = user.repositoriesContributedTo?.nodes || [];

  return {
    contributionSummary: {
      total: contributions.contributionCalendar.totalContributions,
      commits: contributions.totalCommitContributions,
      pullRequests: contributions.totalPullRequestContributions,
      issues: contributions.totalIssueContributions,
      reviews: contributions.totalPullRequestReviewContributions,
      weeks: contributions.contributionCalendar.weeks,
    },
    openSource: {
      totalCount: user.repositoriesContributedTo?.totalCount || 0,
      repositories: openSourceNodes
        .filter(Boolean)
        .map((repo) => ({
          id: `${repo.owner.login}/${repo.name}`,
          name: repo.name,
          owner: repo.owner.login,
          description: repo.description,
          url: repo.url,
          stars: repo.stargazerCount,
          forks: repo.forkCount,
          updatedAt: repo.updatedAt,
          language: repo.primaryLanguage?.name || null,
        })),
    },
  };
}

export async function fetchLeetCodeStats() {
  if (!leetcodeUsername) {
    throw new Error('Set VITE_LEETCODE_USERNAME to load LeetCode stats.');
  }

  const data = await fetchJson(`${LEETCODE_API}/${leetcodeUsername}`);

  if (data.errors?.length) {
    throw new Error(data.errors[0].message || 'Failed to load LeetCode stats.');
  }

  if (typeof data.totalSolved !== 'number') {
    throw new Error('LeetCode profile not found. Verify VITE_LEETCODE_USERNAME.');
  }

  const allSubmissionInfo = data.totalSubmissions?.find((entry) => entry.difficulty === 'All');
  const acceptedAllInfo = data.matchedUserStats?.acSubmissionNum?.find((entry) => entry.difficulty === 'All');

  const totalSubmissions = allSubmissionInfo?.submissions || 0;
  const totalAcceptedSubmissions = acceptedAllInfo?.submissions || 0;
  const acceptanceRate = totalSubmissions
    ? Number(((totalAcceptedSubmissions / totalSubmissions) * 100).toFixed(1))
    : 0;

  return {
    totalSolved: data.totalSolved,
    easySolved: data.easySolved,
    mediumSolved: data.mediumSolved,
    hardSolved: data.hardSolved,
    totalQuestions: data.totalQuestions,
    ranking: data.ranking,
    acceptanceRate,
  };
}