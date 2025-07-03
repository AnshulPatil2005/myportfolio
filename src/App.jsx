import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Contact from './components/Contact';
import Testimonials from './components/Testimonials';
import Timeline from './components/Timeline';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import Loader from './components/Loader';

function ScrollProgressBar() {
  const [scrollTop, setScrollTop] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setScrollTop(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-50 bg-transparent">
      <div
        className="h-full bg-blue-500"
        style={{ width: `${scrollTop}%`, transition: 'width 0.2s ease-out' }}
      ></div>
    </div>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500); // 1.5s spinner
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="bg-white text-gray-900 dark:bg-black dark:text-white font-sans scroll-smooth">
      {/* Scroll progress bar */}
      <ScrollProgressBar />

      {/* Navbar */}
      <Navbar />

      {/* Sections */}
      <main className="pt-16">
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Testimonials />
        <Timeline />
        <Contact />
      </main>

      {/* Footer + BackToTop */}
      <Footer />
      <BackToTop />
    </div>
  );
}
