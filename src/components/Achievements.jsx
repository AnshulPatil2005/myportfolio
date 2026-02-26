import { FiAward, FiStar, FiTrendingUp } from 'react-icons/fi';

const achievements = [
  {
    icon: <FiAward />,
    title: 'IIIT Surat',
    description: 'B.Tech in Electronics and Communication Engineering',
    highlight: 'Strong academic foundation',
  },
  {
    icon: <FiStar />,
    title: 'Open Source Contributor',
    description: 'Contributions across software and developer tooling projects',
    highlight: '10+ repositories',
  },
  {
    icon: <FiTrendingUp />,
    title: 'Technical Delivery',
    description: 'Experience building full-stack applications from concept to deployment',
    highlight: '20+ technologies',
  },
];

export default function Achievements() {
  return (
    <section id="achievements" className="mb-10 rounded-lg border border-slate-300 bg-white px-6 py-10 sm:px-8">
      <h3 className="section-title mb-8 text-2xl font-semibold">Achievements and Highlights</h3>

      <div className="grid gap-4 md:grid-cols-3">
        {achievements.map((achievement) => (
          <article key={achievement.title} className="rounded border border-slate-200 bg-slate-50 p-5">
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded border border-slate-300 bg-white text-slate-700">
              {achievement.icon}
            </div>
            <h4 className="mb-2 text-lg font-semibold text-slate-900">{achievement.title}</h4>
            <p className="mb-3 text-sm text-slate-700">{achievement.description}</p>
            <p className="text-sm font-medium text-slate-800">{achievement.highlight}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
