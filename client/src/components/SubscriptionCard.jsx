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
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700">
      <div className="px-6 py-4 border-b border-gray-700 bg-gray-900/50">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-white">Subscription Status</h3>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge()}`}>
            {isPremium ? 'PREMIUM' : 'FREE'}
          </span>
        </div>
      </div>
      
      <div className="px-6 py-4">
        {isPremium ? (
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Plan:</span>
              <span className="font-semibold text-white capitalize">{subscription?.subscription_status}</span>
            </div>
            {getExpiryDate() && (
              <div className="flex justify-between">
                <span className="text-gray-400">Expires:</span>
                <span className="text-white">{getExpiryDate()}</span>
              </div>
            )}
            <div className="mt-4 pt-4 border-t border-gray-700">
              <h4 className="font-medium text-white mb-2">Premium Benefits:</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-center">
                  <span className="material-icons text-green-400 mr-2 text-base">check_circle</span>
                  Enter all draws
                </li>
                <li className="flex items-center">
                  <span className="material-icons text-green-400 mr-2 text-base">check_circle</span>
                  Higher prize multipliers
                </li>
                <li className="flex items-center">
                  <span className="material-icons text-green-400 mr-2 text-base">check_circle</span>
                  Exclusive bonus draws
                </li>
              </ul>
            </div>
            <button
              onClick={onCancel}
              disabled={loading}
              className="mt-4 w-full py-2 px-4 border border-red-500/30 rounded-lg shadow-sm text-sm font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 transition duration-200"
            >
              Cancel Subscription
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-300">
              Upgrade to Premium and unlock exclusive benefits!
            </p>
            <div className="bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 rounded-lg p-4 border border-yellow-500/30">
              <p className="text-lg font-bold text-yellow-400">Premium Plan</p>
              <p className="text-2xl font-bold text-yellow-300 mt-1">$19.99<span className="text-sm">/month</span></p>
              <ul className="mt-3 space-y-1 text-sm text-yellow-200">
                <li className="flex items-center">
                  <span className="material-icons text-yellow-400 mr-2 text-base">check_circle</span>
                  Enter all draws
                </li>
                <li className="flex items-center">
                  <span className="material-icons text-yellow-400 mr-2 text-base">check_circle</span>
                  2x prize multiplier
                </li>
                <li className="flex items-center">
                  <span className="material-icons text-yellow-400 mr-2 text-base">check_circle</span>
                  Exclusive bonus draws
                </li>
                <li className="flex items-center">
                  <span className="material-icons text-yellow-400 mr-2 text-base">check_circle</span>
                  Priority support
                </li>
              </ul>
            </div>
            <button
              onClick={() => onUpgrade('premium')}
              disabled={loading}
              className="w-full py-2 px-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold rounded-lg hover:from-yellow-600 hover:to-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 transition duration-200 shadow-lg"
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