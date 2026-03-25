import React from 'react';

const ScoreChart = ({ scores }) => {
  if (scores.length === 0) {
    return null;
  }

  // Calculate average
  const average = Math.round(scores.reduce((sum, s) => sum + s.value, 0) / scores.length);
  
  // Get highest score
  const highest = Math.max(...scores.map(s => s.value));
  
  // Get lowest score
  const lowest = Math.min(...scores.map(s => s.value));

  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-4">Score Statistics</h3>
      
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-6">
        <div className="bg-indigo-900 rounded-lg p-4">
          <dt className="text-sm font-medium text-indigo-300 truncate">Average Score</dt>
          <dd className="mt-1 text-3xl font-semibold text-indigo-100">{average}</dd>
        </div>
        
        <div className="bg-green-900 rounded-lg p-4">
          <dt className="text-sm font-medium text-green-300 truncate">Highest Score</dt>
          <dd className="mt-1 text-3xl font-semibold text-green-100">{highest}</dd>
        </div>
        
        <div className="bg-red-900 rounded-lg p-4">
          <dt className="text-sm font-medium text-red-300 truncate">Lowest Score</dt>
          <dd className="mt-1 text-3xl font-semibold text-red-100">{lowest}</dd>
        </div>
      </div>
      
      <div className="mt-4">
        <h4 className="text-sm font-medium text-gray-300 mb-2">Score Progression</h4>
        <div className="space-y-2">
          {scores.slice().reverse().map((score, index) => (
            <div key={score.id} className="relative">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Score {index + 1}</span>
                <span className="font-medium text-white">{score.value}</span>
              </div>
              <div className="mt-1 relative">
                <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-600">
                  <div
                    style={{ width: `${score.value}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500 transition-all duration-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScoreChart;