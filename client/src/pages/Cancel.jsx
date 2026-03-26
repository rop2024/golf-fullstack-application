import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Cancel = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to subscription page after 5 seconds
    const timer = setTimeout(() => {
      navigate('/subscription');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-center">
          <div className="mb-8">
            <svg className="mx-auto h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Payment Cancelled</h1>
          <p className="text-gray-300 mb-8">
            Your payment was cancelled. No charges have been made to your account.
          </p>
          <p className="text-sm text-gray-400">
            You will be redirected to the subscription page in a few seconds...
          </p>
          <button
            onClick={() => navigate('/subscription')}
            className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            Back to Subscription
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cancel;