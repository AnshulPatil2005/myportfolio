import { motion } from 'framer-motion';
import { FadeIn } from './ScrollReveal';

export default function Contact() {
  return (
    <section id="contact" className="apple-section bg-[#f5f5f7]">
      <div className="mx-auto max-w-4xl">
        <FadeIn>
          <h2 className="section-title">Get in Touch</h2>
          <p className="mx-auto mb-16 max-w-2xl text-center text-xl text-[#86868b]">
            Have a project in mind or just want to say hello? I'd love to hear from you.
          </p>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="apple-card overflow-hidden bg-white p-8 sm:p-12">
            <form className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-sm font-medium text-[#1d1d1f]">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="Steve Jobs"
                  className="rounded-xl border border-[#d2d2d7] bg-[#f5f5f7] px-4 py-3 text-[#1d1d1f] transition-all focus:border-[#0066cc] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#0066cc]/10"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm font-medium text-[#1d1d1f]">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="steve@apple.com"
                  className="rounded-xl border border-[#d2d2d7] bg-[#f5f5f7] px-4 py-3 text-[#1d1d1f] transition-all focus:border-[#0066cc] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#0066cc]/10"
                />
              </div>

              <div className="flex flex-col gap-2 sm:col-span-2">
                <label htmlFor="message" className="text-sm font-medium text-[#1d1d1f]">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  placeholder="Tell me about your project..."
                  className="rounded-xl border border-[#d2d2d7] bg-[#f5f5f7] px-4 py-3 text-[#1d1d1f] transition-all focus:border-[#0066cc] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#0066cc]/10"
                ></textarea>
              </div>

              <div className="sm:col-span-2">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full rounded-full bg-[#0066cc] py-4 text-lg font-medium text-white transition-colors hover:bg-[#0077ed]"
                >
                  Send Message
                </motion.button>
              </div>
            </form>
          </div>
        </FadeIn>

        <FadeIn delay={0.4}>
          <div className="mt-16 flex flex-wrap justify-center gap-12">
            <div className="text-center">
              <p className="text-sm font-medium text-[#86868b]">Email</p>
              <a href="mailto:anshul@example.com" className="text-lg font-semibold text-[#1d1d1f] hover:text-[#0066cc]">
                anshul@example.com
              </a>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-[#86868b]">Location</p>
              <p className="text-lg font-semibold text-[#1d1d1f]">New York, NY</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-[#86868b]">Social</p>
              <div className="flex gap-4">
                <a href="#" className="font-semibold text-[#1d1d1f] hover:text-[#0066cc]">LinkedIn</a>
                <a href="#" className="font-semibold text-[#1d1d1f] hover:text-[#0066cc]">GitHub</a>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
