import React from 'react';
import { useNavigate } from 'react-router-dom';

const Features = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 py-20 px-4 sm:px-6 lg:px-8">
        {/* Bottom transition blur */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-transparent via-gray-800/20 to-gray-800/60 backdrop-blur-sm"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent tracking-wider">
            Features
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            Discover what makes Draw5 the ultimate golf performance platform
          </p>
          <button
            onClick={() => navigate('/?modal=signup')}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200 shadow-lg hover:shadow-xl"
          >
            Get Started Free
          </button>
        </div>
      </section>

      {/* Core Features */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gray-800">
        {/* Top transition blur */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-gray-800/60 via-gray-800/20 to-transparent backdrop-blur-sm"></div>
        {/* Bottom transition blur */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-transparent via-gray-800/20 to-gray-900/60 backdrop-blur-sm"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Core Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-700 p-8 rounded-lg hover:bg-gray-600 transition duration-300">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-icons text-3xl text-white">golf_course</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-center">Score Tracking</h3>
              <p className="text-gray-300 text-center mb-4">
                Log your golf scores with our intuitive interface. Track every round with detailed statistics and performance metrics.
              </p>
              <ul className="text-sm text-gray-400 space-y-2">
                <li>• Easy score entry</li>
                <li>• Course information</li>
                <li>• Weather conditions</li>
                <li>• Performance analytics</li>
              </ul>
            </div>

            <div className="bg-gray-700 p-8 rounded-lg hover:bg-gray-600 transition duration-300">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-icons text-3xl text-white">shuffle</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-center">Draw Generation</h3>
              <p className="text-gray-300 text-center mb-4">
                Your latest five scores automatically generate your unique draw entry. No manual number selection required.
              </p>
              <ul className="text-sm text-gray-400 space-y-2">
                <li>• Automatic conversion</li>
                <li>• Unique algorithm</li>
                <li>• Performance-based</li>
                <li>• Transparent process</li>
              </ul>
            </div>

            <div className="bg-gray-700 p-8 rounded-lg hover:bg-gray-600 transition duration-300">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-icons text-3xl text-white">emoji_events</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-center">Prize System</h3>
              <p className="text-gray-300 text-center mb-4">
                Win prizes based on matching numbers. Multiple tiers ensure everyone has a chance to win something.
              </p>
              <ul className="text-sm text-gray-400 space-y-2">
                <li>• Match 3, 4, or 5 numbers</li>
                <li>• Tiered reward system</li>
                <li>• Instant notifications</li>
                <li>• Secure payouts</li>
              </ul>
            </div>

            <div className="bg-gray-700 p-8 rounded-lg hover:bg-gray-600 transition duration-300">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-icons text-3xl text-white">analytics</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-center">Performance Analytics</h3>
              <p className="text-gray-300 text-center mb-4">
                Detailed insights into your golf performance. Track improvement over time with comprehensive statistics.
              </p>
              <ul className="text-sm text-gray-400 space-y-2">
                <li>• Score trends</li>
                <li>• Handicap calculation</li>
                <li>• Course statistics</li>
                <li>• Progress tracking</li>
              </ul>
            </div>

            <div className="bg-gray-700 p-8 rounded-lg hover:bg-gray-600 transition duration-300">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-icons text-3xl text-white">local_fire_department</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-center">Gamification</h3>
              <p className="text-gray-300 text-center mb-4">
                Stay motivated with streaks, achievements, and leaderboards. Turn practice into an engaging experience.
              </p>
              <ul className="text-sm text-gray-400 space-y-2">
                <li>• Activity streaks</li>
                <li>• Achievement badges</li>
                <li>• Leaderboards</li>
                <li>• Progress milestones</li>
              </ul>
            </div>

            <div className="bg-gray-700 p-8 rounded-lg hover:bg-gray-600 transition duration-300">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-icons text-3xl text-white">security</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-center">Secure & Transparent</h3>
              <p className="text-gray-300 text-center mb-4">
                Your data is protected with enterprise-grade security. All draw processes are transparent and verifiable.
              </p>
              <ul className="text-sm text-gray-400 space-y-2">
                <li>• End-to-end encryption</li>
                <li>• Transparent draws</li>
                <li>• Secure payments</li>
                <li>• Data privacy</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Features */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gray-900">
        {/* Top transition blur */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-gray-900/60 via-gray-900/20 to-transparent backdrop-blur-sm"></div>
        {/* Bottom transition blur */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-transparent via-gray-900/20 to-gray-800/60 backdrop-blur-sm"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Advanced Features</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-6 text-blue-400">Pro Analytics Dashboard</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                    <span className="material-icons text-white text-sm">trending_up</span>
                  </span>
                  <div>
                    <h4 className="font-semibold">Score Trends</h4>
                    <p className="text-gray-400 text-sm">Visualize your performance over time with interactive charts</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                    <span className="material-icons text-white text-sm">insights</span>
                  </span>
                  <div>
                    <h4 className="font-semibold">Performance Insights</h4>
                    <p className="text-gray-400 text-sm">AI-powered analysis of your strengths and areas for improvement</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                    <span className="material-icons text-white text-sm">compare</span>
                  </span>
                  <div>
                    <h4 className="font-semibold">Course Comparison</h4>
                    <p className="text-gray-400 text-sm">Compare your performance across different courses and conditions</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-6 text-blue-400">Community Features</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                    <span className="material-icons text-white text-sm">group</span>
                  </span>
                  <div>
                    <h4 className="font-semibold">Leaderboards</h4>
                    <p className="text-gray-400 text-sm">Compete with friends and players worldwide</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                    <span className="material-icons text-white text-sm">celebration</span>
                  </span>
                  <div>
                    <h4 className="font-semibold">Achievements</h4>
                    <p className="text-gray-400 text-sm">Unlock badges and celebrate your milestones</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                    <span className="material-icons text-white text-sm">handshake</span>
                  </span>
                  <div>
                    <h4 className="font-semibold">Charity Integration</h4>
                    <p className="text-gray-400 text-sm">Contribute to causes you care about</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Features */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gray-800">
        {/* Top transition blur */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-gray-800/60 via-gray-800/20 to-transparent backdrop-blur-sm"></div>
        {/* Bottom transition blur */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-transparent via-gray-800/20 to-gray-900/60 backdrop-blur-sm"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Technical Excellence</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-icons text-4xl text-white">cloud</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Cloud Infrastructure</h3>
              <p className="text-gray-400">Scalable, secure cloud infrastructure ensuring 99.9% uptime</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-icons text-4xl text-white">verified</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Verified Draws</h3>
              <p className="text-gray-400">Cryptographically secure random number generation</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-icons text-4xl text-white">smartphone</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Mobile Optimized</h3>
              <p className="text-gray-400">Responsive design works perfectly on all devices</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        {/* Top transition blur */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-blue-600/60 via-blue-600/20 to-transparent backdrop-blur-sm"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Experience All Features?</h2>
          <p className="text-xl text-blue-100 mb-8">Join thousands of golfers already using Draw5</p>
          <button
            onClick={() => navigate('/?modal=signup')}
            className="px-12 py-4 bg-white text-blue-600 font-bold text-xl rounded-lg hover:bg-gray-100 transition duration-200 shadow-lg hover:shadow-xl"
          >
            Start Your Journey
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
                <li><a href="#" onClick={() => navigate('/')} className="hover:text-white cursor-pointer">Home</a></li>
                <li><a href="#" onClick={() => navigate('/features')} className="hover:text-white cursor-pointer">Features</a></li>
                <li><a href="#" onClick={() => navigate('/pricing')} className="hover:text-white cursor-pointer">Pricing</a></li>
                <li><a href="#" onClick={() => navigate('/how-it-works')} className="hover:text-white cursor-pointer">How it Works</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Privacy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Terms</a></li>
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
            <p>&copy; 2024 Draw5. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Features;