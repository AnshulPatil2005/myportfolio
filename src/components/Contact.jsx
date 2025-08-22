// Import React and useState hook for local component state
import React, { useState } from 'react';
// Custom hook to reveal the section on scroll (intersection‑observer under the hood)
import useScrollReveal from '../hooks/useScrollReveal';
// Icons for email, LinkedIn, copy, and check indicators
import { FiMail, FiLinkedin, FiCopy, FiCheck } from 'react-icons/fi';

export default function Contact() {
  // Get a ref for the section and a boolean "visible" for entrance animation
  const [ref, visible] = useScrollReveal();
  // Track "copied" state separately for email and LinkedIn (to toggle icon/text briefly)
  const [copied, setCopied] = useState({ email: false, linkedin: false });

  // Contact details (could be moved to env/props if you want configurability)
  const email = 'anshulpatil1022@gmail.com';
  const linkedin = 'https://www.linkedin.com/in/anshul-patil-575006280/';

  // Utility: copy a value to clipboard and flash a "Copied" state for 1.4s
  const copy = async (key, value) => {
    try {
      // Write text to clipboard using the modern Clipboard API
      await navigator.clipboard.writeText(value);
      // Mark the specific field (email/linkedin) as copied
      setCopied((c) => ({ ...c, [key]: true }));
      // Reset the flag after a short delay to restore the "Copy" label/icon
      setTimeout(() => setCopied((c) => ({ ...c, [key]: false })), 1400);
    } catch {
      // Silently ignore errors (e.g., non‑secure context, permission issues)
    }
  };

  return (
    // Top-level section with reveal animation and gradient background
    <section
      id="contact" // Anchor for in-page navigation (e.g., navbar link)
      ref={ref}    // Attach to observer from useScrollReveal
      className={`py-20 px-6 transition-all duration-700 ${
        // Fade/slide in when "visible" flips true
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } bg-gradient-to-b from-black to-gray-900`}
    >
      {/* Constrain width and center the card */}
      <div className="max-w-2xl mx-auto relative">
        {/* Decorative blurred gradient halo behind the card */}
        <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 blur opacity-30" />
        {/* Glassy card container with border and backdrop blur */}
        <div className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-xl">
          {/* Section title with gradient text */}
          <h3 className="text-3xl font-extrabold mb-6 text-center">
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Contact Me
            </span>
          </h3>

          {/* Short intro/CTA line */}
          <p className="text-gray-300/90 text-center mb-8">
            I’m open to internships, freelance, and collaboration. Reach out anytime!
          </p>

          {/* Contact items list (email + LinkedIn) */}
          <div className="space-y-5">
            {/* Email row */}
            <div className="flex flex-col sm:flex-row items-center gap-3 justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              {/* Left: icon + mailto link */}
              <div className="flex items-center gap-3">
                {/* Icon with subtle tinted background */}
                <span className="p-2 rounded-lg bg-blue-500/20 text-blue-300">
                  <FiMail />
                </span>
                {/* Mail link; break-all to handle narrow screens */}
                <a
                  href={`mailto:${email}`}
                  className="text-blue-300 hover:text-blue-200 break-all"
                >
                  {email}
                </a>
              </div>

              {/* Right: copy-to-clipboard button */}
              <button
                onClick={() => copy('email', email)} // Copy email address
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-sm text-gray-200 hover:bg-white/10 transition"
                aria-label="Copy email" // A11y label for screen readers
              >
                {/* Toggle icon based on copied state */}
                {copied.email ? <FiCheck /> : <FiCopy />}
                {/* Toggle label based on copied state */}
                {copied.email ? 'Copied' : 'Copy'}
              </button>
            </div>

            {/* LinkedIn row */}
            <div className="flex flex-col sm:flex-row items-center gap-3 justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              {/* Left: icon + external link */}
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-lg bg-cyan-500/20 text-cyan-300">
                  <FiLinkedin />
                </span>
                {/* Open in new tab; rel="noreferrer" to avoid leaking referrer */}
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-300 hover:text-cyan-200 break-all"
                >
                  {linkedin}
                </a>
              </div>

              {/* Right: copy LinkedIn URL */}
              <button
                onClick={() => copy('linkedin', linkedin)} // Copy profile URL
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-sm text-gray-200 hover:bg-white/10 transition"
                aria-label="Copy LinkedIn URL"
              >
                {/* Toggle icon/label using copied.linkedin */}
                {copied.linkedin ? <FiCheck /> : <FiCopy />}
                {copied.linkedin ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Primary call-to-action buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            {/* Pre-filled email with subject/body (URL-encoded) */}
            <a
              href={`mailto:${email}?subject=Hello%20Anshul&body=Hi%20Anshul,%0D%0A%0D%0A`}
              className="px-5 py-3 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-medium hover:opacity-90 transition"
            >
              Send an Email
            </a>

            {/* External LinkedIn CTA */}
            <a
              href={linkedin}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-3 rounded-full border border-white/15 text-white hover:bg-white/10 transition"
            >
              Connect on LinkedIn
            </a>
          </div>

          {/* Small helper tip below CTAs */}
          <p className="mt-6 text-center text-xs text-gray-400">
            Tip: Use the <span className="text-gray-200">Copy</span> buttons to quickly share my contacts.
          </p>
        </div>
      </div>
    </section>
  );
}
