import { FiFileText } from 'react-icons/fi';

const publications = [
  {
    title: 'Publication in Progress',
    status: 'In Preparation',
    authors: 'Anshul Patil',
    venue: 'To be announced',
    year: '2026',
    description: 'Current work focuses on practical software engineering outcomes and scalable system design.',
    topics: ['Software Engineering', 'Scalable Systems', 'Product Development'],
  },
  {
    title: 'Technical Note in Progress',
    status: 'Draft',
    authors: 'Anshul Patil',
    venue: 'To be announced',
    year: '2026',
    description: 'Additional write-ups are being prepared around architecture decisions and implementation tradeoffs.',
    topics: ['Architecture', 'Reliability', 'Engineering Practice'],
  },
];

export default function Research() {
  return (
    <section id="research" className="mb-10 rounded-lg border border-slate-300 bg-white px-6 py-10 sm:px-8">
      <h3 className="section-title mb-6 text-2xl font-semibold">Research and Publications</h3>
      <p className="mb-8 text-slate-700">
        Ongoing work and technical writing focused on software systems, delivery quality,
        and maintainable engineering practices.
      </p>

      <div className="space-y-4">
        {publications.map((publication) => (
          <article key={publication.title} className="rounded border border-slate-200 bg-slate-50 p-5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <FiFileText className="text-slate-700" />
                <h4 className="text-lg font-semibold text-slate-900">{publication.title}</h4>
              </div>
              <span className="rounded border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700">
                {publication.status}
              </span>
            </div>

            <p className="mb-1 text-sm text-slate-700">{publication.authors}</p>
            <p className="mb-3 text-sm text-slate-600">{publication.venue} | {publication.year}</p>
            <p className="mb-3 text-sm text-slate-700">{publication.description}</p>

            <div className="flex flex-wrap gap-2">
              {publication.topics.map((topic) => (
                <span
                  key={topic}
                  className="rounded border border-slate-300 bg-white px-2.5 py-1 text-xs text-slate-700"
                >
                  {topic}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
