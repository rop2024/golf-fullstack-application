import React from 'react';
import { useAuth } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import LoadingSpinner from './components/LoadingSpinner';

const Home = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!user) {
    // Redirect to landing page if not authenticated
    window.location.href = '/';
    return <LoadingSpinner fullScreen />;
  }

  return <Dashboard />;
};

export default Home;