import React from 'react';
import useScrollReveal from '../hooks/useScrollReveal';
import { FiExternalLink, FiFileText } from 'react-icons/fi';

const publications = [
  {
    title: 'Working on AI-Powered Document Analysis Systems',
    status: 'In Progress',
    authors: 'Anshul Patil',
    venue: 'Research in Progress',
    year: '2025',
    description: 'Exploring novel approaches to automated document analysis using large language models and vector databases for legal and contract documents.',
    topics: ['Natural Language Processing', 'Document AI', 'LLM Applications'],
  },
  {
    title: 'Working on Agentic AI Systems for Code Review',
    status: 'In Progress',
    authors: 'Anshul Patil',
    venue: 'Research in Progress',
    year: '2025',
    description: 'Investigating multi-agent systems for automated code review, risk assessment, and security vulnerability detection in pull requests.',
    topics: ['AI Agents', 'Software Engineering', 'Code Analysis'],
  },
];

export default function Research() {
  const [ref, visible] = useScrollReveal();

  return (
    <section
      id="research"
      ref={ref}
      className={`py-20 px-6 transition-all duration-700 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="max-w-6xl mx-auto">
        <h3 className="text-3xl font-bold mb-6 text-center text-blue-600 dark:text-blue-400">
          Research & Publications
        </h3>

        <p className="text-center text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
          Current research interests and ongoing work in AI, machine learning, and software engineering.
        </p>

        <div className="space-y-8">
          {publications.map((pub, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-gray-800 border dark:border-gray-700 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <FiFileText className="text-blue-600 dark:text-blue-400 text-xl flex-shrink-0" />
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {pub.title}
                    </h4>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {pub.authors}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                    <span>{pub.venue}</span>
                    <span>•</span>
                    <span>{pub.year}</span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
                  pub.status === 'In Progress'
                    ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
                    : 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                }`}>
                  {pub.status}
                </span>
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {pub.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {pub.topics.map((topic, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            More publications and research papers coming soon. Stay tuned for updates on my work in AI and software engineering.
          </p>
        </div>
      </div>
    </section>
  );
}
