import { FiExternalLink, FiGitCommit } from 'react-icons/fi';

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function OpenSource({ repositories, totalCount, loading, error }) {
  return (
    <section id="opensource" className="classic-section mb-10 px-6 py-10 sm:px-8">
      <h3 className="section-title mb-2 text-2xl font-semibold">Open Source Work</h3>
      <p className="classic-muted mb-6 text-sm">
        Recent external repositories where I contributed through commits, pull requests, issues, or reviews.
      </p>

      {loading ? <p className="classic-muted text-sm">Loading open-source activity...</p> : null}
      {!loading && error ? <p className="text-sm text-red-700">{error}</p> : null}

      {!loading && !error && (
        <>
          <div className="mb-6 flex items-center gap-2 text-sm text-stone-700">
            <FiGitCommit />
            <span>
              Showing {repositories.length} repositories ({totalCount} total contributed repositories)
            </span>
          </div>

          {repositories.length === 0 ? (
            <p className="classic-muted text-sm">No open-source activity available for this account yet.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {repositories.map((repo) => (
                <article key={repo.id} className="classic-card p-5">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <h4 className="text-lg font-semibold text-stone-900">
                      {repo.owner}/{repo.name}
                    </h4>
                    <span className="classic-pill text-xs">{repo.language || 'Unknown'}</span>
                  </div>

                  <p className="classic-muted mb-4 text-sm leading-6">
                    {repo.description || 'No description available.'}
                  </p>

                  <div className="mb-4 flex flex-wrap gap-2 text-xs text-stone-700">
                    <span className="classic-pill">{repo.stars} stars</span>
                    <span className="classic-pill">{repo.forks} forks</span>
                    <span className="classic-pill">Updated {formatDate(repo.updatedAt)}</span>
                  </div>

                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-medium text-stone-900 underline underline-offset-2 hover:text-amber-900"
                  >
                    View Repository <FiExternalLink size={14} />
                  </a>
                </article>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
