import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ activePage = 'dashboard' }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [greeting, setGreeting] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) setGreeting('Good Morning');
    else if (hour >= 12 && hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest('.user-dropdown')) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const getButtonClasses = (page) => {
    const baseClasses = "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium";
    if (activePage === page) {
      return `${baseClasses} border-white text-white`;
    }
    return `${baseClasses} border-transparent text-gray-300 hover:text-white hover:border-white/50`;
  };

  return (
    <nav className="relative bg-gray-800 shadow-lg border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-between h-16">
          <div className="flex space-x-8">
            <button
              onClick={() => navigate('/dashboard')}
              className={getButtonClasses('dashboard')}
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate('/scores')}
              className={getButtonClasses('scores')}
            >
              Scores
            </button>
            <button
              onClick={() => navigate('/draw')}
              className={getButtonClasses('draw')}
            >
              Draw
            </button>
            <button
              onClick={() => navigate('/winners')}
              className={getButtonClasses('winners')}
            >
              Winners
            </button>
            <button
              onClick={() => navigate('/subscription')}
              className={getButtonClasses('subscription')}
            >
              Subscription
            </button>
          </div>
          <div className="flex items-center space-x-4">
            {/* User Dropdown */}
            <div className="relative user-dropdown">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                <span className="material-icons text-gray-300">person</span>
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-50">
                  {/* User Info Header */}
                  <div className="px-4 py-3 border-b border-gray-700">
                    <p className="text-sm font-medium text-white">
                      {user?.profile?.username || user?.email?.split('@')[0]}
                    </p>
                    <p className="text-xs text-gray-400">{user?.email}</p>
                    <p className="text-xs text-gray-500 mt-1">{greeting}!</p>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        navigate('/settings');
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition duration-200 flex items-center"
                    >
                      <span className="material-icons text-base mr-3">person</span>
                      Profile Settings
                    </button>

                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        navigate('/subscription');
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition duration-200 flex items-center"
                    >
                      <span className="material-icons text-base mr-3">credit_card</span>
                      Subscription
                    </button>

                    <div className="border-t border-gray-700 my-1"></div>

                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        handleLogout();
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition duration-200 flex items-center"
                    >
                      <span className="material-icons text-base mr-3">logout</span>
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;