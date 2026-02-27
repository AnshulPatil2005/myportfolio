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
import usePortfolioData from './hooks/usePortfolioData';

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

  return (
    <div className="classic-page min-h-screen text-stone-900">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 pb-16 pt-24 sm:px-6 lg:px-8">
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
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
