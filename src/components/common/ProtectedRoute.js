import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If allowedRoles is specified, check if user has required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.roleId)) {
    // Redirect based on user role
    if (user?.roleId === 1) {
      return <Navigate to="/admin" replace />;
    } else if (user?.roleId === 3) {
      return <Navigate to="/owner" replace />;
    } else if (user?.roleId === 4) {
      return <Navigate to="/guard" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute; 