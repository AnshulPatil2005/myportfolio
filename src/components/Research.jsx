import useScrollReveal from '../hooks/useScrollReveal';
import { FiFileText } from 'react-icons/fi';

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
      className={`px-6 py-20 transition-all duration-700 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="mx-auto max-w-6xl">
        <h3 className="section-title mb-6 text-center text-3xl font-bold text-white">
          Research & Publications
        </h3>

        <p className="mx-auto mb-12 max-w-2xl text-center text-gray-400">
          Current research interests and ongoing work in AI, machine learning, and software engineering.
        </p>

        <div className="space-y-6">
          {publications.map((pub, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-blue-500/30 hover:shadow-[0_0_20px_rgba(59,130,246,0.1)]"
            >
              <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-3">
                    <FiFileText className="flex-shrink-0 text-xl text-blue-400" />
                    <h4 className="text-lg font-semibold text-white">
                      {pub.title}
                    </h4>
                  </div>
                  <p className="mb-2 text-sm text-gray-400">{pub.authors}</p>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                    <span>{pub.venue}</span>
                    <span>·</span>
                    <span>{pub.year}</span>
                  </div>
                </div>
                <span className="inline-block self-start whitespace-nowrap rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-300">
                  {pub.status}
                </span>
              </div>

              <p className="mb-4 text-sm leading-relaxed text-gray-300">
                {pub.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {pub.topics.map((topic, i) => (
                  <span
                    key={i}
                    className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs text-blue-400"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-sm text-gray-500">
            More publications and research papers coming soon. Stay tuned for updates on my work in AI and software engineering.
          </p>
        </div>
      </div>
    </section>
  );
}
