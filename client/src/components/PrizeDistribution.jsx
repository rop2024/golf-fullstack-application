import React from 'react';

const PrizeDistribution = ({ distribution }) => {
  if (!distribution || distribution.length === 0) {
    return (
      <div className="text-center py-8">
        <span className="material-icons text-gray-400 text-4xl">pie_chart</span>
        <p className="mt-2 text-sm text-gray-500">No prize distribution data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <span className="material-icons mr-2 text-blue-500">pie_chart</span>
        Prize Distribution
      </h3>

      <div className="space-y-3">
        {distribution.map((tier, index) => (
          <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${
                tier.match_count === 5 ? 'bg-yellow-400' :
                tier.match_count === 4 ? 'bg-purple-400' :
                tier.match_count === 3 ? 'bg-blue-400' :
                tier.match_count === 2 ? 'bg-green-400' : 'bg-gray-400'
              }`} />
              <div>
                <p className="font-medium text-gray-900">
                  {tier.match_count} Match{tier.match_count !== 1 ? 'es' : ''}
                </p>
                <p className="text-sm text-gray-500">
                  {tier.winner_count} winner{tier.winner_count !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-green-600">
                ${tier.prize_amount?.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">
                per winner
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-900">Total Prize Pool</span>
          <span className="text-xl font-bold text-green-600">
            ${distribution.reduce((sum, tier) => sum + (tier.prize_amount * tier.winner_count), 0).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PrizeDistribution;