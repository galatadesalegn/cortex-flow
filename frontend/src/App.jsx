import React, { Suspense, lazy, useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useTheme } from './contexts/ThemeContext';

// ============================================
// PERFORMANCE OPTIMIZED APP WITH CODE SPLITTING
// ============================================

// Eager load critical components (above the fold)
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';

// Lazy load heavy sections (on demand)
const ProjectSingle = lazy(() => import('./pages/ProjectSingle'));
const AdminApp = lazy(() => import('./admin/AdminApp'));

// Loading fallback with skeleton UI
const SectionLoader = () => {
  return (
    <div className="min-h-[50vh] flex items-center justify-center bg-bg-primary">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-accent/30 border-t-accent rounded-full animate-spin" />
        <p className="text-accent animate-pulse font-medium tracking-wider">Loading...</p>
      </div>
    </div>
  );
};

// Simple hash-based router to support both paths and legacy hash routes
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
  const { isDark } = useTheme();
  const location = useLocation();
  
  // Check for admin path (non-hash)
  const isAdminPath = location.pathname.startsWith('/admin');
  
  // Check for project-single (hash-based)
  const isProjectPage = location.hash.startsWith('#/project-single') || location.hash.startsWith('#project-single');

  // If it's an admin path, render AdminApp without the portfolio layout (Navbar/Footer)
  if (isAdminPath) {
    return (
      <Suspense fallback={<SectionLoader />}>
        <Routes>
          <Route path="/admin/*" element={<AdminApp />} />
        </Routes>
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      {!isProjectPage && <Navbar />}
      
      <main>
        {isProjectPage ? (
          <Suspense fallback={<SectionLoader />}>
            <ProjectSingle key={location.hash} />
          </Suspense>
        ) : (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/project-single" element={
              <Suspense fallback={<SectionLoader />}>
                <ProjectSingle />
              </Suspense>
            } />
            {/* Redirect /login to /admin/login */}
            <Route path="/login" element={<Navigate to="/admin/login" replace />} />
            {/* Catch-all for other paths to prevent blank screen */}
            <Route path="*" element={<Home />} />
          </Routes>
        )}
      </main>
      
      <Footer />
    </div>
  );
}

export default App;
