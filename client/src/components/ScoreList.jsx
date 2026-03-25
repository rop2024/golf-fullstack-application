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

  // Create 5 rows, filling with actual scores and empty rows
  const tableRows = [];
  for (let i = 0; i < 5; i++) {
    const score = scores[i];
    tableRows.push(
      <tr key={i} className="border-b border-gray-600">
        <td className="px-4 py-3 text-sm text-white">
          {score ? `#${scores.length - i}` : ''}
        </td>
        <td className="px-4 py-3">
          {score ? (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getScoreBadgeColor(score.value)}`}>
              {score.value}
            </span>
          ) : (
            <span className="text-gray-400">-</span>
          )}
        </td>
        <td className="px-4 py-3 text-sm text-gray-400">
          {score ? formatDistanceToNow(new Date(score.created_at), { addSuffix: true }) : ''}
        </td>
        <td className="px-4 py-3 text-center">
          {score ? (
            <button
              onClick={() => onDelete(score.id)}
              disabled={loading}
              className="text-red-400 hover:text-red-300 transition disabled:opacity-50"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          ) : (
            <span className="text-gray-400">-</span>
          )}
        </td>
      </tr>
    );
  }

  if (scores.length === 0) {
    return (
      <div className="text-center">
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
        <h3 className="mt-2 text-sm font-medium text-white">No scores yet</h3>
        <p className="mt-1 text-sm text-gray-400">
          Add your first score using the form above.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="px-6 py-4 border-b border-gray-700 bg-gray-900/50">
        <h3 className="text-lg font-semibold text-white">Your Scores</h3>
        <p className="mt-1 text-sm text-gray-400">
          Showing your {scores.length} most recent scores
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-600">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                #
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Score
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                Delete
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-600">
            {tableRows}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScoreList;