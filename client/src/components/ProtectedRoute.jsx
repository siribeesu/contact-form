// src/components/ProtectedRoute.jsx
// Wraps routes that require admin authentication

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Spinner from './Spinner';

/**
 * Renders children if authenticated, redirects to login otherwise
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Wait for localStorage check to complete
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-navy-900">
        <Spinner size="lg" text="Loading..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
