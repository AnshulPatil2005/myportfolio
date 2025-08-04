// src/components/Testimonials.jsx
import React from 'react';

export default function Testimonials() {
  const feedback = [
    {
      name: 'Sachin Patil',
      role: 'Manager',
      text: 'Anshul is a problem-solver who delivers high-quality code fast.',
    },
    {
      name: 'Dhanishtha Patel',
      role: 'Teammate',
      text: 'Very reliable and always ready to take ownership.',
    },
  ];

  return (
    <section
      id="testimonials"
      className="py-20 px-6 text-center bg-black"
    >
      <h3 className="text-3xl font-bold mb-10 text-blue-500">Endorsements</h3>
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {feedback.map((item, idx) => (
          <div
            key={idx}
            className="bg-gray-900 p-6 rounded-xl shadow-md border border-gray-700"
          >
            <p className="text-gray-300 italic mb-4">"{item.text}"</p>
            <h5 className="text-lg font-semibold text-white">{item.name}</h5>
            <p className="text-sm text-gray-400">{item.role}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
