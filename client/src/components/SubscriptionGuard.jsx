import React from 'react';
import { useSubscription } from '../hooks/useSubscription';
import UpgradePrompt from './UpgradePrompt';
import LoadingSpinner from './LoadingSpinner';

const SubscriptionGuard = ({ 
  children, 
  requiredPlan = 'premium', 
  feature = null,
  fallback = null 
}) => {
  const { isPremium, isPro, loading, subscription } = useSubscription();

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