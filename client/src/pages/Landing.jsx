import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [loginTimeout, setLoginTimeout] = useState(null);
  const { signIn, signUp, error, loading, user } = useAuth();

  // Check for modal parameter on mount
  useEffect(() => {
    const modalParam = searchParams.get('modal');
    if (modalParam === 'login') {
      openModal(true);
    } else if (modalParam === 'signup') {
      openModal(false);
    }
  }, [searchParams]);

  // Redirect if already authenticated
  useEffect(() => {
    if (user && !loading) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (loginTimeout) {
        clearTimeout(loginTimeout);
      }
    };
  }, [loginTimeout]);

  const openModal = (loginMode = true) => {
    setIsLoginMode(loginMode);
    setIsModalOpen(true);
    setPasswordError('');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setLoginData({ email: '', password: '' });
    setSignupData({ username: '', email: '', password: '', confirmPassword: '' });
    setPasswordError('');
    if (loginTimeout) {
      clearTimeout(loginTimeout);
      setLoginTimeout(null);
    }
    // Clean up URL parameter
    navigate('/', { replace: true });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    // Clear any existing timeout
    if (loginTimeout) {
      clearTimeout(loginTimeout);
    }

    // Set a timeout to prevent infinite loading (10 seconds)
    const timeoutId = setTimeout(() => {
      console.error('Login timeout - forcing loading state reset');
      window.location.reload();
    }, 10000);

    setLoginTimeout(timeoutId);

    try {
      const result = await signIn(loginData.email, loginData.password);
      if (result.success) {
        clearTimeout(timeoutId);
        setLoginTimeout(null);
        closeModal();
        navigate('/dashboard');
      } else {
        clearTimeout(timeoutId);
        setLoginTimeout(null);
      }
    } catch (err) {
      clearTimeout(timeoutId);
      setLoginTimeout(null);
      console.error('Login error:', err);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords match
    if (signupData.password !== signupData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    // Validate password strength
    if (signupData.password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    setPasswordError('');

    const result = await signUp(signupData.email, signupData.password, signupData.username);
    if (result.success) {
      closeModal();
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 py-20 px-4 sm:px-6 lg:px-8">
        {/* Bottom transition blur */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-transparent via-gray-800/20 to-gray-800/60 backdrop-blur-sm"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent tracking-wider">
            Draw5
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-4">
            Turn your last five scores into winning numbers
          </p>
          <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
            Track your performance, improve consistently, and automatically enter monthly draws. Your results define your chances.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button
              onClick={() => openModal(false)}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200 shadow-lg hover:shadow-xl"
            >
              Get Started Free
            </button>
            <button
              onClick={() => openModal(true)}
              className="px-8 py-4 border-2 border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white font-semibold rounded-lg transition duration-200"
            >
              Sign In
            </button>
          </div>
          {/* Animated numbers */}
          <div className="flex justify-center space-x-4 text-2xl font-mono">
            {[12, 25, 8, 41, 33].map((num, index) => (
              <div
                key={index}
                className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg animate-bounce-in-out"
                style={{
                  animationDelay: `${index * 0.3}s`,
                  animationDuration: '12s',
                  animationIterationCount: 'infinite'
                }}
              >
                {num}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gray-800">
        {/* Top transition blur */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-gray-800/60 via-gray-800/20 to-transparent backdrop-blur-sm"></div>
        {/* Bottom transition blur */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-transparent via-gray-800/20 to-gray-900/60 backdrop-blur-sm"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">How Draw5 Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Track Your Scores</h3>
              <p className="text-gray-400">Add your daily scores within the defined range.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Automatic Conversion</h3>
              <p className="text-gray-400">Your latest five scores are converted into your draw entry.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Monthly Draw</h3>
              <p className="text-gray-400">The system generates five winning numbers.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">4</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Results</h3>
              <p className="text-gray-400">Matching numbers determine your reward tier.</p>
            </div>
          </div>
          <div className="text-center mt-12">
            <button
              onClick={() => navigate('/how-it-works')}
              className="px-8 py-4 bg-blue-600 text-white font-bold text-lg rounded-lg hover:bg-blue-700 transition duration-200 shadow-lg hover:shadow-xl"
            >
              Learn More About How It Works →
            </button>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gray-900">
        {/* Top transition blur */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-gray-900/60 via-gray-900/20 to-transparent backdrop-blur-sm"></div>
        {/* Bottom transition blur */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-transparent via-gray-900/20 to-gray-800/60 backdrop-blur-sm"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Performance, Not Just Chance</h2>
              <ul className="space-y-4 text-gray-300">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Entries are based on real user activity
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Consistency improves participation quality
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Structured system instead of random guessing
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Transparent logic behind draws
                </li>
              </ul>
            </div>
            <div className="bg-gray-800 p-8 rounded-lg">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="material-icons text-4xl text-white">adjust</span>
                </div>
                <p className="text-gray-400">System Architecture</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Analytics Preview */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gray-800">
        {/* Top transition blur */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-gray-800/60 via-gray-800/20 to-transparent backdrop-blur-sm"></div>
        {/* Bottom transition blur */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-transparent via-gray-800/20 to-gray-900/60 backdrop-blur-sm"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Track Progress and Improve Outcomes</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-700 p-6 rounded-lg text-center">
              <div className="text-4xl mb-4 text-blue-500"><span className="material-icons">trending_up</span></div>
              <h3 className="text-xl font-semibold mb-2">Score Trends</h3>
              <p className="text-gray-400">Visualize your performance over time</p>
            </div>
            <div className="bg-gray-700 p-6 rounded-lg text-center">
              <div className="text-4xl mb-4 text-blue-500"><span className="material-icons">local_fire_department</span></div>
              <h3 className="text-xl font-semibold mb-2">Consistency</h3>
              <p className="text-gray-400">Track your activity streaks</p>
            </div>
            <div className="bg-gray-700 p-6 rounded-lg text-center">
              <div className="text-4xl mb-4 text-blue-500"><span className="material-icons">analytics</span></div>
              <h3 className="text-xl font-semibold mb-2">Insights</h3>
              <p className="text-gray-400">Performance improvement metrics</p>
            </div>
          </div>
        </div>
      </section>

      {/* Rewards System */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gray-900">
        {/* Top transition blur */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-gray-900/60 via-gray-900/20 to-transparent backdrop-blur-sm"></div>
        {/* Bottom transition blur */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-transparent via-gray-900/20 to-gray-800/60 backdrop-blur-sm"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Structured Rewards</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800 p-8 rounded-lg text-center border border-gray-700">
              <h3 className="text-2xl font-bold text-yellow-500 mb-2">Match 3</h3>
              <p className="text-gray-400">Entry-level reward</p>
            </div>
            <div className="bg-gray-800 p-8 rounded-lg text-center border-2 border-blue-500">
              <h3 className="text-2xl font-bold text-blue-400 mb-2">Match 4</h3>
              <p className="text-gray-400">Mid-tier reward</p>
            </div>
            <div className="bg-gray-800 p-8 rounded-lg text-center border border-gray-700">
              <h3 className="text-2xl font-bold text-green-500 mb-2">Match 5</h3>
              <p className="text-gray-400">Top-tier reward</p>
            </div>
          </div>
        </div>
      </section>

      {/* Charity Integration */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gray-800">
        {/* Top transition blur */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-gray-800/60 via-gray-800/20 to-transparent backdrop-blur-sm"></div>
        {/* Bottom transition blur */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-transparent via-gray-800/20 to-gray-900/60 backdrop-blur-sm"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Optional Contribution</h2>
          <p className="text-lg text-gray-400 mb-8">
            Users can allocate a percentage of their subscription toward selected charities.
          </p>
          <div className="bg-gray-700 p-8 rounded-lg inline-block">
            <span className="material-icons text-5xl text-blue-500">handshake</span>
          </div>
        </div>
      </section>

      {/* Gamification */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gray-900">
        {/* Top transition blur */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-gray-900/60 via-gray-900/20 to-transparent backdrop-blur-sm"></div>
        {/* Bottom transition blur */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-transparent via-gray-900/20 to-gray-800/60 backdrop-blur-sm"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Consistency Matters</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="text-4xl mb-4 text-blue-500"><span className="material-icons">local_fire_department</span></div>
              <h3 className="text-xl font-semibold mb-2">Activity Streaks</h3>
              <p className="text-gray-400">Track consecutive participation</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="text-4xl mb-4 text-blue-500"><span className="material-icons">emoji_events</span></div>
              <h3 className="text-xl font-semibold mb-2">Achievements</h3>
              <p className="text-gray-400">Unlock badges for milestones</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="text-4xl mb-4 text-blue-500"><span className="material-icons">leaderboard</span></div>
              <h3 className="text-xl font-semibold mb-2">Leaderboards</h3>
              <p className="text-gray-400">Compare with other players</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gray-800">
        {/* Top transition blur */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-gray-800/60 via-gray-800/20 to-transparent backdrop-blur-sm"></div>
        {/* Bottom transition blur */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-transparent via-gray-800/20 to-blue-600/60 backdrop-blur-sm"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">Simple Pricing</h2>
          <p className="text-center text-gray-400 mb-12">Choose the plan that fits your golf performance goals</p>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-gray-700 p-6 rounded-lg text-center">
              <h3 className="text-xl font-bold text-blue-400 mb-2">Free</h3>
              <p className="text-3xl font-black text-white mb-1">$0</p>
              <p className="text-gray-400 text-sm mb-4">Get started</p>
              <ul className="text-sm text-gray-300 space-y-1 mb-6">
                <li>5 scores/month</li>
                <li>1 draw entry/month</li>
                <li>1x prize multiplier</li>
              </ul>
              <button className="w-full py-2 px-4 bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-lg transition duration-200">
                Current Plan
              </button>
            </div>
            <div className="bg-blue-600 p-6 rounded-lg text-center border-2 border-blue-500 transform scale-105 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold">Most Popular</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Premium</h3>
              <p className="text-3xl font-black text-white mb-1">$19.99</p>
              <p className="text-blue-100 text-sm mb-4">per month</p>
              <ul className="text-sm text-white space-y-1 mb-6">
                <li>20 scores/month</li>
                <li>5 draw entries/month</li>
                <li>2x prize multiplier</li>
                <li>Advanced stats</li>
                <li>Bulk submit</li>
              </ul>
              <button
                onClick={() => openModal(false)}
                className="w-full py-2 px-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition duration-200"
              >
                Upgrade
              </button>
            </div>
            <div className="bg-gray-700 p-6 rounded-lg text-center">
              <h3 className="text-xl font-bold text-purple-400 mb-2">Pro</h3>
              <p className="text-3xl font-black text-white mb-1">$49.99</p>
              <p className="text-gray-400 text-sm mb-4">per month</p>
              <ul className="text-sm text-gray-300 space-y-1 mb-6">
                <li>50 scores/month</li>
                <li>10 draw entries/month</li>
                <li>5x prize multiplier</li>
                <li>All Premium features</li>
                <li>API access</li>
              </ul>
              <button
                onClick={() => openModal(false)}
                className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition duration-200"
              >
                Upgrade
              </button>
            </div>
          </div>
          <div className="text-center">
            <button
              onClick={() => navigate('/pricing')}
              className="px-8 py-3 bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-lg transition duration-200"
            >
              View Detailed Pricing →
            </button>
          </div>
        </div>
      </section>

      {/* Trust and Transparency */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gray-900">
        {/* Top transition blur */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-gray-900/60 via-gray-900/20 to-transparent backdrop-blur-sm"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Transparent System</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-center">
                <span className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                  <span className="material-icons text-white text-base">check</span>
                </span>
                <span className="text-gray-300">Clear draw mechanism</span>
              </div>
              <div className="flex items-center">
                <span className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                  <span className="material-icons text-white text-base">check</span>
                </span>
                <span className="text-gray-300">Secure payment processing</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center">
                <span className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                  <span className="material-icons text-white text-base">check</span>
                </span>
                <span className="text-gray-300">Verified results</span>
              </div>
              <div className="flex items-center">
                <span className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                  <span className="material-icons text-white text-base">check</span>
                </span>
                <span className="text-gray-300">User data protection</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        {/* Top transition blur */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-blue-600/60 via-blue-600/20 to-transparent backdrop-blur-sm"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Your next five scores define your next opportunity</h2>
          <button
            onClick={() => openModal(false)}
            className="px-12 py-4 bg-white text-blue-600 font-bold text-xl rounded-lg hover:bg-gray-100 transition duration-200 shadow-lg hover:shadow-xl"
          >
            Join Draw5
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-4 sm:px-6 lg:px-8 bg-gray-900 border-t border-gray-800">
        {/* Top transition blur */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-gray-900/60 via-gray-900/20 to-transparent backdrop-blur-sm"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Draw5</h3>
              <p className="text-gray-400 text-sm">Turn your golf scores into winning opportunities.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" onClick={() => navigate('/features')} className="hover:text-white cursor-pointer">Features</a></li>
                <li><a href="#" onClick={() => navigate('/pricing')} className="hover:text-white cursor-pointer">Pricing</a></li>
                <li><a href="#" onClick={() => navigate('/how-it-works')} className="hover:text-white cursor-pointer">How it Works</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" onClick={() => navigate('/help')} className="hover:text-white cursor-pointer">Help Center</a></li>
                <li><a href="#" onClick={() => navigate('/contact')} className="hover:text-white cursor-pointer">Contact</a></li>
                <li><a href="#" className="hover:text-white">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" onClick={() => navigate('/privacy')} className="hover:text-white cursor-pointer">Privacy</a></li>
                <li><a href="#" onClick={() => navigate('/terms')} className="hover:text-white cursor-pointer">Terms</a></li>
                <li><a href="#" onClick={() => navigate('/cookies')} className="hover:text-white cursor-pointer">Cookies</a></li>
                <li><a href="#" onClick={() => navigate('/legal')} className="hover:text-white cursor-pointer">Legal</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
            <p>&copy; Draw5. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Blur Background */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeModal}
          ></div>

          {/* Modal Content */}
          <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <span className="material-icons">close</span>
              </button>

              {/* Modal Header */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-extrabold text-gray-900">
                  {isLoginMode ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  {isLoginMode ? 'Sign in to your account to continue' : 'Join us and start your journey'}
                </p>
              </div>

              {/* Login Form */}
              {isLoginMode ? (
                <form className="space-y-6" onSubmit={handleLoginSubmit}>
                  {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-red-700">{error}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label htmlFor="modal-email" className="block text-sm font-medium text-gray-700">
                        Email Address
                      </label>
                      <input
                        id="modal-email"
                        type="email"
                        required
                        className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        placeholder="you@example.com"
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      />
                    </div>

                    <div>
                      <label htmlFor="modal-password" className="block text-sm font-medium text-gray-700">
                        Password
                      </label>
                      <div className="mt-1 relative">
                        <input
                          id="modal-password"
                          type={showPassword ? "text" : "password"}
                          required
                          className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                          placeholder="••••••••"
                          value={loginData.password}
                          onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          ) : (
                            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="modal-remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor="modal-remember-me" className="ml-2 block text-sm text-gray-900">
                        Remember me
                      </label>
                    </div>

                    <div className="text-sm">
                      <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                        Forgot your password?
                      </a>
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150"
                    >
                      {loading ? (
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        'Sign in'
                      )}
                    </button>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      Don't have an account?{' '}
                      <button
                        type="button"
                        onClick={() => setIsLoginMode(false)}
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Sign up now
                      </button>
                    </p>
                  </div>
                </form>
              ) : (
                /* Signup Form */
                <form className="space-y-6" onSubmit={handleSignupSubmit}>
                  {(error || passwordError) && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-red-700">{error || passwordError}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label htmlFor="modal-username" className="block text-sm font-medium text-gray-700">
                        Username
                      </label>
                      <input
                        id="modal-username"
                        name="username"
                        type="text"
                        required
                        className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        placeholder="johndoe"
                        value={signupData.username}
                        onChange={(e) => setSignupData({ ...signupData, username: e.target.value })}
                      />
                    </div>

                    <div>
                      <label htmlFor="modal-signup-email" className="block text-sm font-medium text-gray-700">
                        Email Address
                      </label>
                      <input
                        id="modal-signup-email"
                        name="email"
                        type="email"
                        required
                        className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        placeholder="you@example.com"
                        value={signupData.email}
                        onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                      />
                    </div>

                    <div>
                      <label htmlFor="modal-signup-password" className="block text-sm font-medium text-gray-700">
                        Password
                      </label>
                      <div className="mt-1 relative">
                        <input
                          id="modal-signup-password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          required
                          className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                          placeholder="••••••••"
                          value={signupData.password}
                          onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          ) : (
                            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                          )}
                        </button>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">Must be at least 6 characters</p>
                    </div>

                    <div>
                      <label htmlFor="modal-confirm-password" className="block text-sm font-medium text-gray-700">
                        Confirm Password
                      </label>
                      <div className="mt-1 relative">
                        <input
                          id="modal-confirm-password"
                          name="confirmPassword"
                          type={showPassword ? "text" : "password"}
                          required
                          className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                          placeholder="••••••••"
                          value={signupData.confirmPassword}
                          onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          ) : (
                            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150"
                    >
                      {loading ? (
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        'Create Account'
                      )}
                    </button>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => setIsLoginMode(true)}
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Sign in
                      </button>
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Landing;