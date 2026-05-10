import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { ThemeProvider } from './contexts/ThemeContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import './App.css';

function AdminApp() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AdminContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

function AdminContent() {
  return (
    <>
      <Toaster
        position="top-center"
        containerClassName="centered-toaster"
        toastOptions={{
          style: {
            background: 'linear-gradient(135deg, #0d1411 0%, #0a1a14 100%)',
            border: '1px solid rgba(29, 233, 182, 0.2)',
            color: '#e2e8f0',
            borderRadius: '12px',
            padding: '16px 20px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(12px)',
          },
          success: {
            style: {
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
            },
            iconTheme: {
              primary: '#10b981',
              secondary: '#064e3b',
            },
          },
          error: {
            style: {
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
            },
            iconTheme: {
              primary: '#ef4444',
              secondary: '#7f1d1d',
            },
          },
          info: {
            style: {
              background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(6, 182, 212, 0.05) 100%)',
              border: '1px solid rgba(6, 182, 212, 0.3)',
            },
            iconTheme: {
              primary: '#06b6d4',
              secondary: '#164e63',
            },
          },
        }}
      />
      <Routes>
        {/* Public Routes */}
        <Route path="login" element={<Login />} />
        
        {/* Entry point for /admin - checks auth first */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Navigate to="/admin/dashboard" replace />
            </ProtectedRoute>
          } 
        />
        
        {/* Dashboard is the main entry for protected routes */}
        <Route 
          path="dashboard/*" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Catch all for admin - redirect to login */}
        <Route path="*" element={<Navigate to="/admin/login" replace />} />
      </Routes>
    </>
  );
}

export default AdminApp;
