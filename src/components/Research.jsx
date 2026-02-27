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
    <section id="research" className="classic-section mb-10 px-6 py-10 sm:px-8">
      <h3 className="section-title mb-6 text-2xl font-semibold">Research and Publications</h3>
      <p className="classic-muted mb-8">
        Ongoing work and technical writing focused on software systems, delivery quality,
        and maintainable engineering practices.
      </p>

      <div className="space-y-4">
        {publications.map((publication) => (
          <article key={publication.title} className="classic-card p-5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <FiFileText className="text-stone-700" />
                <h4 className="text-lg font-semibold text-stone-900">{publication.title}</h4>
              </div>
              <span className="classic-pill text-xs">
                {publication.status}
              </span>
            </div>

            <p className="mb-1 text-sm text-stone-700">{publication.authors}</p>
            <p className="mb-3 text-sm text-stone-600">{publication.venue} | {publication.year}</p>
            <p className="mb-3 text-sm text-stone-700">{publication.description}</p>

            <div className="flex flex-wrap gap-2">
              {publication.topics.map((topic) => (
                <span
                  key={topic}
                  className="classic-pill px-2.5 py-1 text-xs"
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