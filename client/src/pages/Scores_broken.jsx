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

      {/* Header */}
      <header className="relative py-16 px-4 sm:px-6 lg:px-8 bg-gray-800">
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-gray-800 via-gray-800 to-transparent backdrop-blur-sm"></div>
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Score Management
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Track your golf scores and manage your entries
          </p>
          <div className="bg-gray-700 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-sm text-gray-300">
              <span className="font-semibold text-white">{maxScores}</span> score slots available •{' '}
              <span className="font-semibold text-white">{remainingSlots}</span> remaining
              {!isPremium && !isPro && remainingSlots > 0 && (
                <span className="block mt-1 text-blue-400">
                  Upgrade for unlimited scores and advanced features
                </span>
              )}
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Success Message */}
          {showSuccess && (
            <div className="mb-6 rounded-lg bg-green-900 border border-green-600 p-4 animate-fade-in">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-300">{successMessage}</p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 rounded-lg bg-red-900 border border-red-600 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-300">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {/* Add Score Form */}
            <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
                {!isMaxScores ? (
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-white mb-4">Add New Score</h2>
                    <ScoreForm onSubmit={handleAddScore} loading={scoresLoading} />

                    {!isPremium && !isPro && (
                      <div className="mt-6 bg-blue-900 border border-blue-600 rounded-lg p-4">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-blue-300">
                              <span className="font-semibold">{remainingSlots}</span> free slots remaining.{' '}
                              <button
                                onClick={() => navigate('/subscription')}
                                className="font-medium text-blue-400 hover:text-blue-300 underline"
                              >
                                Upgrade for unlimited scores
                              </button>
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-6">
                    <div className="bg-yellow-900 border border-yellow-600 rounded-lg p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-yellow-300">
                            Maximum of <span className="font-semibold">{maxScores}</span> scores reached.{' '}
                            {!isPremium && !isPro && (
                              <button
                                onClick={() => navigate('/subscription')}
                                className="font-medium text-yellow-400 hover:text-yellow-300 underline"
                              >
                                Upgrade to add more
                              </button>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bulk Score Submission (Premium Feature) */}
                {canBulkSubmit && (
                  <div className="border-t border-gray-700">
                    <button
                      onClick={() => setShowBulkForm(!showBulkForm)}
                      className="w-full px-6 py-4 text-left text-indigo-400 hover:text-indigo-300 hover:bg-gray-700 transition-colors flex items-center justify-between"
                    >
                      <span className="font-medium">Bulk Score Submission</span>
                      <svg className={`h-5 w-5 transform transition-transform ${showBulkForm ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {showBulkForm && (
                      <div className="px-6 pb-6">
                        <div className="bg-gray-700 rounded-lg p-4">
                          <h3 className="text-lg font-semibold text-white mb-4">Bulk Add Scores</h3>
                          <textarea
                            rows={3}
                            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Enter scores separated by commas (e.g., 85, 92, 78, 95)"
                            value={bulkScores}
                            onChange={(e) => setBulkScores(e.target.value)}
                          />
                          <button
                            onClick={handleBulkSubmit}
                            className="mt-3 w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                          >
                            Submit All Scores
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

            {/* Score List and Stats */}
            {/* Score List */}
            <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6">
              <h2 className="text-xl font-bold text-white mb-4">Your Scores</h2>
              <ScoreList
                scores={scores}
                onDelete={handleDeleteScore}
                loading={scoresLoading}
              />
            </div>

            {/* Score Statistics */}
            {hasScores && (
              <>
                {/* Stats Summary */}
                <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Score Summary</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-700 rounded-lg p-3">
                      <p className="text-xs text-gray-400 uppercase tracking-wide">Total Scores</p>
                      <p className="text-2xl font-bold text-white">{stats.count}</p>
                    </div>
                    <div className="bg-gray-700 rounded-lg p-3">
                      <p className="text-xs text-gray-400 uppercase tracking-wide">Total Points</p>
                      <p className="text-2xl font-bold text-white">{stats.total}</p>
                    </div>
                    {isPremium && (
                      <>
                        <div className="bg-gray-700 rounded-lg p-3">
                          <p className="text-xs text-gray-400 uppercase tracking-wide">Average</p>
                          <p className="text-2xl font-bold text-white">{stats.average}</p>
                        </div>
                        <div className="bg-gray-700 rounded-lg p-3">
                          <p className="text-xs text-gray-400 uppercase tracking-wide">Range</p>
                          <p className="text-lg font-bold text-white">{stats.lowest} - {stats.highest}</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Score Chart - Premium Feature */}
                {/* <SubscriptionGuard requiredPlan="premium" feature="Advanced Statistics">
                  <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Score Trends</h3>
                    <ScoreChart scores={scores} />
                  </div>
                </SubscriptionGuard> */}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Scores;