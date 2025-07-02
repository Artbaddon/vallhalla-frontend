import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';
import HomePage from './pages/HomePage';
import Login from './pages/auth/Login';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import AdminDashboard from './pages/admin/AdminDashboard';
import OwnerDashboard from './pages/owner/OwnerDashboard';
import GuardDashboard from './pages/guard/GuardDashboard';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/common/ProtectedRoute';
import TestNavigation from './TestNavigation';
import './App.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function AppRoutes() {
  const { user, loading, isAdmin, isOwner, isSecurity } = useAuth();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/test" element={<TestNavigation />} />
      
      {/* Dashboard route - redirects based on role */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          {isAdmin ? <Navigate to="/admin/dashboard" replace /> : 
           isOwner ? <Navigate to="/owner/dashboard" replace /> : 
           isSecurity ? <Navigate to="/guard/dashboard" replace /> : 
           <Navigate to="/" replace />}
        </ProtectedRoute>
      } />
      
      {/* Admin routes */}
      <Route path="/admin/*" element={
        <ProtectedRoute allowedRoles={[1]}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      
      {/* Owner routes */}
      <Route path="/owner/*" element={
        <ProtectedRoute allowedRoles={[3]}>
          <OwnerDashboard />
        </ProtectedRoute>
      } />
      
      {/* Guard routes */}
      <Route path="/guard/*" element={
        <ProtectedRoute allowedRoles={[2]}>
          <GuardDashboard />
        </ProtectedRoute>
      } />
      
      {/* Catch all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="App">
          <Toaster position="top-right" />
          <AppRoutes />
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
