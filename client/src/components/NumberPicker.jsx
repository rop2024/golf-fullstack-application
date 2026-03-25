import React, { useState, useEffect } from 'react';

const NumberPicker = ({ onSubmit, loading, initialNumbers = [], maxNumbers = 5, minNumber = 1, maxNumber = 50 }) => {
  const [selectedNumbers, setSelectedNumbers] = useState(initialNumbers);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialNumbers.length > 0) {
      setSelectedNumbers(initialNumbers);
    }
  }, [initialNumbers]);

  const handleNumberClick = (num) => {
    if (selectedNumbers.includes(num)) {
      // Remove number
      setSelectedNumbers(selectedNumbers.filter(n => n !== num));
      setError('');
    } else {
      // Add number
      if (selectedNumbers.length >= maxNumbers) {
        setError(`You can only select ${maxNumbers} numbers`);
        return;
      }
      setSelectedNumbers([...selectedNumbers, num].sort((a, b) => a - b));
      setError('');
    }
  };

  const handleRandomize = async () => {
    // Generate random unique numbers
    const randomNumbers = [];
    while (randomNumbers.length < maxNumbers) {
      const num = Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;
      if (!randomNumbers.includes(num)) {
        randomNumbers.push(num);
      }
    }
    setSelectedNumbers(randomNumbers.sort((a, b) => a - b));
    setError('');
  };

  const handleClear = () => {
    setSelectedNumbers([]);
    setError('');
  };

  const handleSubmit = () => {
    if (selectedNumbers.length !== maxNumbers) {
      setError(`Please select exactly ${maxNumbers} numbers`);
      return;
    }
    onSubmit(selectedNumbers);
  };

  // Generate array of numbers 1-50
  const numbers = Array.from({ length: maxNumber }, (_, i) => i + 1);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Pick Your Numbers ({selectedNumbers.length}/{maxNumbers})
      </h3>
      
      <div className="grid grid-cols-10 gap-2 mb-6">
        {numbers.map((num) => (
          <button
            key={num}
            onClick={() => handleNumberClick(num)}
            disabled={loading}
            className={`
              h-10 w-10 rounded-full font-semibold transition-all duration-200
              ${selectedNumbers.includes(num)
                ? 'bg-indigo-600 text-white shadow-lg transform scale-110'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
              ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            {num}
          </button>
        ))}
      </div>
      
      <div className="flex space-x-3 mb-4">
        <button
          onClick={handleRandomize}
          disabled={loading}
          className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          🎲 Randomize
        </button>
        <button
          onClick={handleClear}
          disabled={loading}
          className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          🗑️ Clear
        </button>
      </div>
      
      {error && (
        <div className="mb-4 text-sm text-red-600 text-center">
          {error}
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Selected: {selectedNumbers.length === 0 ? 'None' : selectedNumbers.join(', ')}
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading || selectedNumbers.length !== maxNumbers}
          className="py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Submitting...' : 'Submit Entry'}
        </button>
      </div>
    </div>
  );
};

export default NumberPicker;