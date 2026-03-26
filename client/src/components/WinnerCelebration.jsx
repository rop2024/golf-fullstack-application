import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';

const WinnerCelebration = ({ show, onClose, prizeAmount, matchCount }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      // Trigger confetti animation
      confetti({
        particleCount: 200,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FFA500', '#FF4500', '#FF6347']
      });
      
      // Multiple bursts
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 100,
          origin: { y: 0.5, x: 0.3 },
          colors: ['#FFD700', '#FFA500']
        });
      }, 500);
      
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 100,
          origin: { y: 0.5, x: 0.7 },
          colors: ['#FFD700', '#FFA500']
        });
      }, 1000);
      
      // Auto close after 5 seconds
      const timer = setTimeout(() => {
        handleClose();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [show]);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  if (!isVisible) return null;

  const getMessage = () => {
    if (matchCount === 5) return "JACKPOT WINNER!";
    if (matchCount === 4) return "MAJOR WINNER!";
    if (matchCount === 3) return "Great Win!";
    if (matchCount === 2) return "You're a Winner!";
    return "Congratulations!";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-75" onClick={handleClose} />
      
      {/* Modal */}
      <div className="relative bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 rounded-lg shadow-2xl p-8 max-w-md w-full mx-4 transform animate-bounce-in">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-white hover:text-gray-200"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="text-center">
          {/* Trophy Icon */}
          <div className="mb-4">
            <svg className="h-20 w-20 mx-auto text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-2">
            {getMessage()}
          </h2>
          
          <p className="text-xl text-white mb-4">
            You won ${prizeAmount?.toLocaleString()}!
          </p>
          
          <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-6">
            <p className="text-white">
              Prize amount has been added to your balance.
              <br />
              <span className="text-sm">Go to Winners page to view your winnings.</span>
            </p>
          </div>
          
          <button
            onClick={handleClose}
            className="px-6 py-2 bg-white text-yellow-600 rounded-md font-semibold hover:bg-gray-100 transition flex items-center"
          >
            <span className="material-icons mr-2">celebration</span>
            Awesome!
          </button>
        </div>
      </div>
    </div>
  );
};

export default WinnerCelebration;