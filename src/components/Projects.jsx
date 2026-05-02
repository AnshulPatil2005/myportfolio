import { useMemo, useState } from 'react';
import { FiExternalLink, FiGithub } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { FadeIn } from './ScrollReveal';

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function Projects({ repos, loading, error }) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = useMemo(() => {
    const languages = repos
      .map((repo) => repo.language || 'Other')
      .filter(Boolean);

    return ['All', ...new Set(languages)];
  }, [repos]);

  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'All') {
      return repos;
    }

    return repos.filter((repo) => (repo.language || 'Other') === selectedCategory);
  }, [repos, selectedCategory]);

  return (
    <section id="projects" className="apple-section mx-auto max-w-7xl">
      <FadeIn>
        <h3 className="section-title">Projects</h3>
        <p className="mx-auto mb-12 max-w-2xl text-center text-lg text-[#86868b]">
          A collection of my work, ranging from small utilities to full-scale applications,
          synced live from GitHub.
        </p>
      </FadeIn>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#0066cc] border-t-transparent"></div>
        </div>
      ) : null}

      {!loading && error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : null}

      {!loading && !error && (
        <>
          <FadeIn delay={0.2}>
            <div className="mb-12 flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full px-6 py-2 text-sm font-medium transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-[#1d1d1f] text-white'
                      : 'bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#e8e8ed]'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </FadeIn>

          <AnimatePresence mode="popLayout">
            <motion.div
              layout
              className="grid gap-8 md:grid-cols-2"
            >
              {filteredProjects.map((repo) => (
                <motion.article
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -8 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={repo.id}
                  className="apple-card group flex flex-col overflow-hidden"
                >
                  {/* Image Preview Area */}
                  <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
                    <img
                      src={`https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop`}
                      alt={repo.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
                    <div className="absolute right-4 top-4 flex gap-2">
                       <a
                        href={repo.htmlUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#1d1d1f] backdrop-blur transition-all hover:bg-white hover:text-[#0066cc]"
                        title="GitHub Repository"
                      >
                        <FiGithub size={18} />
                      </a>
                      {repo.homepage && (
                        <a
                          href={repo.homepage}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#1d1d1f] backdrop-blur transition-all hover:bg-white hover:text-[#0066cc]"
                          title="Live Demo"
                        >
                          <FiExternalLink size={18} />
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-8">
                    <div className="mb-4">
                      <span className="mb-2 inline-block text-xs font-semibold uppercase tracking-widest text-[#0066cc]">
                        {repo.language || 'Software'}
                      </span>
                      <h4 className="text-2xl font-bold text-[#1d1d1f]">{repo.name}</h4>
                    </div>

                    <p className="mb-8 line-clamp-2 text-lg leading-relaxed text-[#424245]">
                      {repo.description || 'Focusing on clean code and robust architecture.'}
                    </p>

                    <div className="mt-auto flex flex-wrap gap-4 text-xs font-semibold uppercase tracking-wider text-[#86868b]">
                      <div className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-yellow-400"></span>
                        {repo.stars} Stars
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-400"></span>
                        {repo.forks} Forks
                      </div>
                      <div>Updated {formatDate(repo.updatedAt)}</div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          </AnimatePresence>

          {filteredProjects.length === 0 && (
            <p className="py-20 text-center text-[#86868b]">No repositories found for this filter.</p>
          )}
        </>
      )}
    </section>
  );
}
