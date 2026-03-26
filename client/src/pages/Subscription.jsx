import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSubscription } from '../hooks/useSubscription';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';

const Subscription = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const {
    subscription,
    balance,
    isPremium,
    isPro,
    loading,
    error,
    upgradeSubscription,
    cancelSubscription,
    fetchSubscription,
    fetchBalance,
    getFeatureLimit
  } = useSubscription();

  const [selectedPlan, setSelectedPlan] = useState('premium');
  const [selectedDuration, setSelectedDuration] = useState('monthly');
  const [processing, setProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [stripeError, setStripeError] = useState('');

  // Price IDs from environment
  const priceIds = {
    premium: {
      monthly: import.meta.env.VITE_STRIPE_PRICE_PREMIUM_MONTHLY,
      yearly: import.meta.env.VITE_STRIPE_PRICE_PREMIUM_YEARLY
    },
    pro: {
      monthly: import.meta.env.VITE_STRIPE_PRICE_PRO_MONTHLY,
      yearly: import.meta.env.VITE_STRIPE_PRICE_PRO_YEARLY
    }
  };

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  const handleUpgrade = async () => {
    setProcessing(true);
    const result = await upgradeSubscription(selectedPlan, selectedDuration);
    if (result.success) {
      setSuccessMessage(`Successfully upgraded to ${selectedPlan} plan!`);
      setTimeout(() => setSuccessMessage(''), 3000);
      await fetchSubscription();
      await fetchBalance();
    }
    setProcessing(false);
  };

  const subscribe = async (priceId) => {
    setProcessing(true);
    setStripeError(''); // Clear any previous errors
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/subscription/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ priceId }),
      });

      const data = await res.json();

      if (res.ok) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        setStripeError(data.error || 'Failed to create subscription');
      }
    } catch (err) {
      setStripeError('Failed to create subscription');
    } finally {
      setProcessing(false);
    }
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

  const getPrice = (plan, duration) => {
    const prices = {
      premium: { monthly: 19.99, yearly: 199.99 },
      pro: { monthly: 49.99, yearly: 499.99 }
    };
    return prices[plan]?.[duration] || 0;
  };

  const getSavings = (plan) => {
    const monthlyPrice = getPrice(plan, 'monthly');
    const yearlyPrice = getPrice(plan, 'yearly');
    const monthlyTotal = monthlyPrice * 12;
    const savings = monthlyTotal - yearlyPrice;
    return Math.round((savings / monthlyTotal) * 100);
  };

  const plans = {
    free: {
      name: 'Free',
      price: 0,
      features: {
        scores: 'Up to 5 scores',
        drawEntries: '1 entry per month',
        prizeMultiplier: '1x',
        stats: 'Basic statistics',
        support: 'Community support'
      },
      limits: {
        maxScores: 5,
        maxDrawEntries: 1,
        prizeMultiplier: 1
      }
    },
    premium: {
      name: 'Premium',
      price: selectedDuration === 'monthly' ? 19.99 : 199.99,
      features: {
        scores: 'Up to 20 scores',
        drawEntries: '5 entries per month',
        prizeMultiplier: '2x',
        stats: 'Advanced statistics',
        support: 'Priority support',
        bulkSubmit: 'Bulk score submission',
        customNumbers: 'Custom number sets'
      },
      limits: {
        maxScores: 20,
        maxDrawEntries: 5,
        prizeMultiplier: 2
      }
    },
    pro: {
      name: 'Pro',
      price: selectedDuration === 'monthly' ? 49.99 : 499.99,
      features: {
        scores: 'Up to 50 scores',
        drawEntries: '10 entries per month',
        prizeMultiplier: '5x',
        stats: 'Advanced statistics',
        support: 'VIP support',
        bulkSubmit: 'Bulk score submission',
        customNumbers: 'Custom number sets',
        apiAccess: 'API access',
        earlyAccess: 'Early access to features'
      },
      limits: {
        maxScores: 50,
        maxDrawEntries: 10,
        prizeMultiplier: 5
      }
    }
  };

  if (authLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar activePage="subscription" />

      {/* Main Content */}
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">Subscription Plans</h1>
            <p className="mt-2 text-sm text-gray-600">
              Choose the plan that best fits your needs and unlock premium features
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
            {(error || stripeError) && (
              <div className="mb-4 rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">{error || stripeError}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="px-4 py-8 sm:px-0">
              {/* Current Subscription Status */}
              <div className="mb-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Status</h2>
                  <div className="flex justify-between items-center flex-wrap gap-4">
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
                    {(isPremium || isPro) && (
                      <button
                        onClick={handleCancel}
                        disabled={processing}
                        className="px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 hover:bg-red-50"
                      >
                        Cancel Subscription
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Duration Toggle */}
              <div className="flex justify-center mb-8">
                <div className="bg-gray-200 rounded-lg p-1 inline-flex">
                  <button
                    onClick={() => setSelectedDuration('monthly')}
                    className={`px-6 py-2 rounded-md text-sm font-medium transition ${
                      selectedDuration === 'monthly'
                        ? 'bg-white text-indigo-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setSelectedDuration('yearly')}
                    className={`px-6 py-2 rounded-md text-sm font-medium transition ${
                      selectedDuration === 'yearly'
                        ? 'bg-white text-indigo-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Yearly
                    <span className="ml-1 text-xs text-green-600">Save {getSavings(selectedPlan)}%</span>
                  </button>
                </div>
              </div>

              {/* Pricing Plans */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {Object.entries(plans).map(([key, plan]) => {
                  const isCurrentPlan = (key === 'free' && !isPremium && !isPro) ||
                                       (key === 'premium' && isPremium) ||
                                       (key === 'pro' && isPro);

                  return (
                    <div
                      key={key}
                      className={`bg-white rounded-lg shadow-md overflow-hidden transition-all ${
                        isCurrentPlan ? 'ring-2 ring-indigo-500 transform scale-105' : 'hover:shadow-lg'
                      }`}
                    >
                      {key === 'premium' && (
                        <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 px-6 py-2 text-center">
                          <p className="text-white font-semibold">MOST POPULAR</p>
                        </div>
                      )}
                      <div className="px-6 py-8">
                        <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                        <div className="mt-4">
                          <span className="text-4xl font-bold">${plan.price}</span>
                          <span className="text-gray-500">/{selectedDuration === 'monthly' ? 'month' : 'year'}</span>
                        </div>

                        <ul className="mt-6 space-y-3">
                          {Object.entries(plan.features).map(([feature, description]) => (
                            <li key={feature} className="flex items-center text-gray-600">
                              <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              <span className="text-sm">{description}</span>
                            </li>
                          ))}
                        </ul>

                        {isCurrentPlan ? (
                          <button
                            disabled
                            className="mt-8 w-full py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-gray-100 cursor-not-allowed"
                          >
                            Current Plan
                          </button>
                        ) : key !== 'free' ? (
                          <button
                            onClick={() => subscribe(priceIds[key][selectedDuration])}
                            disabled={processing}
                            className="mt-8 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                          >
                            {processing ? 'Processing...' : `Subscribe to ${plan.name}`}
                          </button>
                        ) : (
                          <button
                            disabled
                            className="mt-8 w-full py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-gray-100 cursor-not-allowed"
                          >
                            Free Forever
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Feature Comparison Table */}
              <div className="mt-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Feature Comparison</h2>
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feature</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Free</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Premium</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Pro</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">Max Scores</td>
                        <td className="px-6 py-4 text-center text-sm text-gray-500">{plans.free.limits.maxScores}</td>
                        <td className="px-6 py-4 text-center text-sm text-gray-900 font-semibold">{plans.premium.limits.maxScores}</td>
                        <td className="px-6 py-4 text-center text-sm text-gray-900 font-semibold">{plans.pro.limits.maxScores}</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">Draw Entries/Month</td>
                        <td className="px-6 py-4 text-center text-sm text-gray-500">{plans.free.limits.maxDrawEntries}</td>
                        <td className="px-6 py-4 text-center text-sm text-gray-900 font-semibold">{plans.premium.limits.maxDrawEntries}</td>
                        <td className="px-6 py-4 text-center text-sm text-gray-900 font-semibold">{plans.pro.limits.maxDrawEntries}</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">Prize Multiplier</td>
                        <td className="px-6 py-4 text-center text-sm text-gray-500">{plans.free.limits.prizeMultiplier}x</td>
                        <td className="px-6 py-4 text-center text-sm text-gray-900 font-semibold">{plans.premium.limits.prizeMultiplier}x</td>
                        <td className="px-6 py-4 text-center text-sm text-gray-900 font-semibold">{plans.pro.limits.prizeMultiplier}x</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">Advanced Statistics</td>
                        <td className="px-6 py-4 text-center">
                          <svg className="h-5 w-5 text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <svg className="h-5 w-5 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <svg className="h-5 w-5 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">Bulk Score Submission</td>
                        <td className="px-6 py-4 text-center">
                          <svg className="h-5 w-5 text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <svg className="h-5 w-5 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <svg className="h-5 w-5 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">Priority Support</td>
                        <td className="px-6 py-4 text-center">
                          <svg className="h-5 w-5 text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <svg className="h-5 w-5 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <svg className="h-5 w-5 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">API Access</td>
                        <td className="px-6 py-4 text-center">
                          <svg className="h-5 w-5 text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <svg className="h-5 w-5 text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <svg className="h-5 w-5 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* FAQ Section */}
              <div className="mt-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">What happens when my subscription expires?</h3>
                    <p className="text-gray-600">When your subscription expires, you'll be automatically downgraded to the Free plan. Your scores and draw history will be preserved, but you'll lose access to premium features.</p>
                  </div>
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Can I upgrade or downgrade anytime?</h3>
                    <p className="text-gray-600">Yes! You can upgrade or downgrade your subscription at any time. Changes take effect immediately for upgrades, and at the next billing cycle for downgrades.</p>
                  </div>
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">How does the prize multiplier work?</h3>
                    <p className="text-gray-600">Premium members receive a 2x multiplier on all winnings. Pro members receive a 5x multiplier. The multiplier applies to your base prize amount.</p>
                  </div>
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h3>
                    <p className="text-gray-600">We accept all major credit cards, PayPal, and cryptocurrency payments. All payments are securely processed.</p>
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