// Import React and useState hook for local component state
import React, { useState, useRef } from 'react';
// Custom hook to reveal the section on scroll (intersection observer under the hood)
import useScrollReveal from '../hooks/useScrollReveal';
// Icons for email, LinkedIn, copy, and check indicators
import { FiMail, FiLinkedin, FiCopy, FiCheck, FiSend } from 'react-icons/fi';

export default function Contact() {
  // Get a ref for the section and a boolean "visible" for entrance animation
  const [ref, visible] = useScrollReveal();
  // Track "copied" state separately for email and LinkedIn (to toggle icon/text briefly)
  const [copied, setCopied] = useState({ email: false, linkedin: false });

  // Form state
  const formRef = useRef();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      // Silently ignore errors (e.g., non secure context, permission issues)
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus({ type: '', message: '' });

    try {
      // Note: To use EmailJS, install @emailjs/browser and configure with your service ID
      // For now, this is a fallback that opens the default email client
      const subject = encodeURIComponent(`Portfolio Contact from ${formData.name}`);
      const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`);
      window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;

      setFormStatus({
        type: 'success',
        message: 'Opening your email client. If it doesn\'t open, please email me directly.'
      });
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setFormStatus({
        type: 'error',
        message: 'Something went wrong. Please email me directly.'
      });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setFormStatus({ type: '', message: '' }), 5000);
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
      }`}
    >
      {/* Constrain width and center the card */}
      <div className="max-w-2xl mx-auto relative">
        {/* Decorative blurred halo behind the card */}
        <div className="absolute -inset-0.5 rounded-2xl blur opacity-40" style={{ background: 'linear-gradient(135deg, #87CEEB, #4682B4)' }} />
        {/* Glassy card container with border and backdrop blur */}
        <div className="relative rounded-2xl border p-8 shadow-xl" style={{ borderColor: 'rgba(135, 206, 235, 0.4)', backgroundColor: 'rgba(26, 26, 46, 0.9)', backdropFilter: 'blur(20px)' }}>
          {/* Section title */}
          <h3 className="text-3xl font-extrabold mb-6 text-center" style={{ color: '#FFFFFF' }}>
            Contact Me
          </h3>

          {/* Short intro/CTA line */}
          <p className="text-center mb-8" style={{ color: '#F0F0F0' }}>
            I'm open to internships, freelance, and collaboration. Reach out anytime!
          </p>

          {/* Contact Form */}
          <form ref={formRef} onSubmit={handleSubmit} className="mb-8 space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none transition"
                placeholder="Your Name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Your Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none transition"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="5"
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none transition resize-none"
                placeholder="Your message here..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
              <FiSend />
            </button>

            {formStatus.message && (
              <div className={`p-3 rounded-lg text-sm ${
                formStatus.type === 'success'
                  ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                  : 'bg-red-500/20 text-red-300 border border-red-500/30'
              }`}>
                {formStatus.message}
              </div>
            )}
          </form>

          <div className="border-t border-white/10 my-8"></div>

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
              className="px-5 py-3 rounded-full bg-blue-600 text-white font-medium hover:bg-cyan-500 transition"
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
