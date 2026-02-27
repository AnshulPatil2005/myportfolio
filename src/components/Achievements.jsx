import { FiAward, FiGitPullRequest, FiTrendingUp } from 'react-icons/fi';

export default function Achievements({ repoCount, totalContributions, openSourceCount }) {
  const achievements = [
    {
      icon: <FiAward />,
      title: 'Repository Footprint',
      description: 'Projects maintained across different stacks and domains.',
      highlight: `${repoCount}+ repositories`,
    },
    {
      icon: <FiGitPullRequest />,
      title: 'Open Source Activity',
      description: 'Contributions delivered across external repositories.',
      highlight: `${openSourceCount}+ contributed repositories`,
    },
    {
      icon: <FiTrendingUp />,
      title: 'Yearly GitHub Velocity',
      description: 'Live contribution count fetched through GitHub GraphQL API.',
      highlight: `${totalContributions}+ contributions`,
    },
  ];

  return (
    <section id="achievements" className="classic-section mb-10 px-6 py-10 sm:px-8">
      <h3 className="section-title mb-8 text-2xl font-semibold">Achievements and Highlights</h3>

      <div className="grid gap-4 md:grid-cols-3">
        {achievements.map((achievement) => (
          <article key={achievement.title} className="classic-card p-5">
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded border border-amber-300 bg-amber-100 text-stone-700">
              {achievement.icon}
            </div>
            <h4 className="mb-2 text-lg font-semibold text-stone-900">{achievement.title}</h4>
            <p className="mb-3 text-sm text-stone-700">{achievement.description}</p>
            <p className="text-sm font-medium text-stone-900">{achievement.highlight}</p>
          </article>
        ))}
      </div>
    </section>
  );
}