import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useSubscription } from '../hooks/useSubscription';
import UpgradePrompt from './UpgradePrompt';
import LoadingSpinner from './LoadingSpinner';

const SubscriptionGuard = ({ 
  children, 
  requiredPlan = 'premium', 
  feature = null,
  fallback = null 
}) => {
  const { user } = useAuth();
  const { isPremium, isPro, loading, subscription } = useSubscription();

  // Admin users have access to all features
  const isAdmin = user?.profile?.role === 'admin';
  if (isAdmin) {
    return children;
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  const hasAccess = () => {
    if (requiredPlan === 'premium') return isPremium || isPro;
    if (requiredPlan === 'pro') return isPro;
    return true;
  };

  if (!hasAccess()) {
    if (fallback) return fallback;
    
    return (
      <UpgradePrompt 
        requiredPlan={requiredPlan}
        currentPlan={subscription?.subscription_status || 'free'}
        feature={feature}
      />
    );
  }

  return children;
};

export default SubscriptionGuard;