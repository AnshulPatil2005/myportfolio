import { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip as ChartTooltip,
  Legend,
} from 'chart.js';
import profile from '../assets/profile-placeholder.svg';

ChartJS.register(BarElement, CategoryScale, LinearScale, ChartTooltip, Legend);

function contributionTone(count, maxCount) {
  if (!count) {
    return 'bg-stone-200';
  }

  const ratio = maxCount ? count / maxCount : 0;

  if (ratio >= 0.75) {
    return 'bg-amber-700';
  }

  if (ratio >= 0.5) {
    return 'bg-amber-600';
  }

  if (ratio >= 0.25) {
    return 'bg-amber-500';
  }

  return 'bg-amber-400';
}

export default function About({
  leetcodeUsername,
  repoCount,
  contributionSummary,
  contributionLoading,
  contributionError,
  leetcode,
  leetcodeLoading,
  leetcodeError,
}) {
  const chartData = leetcode
    ? {
        labels: ['Easy', 'Medium', 'Hard'],
        datasets: [
          {
            label: 'Solved',
            data: [leetcode.easySolved, leetcode.mediumSolved, leetcode.hardSolved],
            backgroundColor: ['#166534', '#b45309', '#9a3412'],
          },
        ],
      }
    : null;

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: {
        ticks: { color: '#57534e' },
        grid: { color: 'rgba(120, 113, 108, 0.2)' },
      },
      y: {
        beginAtZero: true,
        ticks: { color: '#57534e' },
        grid: { color: 'rgba(120, 113, 108, 0.2)' },
      },
    },
  };

  const contributionDays = useMemo(() => {
    if (!contributionSummary?.weeks?.length) {
      return [];
    }

    return contributionSummary.weeks
      .flatMap((week) => week.contributionDays)
      .slice(-140);
  }, [contributionSummary]);

  const maxContributionCount = useMemo(() => {
    if (!contributionDays.length) {
      return 0;
    }

    return Math.max(...contributionDays.map((day) => day.contributionCount));
  }, [contributionDays]);

  return (
    <section id="about" className="classic-section mb-10 px-6 py-10 sm:px-8">
      <h3 className="section-title mb-8 text-2xl font-semibold">About</h3>

      <div className="grid gap-8 md:grid-cols-[220px_1fr] md:items-start">
        <img
          src={profile}
          alt="Anshul Patil"
          className="mx-auto h-52 w-52 rounded border border-amber-200 object-cover"
        />

        <div>
          <p className="classic-muted mb-4">
            I build production-grade web applications with a focus on quality engineering,
            maintainability, and measurable outcomes.
          </p>
          <p className="classic-muted mb-6">
            This portfolio now pulls live coding activity from GitHub and LeetCode so the data
            stays current without manual updates.
          </p>

          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <div className="classic-card p-4 text-center">
              <p className="text-2xl font-semibold text-stone-900">{repoCount}</p>
              <p className="classic-muted text-sm">GitHub Repositories</p>
            </div>
            <div className="classic-card p-4 text-center">
              <p className="text-2xl font-semibold text-stone-900">{contributionSummary?.total || 0}</p>
              <p className="classic-muted text-sm">Yearly Contributions</p>
            </div>
            <div className="classic-card p-4 text-center">
              <p className="text-2xl font-semibold text-stone-900">{leetcode?.totalSolved || 0}</p>
              <p className="classic-muted text-sm">LeetCode Solved</p>
            </div>
          </div>

          <div className="mb-8 classic-card p-5">
            <h4 className="mb-3 text-lg font-semibold text-stone-900">Core Focus Areas</h4>
            <ul className="list-disc space-y-2 pl-5 text-stone-700">
              <li>Backend API architecture for scalable applications.</li>
              <li>React frontend systems with clear interaction and accessibility.</li>
              <li>Reliable delivery workflows with cloud deployment and observability.</li>
            </ul>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="classic-card p-5">
              <h4 className="mb-3 text-lg font-semibold text-stone-900">LeetCode Stats</h4>
              {leetcodeLoading ? (
                <p className="classic-muted text-sm">Loading LeetCode stats...</p>
              ) : leetcodeError ? (
                <p className="text-sm text-red-700">{leetcodeError}</p>
              ) : (
                <ul className="space-y-1 text-sm text-stone-700">
                  <li>
                    Username: <span className="font-semibold text-stone-900">{leetcodeUsername || 'Configured in .env'}</span>
                  </li>
                  <li>
                    Acceptance Rate: <span className="font-semibold text-stone-900">{leetcode.acceptanceRate}%</span>
                  </li>
                  <li>
                    Global Rank: <span className="font-semibold text-stone-900">#{leetcode.ranking}</span>
                  </li>
                  <li>
                    Total Solved: <span className="font-semibold text-stone-900">{leetcode.totalSolved}</span>
                  </li>
                </ul>
              )}
            </div>

            <div className="classic-card p-5">
              <h4 className="mb-3 text-lg font-semibold text-stone-900">Solved Distribution</h4>
              {chartData ? (
                <Bar data={chartData} options={chartOptions} />
              ) : (
                <p className="classic-muted text-sm">Waiting for LeetCode data...</p>
              )}
            </div>
          </div>

          <div className="mt-6 classic-card p-5">
            <h4 className="mb-3 text-lg font-semibold text-stone-900">Live GitHub Contributions</h4>
            {contributionLoading ? (
              <p className="classic-muted text-sm">Loading contribution calendar...</p>
            ) : contributionError ? (
              <p className="text-sm text-red-700">{contributionError}</p>
            ) : (
              <>
                <div className="mb-4 flex flex-wrap gap-2 text-xs text-stone-700">
                  <span className="classic-pill">{contributionSummary.total} total</span>
                  <span className="classic-pill">{contributionSummary.commits} commits</span>
                  <span className="classic-pill">{contributionSummary.pullRequests} PRs</span>
                  <span className="classic-pill">{contributionSummary.issues} issues</span>
                  <span className="classic-pill">{contributionSummary.reviews} reviews</span>
                </div>

                <div className="overflow-x-auto">
                  <div className="grid min-w-[560px] grid-cols-20 gap-1">
                    {contributionDays.map((day) => (
                      <div
                        key={day.date}
                        className={`h-3 rounded-sm ${contributionTone(day.contributionCount, maxContributionCount)}`}
                        title={`${day.date}: ${day.contributionCount} contributions`}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
