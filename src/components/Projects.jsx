import React, { useEffect, useRef, useState } from 'react';
import useScrollReveal from '../hooks/useScrollReveal';
import { FiExternalLink } from 'react-icons/fi';

const projects = [
  {
  title: 'AI PR Reviewer Bot',
  desc: 'An agentic AI-powered PR review tool with risk analysis and suggestions.',
  tech: ['FastAPI', 'React', 'GitHub API', 'LLM'],
  link: 'https://github.com/AnshulPatil2005/AI-PR-Reviewer',
  details:
    'This tool automatically analyzes GitHub Pull Requests using LLM agents, providing risk assessment and improvement suggestions. It features a React frontend, FastAPI backend, and connects to GitHub via the REST API. It demonstrates practical use of agentic AI, security handling, and project deployment.',
},

  {
    title: 'E-commerce Shopping Website',
    desc: 'Built with the MERN stack, supports authentication, cart, and payments.',
    tech: ['MongoDB', 'Express', 'React', 'Node'],
    link: 'https://github.com/AnshulPatil2005/shoppingmernproject',
    details:
      'This full-featured e-commerce platform supports product listings, user registration, payment integration, cart management, and admin dashboard. Backend uses Express and MongoDB, frontend uses React with Tailwind.',
  },
  {
    title: 'Cat vs Dog Classifier',
    desc: 'Trained a CNN to distinguish between cat and dog images.',
    tech: ['Python', 'TensorFlow', 'CNN'],
    link: '#',
    details:
      'Used a custom-built Convolutional Neural Network trained on a Kaggle dataset of cat and dog images, achieving over 90% accuracy. Data augmentation, dropout, and softmax were used to optimize model performance.',
  },
  {
    title: 'Snake Game in Terminal',
    desc: 'Classic snake game using C++ and terminal rendering.',
    tech: ['C++', 'OOP', 'Console'],
    link: 'https://github.com/AnshulPatil2005/snake-game-in-terminal',
    details:
      'Written in C++ using object-oriented principles, this project mimics the classic Snake game playable directly in the terminal. It uses ncurses for rendering and keyboard inputs for snake control.',
  },
  {
    title: 'Trading Bot (Telegram + Zerodha)',
    desc: 'Automates trade execution based on Telegram signal input.',
    tech: ['Python', 'Zerodha', 'Telegram'],
    link: 'https://github.com/AnshulPatil2005/trading-bot',
    details:
      'This bot connects to Zerodha using KiteConnect and listens to trading signals via Telegram bot token. Supports live price polling, automated order placement, and P&L notifications.',
  },
  {
    title: 'AI Storytelling Game',
    desc: 'A GPT-powered storytelling game with dynamic branching.',
    tech: ['React', 'OpenAI', 'Tailwind'],
    link: '#',
    details:
      'An interactive narrative game where users drive the plot by entering prompts. Powered by GPT-4, the game generates story branches in real-time, creating an immersive and unpredictable experience.',
  },
  {
    title: 'Portfolio Website',
    desc: 'A beautiful developer portfolio built with React and Tailwind CSS.',
    tech: ['React', 'Tailwind CSS', 'Vite', 'Framer Motion'],
    link: 'https://github.com/AnshulPatil2005/myportfolio',
    details:
      'This portfolio showcases my skills, experience, and projects using a modern UI built with React and Tailwind CSS. Features include scroll animations, modals, dark/light mode, and a responsive design powered by Vite.',
  },
];

export default function Projects() {
  const [ref, visible] = useScrollReveal();
  const cardsRef = useRef([]);
  const [activeProject, setActiveProject] = useState(null);

  useEffect(() => {
    cardsRef.current.forEach((card) => {
      if (!card) return;

      let frame;
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
      const handleLeave = () => {
        cancelAnimationFrame(frame);
        card.style.transition = 'transform 0.4s ease';
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
        setTimeout(() => (card.style.transition = ''), 400);
      };

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
      <h3 className="text-3xl font-bold mb-10 text-blue-600 dark:text-blue-400">Projects</h3>
      <div className="grid gap-10 md:grid-cols-2 max-w-6xl mx-auto">
        {projects.map((project, idx) => (
          <div
            key={idx}
            ref={(el) => (cardsRef.current[idx] = el)}
            className="bg-white dark:bg-gray-800 border dark:border-gray-700 p-6 rounded-2xl shadow-lg transform-gpu cursor-pointer hover:shadow-2xl hover:shadow-blue-500/30 transition-transform duration-300 ease-out flex flex-col"
            style={{
              transformStyle: 'preserve-3d',
              transformOrigin: 'center center',
              willChange: 'transform',
            }}
          >
            <div className="flex flex-col gap-3">
              <h4 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">{project.title}</h4>
              <p className="text-gray-700 dark:text-gray-300">{project.desc}</p>

              <div className="flex justify-center gap-4 mt-4">
                <a
                  href={project.link}
                  className="flex items-center gap-1 text-blue-500 dark:text-blue-300 font-medium hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Project <FiExternalLink />
                </a>
                <button
                  onClick={() => setActiveProject(project)}
                  className="text-gray-600 dark:text-gray-300 underline hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Learn More
                </button>
              </div>
            </div>

            {/* Tech Tags pinned to bottom, centered */}
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

      {/* Modal */}
      {activeProject && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center animate-fadeIn">
          <div className="bg-white dark:bg-gray-900 p-8 rounded-lg max-w-xl w-full shadow-2xl relative">
            <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4">{activeProject.title}</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">{activeProject.details}</p>
            <button
              onClick={() => setActiveProject(null)}
              className="absolute top-3 right-4 text-gray-500 hover:text-red-500 text-xl"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
