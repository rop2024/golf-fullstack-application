import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWinners } from '../hooks/useWinners';
import Navbar from '../components/Navbar';
import WinnerCard from '../components/WinnerCard';
import PrizeDistribution from '../components/PrizeDistribution';
import WinnerCelebration from '../components/WinnerCelebration';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Winners = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const drawIdParam = searchParams.get('drawId');

  const {
    winnings,
    winningsStats,
    topWinners,
    winnerStats,
    loading,
    error,
    claimPrize,
    getDrawWinners,
    getPrizeDistribution
  } = useWinners();

  const [selectedDrawId, setSelectedDrawId] = useState(drawIdParam);
  const [drawWinners, setDrawWinners] = useState([]);
  const [drawDistribution, setDrawDistribution] = useState([]);
  const [selectedDraw, setSelectedDraw] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationPrize, setCelebrationPrize] = useState(null);
  const [activeTab, setActiveTab] = useState('my-winnings'); // 'my-winnings', 'leaderboard', 'statistics'

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  // Fetch draw winners when selected draw changes
  useEffect(() => {
    if (selectedDrawId) {
      fetchDrawWinners(selectedDrawId);
    }
  }, [selectedDrawId]);

  const fetchDrawWinners = async (drawId) => {
    const result = await getDrawWinners(drawId);
    if (result.success) {
      setDrawWinners(result.data.winners);
      setDrawDistribution(result.data.distribution);
    }
  };

  const handleClaimPrize = async (winnerId, prizeAmount, matchCount) => {
    const result = await claimPrize(winnerId);
    if (result.success) {
      setCelebrationPrize({ amount: prizeAmount, matchCount });
      setShowCelebration(true);
    }
  };

  const handleViewDrawWinners = (drawId) => {
    setSelectedDrawId(drawId);
    navigate(`/winners?drawId=${drawId}`);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar activePage="winners" />

      {/* Main Content */}
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-white">Winners & Prizes</h1>
            <p className="mt-2 text-sm text-gray-600">
              View your winnings, top winners, and prize distribution
            </p>
          </div>
        </header>

        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            {/* Error Message */}
            {error && (
              <div className="mb-4 rounded-md bg-red-900 border border-red-700 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <span className="material-icons text-red-400">error</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-200">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="px-4 py-8 sm:px-0">
              {/* Tabs */}
              <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveTab('my-winnings')}
                    className={`${
                      activeTab === 'my-winnings'
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    My Winnings
                    {winningsStats.pendingWins > 0 && (
                      <span className="ml-2 bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full text-xs">
                        {winningsStats.pendingWins} pending
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('leaderboard')}
                    className={`${
                      activeTab === 'leaderboard'
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    Leaderboard
                  </button>
                  <button
                    onClick={() => setActiveTab('statistics')}
                    className={`${
                      activeTab === 'statistics'
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    Statistics
                  </button>
                </nav>
              </div>

              {/* My Winnings Tab */}
              {activeTab === 'my-winnings' && (
                <div>
                  {/* Summary Cards */}
                  {winningsStats.totalWins > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-md p-6 text-white">
                        <p className="text-sm opacity-90">Total Won</p>
                        <p className="text-3xl font-bold">${winningsStats.totalWon.toLocaleString()}</p>
                      </div>
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-md p-6 text-white">
                        <p className="text-sm opacity-90">Total Wins</p>
                        <p className="text-3xl font-bold">{winningsStats.totalWins}</p>
                      </div>
                      <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg shadow-md p-6 text-white">
                        <p className="text-sm opacity-90">Highest Prize</p>
                        <p className="text-3xl font-bold">${winningsStats.highestPrize.toLocaleString()}</p>
                      </div>
                    </div>
                  )}

                  {/* Winnings List */}
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                    </div>
                  ) : winnings.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No winnings yet</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Enter draws to have a chance to win prizes!
                      </p>
                      <button
                        onClick={() => navigate('/draw')}
                        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                      >
                        Enter Draw Now
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {winnings.map((winning) => (
                        <WinnerCard
                          key={winning.id}
                          winner={winning}
                          onClaim={handleClaimPrize}
                          showClaimButton={winning.status === 'pending'}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Leaderboard Tab */}
              {activeTab === 'leaderboard' && (
                <div>
                  <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="px-6 py-4 bg-gradient-to-r from-yellow-400 to-yellow-600">
                      <h3 className="text-xl font-bold text-white">Top Winners</h3>
                      <p className="text-sm text-white opacity-90">Based on total winnings</p>
                    </div>
                    <div className="divide-y divide-gray-200">
                      {topWinners.map((winner, index) => (
                        <div key={winner.user_id} className="px-6 py-4 hover:bg-gray-50">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="flex-shrink-0">
                                {index === 0 && (
                                  <span className="material-icons text-yellow-500 text-3xl">emoji_events</span>
                                )}
                                {index === 1 && (
                                  <span className="material-icons text-gray-400 text-3xl">military_tech</span>
                                )}
                                {index === 2 && (
                                  <span className="material-icons text-amber-600 text-3xl">workspace_premium</span>
                                )}
                                {index > 2 && (
                                  <span className="text-xl font-bold text-gray-500">#{index + 1}</span>
                                )}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">{winner.username}</p>
                                <p className="text-sm text-gray-500">{winner.total_wins} wins</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xl font-bold text-green-600">
                                ${winner.total_winnings.toLocaleString()}
                              </p>
                              <p className="text-xs text-gray-500">
                                Highest: ${winner.highest_prize.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Statistics Tab */}
              {activeTab === 'statistics' && winnerStats && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Global Statistics</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Total Winners</span>
                        <span className="font-semibold text-gray-900">{winnerStats.totalWinners}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Total Prize Awarded</span>
                        <span className="font-semibold text-green-600">${winnerStats.totalPrizeAwarded?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Claimed Prizes</span>
                        <span className="font-semibold text-green-600">{winnerStats.claimedCount}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Pending Prizes</span>
                        <span className="font-semibold text-yellow-600">{winnerStats.pendingCount}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Average Prize</span>
                        <span className="font-semibold text-gray-900">${winnerStats.averagePrize?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-gray-600">Highest Prize</span>
                        <span className="font-semibold text-purple-600">${winnerStats.highestPrize?.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Statistics</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Total Wins</span>
                        <span className="font-semibold text-gray-900">{winningsStats.totalWins}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Total Won</span>
                        <span className="font-semibold text-green-600">${winningsStats.totalWon?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Highest Prize</span>
                        <span className="font-semibold text-purple-600">${winningsStats.highestPrize?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-gray-600">Pending Claims</span>
                        <span className="font-semibold text-yellow-600">{winningsStats.pendingWins}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Celebration Modal */}
      {showCelebration && celebrationPrize && (
        <WinnerCelebration
          show={showCelebration}
          onClose={() => setShowCelebration(false)}
          prizeAmount={celebrationPrize.amount}
          matchCount={celebrationPrize.matchCount}
        />
      )}
    </div>
  );
};

export default Winners;