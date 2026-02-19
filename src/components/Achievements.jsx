import useScrollReveal from '../hooks/useScrollReveal';
import { FiAward, FiStar, FiTrendingUp } from 'react-icons/fi';

const achievements = [
  {
    icon: <FiAward />,
    title: 'IIIT Surat',
    description: 'B.Tech in Electronics and Communication Engineering',
    highlight: 'Top Academic Performance',
    color: 'blue',
  },
  {
    icon: <FiStar />,
    title: 'Open Source Contributor',
    description: 'Contributing to AI and DevTools projects',
    highlight: '10+ Projects',
    color: 'cyan',
  },
  {
    icon: <FiTrendingUp />,
    title: 'Technical Skills',
    description: 'Full-stack development with AI/ML expertise',
    highlight: '20+ Technologies',
    color: 'purple',
  },
];

export default function Achievements() {
  const [ref, visible] = useScrollReveal();

  return (
    <section
      id="achievements"
      ref={ref}
      className={`px-6 py-16 transition-all duration-700 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="mx-auto max-w-6xl">
        <h3 className="section-title mb-12 text-center text-3xl font-bold text-white">
          Achievements & Highlights
        </h3>

        <div className="grid gap-6 md:grid-cols-3">
          {achievements.map((achievement, idx) => (
            <div
              key={idx}
              className="group rounded-2xl border border-slate-700/50 bg-slate-800/50 p-6 text-center shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/30 hover:shadow-[0_0_25px_rgba(59,130,246,0.15)]"
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-blue-500/20 bg-blue-500/10 text-2xl text-blue-400">
                {achievement.icon}
              </div>
              <h4 className="mb-2 text-lg font-semibold text-white">
                {achievement.title}
              </h4>
              <p className="mb-4 text-sm text-gray-400">
                {achievement.description}
              </p>
              <span className="inline-block rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-medium text-blue-300">
                {achievement.highlight}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-10">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-blue-500/30 bg-blue-500/10">
                <span className="text-lg font-bold text-blue-400">8+</span>
              </div>
              <div className="text-left">
                <p className="text-xs text-gray-400">Projects</p>
                <p className="text-sm font-semibold text-white">Completed</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-green-500/30 bg-green-500/10">
                <span className="text-lg font-bold text-green-400">20+</span>
              </div>
              <div className="text-left">
                <p className="text-xs text-gray-400">Technologies</p>
                <p className="text-sm font-semibold text-white">Mastered</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-purple-500/30 bg-purple-500/10">
                <span className="text-lg font-bold text-purple-400">2+</span>
              </div>
              <div className="text-left">
                <p className="text-xs text-gray-400">Research</p>
                <p className="text-sm font-semibold text-white">In Progress</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
