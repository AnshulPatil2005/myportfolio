import React, { useEffect, useState } from 'react';
import CountUp from 'react-countup';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip as ChartTooltip,
  Legend,
} from 'chart.js';
import profile from '../assets/profile.jpg';
import useScrollReveal from '../hooks/useScrollReveal';

ChartJS.register(BarElement, CategoryScale, LinearScale, ChartTooltip, Legend);

export default function About() {
  const [ref, visible] = useScrollReveal();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchLeetCodeStats() {
      try {
        const res = await axios.get('https://leetcode-stats.tashif.codes/Anshulpatil20');
        setStats(res.data);
      } catch (err) {
        console.error('LeetCode stats fetch failed:', err);
        setError(true);
      }
    }

    fetchLeetCodeStats();
  }, []);

  const chartData = stats && {
    labels: ['Easy', 'Medium', 'Hard'],
    datasets: [
      {
        label: 'Solved',
        data: [stats.easySolved, stats.mediumSolved, stats.hardSolved],
        backgroundColor: ['#4ade80', '#facc15', '#f87171'],
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, ticks: { stepSize: 10 } } },
  };

  return (
    <section
      id="about"
      ref={ref}
      className={`relative overflow-hidden px-4 py-16 text-white transition-all duration-700 sm:px-6 sm:py-20 ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
      style={{ minHeight: '100vh' }}
    >
      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center gap-10 md:flex-row md:gap-12">
        <div className="w-full md:w-1/3">
          <img
            src={profile}
            alt="Profile"
            className="mx-auto h-40 w-40 rounded-xl border-2 border-blue-500 object-cover shadow-lg sm:h-56 sm:w-56 md:h-64 md:w-64"
          />
        </div>

        <div className="w-full text-center md:w-2/3 md:text-left">
          <h3 className="mb-4 text-2xl font-bold text-white sm:text-3xl">About</h3>

          <p className="mb-4 text-base text-gray-200 sm:text-lg">
            I am a full-stack developer focused on building maintainable systems and production-ready applications.
          </p>

          <p className="mb-6 text-sm text-gray-300 sm:text-base">
            My work centers on clean architecture, practical user experience, and measurable performance improvements.
          </p>

          <div className="mt-8 grid grid-cols-1 justify-items-center gap-4 sm:grid-cols-3 sm:gap-6 md:justify-items-start">
            <div className="text-center">
              <p className="text-3xl font-bold text-white sm:text-4xl">
                <CountUp end={8} duration={2} />+
              </p>
              <p className="text-xs text-gray-300 sm:text-sm">Projects Delivered</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-sky-300 sm:text-4xl">
                <CountUp end={200} duration={2} />+
              </p>
              <p className="text-xs text-gray-300 sm:text-sm">GitHub Contributions</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white sm:text-4xl">
                <CountUp end={20} duration={2} />+
              </p>
              <p className="text-xs text-gray-300 sm:text-sm">Technologies Used</p>
            </div>
          </div>

          <div className="mt-10 rounded-xl border border-slate-700/70 bg-slate-900/70 p-5 sm:p-6">
            <h4 className="mb-3 text-lg font-semibold text-white sm:text-xl">Core Focus Areas</h4>
            <ul className="space-y-2 text-sm text-gray-200 sm:text-base">
              <li>Backend API design and optimization for high-throughput applications.</li>
              <li>Frontend engineering with React for responsive, accessible interfaces.</li>
              <li>Cloud-native deployment workflows and observability-driven improvements.</li>
            </ul>
          </div>

          <div className="mt-10 sm:mt-14">
            <h3 className="mb-3 text-xl font-bold text-white sm:mb-4 sm:text-2xl">LeetCode Stats</h3>

            {error ? (
              <p className="text-red-400">Failed to load stats.</p>
            ) : !stats ? (
              <p className="text-gray-400">Loading stats...</p>
            ) : (
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
                <ul className="flex-1 space-y-2 text-left text-sm text-gray-200 sm:text-base">
                  <li>Acceptance Rate: <span className="font-semibold">{stats.acceptanceRate}%</span></li>
                  <li>Global Rank: <span className="font-semibold">#{stats.ranking}</span></li>
                  <li>Total Solved: <span className="font-semibold">{stats.totalSolved}</span></li>
                  <li>Easy: <span className="font-semibold text-green-400">{stats.easySolved}</span></li>
                  <li>Medium: <span className="font-semibold text-yellow-400">{stats.mediumSolved}</span></li>
                  <li>Hard: <span className="font-semibold text-red-400">{stats.hardSolved}</span></li>
                </ul>

                <div className="mx-auto w-full max-w-md lg:mx-0 lg:w-1/2">
                  <Bar data={chartData} options={chartOptions} />
                </div>
              </div>
            )}
          </div>

          <div className="mt-10 sm:mt-14">
            <h3 className="mb-3 text-xl font-bold text-white sm:mb-4 sm:text-2xl">GitHub Stats</h3>
            <div className="flex justify-center md:justify-start">
              <img
                src="https://github-readme-stats.vercel.app/api?username=AnshulPatil2005&show_icons=true&theme=dark&bg_color=000000&title_color=60a5fa&text_color=ffffff&icon_color=60a5fa&border_color=3b82f6"
                alt="GitHub Stats"
                className="w-full max-w-sm rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
