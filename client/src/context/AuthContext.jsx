import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase, getSession, signOut } from '../services/supabase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingTimeout, setLoadingTimeout] = useState(null);

  // Safety timeout to prevent infinite loading
  const startLoadingTimeout = () => {
    if (loadingTimeout) {
      clearTimeout(loadingTimeout);
    }
    const timeout = setTimeout(() => {
      console.warn('Auth loading timeout - forcing loading to false');
      setLoading(false);
      setError('Loading timeout - please try refreshing the page');
    }, 15000); // 15 seconds timeout
    setLoadingTimeout(timeout);
  };

  const clearLoadingTimeout = () => {
    if (loadingTimeout) {
      clearTimeout(loadingTimeout);
      setLoadingTimeout(null);
    }
  };

  useEffect(() => {
    let mounted = true;

    // Start loading timeout
    startLoadingTimeout();

    // Check active session on mount
    const initializeAuth = async () => {
      try {
        const session = await getSession();
        if (mounted) {
          if (session?.user) {
            setSession(session);
            setUser(session.user);
            await fetchUserProfile(session.user.id);
          } else {
            setSession(null);
            setUser(null);
          }
          setLoading(false);
          clearLoadingTimeout();
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
        if (mounted) {
          setError(err.message);
          setSession(null);
          setUser(null);
          setLoading(false);
          clearLoadingTimeout();
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);

        if (!mounted) return;

        try {
          if (session?.user) {
            setSession(session);
            setUser(session.user);

            // Fetch user profile from profiles table
            await fetchUserProfile(session.user.id);
          } else {
            setSession(null);
            setUser(null);
          }
        } catch (err) {
          console.error('Error in auth state change:', err);
          setError(err.message);
        } finally {
          // Always ensure loading is set to false
          setLoading(false);
          clearLoadingTimeout();
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
      clearLoadingTimeout();
    };
  }, []);

  const fetchUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
      } else if (data) {
        setUser(prev => ({ ...prev, profile: data }));
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  const signUp = async (email, password, username) => {
    try {
      setError(null);
      setLoading(true);
      startLoadingTimeout();

      // Sign up with Supabase
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username,
          }
        }
      });

      if (signUpError) throw signUpError;

      if (authData.user) {
        // Create profile in profiles table
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: authData.user.id,
              email: email,
              username: username,
              subscription_status: 'free',
              created_at: new Date().toISOString()
            }
          ]);

        if (profileError) {
          console.error('Error creating profile:', profileError);
          // Don't throw here, user still created
        }

        // Don't set user/session here - let the auth state change listener handle it
        return { success: true, user: authData.user };
      }

      return { success: false, error: 'Signup failed' };
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.message);
      setLoading(false);
      clearLoadingTimeout();
      return { success: false, error: err.message };
    }
  };

  const signIn = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      startLoadingTimeout();

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) throw signInError;

      if (data.user && data.session) {
        // Set user and session immediately for better UX
        setUser(data.user);
        setSession(data.session);
        await fetchUserProfile(data.user.id);
        return { success: true, user: data.user };
      }

      throw new Error('Login failed - no user data received');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message);
      setLoading(false);
      clearLoadingTimeout();
      return { success: false, error: err.message };
    }
    // Don't set loading to false here - let the auth state change listener handle it
  };

  const logout = async () => {
    try {
      setLoading(true);
      startLoadingTimeout();
      const success = await signOut();
      if (success) {
        setUser(null);
        setSession(null);
      }
    } catch (err) {
      console.error('Logout error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
      clearLoadingTimeout();
    }
  };

  const updateProfile = async (updates) => {
    if (!user) return { success: false, error: 'No user logged in' };

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      setUser(prev => ({ ...prev, profile: data }));
      return { success: true, data };
    } catch (err) {
      console.error('Profile update error:', err);
      return { success: false, error: err.message };
    }
  };

  const value = {
    user,
    session,
    loading,
    error,
    signUp,
    signIn,
    logout,
    updateProfile,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};