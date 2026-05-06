import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../Components/Sidebar';
import Header from '../Components/Header';
import SummaryCards from '../Components/SummaryCards';
import ProfileVisitors from '../Components/ProfileVisitors';
import SkillDistribution from '../Components/SkillDistribution';
import RecentActivity from '../Components/RecentActivity';

// Lazy load heavy components for better initial load performance
const Projects = lazy(() => import('../Components/Projects'));
const Certificates = lazy(() => import('../Components/Certificates'));
const Skills = lazy(() => import('../Components/Skills'));
const Services = lazy(() => import('../Components/Services'));
const Messages = lazy(() => import('../Components/Messages'));
const Settings = lazy(() => import('../Components/Settings'));
const About = lazy(() => import('./About'));
const Testimonials = lazy(() => import('../Components/Testimonials'));

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
  </div>
);

// Dashboard Home Component
const DashboardHome = () => (
  <>
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-white">Welcome back, Admin</h1>
      <p className="text-gray-500 mt-1">Manage your portfolio and track performance</p>
    </div>

    <SummaryCards />

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
      <div className="lg:col-span-2">
        <ProfileVisitors />
      </div>
      <div>
        <SkillDistribution />
      </div>
    </div>

    <div className="mt-6">
      <RecentActivity />
    </div>
  </>
);

const Dashboard = () => {
  return (
    <div className="flex min-h-screen bg-[#0a0a0f] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/dashboard" element={<DashboardHome />} />
              <Route path="/about" element={<About />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/certificates" element={<Certificates />} />
              <Route path="/skills" element={<Skills />} />
              <Route path="/services" element={<Services />} />
              <Route path="/testimonials" element={<Testimonials />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
