import { useMemo, useState } from 'react';
import { FiExternalLink, FiGithub } from 'react-icons/fi';

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
    <section id="projects" className="classic-section mb-10 px-6 py-10 sm:px-8">
      <h3 className="section-title mb-2 text-2xl font-semibold">GitHub Projects</h3>
      <p className="classic-muted mb-6 text-sm">
        Fetched live from the GitHub API and sorted by latest updates.
      </p>

      {loading ? <p className="classic-muted text-sm">Loading repositories...</p> : null}
      {!loading && error ? <p className="text-sm text-red-700">{error}</p> : null}

      {!loading && !error && (
        <>
          <div className="mb-8 flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`rounded border px-3 py-1.5 text-sm transition-colors ${
                  selectedCategory === category
                    ? 'border-amber-700 bg-amber-100 text-stone-900'
                    : 'border-amber-200 bg-amber-50 text-stone-700 hover:border-amber-300 hover:bg-amber-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {filteredProjects.length === 0 ? (
            <p className="classic-muted text-sm">No repositories found for this filter.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredProjects.map((repo) => (
                <article key={repo.id} className="classic-card p-5">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <h4 className="text-lg font-semibold text-stone-900">{repo.name}</h4>
                    <span className="classic-pill text-xs">{repo.language || 'Other'}</span>
                  </div>

                  <p className="classic-muted mb-4 text-sm leading-6">
                    {repo.description || 'No description provided.'}
                  </p>

                  <div className="mb-4 flex flex-wrap gap-2 text-xs text-stone-700">
                    <span className="classic-pill">{repo.stars} stars</span>
                    <span className="classic-pill">{repo.forks} forks</span>
                    <span className="classic-pill">Updated {formatDate(repo.updatedAt)}</span>
                    {repo.private ? <span className="classic-pill">Private</span> : null}
                    {repo.isFork ? <span className="classic-pill">Fork</span> : null}
                    {repo.archived ? <span className="classic-pill">Archived</span> : null}
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <a
                      href={repo.htmlUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-medium text-stone-900 underline underline-offset-2 hover:text-amber-900"
                    >
                      <FiGithub size={14} /> Repository
                    </a>

                    {repo.homepage ? (
                      <a
                        href={repo.homepage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm font-medium text-stone-900 underline underline-offset-2 hover:text-amber-900"
                      >
                        Live Demo <FiExternalLink size={14} />
                      </a>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}