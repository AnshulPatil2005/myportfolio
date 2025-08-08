import React, { useState } from 'react';
import useScrollReveal from '../hooks/useScrollReveal';
import { FiMail, FiLinkedin, FiCopy, FiCheck } from 'react-icons/fi';

export default function Contact() {
  const [ref, visible] = useScrollReveal();
  const [copied, setCopied] = useState({ email: false, linkedin: false });

  const email = 'anshulpatil1022@gmail.com';
  const linkedin = 'https://www.linkedin.com/in/anshul-patil-575006280/';

  const copy = async (key, value) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied((c) => ({ ...c, [key]: true }));
      setTimeout(() => setCopied((c) => ({ ...c, [key]: false })), 1400);
    } catch {
      // ignore
    }
  };

  return (
    <section
      id="contact"
      ref={ref}
      className={`py-20 px-6 transition-all duration-700 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } bg-gradient-to-b from-black to-gray-900`}
    >
      <div className="max-w-2xl mx-auto relative">
        {/* animated gradient halo */}
        <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 blur opacity-30" />
        <div className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-xl">
          <h3 className="text-3xl font-extrabold mb-6 text-center">
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Contact Me
            </span>
          </h3>
          <p className="text-gray-300/90 text-center mb-8">
            I’m open to internships, freelance, and collaboration. Reach out anytime!
          </p>

          {/* contact items */}
          <div className="space-y-5">
            {/* Email */}
            <div className="flex flex-col sm:flex-row items-center gap-3 justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-lg bg-blue-500/20 text-blue-300">
                  <FiMail />
                </span>
                <a
                  href={`mailto:${email}`}
                  className="text-blue-300 hover:text-blue-200 break-all"
                >
                  {email}
                </a>
              </div>
              <button
                onClick={() => copy('email', email)}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-sm text-gray-200 hover:bg-white/10 transition"
                aria-label="Copy email"
              >
                {copied.email ? <FiCheck /> : <FiCopy />}
                {copied.email ? 'Copied' : 'Copy'}
              </button>
            </div>

            {/* LinkedIn */}
            <div className="flex flex-col sm:flex-row items-center gap-3 justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-lg bg-cyan-500/20 text-cyan-300">
                  <FiLinkedin />
                </span>
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-300 hover:text-cyan-200 break-all"
                >
                  {linkedin}
                </a>
              </div>
              <button
                onClick={() => copy('linkedin', linkedin)}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-sm text-gray-200 hover:bg-white/10 transition"
                aria-label="Copy LinkedIn URL"
              >
                {copied.linkedin ? <FiCheck /> : <FiCopy />}
                {copied.linkedin ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={`mailto:${email}?subject=Hello%20Anshul&body=Hi%20Anshul,%0D%0A%0D%0A`}
              className="px-5 py-3 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-medium hover:opacity-90 transition"
            >
              Send an Email
            </a>
            <a
              href={linkedin}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-3 rounded-full border border-white/15 text-white hover:bg-white/10 transition"
            >
              Connect on LinkedIn
            </a>
          </div>

          {/* tiny helper note */}
          <p className="mt-6 text-center text-xs text-gray-400">
            Tip: Use the <span className="text-gray-200">Copy</span> buttons to quickly share my contacts.
          </p>
        </div>
      </div>
    </section>
  );
}
