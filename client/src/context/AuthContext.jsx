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

  useEffect(() => {
    // Check active session on mount
    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);

        if (session) {
          setSession(session);
          setUser(session.user);

          // Fetch user profile from profiles table
          if (session.user) {
            await fetchUserProfile(session.user.id);
          }
        } else {
          setSession(null);
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkUser = async () => {
    try {
      const session = await getSession();
      if (session) {
        setSession(session);
        setUser(session.user);
        await fetchUserProfile(session.user.id);
      }
    } catch (err) {
      console.error('Error checking user:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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

        setUser(authData.user);
        setSession(authData.session);

        return { success: true, user: authData.user };
      }

      return { success: false, error: 'Signup failed' };
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      setError(null);
      setLoading(true);

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) throw signInError;

      if (data.user) {
        setUser(data.user);
        setSession(data.session);
        await fetchUserProfile(data.user.id);

        return { success: true, user: data.user };
      }

      return { success: false, error: 'Login failed' };
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
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