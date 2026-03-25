import React from 'react';

const BalanceCard = ({ balance, onRefresh }) => {
  return (
    <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm opacity-90">Your Balance</p>
          <p className="text-3xl font-bold mt-1">${balance?.toLocaleString() || 0}</p>
          <p className="text-xs opacity-75 mt-2">Available for draws and prizes</p>
        </div>
        <button
          onClick={onRefresh}
          className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default BalanceCard;