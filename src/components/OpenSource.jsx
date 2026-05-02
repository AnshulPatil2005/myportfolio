import { FiExternalLink, FiGithub, FiStar, FiGitBranch } from 'react-icons/fi';
import { FadeIn, StaggerContainer, StaggerItem } from './ScrollReveal';

export default function OpenSource({ repositories, totalCount, loading, error }) {
  return (
    <section id="opensource" className="apple-section mx-auto max-w-7xl">
      <FadeIn>
        <h3 className="section-title">Open Source</h3>
        <p className="mx-auto mb-12 max-w-2xl text-center text-lg text-[#86868b]">
          Proudly contributing to the community. Here are some of the projects I've
          been involved with lately.
        </p>
      </FadeIn>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#0066cc] border-t-transparent"></div>
        </div>
      ) : null}

      {!loading && error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : null}

      {!loading && !error && (
        <StaggerContainer>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {repositories.map((repo) => (
              <StaggerItem key={repo.name}>
                <div className="apple-card flex h-full flex-col p-6 hover:bg-white">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[#0066cc]">
                      <FiGithub size={18} />
                      <span className="text-sm font-semibold uppercase tracking-wider">GitHub</span>
                    </div>
                    <a
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#86868b] hover:text-[#1d1d1f]"
                    >
                      <FiExternalLink size={18} />
                    </a>
                  </div>

                  <h4 className="mb-3 text-xl font-bold text-[#1d1d1f]">{repo.name}</h4>

                  <p className="mb-6 flex-grow text-sm leading-relaxed text-[#424245]">
                    {repo.description || 'Contributing to better software, one PR at a time.'}
                  </p>

                  <div className="flex items-center gap-4 text-xs font-medium text-[#86868b]">
                    <div className="flex items-center gap-1">
                      <FiStar size={14} className="text-yellow-500" />
                      {repo.stars || repo.stargazerCount || 0}
                    </div>
                    <div className="flex items-center gap-1">
                      <FiGitBranch size={14} className="text-blue-500" />
                      {repo.forks || repo.forkCount || 0}
                    </div>
                    <div className="ml-auto rounded-full bg-[#e8e8ed] px-2.5 py-0.5 text-[#1d1d1f]">
                      {repo.primaryLanguage?.name || 'Code'}
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </div>

          {totalCount > repositories.length && (
            <FadeIn delay={0.5}>
              <div className="mt-12 text-center">
                <a
                  href="https://github.com/anshul-patil"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-lg font-medium text-[#0066cc] hover:underline"
                >
                  View more on GitHub <FiGithub size={20} />
                </a>
              </div>
            </FadeIn>
          )}
        </StaggerContainer>
      )}
    </section>
  );
}
