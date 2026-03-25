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
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex space-x-8">
              <button
                onClick={() => navigate('/dashboard')}
                className="inline-flex items-center px-1 pt-1 border-b-2 border-indigo-500 text-sm font-medium text-gray-900"
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
              <span className="text-sm text-gray-700">
                {greeting}, {user?.profile?.username || user?.email?.split('@')[0]}!
              </span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-sm text-gray-600">
              Welcome back! Here's your activity summary.
            </p>
          </div>
        </header>

        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                {/* Score Stats */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                      <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Average Score</p>
                      <p className="text-2xl font-semibold text-gray-900">{stats.scores.average}</p>
                      <p className="text-xs text-gray-400">{stats.scores.count} scores recorded</p>
                    </div>
                  </div>
                </div>

                {/* Highest Score */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                      <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Highest Score</p>
                      <p className="text-2xl font-semibold text-gray-900">{stats.scores.highest}</p>
                      <p className="text-xs text-gray-400">Personal best</p>
                    </div>
                  </div>
                </div>

                {/* Winnings */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                      <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Total Winnings</p>
                      <p className="text-2xl font-semibold text-green-600">${stats.winnings.total.toLocaleString()}</p>
                      <p className="text-xs text-gray-400">{stats.winnings.count} wins</p>
                    </div>
                  </div>
                </div>

                {/* Draw Entries */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                      <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5h14a2 2 0 012 2v3a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Draw Entries</p>
                      <p className="text-2xl font-semibold text-gray-900">{stats.entriesCount}</p>
                      <p className="text-xs text-gray-400">Total entries</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Scores and Active Draw */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Recent Scores */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Scores</h3>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {recentScores && recentScores.length > 0 ? (
                      recentScores.slice(0, 5).map((score, index) => (
                        <div key={score.id} className="px-6 py-4 flex justify-between items-center">
                          <div>
                            <p className="text-sm text-gray-500">Score #{index + 1}</p>
                            <p className="text-xs text-gray-400">
                              {new Date(score.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-2xl font-bold text-indigo-600">{score.value}</div>
                        </div>
                      ))
                    ) : (
                      <div className="px-6 py-8 text-center text-gray-500">
                        No scores yet. Start adding scores!
                      </div>
                    )}
                  </div>
                  {recentScores && recentScores.length > 0 && (
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                      <button
                        onClick={() => navigate('/scores')}
                        className="text-sm text-indigo-600 hover:text-indigo-800"
                      >
                        View all scores →
                      </button>
                    </div>
                  )}
                </div>

                {/* Active Draw */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="text-lg font-semibold text-gray-900">Active Draw</h3>
                  </div>
                  <div className="px-6 py-6">
                    {activeDraw ? (
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-sm text-gray-500">Draw #{activeDraw.id?.slice(0, 8)}</span>
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Active</span>
                        </div>
                        <p className="text-2xl font-bold text-green-600 mb-4">${activeDraw.prize_pool?.toLocaleString()}</p>
                        <p className="text-sm text-gray-600 mb-4">Prize Pool</p>
                        <button
                          onClick={() => navigate('/draw')}
                          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                          Enter Draw Now
                        </button>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No active draws at the moment.</p>
                        <p className="text-sm text-gray-400 mt-2">Check back soon!</p>
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