import React from 'react';
import { Navigate }  from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRole }) => {
  // Retrieve user data stored during login
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  if (!token) {
    // Not logged in? Go to home/login
    return <Navigate to="/" replace />;
  }

  if (allowedRole && userRole !== allowedRole) {
    // Logged in but wrong role? Deny access
    alert("Access Denied: This area is restricted.");
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;