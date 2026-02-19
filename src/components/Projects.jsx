import React, { useEffect, useRef, useState } from 'react';
// Custom hook to animate reveal when scrolled into view
import useScrollReveal from '../hooks/useScrollReveal';
// External link icon
import { FiExternalLink } from 'react-icons/fi';

// List of projects with metadata
const projects = [
  {
    title: 'AI PR Reviewer Bot',
    desc: 'An agentic AI-powered PR review tool with risk analysis and suggestions.',
    category: 'AI',
    tech: ['FastAPI', 'React', 'GitHub API', 'LLM'],
    link: 'https://github.com/AnshulPatil2005/AI-PR-Reviewer',
    metrics: ['Reduced code review time by 40%', 'Analyzed 500+ PRs', '95% accuracy in risk detection'],
    details:
      'This tool automatically analyzes GitHub Pull Requests using LLM agents, providing risk assessment and improvement suggestions. It features a React frontend, FastAPI backend, and connects to GitHub via the REST API. It demonstrates practical use of agentic AI, security handling, and project deployment.',
  },
  {
    title: 'Titan-Guidance',
    desc: 'Automated document analysis platform for contracts and legal documents.',
    category: 'AI',
    tech: ['FastAPI', 'Celery', 'Qdrant', 'Redis', 'Ollama', 'Docker'],
    link: 'https://github.com/AnshulPatil2005/Titan-Guidance',
    metrics: ['Processes 100+ page documents in under 2 minutes', 'Extracts 20+ clause types', '85% reduction in manual review time'],
    details:
      'An automated document analysis platform that uses LLM-powered extraction, rule validation, and guidance for contracts and legal documents. Features include OCR, table extraction, embeddings, clause extraction, deadlines, rule validation, and summarization. Built with FastAPI, Celery for async processing, Qdrant for vector storage, Redis for task queuing, and Ollama for LLM inference. Fully containerized with Docker Compose for easy deployment.',
  },
  {
    title: 'E-commerce Shopping Website',
    desc: 'Built with the MERN stack, supports authentication, cart, and payments.',
    category: 'Web',
    tech: ['MongoDB', 'Express', 'React', 'Node'],
    link: 'https://github.com/AnshulPatil2005/shoppingmernproject',
    metrics: ['Handles 1000+ concurrent users', 'Sub-200ms API response time', 'Secure payment integration'],
    details:
      'This full-featured e-commerce platform supports product listings, user registration, payment integration, cart management, and admin dashboard. Backend uses Express and MongoDB, frontend uses React with Tailwind.',
  },
  {
    title: 'Cat vs Dog Classifier',
    desc: 'Trained a CNN to distinguish between cat and dog images.',
    category: 'AI',
    tech: ['Python', 'TensorFlow', 'CNN'],
    link: '#',
    metrics: ['92% accuracy on test set', 'Trained on 25,000+ images', 'Inference time under 50ms'],
    details:
      'Used a custom-built Convolutional Neural Network trained on a Kaggle dataset of cat and dog images, achieving over 90% accuracy. Data augmentation, dropout, and softmax were used to optimize model performance.',
  },
  {
    title: 'Snake Game in Terminal',
    desc: 'Classic snake game using C++ and terminal rendering.',
    category: 'Game',
    tech: ['C++', 'OOP', 'Console'],
    link: 'https://github.com/AnshulPatil2005/snake-game-in-terminal',
    metrics: ['60 FPS smooth rendering', 'Zero memory leaks', 'Cross-platform compatible'],
    details:
      'Written in C++ using object-oriented principles, this project mimics the classic Snake game playable directly in the terminal. It uses ncurses for rendering and keyboard inputs for snake control.',
  },
  {
    title: 'Trading Bot (Telegram + Zerodha)',
    desc: 'Automates trade execution based on Telegram signal input.',
    category: 'Automation',
    tech: ['Python', 'Zerodha', 'Telegram'],
    link: 'https://github.com/AnshulPatil2005/trading-bot',
    metrics: ['Sub-second order execution', 'Handles 500+ signals per day', '99.9% uptime'],
    details:
      'This bot connects to Zerodha using KiteConnect and listens to trading signals via Telegram bot token. Supports live price polling, automated order placement, and P&L notifications.',
  },
  {
    title: 'AI Storytelling Game',
    desc: 'A GPT-powered storytelling game with dynamic branching.',
    category: 'AI',
    tech: ['React', 'OpenAI', 'Tailwind'],
    link: '#',
    metrics: ['Generated 10,000+ unique storylines', 'Average session time 15 minutes', 'Real-time response under 2 seconds'],
    details:
      'An interactive narrative game where users drive the plot by entering prompts. Powered by GPT-4, the game generates story branches in real-time, creating an immersive and unpredictable experience.',
  },
  {
    title: 'Portfolio Website',
    desc: 'A beautiful developer portfolio built with React and Tailwind CSS.',
    category: 'Web',
    tech: ['React', 'Tailwind CSS', 'Vite', 'Framer Motion'],
    link: 'https://github.com/AnshulPatil2005/myportfolio',
    metrics: ['100% Lighthouse score', 'Sub-1 second load time', 'Fully responsive design'],
    details:
      'This portfolio showcases my skills, experience, and projects using a modern UI built with React and Tailwind CSS. Features include scroll animations, modals, dark/light mode, and a responsive design powered by Vite.',
  },
];

export default function Projects() {
  // Hook for scroll animation
  const [ref, visible] = useScrollReveal();

  // Array of refs, one per project card (for tilt effect)
  const cardsRef = useRef([]);

  // Currently opened modal project
  const [activeProject, setActiveProject] = useState(null);

  // Filter state for project categories
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Get unique categories
  const categories = ['All', ...new Set(projects.map(p => p.category))];

  // Filter projects based on selected category
  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter(p => p.category === selectedCategory);

  useEffect(() => {
    // Add tilt / 3D hover effect for each card
    cardsRef.current.forEach((card) => {
      if (!card) return; // Skip if null (not rendered yet)

      let frame; // Track animation frame for smoothness

      // Mouse move handler: calculate rotation based on cursor position
      const handleMove = (e) => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const rotateX = -(y - rect.height / 2) / 12;
          const rotateY = (x - rect.width / 2) / 12;
          card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });
      };

      // Reset card to default when mouse leaves
      const handleLeave = () => {
        cancelAnimationFrame(frame);
        card.style.transition = 'transform 0.4s ease';
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
        setTimeout(() => (card.style.transition = ''), 400);
      };

      // Attach listeners
      card.addEventListener('mousemove', handleMove);
      card.addEventListener('mouseleave', handleLeave);
    });
  }, []);

  return (
    <section
      id="projects"
      ref={ref}
      className={`py-20 px-6 text-center transition-all duration-700 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      {/* Section heading */}
      <h3 className="section-title mb-6 text-3xl font-bold text-white">Projects</h3>

      {/* Category filters */}
      <div className="mb-10 flex flex-wrap justify-center gap-3">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-all duration-300 ${
              selectedCategory === category
                ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]'
                : 'border border-slate-600 bg-slate-800/60 text-slate-300 hover:border-blue-500/50 hover:text-white'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Project grid */}
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2">
        {filteredProjects.map((project, idx) => (
          <div
            key={idx}
            ref={(el) => (cardsRef.current[idx] = el)}
            className="flex cursor-pointer flex-col rounded-2xl border border-slate-700/50 bg-slate-800/50 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 ease-out hover:border-blue-500/40 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] transform-gpu"
            style={{
              transformStyle: 'preserve-3d',
              transformOrigin: 'center center',
              willChange: 'transform',
            }}
          >
            {/* Title + short description */}
            <div className="flex flex-col gap-3">
              <h4 className="text-xl font-semibold text-blue-400">
                {project.title}
              </h4>
              <p className="text-sm leading-relaxed text-gray-300">{project.desc}</p>

              {/* Action links */}
              <div className="mt-3 flex justify-center gap-5">
                <a
                  href={project.link}
                  className="flex items-center gap-1.5 text-sm font-medium text-blue-400 transition-colors hover:text-blue-300"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Project <FiExternalLink size={14} />
                </a>
                <button
                  onClick={() => setActiveProject(project)}
                  className="text-sm text-slate-400 underline underline-offset-2 transition-colors hover:text-blue-400"
                >
                  Learn More
                </button>
              </div>
            </div>

            {/* Tech tags */}
            <div className="mt-auto flex flex-wrap justify-center gap-2 pt-6">
              {project.tech.map((tag, i) => (
                <span
                  key={i}
                  className="rounded-full border border-slate-600/60 bg-slate-700/60 px-3 py-1 text-xs text-slate-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modal for active project */}
      {activeProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-700/60 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-sm">
            {/* Close button */}
            <button
              onClick={() => setActiveProject(null)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-700/60 text-slate-300 transition-colors hover:bg-red-500/80 hover:text-white"
            >
              ✕
            </button>

            {/* Title */}
            <h2 className="mb-3 pr-8 text-2xl font-bold text-blue-400">
              {activeProject.title}
            </h2>

            {/* Category badge */}
            <span className="mb-4 inline-block rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-300">
              {activeProject.category}
            </span>

            {/* Detailed description */}
            <p className="mb-6 text-sm leading-relaxed text-gray-300">
              {activeProject.details}
            </p>

            {/* Metrics Section */}
            <div className="mb-6">
              <h3 className="mb-3 text-base font-semibold text-white">Key Metrics</h3>
              <ul className="space-y-2">
                {activeProject.metrics.map((metric, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="mt-1 text-blue-400">▸</span>
                    <span>{metric}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tech Stack Section */}
            <div className="mb-6">
              <h3 className="mb-3 text-base font-semibold text-white">Tech Stack</h3>
              <div className="flex flex-wrap gap-2">
                {activeProject.tech.map((tech, i) => (
                  <span
                    key={i}
                    className="rounded-md border border-slate-600 bg-slate-800 px-3 py-1 text-sm text-slate-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* View Project Link */}
            <a
              href={activeProject.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-500"
            >
              View Project <FiExternalLink size={14} />
            </a>
          </div>
        </div>
      )}
    </section>
  );
}
