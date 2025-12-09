import React from 'react';
import useScrollReveal from '../hooks/useScrollReveal';
import { FiAward, FiStar, FiTrendingUp } from 'react-icons/fi';

const achievements = [
  {
    icon: <FiAward />,
    title: 'IIIT Surat',
    description: 'B.Tech in Electronics and Communication Engineering',
    highlight: 'Top Academic Performance',
  },
  {
    icon: <FiStar />,
    title: 'Open Source Contributor',
    description: 'Contributing to AI and DevTools projects',
    highlight: '10+ Projects',
  },
  {
    icon: <FiTrendingUp />,
    title: 'Technical Skills',
    description: 'Full-stack development with AI/ML expertise',
    highlight: '20+ Technologies',
  },
];

export default function Achievements() {
  const [ref, visible] = useScrollReveal();

  return (
    <section
      id="achievements"
      ref={ref}
      className={`py-16 px-6 transition-all duration-700 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="max-w-6xl mx-auto">
        <h3 className="text-3xl font-bold mb-12 text-center text-blue-600 dark:text-blue-400">
          Achievements & Highlights
        </h3>

        <div className="grid md:grid-cols-3 gap-8">
          {achievements.map((achievement, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-gray-800 border dark:border-gray-700 p-6 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 text-center"
            >
              <div className="text-blue-600 dark:text-blue-400 text-4xl mb-4 flex justify-center">
                {achievement.icon}
              </div>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {achievement.title}
              </h4>
              <p className="text-gray-600 dark:text-gray-400 mb-3">
                {achievement.description}
              </p>
              <span className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                {achievement.highlight}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-8 flex-wrap justify-center">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">8+</span>
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-600 dark:text-gray-400">Projects</p>
                <p className="font-semibold text-gray-900 dark:text-white">Completed</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">20+</span>
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-600 dark:text-gray-400">Technologies</p>
                <p className="font-semibold text-gray-900 dark:text-white">Mastered</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">2+</span>
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-600 dark:text-gray-400">Research</p>
                <p className="font-semibold text-gray-900 dark:text-white">In Progress</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
