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
        console.log('Auth state changed:', event, session?.user?.id, session ? 'HAS_SESSION' : 'NO_SESSION');

        if (!mounted) {
          console.log('Component unmounted, ignoring auth state change');
          return;
        }

        try {
          if (session?.user) {
            console.log('Setting user and session for:', session.user.id);
            setSession(session);
            setUser(session.user);

            // Fetch user profile from profiles table
            await fetchUserProfile(session.user.id);
            console.log('Auth state change completed successfully');
          } else {
            console.log('Clearing user and session');
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
      console.log('Fetching profile for user:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Profile fetch error:', error);
        if (error.code === 'PGRST116') {
          // Profile doesn't exist, create it
          console.log('Profile not found, creating new profile...');
          const { data: userData } = await supabase.auth.getUser();
          if (userData.user) {
            const { error: createError } = await supabase
              .from('profiles')
              .insert([
                {
                  id: userId,
                  email: userData.user.email,
                  username: userData.user.user_metadata?.username || userData.user.email?.split('@')[0] || 'User',
                  subscription_status: 'free',
                  created_at: new Date().toISOString()
                }
              ]);

            if (createError) {
              console.error('Error creating profile:', createError);
            } else {
              console.log('Profile created successfully');
              // Fetch the newly created profile
              const { data: newProfile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

              if (newProfile) {
                setUser(prev => ({ ...prev, profile: newProfile }));
              }
            }
          }
        }
      } else if (data) {
        console.log('Profile found:', data);
        setUser(prev => ({ ...prev, profile: data }));
      }
    } catch (err) {
      console.error('Error in fetchUserProfile:', err);
      // Don't throw error, just log it
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
        console.log('Signup successful, creating profile for user:', authData.user.id);
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
          console.error('Error creating profile during signup:', profileError);
          // Don't throw here, user still created
        } else {
          console.log('Profile created successfully during signup');
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

      console.log('Attempting sign in for:', email);
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) throw signInError;

      if (data.user && data.session) {
        console.log('Sign in successful, setting user and session');
        // Set user and session immediately for better UX
        setUser(data.user);
        setSession(data.session);
        await fetchUserProfile(data.user.id);
        console.log('Sign in completed successfully');
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