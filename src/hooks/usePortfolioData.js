import { useEffect, useState } from 'react';
import {
  fetchAllGithubRepos,
  fetchGithubContributionData,
  fetchLeetCodeStats,
  githubToken,
  githubUsername,
  leetcodeUsername,
} from '../lib/api';

export default function usePortfolioData() {
  const [state, setState] = useState({
    repos: [],
    reposLoading: true,
    reposError: '',
    contributionSummary: null,
    contributionLoading: true,
    contributionError: '',
    openSource: {
      totalCount: 0,
      repositories: [],
    },
    openSourceLoading: true,
    openSourceError: '',
    leetcode: null,
    leetcodeLoading: true,
    leetcodeError: '',
  });

  useEffect(() => {
    let isCancelled = false;

    async function loadData() {
      const hasGithubConfig = Boolean(githubUsername);
      const hasLeetCodeConfig = Boolean(leetcodeUsername);
      const hasGithubToken = Boolean(githubToken);

      const reposPromise = hasGithubConfig ? fetchAllGithubRepos() : Promise.resolve([]);
      const githubGraphPromise = hasGithubConfig && hasGithubToken
        ? fetchGithubContributionData()
        : Promise.resolve(null);
      const leetcodePromise = hasLeetCodeConfig ? fetchLeetCodeStats() : Promise.resolve(null);

      const [reposResult, githubGraphResult, leetcodeResult] = await Promise.allSettled([
        reposPromise,
        githubGraphPromise,
        leetcodePromise,
      ]);

      if (isCancelled) {
        return;
      }

      const nextState = {
        repos: [],
        reposLoading: false,
        reposError: '',
        contributionSummary: null,
        contributionLoading: false,
        contributionError: '',
        openSource: {
          totalCount: 0,
          repositories: [],
        },
        openSourceLoading: false,
        openSourceError: '',
        leetcode: null,
        leetcodeLoading: false,
        leetcodeError: '',
      };

      if (!hasGithubConfig) {
        nextState.reposError = 'Set VITE_GITHUB_USERNAME in .env to load GitHub repositories.';
        nextState.contributionError = 'Set VITE_GITHUB_USERNAME in .env to load contributions.';
        nextState.openSourceError = 'Set VITE_GITHUB_USERNAME in .env to load open-source work.';
      } else {
        if (reposResult.status === 'fulfilled') {
          nextState.repos = reposResult.value;
        } else {
          nextState.reposError = reposResult.reason?.message || 'Failed to load repositories.';
        }

        if (!hasGithubToken) {
          const tokenMessage = 'Set VITE_GITHUB_TOKEN in .env to show live GitHub contributions and open-source data.';
          nextState.contributionError = tokenMessage;
          nextState.openSourceError = tokenMessage;
        } else if (githubGraphResult.status === 'fulfilled' && githubGraphResult.value) {
          nextState.contributionSummary = githubGraphResult.value.contributionSummary;
          nextState.openSource = githubGraphResult.value.openSource;
        } else {
          const githubError = githubGraphResult.reason?.message || 'Failed to load GitHub activity.';
          nextState.contributionError = githubError;
          nextState.openSourceError = githubError;
        }
      }

      if (!hasLeetCodeConfig) {
        nextState.leetcodeError = 'Set VITE_LEETCODE_USERNAME in .env to load LeetCode stats.';
      } else if (leetcodeResult.status === 'fulfilled') {
        nextState.leetcode = leetcodeResult.value;
      } else {
        nextState.leetcodeError = leetcodeResult.reason?.message || 'Failed to load LeetCode stats.';
      }

      setState(nextState);
    }

    loadData();

    return () => {
      isCancelled = true;
    };
  }, []);

  return {
    ...state,
    githubUsername,
    leetcodeUsername,
  };
}