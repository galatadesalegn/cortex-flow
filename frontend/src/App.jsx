import React, { Suspense, lazy, useState, useEffect } from 'react';
import { useTheme } from './contexts/ThemeContext';

// ============================================
// PERFORMANCE OPTIMIZED APP WITH CODE SPLITTING
// ============================================

// Eager load critical components (above the fold)
import Navbar from './Components/Layout/Navbar';
import Footer from './Components/Layout/Footer';
import Home from './Components/pages/Home';

// Lazy load heavy sections (on demand)
const ProjectSingle = lazy(() => import('./Components/pages/ProjectSingle'));

// Loading fallback with skeleton UI
const SectionLoader = () => {
  const { isDark } = useTheme();
  return (
    <div className={`min-h-[50vh] flex items-center justify-center transition-colors duration-500 ${isDark ? 'bg-[#0a0a0a]' : 'bg-gray-50'}`}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[#1de9b6]/30 border-t-[#1de9b6] rounded-full animate-spin" />
        <p className="text-[#1de9b6] animate-pulse font-medium tracking-wider">Loading...</p>
      </div>
    </div>
  );
};

// Simple hash-based router
const useHashRouter = () => {
  const [hash, setHash] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return hash;
};

function App() {
  const hash = useHashRouter();
  const { isDark } = useTheme();
  
  // Check if we're on the project page
  const isProjectPage = hash.startsWith('#/project') || hash.startsWith('#project');

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDark ? 'bg-[#0a0a0a]' : 'bg-white'}`}>
      <Navbar />
      
      {isProjectPage ? (
        <Suspense fallback={<SectionLoader />}>
          <ProjectSingle />
        </Suspense>
      ) : (
        <Home />
      )}
      
      <Footer />
    </div>
  );
}

export default App;
