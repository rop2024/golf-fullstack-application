import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDashboard } from '../hooks/useDashboard';
import { useSubscription } from '../hooks/useSubscription';
import { useNavigate } from 'react-router-dom';
import BalanceCard from '../components/BalanceCard';
import SubscriptionCard from '../components/SubscriptionCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = () => {
  const { user, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();
  const { dashboardData, loading: dashboardLoading, refreshDashboard } = useDashboard();
  const { balance, isPremium, upgradeSubscription, cancelSubscription, loading: subLoading } = useSubscription();

  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleUpgrade = async (plan) => {
    const result = await upgradeSubscription(plan);
    if (result.success) {
      refreshDashboard();
    }
  };

  const handleCancelSubscription = async () => {
    if (window.confirm('Are you sure you want to cancel your subscription? You will lose all premium benefits.')) {
      const result = await cancelSubscription();
      if (result.success) {
        refreshDashboard();
      }
    }
  };

  if (authLoading || dashboardLoading) {
    return <LoadingSpinner fullScreen />;
  }

  const { stats, recentScores, activeDraw } = dashboardData;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation Bar */}
      <nav className="relative bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-blue-600/60 via-blue-600/20 to-transparent backdrop-blur-sm"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex justify-between h-16">
            <div className="flex space-x-8">
              <button
                onClick={() => navigate('/dashboard')}
                className="inline-flex items-center px-1 pt-1 border-b-2 border-white text-sm font-medium text-white"
              >
                Dashboard
              </button>
              <button
                onClick={() => navigate('/scores')}
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-blue-100 hover:text-white hover:border-white/50"
              >
                Scores
              </button>
              <button
                onClick={() => navigate('/draw')}
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-blue-100 hover:text-white hover:border-white/50"
              >
                Draw
              </button>
              <button
                onClick={() => navigate('/winners')}
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-blue-100 hover:text-white hover:border-white/50"
              >
                Winners
              </button>
              <button
                onClick={() => navigate('/subscription')}
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-blue-100 hover:text-white hover:border-white/50"
              >
                Subscription
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-blue-100">
                {greeting}, {user?.profile?.username || user?.email?.split('@')[0]}!
              </span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 border border-white/20 text-sm leading-4 font-medium rounded-md text-white bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50 transition duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="py-20">
        <header className="relative">
          <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-blue-600/60 via-blue-600/20 to-transparent backdrop-blur-sm"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Dashboard</h1>
            <p className="text-xl text-gray-300 mb-8">
              Welcome back! Here's your activity summary.
            </p>
          </div>
        </header>

        <main className="relative">
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                {/* Score Stats */}
                <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-md p-3">
                      <span className="material-icons text-white">trending_up</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-400">Average Score</p>
                      <p className="text-2xl font-semibold text-white">{stats.scores.average}</p>
                      <p className="text-xs text-gray-500">{stats.scores.count} scores recorded</p>
                    </div>
                  </div>
                </div>

                {/* Highest Score */}
                <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-md p-3">
                      <span className="material-icons text-white">arrow_upward</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-400">Highest Score</p>
                      <p className="text-2xl font-semibold text-white">{stats.scores.highest}</p>
                      <p className="text-xs text-gray-500">Personal best</p>
                    </div>
                  </div>
                </div>

                {/* Winnings */}
                <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-gradient-to-br from-green-500 to-emerald-600 rounded-md p-3">
                      <span className="material-icons text-white">account_balance_wallet</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-400">Total Winnings</p>
                      <p className="text-2xl font-semibold text-green-400">${stats.winnings.total.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">{stats.winnings.count} wins</p>
                    </div>
                  </div>
                </div>

                {/* Draw Entries */}
                <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-gradient-to-br from-purple-500 to-pink-600 rounded-md p-3">
                      <span className="material-icons text-white">confirmation_number</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-400">Draw Entries</p>
                      <p className="text-2xl font-semibold text-white">{stats.entriesCount}</p>
                      <p className="text-xs text-gray-500">Total entries</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Scores and Active Draw */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Recent Scores */}
                <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700">
                  <div className="px-6 py-4 border-b border-gray-700 bg-gray-900/50">
                    <h3 className="text-lg font-semibold text-white">Recent Scores</h3>
                  </div>
                  <div className="divide-y divide-gray-700">
                    {recentScores && recentScores.length > 0 ? (
                      recentScores.slice(0, 5).map((score, index) => (
                        <div key={score.id} className="px-6 py-4 flex justify-between items-center">
                          <div>
                            <p className="text-sm text-gray-400">Score #{index + 1}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(score.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-2xl font-bold text-blue-400">{score.value}</div>
                        </div>
                      ))
                    ) : (
                      <div className="px-6 py-8 text-center text-gray-400">
                        No scores yet. Start adding scores!
                      </div>
                    )}
                  </div>
                  {recentScores && recentScores.length > 0 && (
                    <div className="px-6 py-4 bg-gray-900/50 border-t border-gray-700">
                      <button
                        onClick={() => navigate('/scores')}
                        className="text-sm text-blue-400 hover:text-blue-300 transition duration-200"
                      >
                        View all scores →
                      </button>
                    </div>
                  )}
                </div>

                {/* Active Draw */}
                <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700">
                  <div className="px-6 py-4 border-b border-gray-700 bg-gray-900/50">
                    <h3 className="text-lg font-semibold text-white">Active Draw</h3>
                  </div>
                  <div className="px-6 py-6">
                    {activeDraw ? (
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-sm text-gray-400">Draw #{activeDraw.id?.slice(0, 8)}</span>
                          <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full border border-yellow-500/30">Active</span>
                        </div>
                        <p className="text-2xl font-bold text-green-400 mb-4">${activeDraw.prize_pool?.toLocaleString()}</p>
                        <p className="text-sm text-gray-400 mb-4">Prize Pool</p>
                        <button
                          onClick={() => navigate('/draw')}
                          className="w-full py-2 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition duration-200 shadow-lg"
                        >
                          Enter Draw Now
                        </button>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-400">No active draws at the moment.</p>
                        <p className="text-sm text-gray-500 mt-2">Check back soon!</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Balance and Subscription */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <BalanceCard balance={balance} onRefresh={() => {}} />
                <SubscriptionCard
                  subscription={null}
                  isPremium={isPremium}
                  onUpgrade={handleUpgrade}
                  onCancel={handleCancelSubscription}
                  loading={subLoading}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;