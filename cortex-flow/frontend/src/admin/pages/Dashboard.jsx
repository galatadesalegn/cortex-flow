import { Suspense, lazy, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import SummaryCards from '../components/SummaryCards';
import ProfileVisitors from '../components/ProfileVisitors';
import SkillDistribution from '../components/SkillDistribution';
import AdminTerminal from '../components/AdminTerminal';
import { useProfile, useTheme } from '../hooks';

// Lazy load heavy components for better initial load performance
const Projects = lazy(() => import('../components/Projects'));
const Certificates = lazy(() => import('../components/Certificates'));
const Skills = lazy(() => import('../components/Skills'));
const Services = lazy(() => import('../components/Services'));
const Messages = lazy(() => import('../components/Messages'));
const Settings = lazy(() => import('../components/Settings'));
const About = lazy(() => import('./About'));
const Testimonials = lazy(() => import('../components/Testimonials'));

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
  </div>
);

// Dashboard Home Component
const DashboardHome = () => {
  const { profile } = useProfile();
  const { isDark } = useTheme();
  
  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="mb-6">
        <h1 className={`text-2xl font-bold transition-colors duration-300 ${isDark ? 'text-white' : 'text-[#1A1A1A]'}`}>
          Welcome back, {profile?.name || 'Admin'}
        </h1>
      </div>

      <div className="flex-none">
        <SummaryCards />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 flex-none">
        <div className="lg:col-span-2">
          <ProfileVisitors />
        </div>
        <div>
          <SkillDistribution />
        </div>
      </div>

      <div className="mt-6 flex-1 min-h-0">
        <AdminTerminal />
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isDark } = useTheme();

  return (
    <div className={`flex min-h-screen overflow-hidden transition-colors duration-300 ${isDark ? 'bg-[#0a0a0f]' : 'bg-[#F5F5F7]'}`}>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<DashboardHome />} />
              <Route path="about" element={<About />} />
              <Route path="projects" element={<Projects />} />
              <Route path="certificates" element={<Certificates />} />
              <Route path="skills" element={<Skills />} />
              <Route path="services" element={<Services />} />
              <Route path="testimonials" element={<Testimonials />} />
              <Route path="messages" element={<Messages />} />
              <Route path="settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="" replace />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
