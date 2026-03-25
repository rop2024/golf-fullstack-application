import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FeatureLock = ({ feature, requiredPlan = 'premium', children }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/subscription');
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="relative"
      >
        {children}
        <div 
          className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center rounded-lg cursor-pointer"
          onClick={handleClick}
        >
          <div className="bg-white rounded-full p-2 shadow-lg">
            <svg className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6-4h12m-6-4v2m-6 4h12m-6-4v2m0-4v2m0 4v2" />
            </svg>
          </div>
        </div>
      </div>
      
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap z-10">
          {feature} requires {requiredPlan} subscription
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
};

export default FeatureLock;