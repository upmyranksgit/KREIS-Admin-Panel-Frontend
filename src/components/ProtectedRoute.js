import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../services/authService';

const ProtectedRoute = ({ children, role }) => {
  const isAuthenticated = authService.isAuthenticated();
  const user = authService.getCurrentUser();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Map backend roles to route roles (case-insensitive)
  const roleMapping = {
    'superadmin': 'superadmin',
    'instituteadmin': 'institute',
    'branchadmin': 'branch',
    'teacher': 'institute',
    'student': 'branch'
  };

  const userRouteRole = roleMapping[user?.role?.toLowerCase()];

  if (role && userRouteRole !== role) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
