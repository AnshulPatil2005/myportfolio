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
      <h3 className="text-3xl font-bold mb-6 text-blue-600 dark:text-blue-400">Projects</h3>

      {/* Category filters */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
              selectedCategory === category
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Project grid */}
      <div className="grid gap-10 md:grid-cols-2 max-w-6xl mx-auto">
        {filteredProjects.map((project, idx) => (
          <div
            key={idx}
            ref={(el) => (cardsRef.current[idx] = el)} // Assign card DOM element
            className="bg-white dark:bg-gray-800 border dark:border-gray-700 p-6 rounded-2xl shadow-lg transform-gpu cursor-pointer hover:shadow-2xl hover:shadow-blue-500/30 transition-transform duration-300 ease-out flex flex-col"
            style={{
              transformStyle: 'preserve-3d', // Enable 3D transforms
              transformOrigin: 'center center',
              willChange: 'transform', // Hint for browser optimization
            }}
          >
            {/* Title + short description */}
            <div className="flex flex-col gap-3">
              <h4 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
                {project.title}
              </h4>
              <p className="text-gray-700 dark:text-gray-300">{project.desc}</p>

              {/* Action links */}
              <div className="flex justify-center gap-4 mt-4">
                {/* External link to GitHub or demo */}
                <a
                  href={project.link}
                  className="flex items-center gap-1 text-blue-500 dark:text-blue-300 font-medium hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Project <FiExternalLink />
                </a>
                {/* Learn More opens modal */}
                <button
                  onClick={() => setActiveProject(project)}
                  className="text-gray-600 dark:text-gray-300 underline hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Learn More
                </button>
              </div>
            </div>

            {/* Tech tags */}
            <div className="flex flex-wrap justify-center gap-2 mt-auto pt-6">
              {project.tech.map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-700 text-sm text-blue-700 dark:text-white rounded-full"
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
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center animate-fadeIn p-4">
          <div className="bg-white dark:bg-gray-900 p-8 rounded-lg max-w-2xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
            {/* Close button */}
            <button
              onClick={() => setActiveProject(null)}
              className="absolute top-3 right-4 text-gray-500 hover:text-red-500 text-2xl"
            >
              X
            </button>

            {/* Title */}
            <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4 pr-8">
              {activeProject.title}
            </h2>

            {/* Category badge */}
            <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-4">
              {activeProject.category}
            </span>

            {/* Detailed description */}
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              {activeProject.details}
            </p>

            {/* Metrics Section */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Key Metrics</h3>
              <ul className="space-y-2">
                {activeProject.metrics.map((metric, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>{metric}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tech Stack Section */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Tech Stack</h3>
              <div className="flex flex-wrap gap-2">
                {activeProject.tech.map((tech, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md text-sm font-medium border border-gray-300 dark:border-gray-600"
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
              className="inline-flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors"
            >
              View Project <FiExternalLink />
            </a>
          </div>
        </div>
      )}
    </section>
  );
}
