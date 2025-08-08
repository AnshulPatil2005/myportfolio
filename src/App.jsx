// src/App.jsx
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Contact from './components/Contact';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import Loader from './components/Loader';
import SocialLinks from './components/SocialLinks';
import StarsBackground from './components/StarsBackground'; // ✅ imported global stars background

// 🔵 Scroll progress bar at the top
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
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="relative min-h-screen text-white font-sans scroll-smooth overflow-x-hidden bg-black">
      {/* 🔵 Subtle noise texture */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 z-0 pointer-events-none"></div>

      {/* 🔵 Global 3D stars background */}
      <StarsBackground />

      {/* 🔵 Scroll progress bar */}
      <ScrollProgressBar />

      {/* 🔵 Navbar */}
      <Navbar />

      {/* 🔵 Main content with proper stacking */}
      <main className="relative z-10 pt-16">
        <section id="hero"><Hero /></section>
        <section id="about"><About /></section>
        <section id="projects"><Projects /></section>
        <section id="skills"><Skills /></section>
        <section id="testimonials"><Testimonials /></section>
        

        <section id="contact"><Contact /></section>
      </main>

      {/* 🔵 Footer and floating actions */}
      <SocialLinks />
      <Footer />
      <BackToTop />
    </div>
  );
}
