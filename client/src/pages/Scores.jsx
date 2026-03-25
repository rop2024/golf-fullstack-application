import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ScoreForm from '../components/ScoreForm';
import ScoreList from '../components/ScoreList';
import ScoreChart from '../components/ScoreChart';
import { useScores } from '../hooks/useScores';

const Scores = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { scores, stats, loading, error, remainingSlots, plan, features, addScore, deleteScore } = useScores();

  const [greeting, setGreeting] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) setGreeting('Good Morning');
    else if (hour >= 12 && hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest('.user-dropdown')) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleAddScore = async (value) => {
    const result = await addScore(value);
    if (!result.success) {
      // Error handling can be added here
      console.error(result.error);
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
              {/* User Dropdown */}
              <div className="relative user-dropdown">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  <span className="material-icons text-gray-300">person</span>
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-50">
                    {/* User Info Header */}
                    <div className="px-4 py-3 border-b border-gray-700">
                      <p className="text-sm font-medium text-white">
                        {user?.profile?.username || user?.email?.split('@')[0]}
                      </p>
                      <p className="text-xs text-gray-400">{user?.email}</p>
                      <p className="text-xs text-gray-500 mt-1">{greeting}!</p>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          navigate('/settings');
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition duration-200 flex items-center"
                      >
                        <span className="material-icons text-base mr-3">person</span>
                        Profile Settings
                      </button>

                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          navigate('/subscription');
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition duration-200 flex items-center"
                      >
                        <span className="material-icons text-base mr-3">credit_card</span>
                        Subscription
                      </button>

                      <div className="border-t border-gray-700 my-1"></div>

                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          handleLogout();
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition duration-200 flex items-center"
                      >
                        <span className="material-icons text-base mr-3">logout</span>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

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

                {/* Score Statistics */}
                <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
                  <ScoreChart scores={scores} />
                </div>
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
                      <h3 className="text-xl font-bold text-white mb-2">🚀 Unlock Premium Features</h3>
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