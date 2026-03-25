import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useScores } from '../hooks/useScore';
import ScoreForm from '../components/ScoreForm';
import ScoreList from '../components/ScoreList';
import ScoreChart from '../components/ScoreChart';
import { useNavigate } from 'react-router-dom';

const Scores = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const {
    scores,
    stats,
    loading: scoresLoading,
    error,
    remainingSlots,
    addScore,
    deleteScore,
    hasScores,
    isMaxScores
  } = useScores();

  const [showSuccess, setShowSuccess] = useState(false);

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  const handleAddScore = async (value) => {
    const result = await addScore(value);
    if (result.success) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const handleDeleteScore = async (scoreId) => {
    if (window.confirm('Are you sure you want to delete this score?')) {
      await deleteScore(scoreId);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex space-x-8">
              <button
                onClick={() => navigate('/dashboard')}
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
              >
                Dashboard
              </button>
              <button
                onClick={() => navigate('/scores')}
                className="inline-flex items-center px-1 pt-1 border-b-2 border-indigo-500 text-sm font-medium text-gray-900"
              >
                Scores
              </button>
              <button
                onClick={() => navigate('/draw')}
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
              >
                Draw
              </button>
              <button
                onClick={() => navigate('/winners')}
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
              >
                Winners
              </button>
              <button
                onClick={() => navigate('/subscription')}
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
              >
                Subscription
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Welcome, {user?.profile?.username || user?.email}</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">Score Management</h1>
            <p className="mt-2 text-sm text-gray-600">
              You can store up to 5 scores. {remainingSlots} slot{remainingSlots !== 1 ? 's' : ''} remaining.
            </p>
          </div>
        </header>

        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            {/* Success Message */}
            {showSuccess && (
              <div className="mb-4 rounded-md bg-green-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">Score added successfully!</p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-4 rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="px-4 py-8 sm:px-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Add Score Form */}
                <div>
                  {!isMaxScores ? (
                    <ScoreForm onSubmit={handleAddScore} loading={scoresLoading} />
                  ) : (
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-yellow-700">
                            You have reached the maximum of 5 scores. Delete some scores to add new ones.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Score Statistics */}
                  {hasScores && <ScoreChart scores={scores} />}
                </div>

                {/* Right Column - Score List */}
                <div>
                  <ScoreList
                    scores={scores}
                    onDelete={handleDeleteScore}
                    loading={scoresLoading}
                  />

                  {/* Stats Summary */}
                  {hasScores && (
                    <div className="mt-4 bg-white rounded-lg shadow-md p-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500">Total Scores</p>
                          <p className="text-lg font-semibold text-gray-900">{stats.count}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Total Points</p>
                          <p className="text-lg font-semibold text-gray-900">{stats.total}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Scores;