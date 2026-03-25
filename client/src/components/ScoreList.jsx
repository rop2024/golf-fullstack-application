import React from 'react';
import { formatDistanceToNow } from 'date-fns';

const ScoreList = ({ scores, onDelete, loading }) => {
  const getScoreColor = (value) => {
    if (value >= 80) return 'text-green-600';
    if (value >= 60) return 'text-blue-600';
    if (value >= 40) return 'text-yellow-600';
    if (value >= 20) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBadgeColor = (value) => {
    if (value >= 80) return 'bg-green-100 text-green-800';
    if (value >= 60) return 'bg-blue-100 text-blue-800';
    if (value >= 40) return 'bg-yellow-100 text-yellow-800';
    if (value >= 20) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  if (scores.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No scores yet</h3>
        <p className="mt-1 text-sm text-gray-500">
          Add your first score using the form above.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Your Scores</h3>
        <p className="mt-1 text-sm text-gray-500">
          Showing your {scores.length} most recent scores
        </p>
      </div>
      
      <ul className="divide-y divide-gray-200">
        {scores.map((score, index) => (
          <li key={score.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className={`inline-flex items-center justify-center h-10 w-10 rounded-full ${getScoreBadgeColor(score.value)}`}>
                    <span className={`text-lg font-bold ${getScoreColor(score.value)}`}>
                      {score.value}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Score #{scores.length - index}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(score.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => onDelete(score.id)}
                disabled={loading}
                className="text-red-600 hover:text-red-800 transition disabled:opacity-50"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ScoreList;