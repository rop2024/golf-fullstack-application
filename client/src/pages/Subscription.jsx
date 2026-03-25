import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSubscription } from '../hooks/useSubscription';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';

const Subscription = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const {
    subscription,
    balance,
    isPremium,
    loading,
    error,
    upgradeSubscription,
    cancelSubscription,
    fetchSubscription,
    fetchBalance
  } = useSubscription();

  const [selectedPlan, setSelectedPlan] = useState('premium');
  const [processing, setProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  const handleUpgrade = async () => {
    setProcessing(true);
    const result = await upgradeSubscription(selectedPlan);
    if (result.success) {
      setSuccessMessage(`Successfully upgraded to ${selectedPlan} plan!`);
      setTimeout(() => setSuccessMessage(''), 3000);
      await fetchSubscription();
      await fetchBalance();
    }
    setProcessing(false);
  };

  const handleCancel = async () => {
    if (window.confirm('Are you sure you want to cancel your subscription? You will lose all premium benefits immediately.')) {
      setProcessing(true);
      const result = await cancelSubscription();
      if (result.success) {
        setSuccessMessage('Subscription cancelled successfully.');
        setTimeout(() => setSuccessMessage(''), 3000);
        await fetchSubscription();
      }
      setProcessing(false);
    }
  };

  if (authLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex space-x-8">
              <button
                onClick={() => navigate('/dashboard')}
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
              >
                Dashboard
              </button>
              <button
                onClick={() => navigate('/scores')}
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
              >
                Scores
              </button>
              <button
                onClick={() => navigate('/draw')}
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
              >
                Draw
              </button>
              <button
                onClick={() => navigate('/winners')}
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
              >
                Winners
              </button>
              <button
                onClick={() => navigate('/subscription')}
                className="inline-flex items-center px-1 pt-1 border-b-2 border-indigo-500 text-sm font-medium text-gray-900"
              >
                Subscription
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Welcome, {user?.profile?.username || user?.email?.split('@')[0]}</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">Subscription Plans</h1>
            <p className="mt-2 text-sm text-gray-600">
              Choose the plan that best fits your needs
            </p>
          </div>
        </header>

        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            {/* Success Message */}
            {successMessage && (
              <div className="mb-4 rounded-md bg-green-50 p-4 animate-fade-in">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">{successMessage}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-4 rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="px-4 py-8 sm:px-0">
              {/* Current Subscription Status */}
              <div className="mb-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Status</h2>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">Your Plan</p>
                      <p className="text-2xl font-bold capitalize">{subscription?.subscription_status || 'Free'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Balance</p>
                      <p className="text-2xl font-bold text-green-600">${balance?.toLocaleString() || 0}</p>
                    </div>
                    {subscription?.subscription_expires_at && (
                      <div>
                        <p className="text-sm text-gray-500">Expires</p>
                        <p className="text-lg font-semibold">
                          {new Date(subscription.subscription_expires_at).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Pricing Plans */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Free Plan */}
                <div className={`bg-white rounded-lg shadow-md overflow-hidden ${isPremium ? 'opacity-75' : 'ring-2 ring-indigo-500'}`}>
                  <div className="px-6 py-8">
                    <h3 className="text-2xl font-bold text-gray-900">Free</h3>
                    <p className="text-4xl font-bold mt-4">$0<span className="text-lg text-gray-500">/month</span></p>
                    <ul className="mt-6 space-y-3">
                      <li className="flex items-center text-gray-600">
                        <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Enter draws
                      </li>
                      <li className="flex items-center text-gray-600">
                        <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Track scores
                      </li>
                      <li className="flex items-center text-gray-400">
                        <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        No prize multiplier
                      </li>
                      <li className="flex items-center text-gray-400">
                        <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        No bonus draws
                      </li>
                    </ul>
                    {!isPremium && (
                      <button
                        disabled
                        className="mt-8 w-full py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-gray-100 cursor-not-allowed"
                      >
                        Current Plan
                      </button>
                    )}
                  </div>
                </div>

                {/* Premium Plan */}
                <div className={`bg-white rounded-lg shadow-md overflow-hidden ${isPremium ? 'ring-2 ring-yellow-500' : 'hover:shadow-xl transition-shadow'}`}>
                  <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 px-6 py-2 text-center">
                    <p className="text-white font-semibold">POPULAR</p>
                  </div>
                  <div className="px-6 py-8">
                    <h3 className="text-2xl font-bold text-gray-900">Premium</h3>
                    <p className="text-4xl font-bold mt-4">$19.99<span className="text-lg text-gray-500">/month</span></p>
                    <ul className="mt-6 space-y-3">
                      <li className="flex items-center text-gray-600">
                        <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Unlimited draw entries
                      </li>
                      <li className="flex items-center text-gray-600">
                        <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        2x prize multiplier
                      </li>
                      <li className="flex items-center text-gray-600">
                        <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Exclusive bonus draws
                      </li>
                      <li className="flex items-center text-gray-600">
                        <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Priority support
                      </li>
                    </ul>
                    {!isPremium ? (
                      <button
                        onClick={() => {
                          setSelectedPlan('premium');
                          handleUpgrade();
                        }}
                        disabled={processing}
                        className="mt-8 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50"
                      >
                        {processing ? 'Processing...' : 'Upgrade to Premium'}
                      </button>
                    ) : (
                      <button
                        onClick={handleCancel}
                        disabled={processing}
                        className="mt-8 w-full py-2 px-4 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                      >
                        {processing ? 'Processing...' : 'Cancel Subscription'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Pro Plan */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="px-6 py-8">
                    <h3 className="text-2xl font-bold text-gray-900">Pro</h3>
                    <p className="text-4xl font-bold mt-4">$49.99<span className="text-lg text-gray-500">/month</span></p>
                    <ul className="mt-6 space-y-3">
                      <li className="flex items-center text-gray-600">
                        <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Everything in Premium
                      </li>
                      <li className="flex items-center text-gray-600">
                        <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        5x prize multiplier
                      </li>
                      <li className="flex items-center text-gray-600">
                        <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        VIP support
                      </li>
                      <li className="flex items-center text-gray-600">
                        <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Early access to new features
                      </li>
                    </ul>
                    <button
                      disabled
                      className="mt-8 w-full py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-gray-100 cursor-not-allowed"
                    >
                      Coming Soon
                    </button>
                  </div>
                </div>
              </div>

              {/* FAQ Section */}
              <div className="mt-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h3>
                    <p className="text-gray-600">We accept all major credit cards, PayPal, and cryptocurrency payments.</p>
                  </div>
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Can I cancel my subscription anytime?</h3>
                    <p className="text-gray-600">Yes, you can cancel your subscription at any time. Your premium benefits will continue until the end of the billing period.</p>
                  </div>
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">How does the prize multiplier work?</h3>
                    <p className="text-gray-600">Premium members receive a 2x multiplier on all winnings. Pro members receive a 5x multiplier.</p>
                  </div>
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">What are bonus draws?</h3>
                    <p className="text-gray-600">Premium and Pro members get access to exclusive bonus draws with higher prize pools and better odds.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Subscription;