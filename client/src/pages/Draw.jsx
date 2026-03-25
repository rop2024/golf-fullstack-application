import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDraw } from '../hooks/useDraw';
import { useSubscription } from '../hooks/useSubscription';
import NumberPicker from '../components/NumberPicker';
import DrawCard from '../components/DrawCard';
import LoadingSpinner from '../components/LoadingSpinner';
import UpgradePrompt from '../components/UpgradePrompt';
import { useNavigate } from 'react-router-dom';

const Draw = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const {
    activeDraw,
    draws,
    userEntries,
    loading,
    error,
    submitEntry,
    generateRandomNumbers,
    hasEnteredDraw,
    getUserEntryForDraw,
    fetchActiveDraw,
    fetchDraws
  } = useDraw();

  const {
    isActive,
    isPremium,
    getFeatureLimit,
    canPerformAction
  } = useSubscription();

  const [showEntryForm, setShowEntryForm] = useState(false);
  const [selectedDrawId, setSelectedDrawId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [randomNumbers, setRandomNumbers] = useState([]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  // Fetch draws on mount
  useEffect(() => {
    if (user) {
      fetchActiveDraw();
      fetchDraws('completed', 10);
    }
  }, [user]);

  const handleEnterDraw = (drawId) => {
    if (!isActive) {
      alert('You need an active subscription to enter draws!');
      navigate('/subscription');
      return;
    }
    setSelectedDrawId(drawId);
    setShowEntryForm(true);
  };

  const handleSubmitNumbers = async (numbers) => {
    const result = await submitEntry(selectedDrawId, numbers);
    if (result.success) {
      setShowEntryForm(false);
      setSuccessMessage('Entry submitted successfully! Good luck!');
      setTimeout(() => setSuccessMessage(''), 3000);
      await fetchActiveDraw();
      await fetchDraws('completed', 10);
    }
  };

  const handleGenerateRandom = async () => {
    const numbers = await generateRandomNumbers();
    if (numbers) {
      setRandomNumbers(numbers);
    }
  };

  const handleViewWinners = (drawId) => {
    navigate(`/winners?drawId=${drawId}`);
  };

  if (authLoading) {
    return <LoadingSpinner fullScreen />;
  }

  const maxEntries = getFeatureLimit('maxDrawEntries');
  const canEnter = canPerformAction('enter_draw');

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
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
              >
                Scores
              </button>
              <button
                onClick={() => navigate('/draw')}
                className="inline-flex items-center px-1 pt-1 border-b-2 border-indigo-500 text-sm font-medium text-gray-900"
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
              <span className="text-sm text-gray-700">
                Plan: <span className="font-semibold capitalize">{isActive ? 'Premium' : 'Free'}</span>
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">Lottery Draw</h1>
            <p className="mt-2 text-sm text-gray-600">
              {canEnter ? (
                `Pick 5 numbers between 1-50 for a chance to win! (${maxEntries} entries allowed per month)`
              ) : (
                'Upgrade to premium to participate in draws and win prizes!'
              )}
            </p>
          </div>
        </header>

        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            {/* Success Message */}
            {successMessage && (
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
              {!canEnter ? (
                <UpgradePrompt
                  requiredPlan="premium"
                  feature="Draw Participation"
                />
              ) : (
                <>
                  {/* Active Draw Section */}
                  {activeDraw && (
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Active Draw</h2>
                      <DrawCard
                        draw={activeDraw}
                        userEntry={getUserEntryForDraw(activeDraw.id)}
                        onEnterDraw={handleEnterDraw}
                        onViewWinners={handleViewWinners}
                        isAdmin={user?.role === 'admin'}
                      />
                    </div>
                  )}

                  {/* Entry Form Modal */}
                  {showEntryForm && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                      <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-lg bg-white">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-xl font-semibold text-gray-900">Enter Draw</h3>
                          <button
                            onClick={() => setShowEntryForm(false)}
                            className="text-gray-400 hover:text-gray-500"
                          >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        <NumberPicker
                          onSubmit={handleSubmitNumbers}
                          loading={loading}
                          initialNumbers={randomNumbers}
                        />
                        <div className="mt-4 text-center">
                          <button
                            onClick={handleGenerateRandom}
                            className="text-indigo-600 hover:text-indigo-800 text-sm"
                          >
                            Or generate random numbers
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Past Draws */}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Past Draws</h2>
                    {loading && !activeDraw ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                      </div>
                    ) : draws.length === 0 ? (
                      <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="mt-2 text-gray-500">No draws available yet.</p>
                        <p className="text-sm text-gray-400">Check back soon for new draws!</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {draws.map((draw) => (
                          <DrawCard
                            key={draw.id}
                            draw={draw}
                            userEntry={getUserEntryForDraw(draw.id)}
                            onEnterDraw={handleEnterDraw}
                            onViewWinners={handleViewWinners}
                            isAdmin={user?.role === 'admin'}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Draw;