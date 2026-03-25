import React from 'react';
import { format } from 'date-fns';

const WinnerCard = ({ winner, onClaim, showClaimButton = true }) => {
  const getMatchCountBadge = (matchCount) => {
    const badges = {
      5: 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white',
      4: 'bg-gradient-to-r from-purple-400 to-purple-600 text-white',
      3: 'bg-gradient-to-r from-blue-400 to-blue-600 text-white',
      2: 'bg-gradient-to-r from-green-400 to-green-600 text-white',
      1: 'bg-gray-400 text-white',
      0: 'bg-gray-300 text-gray-600'
    };
    return badges[matchCount] || badges[0];
  };

  const getMatchCountEmoji = (matchCount) => {
    const emojis = {
      5: '🏆💰🎉',
      4: '🎉🏆',
      3: '🎊✨',
      2: '🎯👍',
      1: '😊',
      0: '😢'
    };
    return emojis[matchCount] || emojis[0];
  };

  const getStatusBadge = (status) => {
    if (status === 'claimed') {
      return 'bg-green-100 text-green-800';
    }
    return 'bg-yellow-100 text-yellow-800';
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getMatchCountBadge(winner.match_count)}`}>
                {winner.match_count} Matches {getMatchCountEmoji(winner.match_count)}
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(winner.status)}`}>
                {winner.status === 'claimed' ? '✓ Claimed' : '💰 Pending'}
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Draw #{winner.draw_id?.slice(0, 8) || 'N/A'}
            </p>
            <p className="text-xs text-gray-400">
              {format(new Date(winner.created_at), 'PPP')}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-green-600">
              ${winner.prize_amount?.toLocaleString()}
            </p>
            {showClaimButton && winner.status === 'pending' && (
              <button
                onClick={() => onClaim(winner.id)}
                className="mt-2 px-4 py-1 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm rounded-md hover:from-green-600 hover:to-green-700 transition shadow-md"
              >
                Claim Prize
              </button>
            )}
          </div>
        </div>
      </div>
      
      {winner.draw_numbers && (
        <div className="px-6 py-3 bg-gray-50">
          <p className="text-xs text-gray-500 mb-1">Winning Numbers:</p>
          <div className="flex space-x-2">
            {winner.draw_numbers.map((num, idx) => (
              <div key={idx} className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-800 font-bold text-sm">
                {num}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {winner.username && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Winner: <span className="font-semibold">{winner.username}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default WinnerCard;