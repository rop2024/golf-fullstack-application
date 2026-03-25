import React from 'react';

const SubscriptionCard = ({ subscription, isPremium, onUpgrade, onCancel, loading }) => {
  const getStatusBadge = () => {
    if (isPremium) {
      return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
    }
    return 'bg-gray-200 text-gray-700';
  };

  const getExpiryDate = () => {
    if (subscription?.subscription_expires_at) {
      const date = new Date(subscription.subscription_expires_at);
      return date.toLocaleDateString();
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Subscription Status</h3>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge()}`}>
            {isPremium ? 'PREMIUM' : 'FREE'}
          </span>
        </div>
      </div>
      
      <div className="px-6 py-4">
        {isPremium ? (
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Plan:</span>
              <span className="font-semibold text-gray-900 capitalize">{subscription?.subscription_status}</span>
            </div>
            {getExpiryDate() && (
              <div className="flex justify-between">
                <span className="text-gray-600">Expires:</span>
                <span className="text-gray-900">{getExpiryDate()}</span>
              </div>
            )}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="font-medium text-gray-900 mb-2">Premium Benefits:</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Enter all draws
                </li>
                <li className="flex items-center">
                  <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Higher prize multipliers
                </li>
                <li className="flex items-center">
                  <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Exclusive bonus draws
                </li>
              </ul>
            </div>
            <button
              onClick={onCancel}
              disabled={loading}
              className="mt-4 w-full py-2 px-4 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
            >
              Cancel Subscription
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-600">
              Upgrade to Premium and unlock exclusive benefits!
            </p>
            <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-4">
              <p className="text-lg font-bold text-yellow-800">Premium Plan</p>
              <p className="text-2xl font-bold text-yellow-900 mt-1">$19.99<span className="text-sm">/month</span></p>
              <ul className="mt-3 space-y-1 text-sm text-yellow-700">
                <li>✓ Enter all draws</li>
                <li>✓ 2x prize multiplier</li>
                <li>✓ Exclusive bonus draws</li>
                <li>✓ Priority support</li>
              </ul>
            </div>
            <button
              onClick={() => onUpgrade('premium')}
              disabled={loading}
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50"
            >
              Upgrade to Premium
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionCard;