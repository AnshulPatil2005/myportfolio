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
import { FadeIn, StaggerContainer, StaggerItem } from './ScrollReveal';

ChartJS.register(BarElement, CategoryScale, LinearScale, ChartTooltip, Legend);

function contributionTone(count, maxCount) {
  if (!count) {
    return 'bg-gray-100';
  }
  const ratio = maxCount ? count / maxCount : 0;
  if (ratio >= 0.75) return 'bg-[#004499]';
  if (ratio >= 0.5) return 'bg-[#0066cc]';
  if (ratio >= 0.25) return 'bg-[#3399ff]';
  return 'bg-[#99ccff]';
}

export default function About({
  leetcodeUsername,
  repoCount,
  contributionSummary,
  contributionLoading,
  contributionError = '',
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
            backgroundColor: ['#34c759', '#ff9500', '#ff3b30'],
            borderRadius: 8,
          },
        ],
      }
    : null;

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: {
        ticks: { color: '#86868b' },
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        ticks: { color: '#86868b' },
        grid: { color: '#f5f5f7' },
      },
    },
  };

  const contributionDays = useMemo(() => {
    if (!contributionSummary?.weeks?.length) return [];
    return contributionSummary.weeks
      .flatMap((week) => week.contributionDays)
      .slice(-140);
  }, [contributionSummary]);

  const maxContributionCount = useMemo(() => {
    if (!contributionDays.length) return 0;
    return Math.max(...contributionDays.map((day) => day.contributionCount));
  }, [contributionDays]);

  return (
    <section id="about" className="apple-section mx-auto max-w-7xl">
      <FadeIn>
        <h3 className="section-title">About</h3>
      </FadeIn>

      <div className="grid gap-12 lg:grid-cols-[300px_1fr] lg:items-start">
        <FadeIn delay={0.2} direction="right">
          <div className="relative group">
            <img
              src={profile}
              alt="Anshul Patil"
              className="mx-auto h-72 w-72 rounded-3xl object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 rounded-3xl border border-black/5 pointer-events-none"></div>
          </div>
        </FadeIn>

        <StaggerContainer delayChildren={0.3}>
          <StaggerItem>
            <p className="mb-6 text-2xl font-medium leading-relaxed text-[#1d1d1f]">
              I build production-grade web applications with a focus on quality engineering,
              maintainability, and measurable outcomes.
            </p>
          </StaggerItem>

          <div className="mb-12 grid gap-6 sm:grid-cols-3">
            {[
              { label: 'GitHub Repos', value: repoCount },
              { label: 'Contributions', value: contributionSummary?.total || 0 },
              { label: 'LeetCode Solved', value: leetcode?.totalSolved || 0 },
            ].map((stat, i) => (
              <StaggerItem key={i}>
                <div className="apple-card p-6 text-center">
                  <p className="text-3xl font-bold text-[#1d1d1f]">{stat.value}</p>
                  <p className="text-sm font-medium text-[#86868b]">{stat.label}</p>
                </div>
              </StaggerItem>
            ))}
          </div>

          <StaggerItem>
            <div className="mb-12 apple-card p-8">
              <h4 className="mb-6 text-xl font-bold text-[#1d1d1f]">Core Focus Areas</h4>
              <div className="grid gap-6 sm:grid-cols-3">
                {[
                  { title: 'Scalable Backend', desc: 'API architecture and system design.' },
                  { title: 'Fluid Frontend', desc: 'React systems with clean interactions.' },
                  { title: 'Reliable Delivery', desc: 'Cloud deployment and observability.' },
                ].map((focus, i) => (
                  <div key={i}>
                    <h5 className="mb-2 font-bold text-[#1d1d1f]">{focus.title}</h5>
                    <p className="text-sm leading-relaxed text-[#424245]">{focus.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </StaggerItem>

          <div className="grid gap-6 lg:grid-cols-2">
            <StaggerItem>
              <div className="apple-card h-full p-8">
                <h4 className="mb-6 text-xl font-bold text-[#1d1d1f]">LeetCode Stats</h4>
                {leetcodeLoading ? (
                  <div className="h-4 w-full animate-pulse rounded bg-gray-200"></div>
                ) : leetcodeError ? (
                  <p className="text-sm text-red-500">{leetcodeError}</p>
                ) : (
                  <ul className="space-y-4">
                    {[
                      { label: 'Global Rank', value: `#${leetcode.ranking}` },
                      { label: 'Acceptance Rate', value: `${leetcode.acceptanceRate}%` },
                      { label: 'Total Solved', value: leetcode.totalSolved },
                    ].map((item, i) => (
                      <li key={i} className="flex items-center justify-between border-b border-[#e8e8ed] pb-2">
                        <span className="text-sm text-[#86868b]">{item.label}</span>
                        <span className="font-bold text-[#1d1d1f]">{item.value}</span>
                      </li>
                    ))}
                    {leetcodeUsername && (
                      <li className="flex items-center justify-between border-b border-[#e8e8ed] pb-2">
                        <span className="text-sm text-[#86868b]">Username</span>
                        <span className="font-bold text-[#1d1d1f]">{leetcodeUsername}</span>
                      </li>
                    )}
                  </ul>
                )}
              </div >
            </StaggerItem>

            <StaggerItem>
              <div className="apple-card h-full p-8">
                <h4 className="mb-6 text-xl font-bold text-[#1d1d1f]">Solved Distribution</h4>
                {chartData ? (
                  <Bar data={chartData} options={chartOptions} />
                ) : (
                  <div className="flex h-40 items-center justify-center">
                    <p className="text-[#86868b]">Waiting for data...</p>
                  </div>
                )}
              </div>
            </StaggerItem>
          </div>

          <StaggerItem>
            <div className="mt-6 apple-card p-8">
              <h4 className="mb-6 text-xl font-bold text-[#1d1d1f]">Activity Calendar</h4>
              {contributionLoading ? (
                <div className="h-20 w-full animate-pulse rounded bg-gray-200"></div>
              ) : (
                <div className="overflow-x-auto">
                  <div className="flex min-w-[560px] flex-col">
                    <div className="grid grid-cols-20 gap-1.5">
                      {contributionDays.map((day) => (
                        <div
                          key={day.date}
                          className={`h-3 w-3 rounded-[2px] transition-colors duration-500 ${contributionTone(day.contributionCount, maxContributionCount)}`}
                          title={`${day.date}: ${day.contributionCount} contributions`}
                        />
                      ))}
                    </div>
                    {contributionError && <p className="mt-2 text-xs text-red-500">{contributionError}</p>}
                    <div className="mt-4 flex justify-end gap-2 text-[10px] font-medium text-[#86868b]">
                      <span>Less</span>
                      <div className="flex gap-1">
                        <div className="h-3 w-3 rounded-[2px] bg-gray-100"></div>
                        <div className="h-3 w-3 rounded-[2px] bg-[#99ccff]"></div>
                        <div className="h-3 w-3 rounded-[2px] bg-[#3399ff]"></div>
                        <div className="h-3 w-3 rounded-[2px] bg-[#0066cc]"></div>
                        <div className="h-3 w-3 rounded-[2px] bg-[#004499]"></div>
                      </div>
                      <span>More</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </StaggerItem>
        </StaggerContainer>
      </div>
    </section>
  );
}
