import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import Research from './components/Research';
import Achievements from './components/Achievements';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 pb-16 pt-24 sm:px-6 lg:px-8">
        <Hero />
        <About />
        <Achievements />
        <Projects />
        <Skills />
        <Research />
        <Testimonials />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}

