import React from 'react';
import useScrollReveal from '../hooks/useScrollReveal';
import { FiExternalLink, FiFileText } from 'react-icons/fi';

const publications = [
  {
    title: 'Coming Soon',
    status: 'Coming Soon',
    authors: 'Anshul Patil',
    venue: 'Coming Soon',
    year: '2025',
    description: 'Exciting research projects are in the pipeline. Check back soon for updates on my latest work.',
    topics: ['AI & ML', 'Software Engineering', 'Research'],
  },
  {
    title: 'Coming Soon',
    status: 'Coming Soon',
    authors: 'Anshul Patil',
    venue: 'Coming Soon',
    year: '2025',
    description: 'More research publications and projects will be shared here. Stay tuned for upcoming announcements.',
    topics: ['Innovation', 'Technology', 'Development'],
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
        <h3 className="text-3xl font-bold mb-6 text-center text-white">
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
                  pub.status === 'Coming Soon'
                    ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300'
                    : pub.status === 'In Progress'
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
