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
import OpenSource from './components/OpenSource';
import Contact from './components/Contact';
import usePortfolioData from './hooks/usePortfolioData';
import { motion, useScroll, useSpring } from 'framer-motion';

export default function App() {
  const {
    repos,
    reposLoading,
    reposError,
    contributionSummary,
    contributionLoading,
    contributionError,
    openSource,
    openSourceLoading,
    openSourceError,
    leetcode,
    leetcodeLoading,
    leetcodeError,
    leetcodeUsername,
  } = usePortfolioData();

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="min-h-screen bg-white font-sans text-[#1d1d1f] selection:bg-[#0066cc]/20 selection:text-[#0066cc]">
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-[60] h-1 bg-[#0066cc] origin-left"
        style={{ scaleX }}
      />

      <Navbar />

      <main>
        <Hero />
        <About
          repoCount={repos.length}
          contributionSummary={contributionSummary}
          contributionLoading={contributionLoading}
          contributionError={contributionError}
          leetcode={leetcode}
          leetcodeLoading={leetcodeLoading}
          leetcodeError={leetcodeError}
          leetcodeUsername={leetcodeUsername}
        />
        <Achievements
          repoCount={repos.length}
          totalContributions={contributionSummary?.total || 0}
          openSourceCount={openSource.totalCount}
        />
        <Projects repos={repos} loading={reposLoading} error={reposError} />
        <OpenSource
          repositories={openSource.repositories}
          totalCount={openSource.totalCount}
          loading={openSourceLoading}
          error={openSourceError}
        />
        <Skills />
        <Research />
        <Testimonials />
        <Contact />
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
}
