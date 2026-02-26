import { FaBriefcase, FaGraduationCap } from 'react-icons/fa';

const timelineData = [
  {
    id: '2024',
    period: 'May 2024',
    title: 'B.Tech in ECE - IIIT Surat',
    description: 'Undergraduate studies with emphasis on systems, software development, and practical engineering.',
    icon: <FaGraduationCap />,
  },
  {
    id: '2025',
    period: 'Jun 2025',
    title: 'Intern - Techvisio Design',
    description: 'Built a real-time traffic dashboard using Django and AWS for monitoring and analytics.',
    icon: <FaBriefcase />,
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="rounded-lg border border-slate-700 bg-slate-900/85 shadow-xl shadow-black/25 backdrop-blur-sm px-6 py-10 sm:px-8">
      <h3 className="section-title mb-6 text-2xl font-semibold">Experience Timeline</h3>

      <div className="space-y-4">
        {timelineData.map((item) => (
          <article key={item.id} className="rounded border border-slate-800 bg-slate-950/90 p-5 shadow-lg shadow-black/20">
            <p className="mb-2 text-sm font-medium text-slate-400">{item.period}</p>
            <h4 className="mb-2 flex items-center gap-2 text-lg font-semibold text-slate-100">
              {item.icon}
              {item.title}
            </h4>
            <p className="text-sm text-slate-300">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}


