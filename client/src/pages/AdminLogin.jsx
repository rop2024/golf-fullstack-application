import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [adminLoginData, setAdminLoginData] = useState({ email: '', password: '' });
  const [adminError, setAdminError] = useState('');
  const [adminLoading, setAdminLoading] = useState(false);
  const { signIn, user, loading, profileLoading } = useAuth();

  // Redirect if already authenticated as admin
  useEffect(() => {
    if (user && !loading && !profileLoading) {
      const isAdmin = user.profile?.role === 'admin';
      if (isAdmin) {
        navigate('/admin/dashboard', { replace: true });
      }
    }
  }, [user, loading, profileLoading, navigate]);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setAdminError('');
    setAdminLoading(true);

    try {
      const result = await signIn(adminLoginData.email, adminLoginData.password);
      if (result.success) {
        // Fetch user profile to check role
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', result.user.id)
          .single();

        if (profileError) {
          console.error('Profile fetch error:', profileError);
          setAdminError('Failed to verify admin privileges.');
          return;
        }

        if (profile.role === 'admin') {
          // Clear form
          setAdminLoginData({ email: '', password: '' });
          // Redirect to admin dashboard
          navigate('/admin/dashboard');
        } else {
          setAdminError('Access denied. Admin privileges required.');
        }
      } else {
        setAdminError('Invalid admin credentials');
      }
    } catch (err) {
      console.error('Admin login error:', err);
      setAdminError('Admin login failed. Please check your credentials.');
    } finally {
      setAdminLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-icons text-white text-2xl">admin_panel_settings</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Admin Login</h2>
            <p className="text-gray-400 text-sm">System administrators only</p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label htmlFor="admin-email" className="block text-sm font-medium text-gray-300 mb-1">
                Admin Email
              </label>
              <input
                id="admin-email"
                type="email"
                required
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="admin@example.com"
                value={adminLoginData.email}
                onChange={(e) => setAdminLoginData({ ...adminLoginData, email: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="admin-password" className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                required
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Enter admin password"
                value={adminLoginData.password}
                onChange={(e) => setAdminLoginData({ ...adminLoginData, password: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={adminLoading}
              className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white font-semibold rounded-md transition duration-200 flex items-center justify-center"
            >
              {adminLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing In...
                </>
              ) : (
                <>
                  <span className="material-icons mr-2 text-sm">login</span>
                  Admin Login
                </>
              )}
            </button>
          </form>

          {adminError && (
            <div className="mt-4 p-3 bg-red-900 border border-red-700 text-red-200 rounded-md text-sm">
              <div className="flex items-center">
                <span className="material-icons mr-2 text-sm">error</span>
                {adminError}
              </div>
            </div>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-gray-400 hover:text-white text-sm transition duration-200"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;