import React from 'react';
import useScrollReveal from '../hooks/useScrollReveal';

export default function Contact() {
  const [ref, visible] = useScrollReveal();

  return (
    <section
      id="contact"
      ref={ref}
      className={`py-20 px-6 text-center bg-gray-900 transition-all duration-700 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="max-w-2xl mx-auto p-10 rounded-xl bg-white dark:bg-gray-800 border dark:border-gray-700 shadow">
        <h3 className="text-3xl font-bold mb-10 text-blue-600 dark:text-blue-400">Contact Me</h3>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Email: <a href="mailto:anshulpatil1022@gmail.com" className="text-blue-500 hover:underline">anshulpatil1022@gmail.com</a>
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          LinkedIn: <a href="https://www.linkedin.com/in/anshul-patil-575006280/" className="text-blue-500 hover:underline">https://www.linkedin.com/in/anshul-patil-575006280/</a>
        </p>
      </div>
    </section>
  );
}
