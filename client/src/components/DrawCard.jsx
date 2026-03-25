import React from 'react';
import { formatDistanceToNow, format } from 'date-fns';

const DrawCard = ({ draw, userEntry, onEnterDraw, onViewWinners, isAdmin, onExecuteDraw }) => {
  const isCompleted = draw.status === 'completed';
  const isPending = draw.status === 'pending';
  const hasEntered = !!userEntry;
  
  const getMatchCountMessage = (matchCount) => {
    if (matchCount === 0) return 'No matches 😢';
    if (matchCount === 1) return '1 match! 🎯';
    if (matchCount === 2) return '2 matches! 🎉';
    if (matchCount === 3) return '3 matches! 🎊';
    if (matchCount === 4) return '4 matches! 🏆';
    if (matchCount === 5) return 'JACKPOT! 💰';
    return `${matchCount} matches`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">
            Draw #{draw.id.slice(0, 8)}
          </h3>
          <span className={`
            px-2 py-1 text-xs font-semibold rounded-full
            ${isCompleted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
          `}>
            {isCompleted ? 'Completed' : 'Active'}
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          {format(new Date(draw.created_at), 'PPP')}
        </p>
      </div>
      
      <div className="px-6 py-4">
        {isCompleted && draw.numbers && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Winning Numbers:</p>
            <div className="flex space-x-2">
              {draw.numbers.map((num, idx) => (
                <div key={idx} className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                  {num}
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Prize Pool:</span>
            <span className="font-semibold text-green-600">${draw.prize_pool?.toLocaleString() || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Entries:</span>
            <span>{draw.draw_entries?.[0]?.count || 0}</span>
          </div>
          {hasEntered && userEntry && (
            <div className="flex justify-between">
              <span className="text-gray-600">Your Match Count:</span>
              <span className={`
                font-semibold
                ${userEntry.match_count === 5 ? 'text-green-600' : 
                  userEntry.match_count >= 3 ? 'text-blue-600' : 'text-gray-600'}
              `}>
                {getMatchCountMessage(userEntry.match_count)}
              </span>
            </div>
          )}
          {userEntry?.prize_amount > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">Your Prize:</span>
              <span className="font-bold text-green-600">${userEntry.prize_amount.toLocaleString()}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        {isPending && !hasEntered && (
          <button
            onClick={() => onEnterDraw(draw.id)}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Enter This Draw
          </button>
        )}
        
        {isPending && hasEntered && (
          <div className="text-center text-sm text-green-600">
            ✓ You've entered this draw
          </div>
        )}
        
        {isCompleted && (
          <button
            onClick={() => onViewWinners(draw.id)}
            className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            View Winners
          </button>
        )}
        
        {isAdmin && isPending && (
          <button
            onClick={() => onExecuteDraw(draw.id)}
            className="mt-2 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Execute Draw
          </button>
        )}
      </div>
    </div>
  );
};

export default DrawCard;