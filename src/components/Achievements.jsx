import { FiAward, FiGitPullRequest, FiTrendingUp } from 'react-icons/fi';
import { FadeIn, StaggerContainer, StaggerItem } from './ScrollReveal';

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
    <section id="achievements" className="apple-section mx-auto max-w-7xl">
      <FadeIn>
        <h3 className="section-title">Highlights</h3>
      </FadeIn>

      <StaggerContainer>
        <div className="grid gap-8 md:grid-cols-3">
          {achievements.map((achievement) => (
            <StaggerItem key={achievement.title}>
              <article className="apple-card group h-full p-8 transition-all duration-300 hover:bg-white">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0066cc]/10 text-[#0066cc] group-hover:scale-110 transition-transform duration-500">
                  {achievement.icon}
                </div>
                <h4 className="mb-3 text-xl font-bold text-[#1d1d1f]">{achievement.title}</h4>
                <p className="mb-6 text-sm leading-relaxed text-[#424245]">{achievement.description}</p>
                <p className="text-lg font-bold text-[#0066cc]">{achievement.highlight}</p>
              </article>
            </StaggerItem>
          ))}
        </div>
      </StaggerContainer>
    </section>
  );
}
