import React, { useEffect, useState } from 'react';
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

ChartJS.register(BarElement, CategoryScale, LinearScale, ChartTooltip, Legend);

export default function About() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchLeetCodeStats() {
      try {
        const response = await axios.get('https://leetcode-stats.tashif.codes/Anshulpatil20');
        setStats(response.data);
      } catch (err) {
        console.error('LeetCode stats fetch failed:', err);
        setError(true);
      }
    }

    fetchLeetCodeStats();
  }, []);

  const chartData = stats
    ? {
        labels: ['Easy', 'Medium', 'Hard'],
        datasets: [
          {
            label: 'Solved',
            data: [stats.easySolved, stats.mediumSolved, stats.hardSolved],
            backgroundColor: ['#16a34a', '#ca8a04', '#dc2626'],
          },
        ],
      }
    : null;

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: {
        ticks: { color: '#cbd5e1' },
        grid: { color: 'rgba(148, 163, 184, 0.15)' },
      },
      y: {
        beginAtZero: true,
        ticks: { color: '#cbd5e1' },
        grid: { color: 'rgba(148, 163, 184, 0.15)' },
      },
    },
  };

  return (
    <section id="about" className="mb-10 rounded-lg border border-slate-700 bg-slate-900/85 shadow-xl shadow-black/25 backdrop-blur-sm px-6 py-10 sm:px-8">
      <h3 className="section-title mb-8 text-2xl font-semibold">About</h3>

      <div className="grid gap-8 md:grid-cols-[220px_1fr] md:items-start">
        <img
          src={profile}
          alt="Anshul Patil"
          className="mx-auto h-52 w-52 rounded border border-slate-700 object-cover"
        />

        <div>
          <p className="mb-4 text-slate-300">
            I am a full-stack developer focused on production-ready products, dependable
            APIs, and straightforward user experiences.
          </p>
          <p className="mb-6 text-slate-300">
            My approach emphasizes code quality, clear requirements, and practical
            engineering outcomes that scale in real environments.
          </p>

          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded border border-slate-800 bg-slate-950 p-4 text-center">
              <p className="text-2xl font-semibold text-slate-100">8+</p>
              <p className="text-sm text-slate-400">Projects Delivered</p>
            </div>
            <div className="rounded border border-slate-800 bg-slate-950 p-4 text-center">
              <p className="text-2xl font-semibold text-slate-100">200+</p>
              <p className="text-sm text-slate-400">GitHub Contributions</p>
            </div>
            <div className="rounded border border-slate-800 bg-slate-950 p-4 text-center">
              <p className="text-2xl font-semibold text-slate-100">20+</p>
              <p className="text-sm text-slate-400">Technologies Used</p>
            </div>
          </div>

          <div className="mb-8 rounded border border-slate-800 bg-slate-950/90 p-5 shadow-lg shadow-black/20">
            <h4 className="mb-3 text-lg font-semibold text-slate-100">Core Focus Areas</h4>
            <ul className="list-disc space-y-2 pl-5 text-slate-300">
              <li>Backend API design and optimization for scalable systems.</li>
              <li>Frontend engineering with React for accessible interfaces.</li>
              <li>Cloud deployment and observability for reliable operations.</li>
            </ul>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded border border-slate-800 bg-slate-950/90 p-5 shadow-lg shadow-black/20">
              <h4 className="mb-3 text-lg font-semibold text-slate-100">LeetCode Stats</h4>
              {error ? (
                <p className="text-sm text-red-700">Unable to load LeetCode stats.</p>
              ) : !stats ? (
                <p className="text-sm text-slate-400">Loading stats...</p>
              ) : (
                <ul className="space-y-1 text-sm text-slate-300">
                  <li>Acceptance Rate: <span className="font-semibold">{stats.acceptanceRate}%</span></li>
                  <li>Global Rank: <span className="font-semibold">#{stats.ranking}</span></li>
                  <li>Total Solved: <span className="font-semibold">{stats.totalSolved}</span></li>
                </ul>
              )}
            </div>

            <div className="rounded border border-slate-800 bg-slate-950/90 p-5 shadow-lg shadow-black/20">
              <h4 className="mb-3 text-lg font-semibold text-slate-100">Solved Distribution</h4>
              {chartData ? <Bar data={chartData} options={chartOptions} /> : <p className="text-sm text-slate-400">Waiting for data...</p>}
            </div>
          </div>

          <div className="mt-6 rounded border border-slate-800 bg-slate-950/90 p-5 shadow-lg shadow-black/20">
            <h4 className="mb-3 text-lg font-semibold text-slate-100">GitHub Summary</h4>
            <img
              src="https://github-readme-stats.vercel.app/api?username=AnshulPatil2005&show_icons=true&theme=transparent&bg_color=00000000&title_color=e2e8f0&text_color=cbd5e1&icon_color=93c5fd&border_color=334155"
              alt="GitHub stats"
              className="w-full max-w-md"
            />
          </div>
        </div>
      </div>
    </section>
  );
}


