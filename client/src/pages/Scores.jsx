import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useScores } from '../hooks/useScores';
import { useSubscription } from '../hooks/useSubscription';
import ScoreForm from '../components/ScoreForm';
import ScoreList from '../components/ScoreList';
import ScoreChart from '../components/ScoreChart';
import LoadingSpinner from '../components/LoadingSpinner';
import SubscriptionGuard from '../components/SubscriptionGuard';
import FeatureLock from '../components/FeatureLock';
import UpgradePrompt from '../components/UpgradePrompt';
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
    isMaxScores,
    fetchScores
  } = useScores();

  const {
    isPremium,
    isPro,
    getFeatureLimit,
    canPerformAction
  } = useSubscription();

  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showBulkForm, setShowBulkForm] = useState(false);
  const [bulkScores, setBulkScores] = useState('');

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  const handleAddScore = async (value) => {
    const result = await addScore(value);
    if (result.success) {
      setSuccessMessage(`Score ${value} added successfully!`);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const handleDeleteScore = async (scoreId) => {
    if (window.confirm('Are you sure you want to delete this score?')) {
      const result = await deleteScore(scoreId);
      if (result.success) {
        setSuccessMessage('Score deleted successfully!');
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    }
  };

  const handleBulkSubmit = async () => {
    const scoresArray = bulkScores.split(',').map(s => parseInt(s.trim()));
    if (scoresArray.some(isNaN)) {
      alert('Please enter valid numbers');
      return;
    }

    // This would call a bulk submit API
    alert('Bulk submit feature would be implemented here');
  };

  const maxScores = getFeatureLimit('maxScores');
  const canSubmit = canPerformAction('submit_score');
  const canBulkSubmit = canPerformAction('bulk_submit');

  if (authLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation Bar */}
      <nav className="relative bg-gray-800 shadow-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex justify-between h-16">
            <div className="flex space-x-8">
              <button
                onClick={() => navigate('/dashboard')}
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-300 hover:text-white hover:border-white/50"
              >
                Dashboard
              </button>
              <button
                onClick={() => navigate('/scores')}
                className="inline-flex items-center px-1 pt-1 border-b-2 border-white text-sm font-medium text-white"
              >
                Scores
              </button>
              <button
                onClick={() => navigate('/draw')}
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-300 hover:text-white hover:border-white/50"
              >
                Draw
              </button>
              <button
                onClick={() => navigate('/winners')}
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-300 hover:text-white hover:border-white/50"
              >
                Winners
              </button>
              <button
                onClick={() => navigate('/subscription')}
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-300 hover:text-white hover:border-white/50"
              >
                Subscription
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-300">
                Plan: <span className="font-semibold capitalize">{isPremium ? 'Premium' : 'Free'}</span>
              </span>
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
              {canSubmit ? (
                `You can store up to ${maxScores} scores. ${remainingSlots} slot${remainingSlots !== 1 ? 's' : ''} remaining.`
              ) : (
                'Upgrade to premium to start tracking your scores!'
              )}
            </p>
          </div>
        </header>

        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            {/* Success Message */}
            {showSuccess && (
              <div className="mb-4 rounded-md bg-green-50 p-4 animate-fade-in">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">{successMessage}</p>
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
              {!canSubmit ? (
                <UpgradePrompt
                  requiredPlan="premium"
                  feature="Score Tracking"
                />
              ) : (
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
                              You have reached the maximum of {maxScores} scores. Delete some scores or upgrade to add more.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Bulk Score Submission (Premium Feature) */}
                    {canBulkSubmit && (
                      <div className="mt-6">
                        <button
                          onClick={() => setShowBulkForm(!showBulkForm)}
                          className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                        >
                          {showBulkForm ? '−' : '+'} Bulk Score Submission
                        </button>

                        {showBulkForm && (
                          <div className="mt-4 bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Bulk Add Scores</h3>
                            <textarea
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                              placeholder="Enter scores separated by commas (e.g., 85, 92, 78, 95)"
                              value={bulkScores}
                              onChange={(e) => setBulkScores(e.target.value)}
                            />
                            <button
                              onClick={handleBulkSubmit}
                              className="mt-3 w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                            >
                              Submit All
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Score Statistics - Premium Feature */}
                    {hasScores && (
                      <SubscriptionGuard requiredPlan="premium" feature="Advanced Statistics">
                        <ScoreChart scores={scores} />
                      </SubscriptionGuard>
                    )}
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
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Score Summary</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-500">Total Scores</p>
                            <p className="text-lg font-semibold text-gray-900">{stats.count}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Total Points</p>
                            <p className="text-lg font-semibold text-gray-900">{stats.total}</p>
                          </div>
                          {isPremium && (
                            <>
                              <div>
                                <p className="text-xs text-gray-500">Average</p>
                                <p className="text-lg font-semibold text-gray-900">{stats.average}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Range</p>
                                <p className="text-lg font-semibold text-gray-900">{stats.lowest} - {stats.highest}</p>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Scores;