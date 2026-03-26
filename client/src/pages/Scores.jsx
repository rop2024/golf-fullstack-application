import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import ScoreForm from '../components/ScoreForm';
import ScoreList from '../components/ScoreList';
import ScoreChart from '../components/ScoreChart';
import { useScores } from '../hooks/useScores';

const Scores = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { scores, stats, loading, error, remainingSlots, plan, features, addScore, deleteScore } = useScores();

  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);

  const handleAddScore = async (value) => {
    const result = await addScore(value);
    if (!result.success) {
      if (result.requiresUpgrade) {
        setShowUpgradePrompt(true);
        // Auto-hide the prompt after 5 seconds
        setTimeout(() => setShowUpgradePrompt(false), 5000);
      } else {
        console.error(result.error);
      }
    }
  };

  const handleDeleteScore = async (scoreId) => {
    const result = await deleteScore(scoreId);
    if (!result.success) {
      // Error handling can be added here
      console.error(result.error);
    }
  };

  const handleUpgradeClick = () => {
    navigate('/subscription');
  };

  const maxScores = features?.maxScores || 5;
  const usedScores = maxScores - remainingSlots;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar activePage="scores" />

      {/* Main Content */}
      <div className="py-20">
        <header className="relative py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Score Management</h1>
            <p className="text-xl text-gray-300 mb-8">
              Track your golf scores and manage your entries
            </p>
          </div>
        </header>

        {/* Upgrade Prompt Notification */}
        {showUpgradePrompt && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
            <div className="bg-gradient-to-r from-amber-900 to-orange-900 border border-amber-600 rounded-lg p-4 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="material-icons text-amber-400 mr-3">warning</span>
                  <div>
                    <h4 className="text-white font-semibold">Free Plan Limit Reached</h4>
                    <p className="text-amber-200 text-sm">You've reached the 5-score limit. Upgrade to Premium for unlimited scores and advanced features.</p>
                  </div>
                </div>
                <button
                  onClick={handleUpgradeClick}
                  className="bg-white text-amber-900 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 shadow-lg text-sm"
                >
                  Upgrade Now
                </button>
              </div>
            </div>
          </div>
        )}

        <main className="relative">
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              {/* Limits and Usage Display */}
              <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700 mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Score Limits</h3>
                    <p className="text-gray-300 text-sm">
                      {plan === 'free' ? 'Free Plan' : `${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan`}: 
                      {usedScores} of {maxScores} scores used
                    </p>
                    <div className="mt-2 bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(usedScores / maxScores) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {plan === 'free' && (
                    <div className="text-right">
                      <button
                        onClick={handleUpgradeClick}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105"
                      >
                        Upgrade to Premium
                      </button>
                      <p className="text-xs text-gray-400 mt-1">Unlimited scores & more features</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Add New Score */}
                <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
                  <ScoreForm onSubmit={handleAddScore} loading={loading} />
                </div>

                {/* Score Statistics - Only for subscribers */}
                {features?.canViewStats ? (
                  <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
                    <ScoreChart scores={scores} />
                  </div>
                ) : (
                  <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
                    <div className="text-center py-8">
                      <div className="text-6xl mb-4 text-indigo-400">
                        <span className="material-icons">analytics</span>
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">Advanced Analytics</h3>
                      <p className="text-gray-300 text-sm mb-4">
                        Unlock detailed score statistics, charts, and insights with a premium subscription.
                      </p>
                      <button
                        onClick={handleUpgradeClick}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105"
                      >
                        Upgrade to Premium
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Your Scores */}
              <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700">
                <ScoreList scores={scores} onDelete={handleDeleteScore} loading={loading} />
              </div>

              {/* Premium Features Advertisement */}
              {plan === 'free' && (
                <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-lg shadow-lg border border-indigo-700 p-6 mt-8">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2 flex items-center">
                        <span className="material-icons text-purple-400 mr-2">rocket_launch</span>
                        Unlock Premium Features
                      </h3>
                      <ul className="text-gray-300 text-sm space-y-1 mb-4">
                        <li>✓ Unlimited score submissions</li>
                        <li>✓ Advanced statistics & analytics</li>
                        <li>✓ Priority customer support</li>
                        <li>✓ Export your score data</li>
                      </ul>
                    </div>
                    <div className="ml-6">
                      <button
                        onClick={handleUpgradeClick}
                        className="bg-white text-indigo-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 shadow-lg"
                      >
                        Upgrade Now
                      </button>
                    </div>
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