import { FaBriefcase, FaGraduationCap } from 'react-icons/fa';
import { FadeIn, StaggerContainer, StaggerItem } from './ScrollReveal';

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
    <section id="experience" className="apple-section mx-auto max-w-7xl">
      <FadeIn>
        <h3 className="section-title">Experience</h3>
        <p className="mx-auto mb-16 max-w-2xl text-center text-lg text-[#86868b]">
          My professional journey and academic milestones in the world of software
          engineering and product development.
        </p>
      </FadeIn>

      <div className="relative mx-auto max-w-4xl px-6">
        {/* Vertical Line */}
        <div className="absolute left-6 top-0 h-full w-px bg-[#e8e8ed] md:left-1/2"></div>

        <StaggerContainer>
          <div className="space-y-12">
            {timelineData.map((item, i) => (
              <StaggerItem key={item.id}>
                <div className={`relative flex flex-col md:flex-row ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                  {/* Dot */}
                  <div className="absolute left-0 top-1/2 z-10 flex h-4 w-4 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white border-2 border-[#0066cc] md:left-1/2"></div>

                  {/* Content */}
                  <div className="w-full pl-12 md:w-1/2 md:pl-0 md:px-12">
                    <div className="apple-card p-8 hover:bg-white">
                      <p className="mb-2 text-sm font-bold text-[#0066cc] uppercase tracking-wider">{item.period}</p>
                      <h4 className="mb-4 flex items-center gap-3 text-xl font-bold text-[#1d1d1f]">
                        <span className="text-[#86868b]">{item.icon}</span>
                        {item.title}
                      </h4>
                      <p className="leading-relaxed text-[#424245]">{item.description}</p>
                    </div>
                  </div>

                  {/* Empty space for md screens */}
                  <div className="hidden md:block md:w-1/2"></div>
                </div>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>
      </div>
    </section>
  );
}
