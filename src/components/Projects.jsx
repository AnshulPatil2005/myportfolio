import React, { useMemo, useState } from 'react';
import { FiExternalLink } from 'react-icons/fi';

const projects = [
  {
    title: 'PR Reviewer Bot',
    description: 'PR review platform with automated risk analysis and improvement suggestions.',
    category: 'Engineering',
    tech: ['FastAPI', 'React', 'GitHub API', 'Automation Engine'],
    link: 'https://github.com/AnshulPatil2005/AI-PR-Reviewer',
    metrics: ['Reduced review time by 40%', 'Analyzed 500+ pull requests', 'High accuracy risk detection'],
  },
  {
    title: 'Titan-Guidance',
    description: 'Document analysis platform for legal and compliance workflows.',
    category: 'Platform',
    tech: ['FastAPI', 'Celery', 'Qdrant', 'Redis', 'Docker'],
    link: 'https://github.com/AnshulPatil2005/Titan-Guidance',
    metrics: ['Processes large documents quickly', 'Extracts multiple clause types', 'Reduces manual review effort'],
  },
  {
    title: 'E-commerce Shopping Website',
    description: 'MERN application with authentication, cart, payments, and admin workflows.',
    category: 'Web',
    tech: ['MongoDB', 'Express', 'React', 'Node.js'],
    link: 'https://github.com/AnshulPatil2005/shoppingmernproject',
    metrics: ['Supports concurrent users', 'Fast API response times', 'Secure payment integration'],
  },
  {
    title: 'Cat vs Dog Classifier',
    description: 'Image classification model built with convolutional neural networks.',
    category: 'Data Science',
    tech: ['Python', 'TensorFlow', 'CNN'],
    link: '#',
    metrics: ['92% test accuracy', 'Trained on 25,000+ images', 'Low-latency inference'],
  },
  {
    title: 'Snake Game in Terminal',
    description: 'Terminal-based snake game built in C++ with OOP principles.',
    category: 'Systems',
    tech: ['C++', 'OOP', 'Console'],
    link: 'https://github.com/AnshulPatil2005/snake-game-in-terminal',
    metrics: ['Smooth rendering', 'No memory leaks', 'Cross-platform support'],
  },
  {
    title: 'Trading Bot (Telegram + Zerodha)',
    description: 'Automates order execution from Telegram trading signals.',
    category: 'Automation',
    tech: ['Python', 'Zerodha API', 'Telegram'],
    link: 'https://github.com/AnshulPatil2005/trading-bot',
    metrics: ['Sub-second order execution', 'High daily signal handling', 'Stable runtime behavior'],
  },
  {
    title: 'Portfolio Website',
    description: 'Responsive portfolio site built with React and Vite.',
    category: 'Web',
    tech: ['React', 'Tailwind CSS', 'Vite'],
    link: 'https://github.com/AnshulPatil2005/myportfolio',
    metrics: ['Strong Lighthouse performance', 'Fast load times', 'Responsive layouts'],
  },
];

export default function Projects() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = useMemo(
    () => ['All', ...new Set(projects.map((project) => project.category))],
    []
  );

  const filteredProjects =
    selectedCategory === 'All'
      ? projects
      : projects.filter((project) => project.category === selectedCategory);

  return (
    <section id="projects" className="mb-10 rounded-lg border border-slate-700 bg-slate-900/85 shadow-xl shadow-black/25 backdrop-blur-sm px-6 py-10 sm:px-8">
      <h3 className="section-title mb-6 text-2xl font-semibold">Projects</h3>

      <div className="mb-8 flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`rounded border px-3 py-1.5 text-sm ${
              selectedCategory === category
                ? 'border-slate-500 bg-slate-100 text-slate-900'
                : 'border-slate-700 bg-slate-950 text-slate-300 hover:border-slate-600 hover:bg-slate-900'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filteredProjects.map((project) => (
          <article key={project.title} className="rounded border border-slate-800 bg-slate-950/90 p-5 shadow-lg shadow-black/20">
            <div className="mb-3 flex items-start justify-between gap-3">
              <h4 className="text-lg font-semibold text-slate-100">{project.title}</h4>
              <span className="rounded bg-slate-900 px-2 py-1 text-xs text-slate-400 ring-1 ring-slate-700">
                {project.category}
              </span>
            </div>

            <p className="mb-4 text-sm leading-6 text-slate-300">{project.description}</p>

            <ul className="mb-4 list-disc space-y-1 pl-5 text-sm text-slate-300">
              {project.metrics.map((metric) => (
                <li key={metric}>{metric}</li>
              ))}
            </ul>

            <div className="mb-4 flex flex-wrap gap-2">
              {project.tech.map((tech) => (
                <span key={tech} className="rounded border border-slate-700 bg-slate-900 px-2.5 py-1 text-xs text-slate-300">
                  {tech}
                </span>
              ))}
            </div>

            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-medium text-slate-200 underline underline-offset-2 hover:text-slate-100"
            >
              View Project <FiExternalLink size={14} />
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}


