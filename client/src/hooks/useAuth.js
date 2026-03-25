import { useAuth as useAuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const auth = useAuthContext();
  
  // Add any additional auth-related utilities here
  const hasRole = (role) => {
    return auth.user?.profile?.role === role;
  };
  
  const isAdmin = () => {
    return auth.user?.profile?.role === 'admin';
  };
  
  const isSubscribed = () => {
    return auth.user?.profile?.subscription_status === 'premium';
  };
  
  return {
    ...auth,
    hasRole,
    isAdmin,
    isSubscribed
  };
};