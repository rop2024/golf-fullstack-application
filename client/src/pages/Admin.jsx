import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Admin = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Dashboard data
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalScores: 0,
    activeDraws: 0,
    totalWinners: 0
  });

  // Scores data
  const [allScores, setAllScores] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);

  // Draws data
  const [draws, setDraws] = useState([]);
  const [activeDraw, setActiveDraw] = useState(null);

  // Winners data
  const [allWinners, setAllWinners] = useState([]);

  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchDashboardStats();
    } else if (activeTab === 'scores') {
      fetchAllScores();
    } else if (activeTab === 'draws') {
      fetchDraws();
    } else if (activeTab === 'winners') {
      fetchAllWinners();
    }
  }, [activeTab]);

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      // Fetch various stats for admin dashboard
      const [scoresRes, drawsRes, winnersRes] = await Promise.all([
        api.get('/scores/all'),
        api.get('/draw/stats'),
        api.get('/winners/admin/all')
      ]);

      setStats({
        totalUsers: scoresRes.data.scores?.length || 0, // Approximate from unique users in scores
        totalScores: scoresRes.data.scores?.length || 0,
        activeDraws: drawsRes.data.activeDraws || 0,
        totalWinners: winnersRes.data.winners?.length || 0
      });
    } catch (err) {
      setError('Failed to fetch dashboard stats');
      console.error('Dashboard stats error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllScores = async () => {
    setLoading(true);
    try {
      const response = await api.get('/scores/all');
      setAllScores(response.data.scores || []);

      // Calculate leaderboard from scores
      const userStats = {};
      response.data.scores.forEach(score => {
        if (!userStats[score.user_id]) {
          userStats[score.user_id] = {
            user_id: score.user_id,
            username: score.username || 'Unknown',
            totalScores: 0,
            averageScore: 0,
            bestScore: 0,
            scores: []
          };
        }
        userStats[score.user_id].scores.push(score.value);
        userStats[score.user_id].totalScores += 1;
      });

      // Calculate averages and best scores
      const leaderboardData = Object.values(userStats).map(user => ({
        ...user,
        averageScore: Math.round(user.scores.reduce((a, b) => a + b, 0) / user.scores.length),
        bestScore: Math.max(...user.scores)
      })).sort((a, b) => b.averageScore - a.averageScore);

      setLeaderboard(leaderboardData);
    } catch (err) {
      setError('Failed to fetch scores');
      console.error('Fetch all scores error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDraws = async () => {
    setLoading(true);
    try {
      const [drawsRes, activeRes] = await Promise.all([
        api.get('/draw'),
        api.get('/draw/active')
      ]);

      setDraws(drawsRes.data.draws || []);
      setActiveDraw(activeRes.data.draw || null);
    } catch (err) {
      setError('Failed to fetch draws');
      console.error('Fetch draws error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllWinners = async () => {
    setLoading(true);
    try {
      const response = await api.get('/winners/admin/all');
      setAllWinners(response.data.winners || []);
    } catch (err) {
      setError('Failed to fetch winners');
      console.error('Fetch all winners error:', err);
    } finally {
      setLoading(false);
    }
  };

  const createNewDraw = async () => {
    setLoading(true);
    try {
      await api.post('/draw/create');
      await fetchDraws(); // Refresh draws list
      setError(null);
    } catch (err) {
      setError('Failed to create draw');
      console.error('Create draw error:', err);
    } finally {
      setLoading(false);
    }
  };

  const executeDraw = async (drawId) => {
    setLoading(true);
    try {
      await api.post(`/draw/${drawId}/execute`);
      await fetchDraws(); // Refresh draws list
      setError(null);
    } catch (err) {
      setError('Failed to execute draw');
      console.error('Execute draw error:', err);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'scores', label: 'All Scores', icon: 'leaderboard' },
    { id: 'draws', label: 'Draw Management', icon: 'casino' },
    { id: 'winners', label: 'All Winners', icon: 'emoji_events' }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-300">Welcome back, {user?.profile?.username || 'Admin'}</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg">
            <div className="flex items-center">
              <span className="material-icons mr-2">error</span>
              {error}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                <span className="material-icons mr-2 text-sm">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="space-y-6">
            {activeTab === 'dashboard' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gray-800 p-6 rounded-lg">
                  <div className="flex items-center">
                    <span className="material-icons text-blue-400 text-2xl mr-3">people</span>
                    <div>
                      <p className="text-gray-400 text-sm">Total Users</p>
                      <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg">
                  <div className="flex items-center">
                    <span className="material-icons text-green-400 text-2xl mr-3">score</span>
                    <div>
                      <p className="text-gray-400 text-sm">Total Scores</p>
                      <p className="text-2xl font-bold text-white">{stats.totalScores}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg">
                  <div className="flex items-center">
                    <span className="material-icons text-purple-400 text-2xl mr-3">casino</span>
                    <div>
                      <p className="text-gray-400 text-sm">Active Draws</p>
                      <p className="text-2xl font-bold text-white">{stats.activeDraws}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg">
                  <div className="flex items-center">
                    <span className="material-icons text-yellow-400 text-2xl mr-3">emoji_events</span>
                    <div>
                      <p className="text-gray-400 text-sm">Total Winners</p>
                      <p className="text-2xl font-bold text-white">{stats.totalWinners}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'scores' && (
              <div className="space-y-6">
                <div className="bg-gray-800 p-6 rounded-lg">
                  <h2 className="text-xl font-bold text-white mb-4">Leaderboard</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="text-left py-2 text-gray-300">Rank</th>
                          <th className="text-left py-2 text-gray-300">Username</th>
                          <th className="text-left py-2 text-gray-300">Total Scores</th>
                          <th className="text-left py-2 text-gray-300">Average</th>
                          <th className="text-left py-2 text-gray-300">Best Score</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leaderboard.map((user, index) => (
                          <tr key={user.user_id} className="border-b border-gray-700">
                            <td className="py-2 text-white">#{index + 1}</td>
                            <td className="py-2 text-white">{user.username}</td>
                            <td className="py-2 text-white">{user.totalScores}</td>
                            <td className="py-2 text-white">{user.averageScore}</td>
                            <td className="py-2 text-white">{user.bestScore}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-gray-800 p-6 rounded-lg">
                  <h2 className="text-xl font-bold text-white mb-4">All Scores</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="text-left py-2 text-gray-300">Username</th>
                          <th className="text-left py-2 text-gray-300">Score</th>
                          <th className="text-left py-2 text-gray-300">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allScores.map((score) => (
                          <tr key={score.id} className="border-b border-gray-700">
                            <td className="py-2 text-white">{score.username || 'Unknown'}</td>
                            <td className="py-2 text-white">{score.value}</td>
                            <td className="py-2 text-white">
                              {new Date(score.created_at).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'draws' && (
              <div className="space-y-6">
                <div className="bg-gray-800 p-6 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white">Draw Management</h2>
                    <button
                      onClick={createNewDraw}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
                    >
                      <span className="material-icons mr-2">add</span>
                      Create New Draw
                    </button>
                  </div>

                  {activeDraw && (
                    <div className="mb-6 p-4 bg-green-900 border border-green-700 rounded-lg">
                      <h3 className="text-green-200 font-semibold mb-2">Active Draw</h3>
                      <p className="text-green-100">Draw #{activeDraw.id} - Status: {activeDraw.status}</p>
                      <button
                        onClick={() => executeDraw(activeDraw.id)}
                        className="mt-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                      >
                        Execute Draw
                      </button>
                    </div>
                  )}

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="text-left py-2 text-gray-300">Draw ID</th>
                          <th className="text-left py-2 text-gray-300">Status</th>
                          <th className="text-left py-2 text-gray-300">Created</th>
                          <th className="text-left py-2 text-gray-300">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {draws.map((draw) => (
                          <tr key={draw.id} className="border-b border-gray-700">
                            <td className="py-2 text-white">{draw.id}</td>
                            <td className="py-2 text-white">
                              <span className={`px-2 py-1 rounded text-xs ${
                                draw.status === 'active' ? 'bg-green-600' :
                                draw.status === 'completed' ? 'bg-blue-600' : 'bg-gray-600'
                              }`}>
                                {draw.status}
                              </span>
                            </td>
                            <td className="py-2 text-white">
                              {new Date(draw.created_at).toLocaleDateString()}
                            </td>
                            <td className="py-2">
                              {draw.status === 'active' && (
                                <button
                                  onClick={() => executeDraw(draw.id)}
                                  className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm"
                                >
                                  Execute
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'winners' && (
              <div className="bg-gray-800 p-6 rounded-lg">
                <h2 className="text-xl font-bold text-white mb-4">All Winners</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-2 text-gray-300">Username</th>
                        <th className="text-left py-2 text-gray-300">Draw ID</th>
                        <th className="text-left py-2 text-gray-300">Matches</th>
                        <th className="text-left py-2 text-gray-300">Prize</th>
                        <th className="text-left py-2 text-gray-300">Claimed</th>
                        <th className="text-left py-2 text-gray-300">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allWinners.map((winner) => (
                        <tr key={winner.id} className="border-b border-gray-700">
                          <td className="py-2 text-white">{winner.username || 'Unknown'}</td>
                          <td className="py-2 text-white">{winner.draw_id}</td>
                          <td className="py-2 text-white">{winner.matches_count}</td>
                          <td className="py-2 text-white">${winner.prize_amount}</td>
                          <td className="py-2 text-white">
                            <span className={`px-2 py-1 rounded text-xs ${
                              winner.claimed ? 'bg-green-600' : 'bg-red-600'
                            }`}>
                              {winner.claimed ? 'Yes' : 'No'}
                            </span>
                          </td>
                          <td className="py-2 text-white">
                            {new Date(winner.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;