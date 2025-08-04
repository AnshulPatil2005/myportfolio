import React, { useEffect, useState } from 'react';
import profile from '../assets/profile.jpg';
import useScrollReveal from '../hooks/useScrollReveal';
import CountUp from 'react-countup';
import { Tooltip } from 'react-tooltip';
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

ChartJS.register(BarElement, CategoryScale, LinearScale, ChartTooltip, Legend);

export default function About() {
  const [ref, visible] = useScrollReveal();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(false);

  const funFacts = [
    { front: '👨‍💻', back: 'Optimized APIs to be 4x faster using async queues & caching.', tooltip: 'Backend wizardry!' },
    { front: '🌍', back: 'Spent 263+ hours perfecting this portfolio with Vite + Tailwind.', tooltip: 'Crafted with love!' },
    { front: '🎮', back: 'Gaming taught me real-time debugging and strategic thinking.', tooltip: 'Gamedev vibes!' },
    { front: '📚', back: 'Self-taught 10+ tools & frameworks via open-source contributions.', tooltip: 'Lifelong learner!' },
  ];

  useEffect(() => {
    async function fetchLeetCodeStats() {
      try {
        const res = await axios.get('https://leetcode-stats-api.herokuapp.com/PaNdA2069');
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
    datasets: [{
      label: 'Solved',
      data: [stats.easySolved, stats.mediumSolved, stats.hardSolved],
      backgroundColor: ['#4ade80', '#facc15', '#f87171'],
      borderRadius: 6,
    }],
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
      className={`relative py-20 px-6 overflow-hidden bg-black text-white transition-all duration-700 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="relative z-10 max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
        <div className="w-full md:w-1/3">
          <img
            src={profile}
            alt="Profile"
            className="rounded-xl shadow-lg w-64 h-64 object-cover mx-auto border-4 border-blue-500 dark:border-white"
          />
        </div>

        <div className="w-full md:w-2/3 text-center md:text-left">
          <h3 className="text-3xl font-bold mb-4 text-blue-400">About Me</h3>
          <p className="text-lg text-gray-200 mb-4">
            Hey! I'm <span className="font-semibold text-blue-300">Anshul</span>, a passionate{' '}
            <span className="font-semibold text-blue-300">Full‑Stack Developer</span> building fast React & Node apps.
          </p>
          <p className="text-md text-gray-300 mb-6">
            I focus on clean architecture, delightful UX, and solving real problems with thoughtful engineering.
          </p>

          <div className="flex flex-wrap justify-center md:justify-start gap-6 mt-8">
            <div className="text-center">
              <p className="text-4xl font-bold text-blue-400"><CountUp end={5} duration={2} />+</p>
              <p className="text-sm text-gray-200">Projects Built</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-blue-400"><CountUp end={100} duration={2} />+</p>
              <p className="text-sm text-gray-200">GitHub Commits</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-blue-400"><CountUp end={10} duration={2} />+</p>
              <p className="text-sm text-gray-200">Technologies Mastered</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            {funFacts.map((fact, i) => (
              <div
                key={i}
                className="group perspective"
                data-tooltip-id={`tooltip-${i}`}
                data-tooltip-content={fact.tooltip}
              >
                <div className="relative w-full h-40 transform-style-preserve-3d transition-transform duration-500 group-hover:rotate-y-180">
                  <div className="absolute w-full h-full flex items-center justify-center text-5xl bg-white dark:bg-gray-800 text-blue-500 rounded-xl shadow border dark:border-gray-700 backface-hidden">
                    {fact.front}
                  </div>
                  <div className="absolute w-full h-full flex items-center justify-center bg-blue-600 text-white p-4 rounded-xl shadow transform rotate-y-180 backface-hidden">
                    <p className="text-sm">{fact.back}</p>
                  </div>
                </div>
                <Tooltip id={`tooltip-${i}`} place="top" />
              </div>
            ))}
          </div>

<div className="mt-14">
  <h3 className="text-2xl font-bold text-blue-400 mb-4">📊 LeetCode Stats</h3>
  {error ? (
    <p className="text-red-400">Failed to load stats.</p>
  ) : !stats ? (
    <p className="text-gray-400">Loading stats...</p>
  ) : (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
      <ul className="text-left space-y-2 text-gray-200 flex-1">
        <li>Acceptance Rate: <span className="font-semibold">{stats.acceptanceRate}%</span></li>
        <li>Global Rank: <span className="font-semibold">#{stats.ranking}</span></li>
        <li>Total Solved: <span className="font-semibold">{stats.totalSolved}</span></li>
        <li>Easy: <span className="text-green-400 font-semibold">{stats.easySolved}</span></li>
        <li>Medium: <span className="text-yellow-400 font-semibold">{stats.mediumSolved}</span></li>
        <li>Hard: <span className="text-red-400 font-semibold">{stats.hardSolved}</span></li>
      </ul>

      <div className="w-full lg:w-1/2">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  )}
</div>

        </div>
      </div>
    </section>
  );
}
