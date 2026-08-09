import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

/**
 * ProtectedRoute — Route guard component
 * 
 * Wraps routes that require authentication. Optionally restricts to admin users.
 * 
 * Props:
 *   - children: The page component to render if authorized
 *   - adminOnly: If true, only users with role='admin' can access
 * 
 * Behavior:
 *   - Not authenticated → redirect to /login?redirect=<current_path>
 *   - Authenticated but not admin (when adminOnly=true) → redirect to / with toast
 *   - Authorized → render children
 */
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();
  const { showToast } = useToast();

  if (!isAuthenticated) {
    // Preserve the intended destination so we can redirect back after login
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (adminOnly && !isAdmin) {
    // Show a toast notification and redirect non-admin users
    // Using setTimeout to avoid updating state during render
    setTimeout(() => {
      showToast('Access denied. Admin privileges required.', 'error');
    }, 0);
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
