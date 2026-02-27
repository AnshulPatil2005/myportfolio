import { useEffect, useState } from 'react';
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
      className="fixed bottom-6 right-6 z-50 rounded border border-amber-300 bg-amber-100 p-3 text-stone-700 shadow-sm hover:bg-amber-200"
      aria-label="Back to top"
    >
      <FaArrowUp />
    </button>
  );
}