import { FiFileText } from 'react-icons/fi';
import { FadeIn, StaggerContainer, StaggerItem } from './ScrollReveal';

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
    <section id="research" className="apple-section mx-auto max-w-7xl">
      <FadeIn>
        <h3 className="section-title">Research & Publications</h3>
        <p className="mx-auto mb-16 max-w-2xl text-center text-lg text-[#86868b]">
          Ongoing work and technical writing focused on software systems, delivery quality,
          and maintainable engineering practices.
        </p>
      </FadeIn>

      <StaggerContainer>
        <div className="grid gap-8 md:grid-cols-2">
          {publications.map((publication) => (
            <StaggerItem key={publication.title}>
              <article className="apple-card group h-full p-8 transition-all duration-300 hover:bg-white">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0066cc]/10 text-[#0066cc]">
                      <FiFileText size={24} />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-[#1d1d1f]">{publication.title}</h4>
                      <p className="text-sm font-medium text-[#86868b]">{publication.venue} • {publication.year}</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-[#f5f5f7] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#1d1d1f]">
                    {publication.status}
                  </span>
                </div>

                <p className="mb-4 font-medium text-[#1d1d1f]">{publication.authors}</p>
                <p className="mb-8 leading-relaxed text-[#424245]">{publication.description}</p>

                <div className="flex flex-wrap gap-2">
                  {publication.topics.map((topic) => (
                    <span
                      key={topic}
                      className="rounded-full bg-[#f5f5f7] px-3 py-1 text-xs font-medium text-[#86868b]"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </article>
            </StaggerItem>
          ))}
        </div>
      </StaggerContainer>
    </section>
  );
}
