import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDraw } from '../hooks/useDraw';
import NumberPicker from '../components/NumberPicker';
import DrawCard from '../components/DrawCard';
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
    getUserEntryForDraw
  } = useDraw();

  const [showEntryForm, setShowEntryForm] = useState(false);
  const [selectedDrawId, setSelectedDrawId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  const handleEnterDraw = (drawId) => {
    setSelectedDrawId(drawId);
    setShowEntryForm(true);
  };

  const handleSubmitNumbers = async (numbers) => {
    const result = await submitEntry(selectedDrawId, numbers);
    if (result.success) {
      setShowEntryForm(false);
      setSuccessMessage('Entry submitted successfully! Good luck!');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleViewWinners = (drawId) => {
    navigate(`/winners?drawId=${drawId}`);
  };

  const handleGenerateRandom = async () => {
    const numbers = await generateRandomNumbers();
    if (numbers && selectedDrawId) {
      await handleSubmitNumbers(numbers);
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
              <span className="text-sm text-gray-700">Welcome, {user?.profile?.username || user?.email}</span>
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
              Pick 5 numbers between 1-50 for a chance to win!
            </p>
          </div>
        </header>

        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            {/* Success Message */}
            {successMessage && (
              <div className="mb-4 rounded-md bg-green-50 p-4">
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
                    <p className="text-gray-500">No draws available yet.</p>
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
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Draw;