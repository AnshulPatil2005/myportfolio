// React core imports for component logic and hooks
import React, { useEffect, useRef, useState } from 'react';

// Static profile image used in the "About" section
import profile from '../assets/profile.jpg';

// Custom hook that toggles visibility when the section scrolls into view
import useScrollReveal from '../hooks/useScrollReveal';

// Lightweight number animation for counters
import CountUp from 'react-countup';

// Simple tooltip library for hover hints on fun‑fact cards
import { Tooltip } from 'react-tooltip';

// Anime.js for timeline-based DOM animations
import { animate, createTimeline, stagger } from 'animejs';

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

  // Track if entrance animations already ran
  const hasAnimated = useRef(false);

  // Prevent duplicate timelines during re-renders
  const isAnimating = useRef(false);

  // Store a long-running animation instance to avoid duplicates
  const floatAnimation = useRef(null);

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
    // Define async function inside effect (effects themselves can't be async)
    async function fetchLeetCodeStats() {
      try {
        // Public API that returns user stats; username is Anshulpatil20 (configurable)
        const res = await axios.get('https://leetcode-stats.tashif.codes/Anshulpatil20');
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

  // Entry animations when the section first becomes visible
  useEffect(() => {
    if (!visible || !ref.current || hasAnimated.current || isAnimating.current) return;

    const root = ref.current;
    const selectAll = (selector) => root.querySelectorAll(selector);

    isAnimating.current = true;

    const timeline = createTimeline({
      defaults: {
        duration: 900,
        ease: 'outExpo',
      },
      onComplete: () => {
        hasAnimated.current = true;
        isAnimating.current = false;
      },
    });

    timeline
      .add(selectAll('[data-animate="profile"]'), {
        opacity: [0, 1],
        translateY: [20, 0],
        scale: [0.95, 1],
        duration: 900,
      })
      .add(selectAll('[data-animate="title"]'), {
        opacity: [0, 1],
        translateY: [14, 0],
        duration: 700,
      }, '-=500')
      .add(selectAll('[data-animate="text"]'), {
        opacity: [0, 1],
        translateY: [12, 0],
        delay: stagger(120),
        duration: 650,
      }, '-=450')
      .add(selectAll('[data-animate="counter"]'), {
        opacity: [0, 1],
        translateY: [10, 0],
        scale: [0.96, 1],
        delay: stagger(120),
        duration: 600,
      }, '-=500')
      .add(selectAll('[data-animate="fact"]'), {
        opacity: [0, 1],
        translateY: [16, 0],
        delay: stagger(90),
        duration: 650,
      }, '-=450')
      .add(selectAll('[data-animate="stats"]'), {
        opacity: [0, 1],
        translateY: [16, 0],
        duration: 650,
      }, '-=450')
      .add(selectAll('[data-animate="github"]'), {
        opacity: [0, 1],
        translateY: [16, 0],
        duration: 650,
      }, '-=500');

    return () => {
      timeline.pause();
      isAnimating.current = false;
    };
  }, [visible, ref]);

  // Animate stats list and chart once data is available
  useEffect(() => {
    if (!visible || !stats || !ref.current) return;

    const root = ref.current;

    animate(root.querySelectorAll('[data-animate="stats-item"]'), {
      opacity: [0, 1],
      translateX: [-8, 0],
      delay: stagger(80),
      ease: 'outQuad',
      duration: 500,
    });

    animate(root.querySelectorAll('[data-animate="chart"]'), {
      opacity: [0, 1],
      scale: [0.96, 1],
      duration: 700,
      ease: 'outExpo',
    });
  }, [visible, stats, ref]);

  // Subtle floating animation on the profile image
  useEffect(() => {
    if (!visible || !ref.current || floatAnimation.current) return;

    const target = ref.current.querySelector('[data-animate="profile"]');
    if (!target) return;

    floatAnimation.current = animate(target, {
      translateY: [0, -8],
      alternate: true,
      ease: 'inOutSine',
      duration: 2500,
      delay: 2000,
      loop: true,
    });

    return () => {
      if (floatAnimation.current) {
        floatAnimation.current.pause();
        floatAnimation.current = null;
      }
    };
  }, [visible, ref]);

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
      className={`relative py-16 sm:py-20 px-4 sm:px-6 overflow-hidden text-white transition-all duration-700 ${
        // Fade/slide in based on visibility
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ minHeight: '100vh' }}
    >
      {/* Constrain content width and manage layout across breakpoints */}
      <div className="relative z-10 max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-12">
        {/* Left column: profile image */}
        <div className="w-full md:w-1/3">
          <img
            src={profile} // Local imported asset
            alt="Profile" // Accessibility alt text
            data-animate="profile"
            className="rounded-xl shadow-lg w-40 h-40 sm:w-56 sm:h-56 md:w-64 md:h-64 object-cover mx-auto border-2 sm:border-4 border-blue-500 dark:border-white"
          />
        </div>

        {/* Right column: text, counters, fun facts, and LeetCode stats */}
        <div className="w-full md:w-2/3 text-center md:text-left">
          {/* Section heading */}
          <h3 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4" data-animate="title" style={{ color: '#FFFFFF' }}>About Me</h3>

          {/* Intro paragraph with highlighted name/role */}
          <p className="text-base sm:text-lg mb-3 sm:mb-4" data-animate="text" style={{ color: '#F0F0F0' }}>
            Hey! I'm <span className="font-semibold" style={{ color: '#87CEEB' }}>Anshul</span>, a passionate{' '}
            <span className="font-semibold" style={{ color: '#87CEEB' }}>Full‑Stack Developer</span> building fast React & Node apps.
          </p>

          {/* Short mission/values statement */}
          <p className="text-sm sm:text-base mb-5 sm:mb-6" data-animate="text" style={{ color: '#F0F0F0' }}>
            I focus on clean architecture, delightful UX, and solving real problems with thoughtful engineering.
          </p>

          {/* Animated KPI counters using CountUp */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8 justify-items-center md:justify-items-start">
            <div className="text-center" data-animate="counter">
              {/* CountUp animates from 0 to 5 over 2s */}
              <p className="text-3xl sm:text-4xl font-bold" style={{ color: '#FFFFFF' }}><CountUp end={5} duration={2} />+</p>
              <p className="text-xs sm:text-sm" style={{ color: '#F0F0F0' }}>Projects Built</p>
            </div>
            <div className="text-center" data-animate="counter">
              {/* CountUp animates to 100 */}
              <p className="text-3xl sm:text-4xl font-bold" style={{ color: '#87CEEB' }}><CountUp end={100} duration={2} />+</p>
              <p className="text-xs sm:text-sm" style={{ color: '#F0F0F0' }}>GitHub Commits</p>
            </div>
            <div className="text-center" data-animate="counter">
              {/* CountUp animates to 10 */}
              <p className="text-3xl sm:text-4xl font-bold" style={{ color: '#FFFFFF' }}><CountUp end={10} duration={2} />+</p>
              <p className="text-xs sm:text-sm" style={{ color: '#F0F0F0' }}>Technologies Mastered</p>
            </div>
          </div>

          {/* Flip‑card fun facts with tooltips */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-8 sm:mt-10">
            {funFacts.map((fact, i) => (
              <div
                key={i} // Stable key for list rendering
                className="group perspective" // "group" enables group‑hover; "perspective" for 3D effect
                data-animate="fact"
                data-tooltip-id={`tooltip-${i}`} // Connect card to its tooltip
                data-tooltip-content={fact.tooltip} // Tooltip text
              >
                {/* 3D flip container: rotates on hover via group-hover */}
                <div className="relative w-full h-32 sm:h-40 transform-style-preserve-3d transition-transform duration-500 group-hover:rotate-y-180">
                  {/* Front face: emoji */}
                  <div className="absolute w-full h-full flex items-center justify-center text-4xl sm:text-5xl rounded-xl shadow border backface-hidden" style={{ backgroundColor: '#1a1a2e', color: '#87CEEB', borderColor: 'rgba(135, 206, 235, 0.4)' }}>
                    {fact.front}
                  </div>
                  {/* Back face: description text (rotated 180°) */}
                  <div className="absolute w-full h-full flex items-center justify-center p-4 rounded-xl shadow transform rotate-y-180 backface-hidden" style={{ background: 'linear-gradient(135deg, #87CEEB, #4682B4)', color: '#FFFFFF' }}>
                    <p className="text-xs sm:text-sm">{fact.back}</p>
                  </div>
                </div>
                {/* Tooltip component instance for this tile */}
                <Tooltip id={`tooltip-${i}`} place="top" />
              </div>
            ))}
          </div>

          {/* LeetCode stats block: shows list + bar chart or error/loading states */}
          <div className="mt-10 sm:mt-14" data-animate="stats">
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4" style={{ color: '#FFFFFF' }}>LeetCode Stats</h3>

            {/* Error state if fetch failed */}
            {error ? (
              <p className="text-red-400">Failed to load stats.</p>
            ) : !stats ? (
              // Loading state while awaiting response
              <p className="text-gray-400">Loading stats...</p>
            ) : (
              // Success state: show numeric list + chart side by side on large screens
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 lg:gap-8">
                {/* Key stat figures (text list) */}
                <ul className="text-left space-y-2 text-gray-200 flex-1 text-sm sm:text-base">
                  <li data-animate="stats-item">Acceptance Rate: <span className="font-semibold">{stats.acceptanceRate}%</span></li>
                  <li data-animate="stats-item">Global Rank: <span className="font-semibold">#{stats.ranking}</span></li>
                  <li data-animate="stats-item">Total Solved: <span className="font-semibold">{stats.totalSolved}</span></li>
                  <li data-animate="stats-item">Easy: <span className="text-green-400 font-semibold">{stats.easySolved}</span></li>
                  <li data-animate="stats-item">Medium: <span className="text-yellow-400 font-semibold">{stats.mediumSolved}</span></li>
                  <li data-animate="stats-item">Hard: <span className="text-red-400 font-semibold">{stats.hardSolved}</span></li>
                </ul>

                {/* Bar chart visualization of solved counts */}
                <div className="w-full lg:w-1/2 max-w-md mx-auto lg:mx-0" data-animate="chart">
                  {/* Bar expects defined data/options; guarded above with stats && chartData */}
                  <Bar data={chartData} options={chartOptions} />
                </div>
              </div>
            )}
          </div>

          {/* GitHub Stats Card */}
          <div className="mt-10 sm:mt-14" data-animate="github">
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4" style={{ color: '#FFFFFF' }}>GitHub Stats</h3>
            <div className="flex justify-center md:justify-start">
              <img
                src="https://github-readme-stats.vercel.app/api?username=AnshulPatil2005&show_icons=true&theme=dark&bg_color=000000&title_color=60a5fa&text_color=ffffff&icon_color=60a5fa&border_color=3b82f6"
                alt="GitHub Stats"
                className="rounded-xl shadow-lg w-full max-w-sm"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
