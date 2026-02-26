import React, { useEffect, useState } from 'react';
import { FaArrowUp } from 'react-icons/fa';

export default function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShow(window.scrollY > 300);

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!show) {
    return null;
  }

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 z-50 rounded border border-slate-400 bg-white p-3 text-slate-700 shadow-sm hover:bg-slate-100"
      aria-label="Back to top"
    >
      <FaArrowUp />
    </button>
  );
}
