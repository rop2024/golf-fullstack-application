import React from 'react';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const AdminGuard = ({ children, fallback = null }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  const isAdmin = user?.profile?.role === 'admin';

  if (!isAdmin) {
    if (fallback) return fallback;

    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="text-center">
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
            <p className="text-gray-300">
              You don't have permission to access this page.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default AdminGuard;