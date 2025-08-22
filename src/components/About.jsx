// React core imports for component logic and hooks
import React, { useEffect, useState } from 'react';

// Static profile image used in the "About" section
import profile from '../assets/profile.jpg';

// Custom hook that toggles visibility when the section scrolls into view
import useScrollReveal from '../hooks/useScrollReveal';

// Lightweight number animation for counters
import CountUp from 'react-countup';

// Simple tooltip library for hover hints on fun‑fact cards
import { Tooltip } from 'react-tooltip';

// HTTP client for fetching LeetCode stats
import axios from 'axios';

// React wrapper around Chart.js for rendering a bar chart
import { Bar } from 'react-chartjs-2';

// Core Chart.js objects and elements we plan to use (tree‑shaken)
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip as ChartTooltip,
  Legend,
} from 'chart.js';

// Register only the Chart.js plugins/elements we need to keep bundle small
ChartJS.register(BarElement, CategoryScale, LinearScale, ChartTooltip, Legend);

// Top‑level About component
export default function About() {
  // Hook returns a ref to attach to the section and a boolean "visible" for reveal animation
  const [ref, visible] = useScrollReveal();

  // LeetCode stats object once fetched; null while loading
  const [stats, setStats] = useState(null);

  // Track fetch failures to show a friendly error message
  const [error, setError] = useState(false);

  // Static fun‑fact cards shown as flip tiles with tooltips
  const funFacts = [
    { front: '👨‍💻', back: 'Optimized APIs to be 4x faster using async queues & caching.', tooltip: 'Backend wizardry!' },
    { front: '🌍', back: 'Spent 263+ hours perfecting this portfolio with Vite + Tailwind.', tooltip: 'Crafted with love!' },
    { front: '🎮', back: 'Gaming taught me real-time debugging and strategic thinking.', tooltip: 'Gamedev vibes!' },
    { front: '📚', back: 'Self-taught 10+ tools & frameworks via open-source contributions.', tooltip: 'Lifelong learner!' },
  ];

  // Fetch LeetCode stats on first render
  useEffect(() => {
    // Define async function inside effect (effects themselves can’t be async)
    async function fetchLeetCodeStats() {
      try {
        // Public API that returns user stats; username is PaNdA2069 (configurable)
        const res = await axios.get('https://leetcode-stats-api.herokuapp.com/PaNdA2069');
        // Store the response JSON on success
        setStats(res.data);
      } catch (err) {
        // Log error for debugging and flip error state to inform the UI
        console.error('LeetCode stats fetch failed:', err);
        setError(true);
      }
    }
    // Invoke the async fetcher
    fetchLeetCodeStats();
    // Empty dependency array → run only once on mount
  }, []);

  // Prepare chart dataset only when stats are available (short‑circuit with &&)
  const chartData = stats && {
    // X‑axis labels for difficulty buckets
    labels: ['Easy', 'Medium', 'Hard'],
    // Single dataset representing solved counts per difficulty
    datasets: [{
      label: 'Solved',
      data: [stats.easySolved, stats.mediumSolved, stats.hardSolved], // Y‑values
      backgroundColor: ['#4ade80', '#facc15', '#f87171'], // Tailwind palette greens/yellows/reds
      borderRadius: 6, // Rounded bars for a softer look
    }],
  };

  // Chart configuration: responsive layout and simple Y scale starting at zero
  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false } }, // Hide legend (label already clear)
    scales: { y: { beginAtZero: true, ticks: { stepSize: 10 } } }, // Tick every 10 units
  };

  // Render the section
  return (
    <section
      id="about"                 // Anchor for in‑page navigation
      ref={ref}                  // Connect to intersection observer from useScrollReveal
      className={`relative py-20 px-6 overflow-hidden bg-black text-white transition-all duration-700 ${
        // Fade/slide in based on visibility
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      {/* Constrain content width and manage layout across breakpoints */}
      <div className="relative z-10 max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
        {/* Left column: profile image */}
        <div className="w-full md:w-1/3">
          <img
            src={profile} // Local imported asset
            alt="Profile" // Accessibility alt text
            className="rounded-xl shadow-lg w-64 h-64 object-cover mx-auto border-4 border-blue-500 dark:border-white"
          />
        </div>

        {/* Right column: text, counters, fun facts, and LeetCode stats */}
        <div className="w-full md:w-2/3 text-center md:text-left">
          {/* Section heading */}
          <h3 className="text-3xl font-bold mb-4 text-blue-400">About Me</h3>

          {/* Intro paragraph with highlighted name/role */}
          <p className="text-lg text-gray-200 mb-4">
            Hey! I'm <span className="font-semibold text-blue-300">Anshul</span>, a passionate{' '}
            <span className="font-semibold text-blue-300">Full‑Stack Developer</span> building fast React & Node apps.
          </p>

          {/* Short mission/values statement */}
          <p className="text-md text-gray-300 mb-6">
            I focus on clean architecture, delightful UX, and solving real problems with thoughtful engineering.
          </p>

          {/* Animated KPI counters using CountUp */}
          <div className="flex flex-wrap justify-center md:justify-start gap-6 mt-8">
            <div className="text-center">
              {/* CountUp animates from 0 to 5 over 2s */}
              <p className="text-4xl font-bold text-blue-400"><CountUp end={5} duration={2} />+</p>
              <p className="text-sm text-gray-200">Projects Built</p>
            </div>
            <div className="text-center">
              {/* CountUp animates to 100 */}
              <p className="text-4xl font-bold text-blue-400"><CountUp end={100} duration={2} />+</p>
              <p className="text-sm text-gray-200">GitHub Commits</p>
            </div>
            <div className="text-center">
              {/* CountUp animates to 10 */}
              <p className="text-4xl font-bold text-blue-400"><CountUp end={10} duration={2} />+</p>
              <p className="text-sm text-gray-200">Technologies Mastered</p>
            </div>
          </div>

          {/* Flip‑card fun facts with tooltips */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            {funFacts.map((fact, i) => (
              <div
                key={i} // Stable key for list rendering
                className="group perspective" // "group" enables group‑hover; "perspective" for 3D effect
                data-tooltip-id={`tooltip-${i}`} // Connect card to its tooltip
                data-tooltip-content={fact.tooltip} // Tooltip text
              >
                {/* 3D flip container: rotates on hover via group-hover */}
                <div className="relative w-full h-40 transform-style-preserve-3d transition-transform duration-500 group-hover:rotate-y-180">
                  {/* Front face: emoji */}
                  <div className="absolute w-full h-full flex items-center justify-center text-5xl bg-white dark:bg-gray-800 text-blue-500 rounded-xl shadow border dark:border-gray-700 backface-hidden">
                    {fact.front}
                  </div>
                  {/* Back face: description text (rotated 180°) */}
                  <div className="absolute w-full h-full flex items-center justify-center bg-blue-600 text-white p-4 rounded-xl shadow transform rotate-y-180 backface-hidden">
                    <p className="text-sm">{fact.back}</p>
                  </div>
                </div>
                {/* Tooltip component instance for this tile */}
                <Tooltip id={`tooltip-${i}`} place="top" />
              </div>
            ))}
          </div>

          {/* LeetCode stats block: shows list + bar chart or error/loading states */}
          <div className="mt-14">
            <h3 className="text-2xl font-bold text-blue-400 mb-4">📊 LeetCode Stats</h3>

            {/* Error state if fetch failed */}
            {error ? (
              <p className="text-red-400">Failed to load stats.</p>
            ) : !stats ? (
              // Loading state while awaiting response
              <p className="text-gray-400">Loading stats...</p>
            ) : (
              // Success state: show numeric list + chart side by side on large screens
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                {/* Key stat figures (text list) */}
                <ul className="text-left space-y-2 text-gray-200 flex-1">
                  <li>Acceptance Rate: <span className="font-semibold">{stats.acceptanceRate}%</span></li>
                  <li>Global Rank: <span className="font-semibold">#{stats.ranking}</span></li>
                  <li>Total Solved: <span className="font-semibold">{stats.totalSolved}</span></li>
                  <li>Easy: <span className="text-green-400 font-semibold">{stats.easySolved}</span></li>
                  <li>Medium: <span className="text-yellow-400 font-semibold">{stats.mediumSolved}</span></li>
                  <li>Hard: <span className="text-red-400 font-semibold">{stats.hardSolved}</span></li>
                </ul>

                {/* Bar chart visualization of solved counts */}
                <div className="w-full lg:w-1/2">
                  {/* Bar expects defined data/options; guarded above with stats && chartData */}
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
