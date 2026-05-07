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
        position="top-right" 
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
