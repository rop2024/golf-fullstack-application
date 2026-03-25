import React from 'react';
import { useNavigate } from 'react-router-dom';

const UpgradePrompt = ({ requiredPlan = 'premium', currentPlan = 'free', feature = null }) => {
  const navigate = useNavigate();

  const getPlanDetails = () => {
    if (requiredPlan === 'premium') {
      return {
        name: 'Premium',
        price: '$19.99/month',
        features: [
          'Up to 20 scores',
          '5x draw entries',
          '2x prize multiplier',
          'Advanced statistics',
          'Priority support'
        ]
      };
    }
    return {
      name: 'Pro',
      price: '$49.99/month',
      features: [
        'Up to 50 scores',
        '10x draw entries',
        '5x prize multiplier',
        'Advanced statistics',
        'API access',
        'Priority support'
      ]
    };
  };

  const plan = getPlanDetails();

  return (
    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg shadow-lg p-8 max-w-md mx-auto">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
          <svg className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {feature ? `Unlock ${feature}` : 'Upgrade Required'}
        </h2>
        
        <p className="text-gray-600 mb-6">
          {feature 
            ? `${feature} is a ${requiredPlan} feature. Upgrade to ${plan.name} to access it.`
            : `This feature requires a ${requiredPlan} subscription.`}
        </p>
        
        <div className="bg-white rounded-lg p-6 mb-6">
          <p className="text-sm text-gray-500 mb-2">Current Plan</p>
          <p className="text-lg font-semibold capitalize mb-4">{currentPlan}</p>
          
          <div className="border-t border-gray-200 my-4"></div>
          
          <p className="text-sm text-gray-500 mb-2">Recommended Plan</p>
          <p className="text-2xl font-bold text-gray-900">{plan.name}</p>
          <p className="text-sm text-gray-500 mb-4">{plan.price}</p>
          
          <ul className="space-y-2 text-left mb-6">
            {plan.features.map((feature, idx) => (
              <li key={idx} className="flex items-center text-sm text-gray-600">
                <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
        </div>
        
        <button
          onClick={() => navigate('/subscription')}
          className="w-full py-3 px-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition shadow-md"
        >
          Upgrade Now
        </button>
        
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-sm text-gray-500 hover:text-gray-700"
        >
          Maybe later
        </button>
      </div>
    </div>
  );
};

export default UpgradePrompt;