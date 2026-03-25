import React, { useState } from 'react';

const ScoreForm = ({ onSubmit, loading }) => {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const numValue = parseInt(value);
    if (isNaN(numValue) || numValue < 0 || numValue > 100) {
      setError('Please enter a valid score between 0 and 100');
      return;
    }

    setError('');
    await onSubmit(numValue);
    setValue('');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Score</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="score" className="block text-sm font-medium text-gray-700">
            Score (0-100)
          </label>
          <input
            type="number"
            id="score"
            min="0"
            max="100"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enter your score"
            required
          />
        </div>

        {error && (
          <div className="text-sm text-red-600">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Adding Score...
            </div>
          ) : (
            'Add Score'
          )}
        </button>
      </form>
    </div>
  );
};

export default ScoreForm;