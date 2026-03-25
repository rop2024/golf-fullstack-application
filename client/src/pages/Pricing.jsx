import React from 'react';
import { useNavigate } from 'react-router-dom';

const Pricing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 py-20 px-4 sm:px-6 lg:px-8">
        {/* Bottom transition blur */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-transparent via-gray-800/20 to-gray-800/60 backdrop-blur-sm"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent tracking-wider">
            Pricing Plans
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            Choose the perfect plan for your golf performance journey
          </p>
        </div>
      </section>

      {/* Pricing Table */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gray-800">
        {/* Top transition blur */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-gray-800/60 via-gray-800/20 to-transparent backdrop-blur-sm"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="overflow-x-auto">
            <table className="w-full bg-gray-700 rounded-lg overflow-hidden">
              <thead className="bg-gray-600">
                <tr>
                  <th className="px-6 py-4 text-left text-lg font-semibold">Feature</th>
                  <th className="px-6 py-4 text-center text-lg font-semibold">
                    <div className="flex flex-col items-center">
                      <span className="text-blue-400">Free</span>
                      <span className="text-sm text-gray-400">$0</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center text-lg font-semibold border-l-2 border-r-2 border-blue-500">
                    <div className="flex flex-col items-center">
                      <span className="text-green-400">Premium</span>
                      <span className="text-sm text-gray-400">$19.99/mo</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center text-lg font-semibold">
                    <div className="flex flex-col items-center">
                      <span className="text-purple-400">Pro</span>
                      <span className="text-sm text-gray-400">$49.99/mo</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-600">
                  <td className="px-6 py-4 font-medium">Max Scores</td>
                  <td className="px-6 py-4 text-center">5</td>
                  <td className="px-6 py-4 text-center border-l-2 border-r-2 border-blue-500 bg-blue-500/10">20</td>
                  <td className="px-6 py-4 text-center">50</td>
                </tr>
                <tr className="border-t border-gray-600">
                  <td className="px-6 py-4 font-medium">Draw Entries/Month</td>
                  <td className="px-6 py-4 text-center">1</td>
                  <td className="px-6 py-4 text-center border-l-2 border-r-2 border-blue-500 bg-blue-500/10">5</td>
                  <td className="px-6 py-4 text-center">10</td>
                </tr>
                <tr className="border-t border-gray-600">
                  <td className="px-6 py-4 font-medium">Prize Multiplier</td>
                  <td className="px-6 py-4 text-center">1x</td>
                  <td className="px-6 py-4 text-center border-l-2 border-r-2 border-blue-500 bg-blue-500/10">2x</td>
                  <td className="px-6 py-4 text-center">5x</td>
                </tr>
                <tr className="border-t border-gray-600">
                  <td className="px-6 py-4 font-medium">Advanced Stats</td>
                  <td className="px-6 py-4 text-center">
                    <span className="material-icons text-red-400">close</span>
                  </td>
                  <td className="px-6 py-4 text-center border-l-2 border-r-2 border-blue-500 bg-blue-500/10">
                    <span className="material-icons text-green-400">check</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="material-icons text-green-400">check</span>
                  </td>
                </tr>
                <tr className="border-t border-gray-600">
                  <td className="px-6 py-4 font-medium">Bulk Submit</td>
                  <td className="px-6 py-4 text-center">
                    <span className="material-icons text-red-400">close</span>
                  </td>
                  <td className="px-6 py-4 text-center border-l-2 border-r-2 border-blue-500 bg-blue-500/10">
                    <span className="material-icons text-green-400">check</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="material-icons text-green-400">check</span>
                  </td>
                </tr>
                <tr className="border-t border-gray-600">
                  <td className="px-6 py-4 font-medium">API Access</td>
                  <td className="px-6 py-4 text-center">
                    <span className="material-icons text-red-400">close</span>
                  </td>
                  <td className="px-6 py-4 text-center border-l-2 border-r-2 border-blue-500 bg-blue-500/10">
                    <span className="material-icons text-red-400">close</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="material-icons text-green-400">check</span>
                  </td>
                </tr>
                <tr className="border-t border-gray-600 bg-gray-600/50">
                  <td className="px-6 py-6 font-semibold text-lg">Choose Plan</td>
                  <td className="px-6 py-6 text-center">
                    <button className="w-full py-2 px-4 bg-gray-500 hover:bg-gray-400 text-white font-semibold rounded-lg transition duration-200">
                      Current Plan
                    </button>
                  </td>
                  <td className="px-6 py-6 text-center border-l-2 border-r-2 border-blue-500 bg-blue-500/10">
                    <button
                      onClick={() => navigate('/?modal=signup')}
                      className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition duration-200"
                    >
                      Upgrade to Premium
                    </button>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <button
                      onClick={() => navigate('/?modal=signup')}
                      className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition duration-200"
                    >
                      Upgrade to Pro
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Plan Details */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gray-900">
        {/* Top transition blur */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-gray-900/60 via-gray-900/20 to-transparent backdrop-blur-sm"></div>
        {/* Bottom transition blur */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-transparent via-gray-900/20 to-gray-800/60 backdrop-blur-sm"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Plan Details</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <div className="bg-gray-800 p-8 rounded-lg border border-gray-700">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-blue-400 mb-2">Free</h3>
                <p className="text-4xl font-black text-white mb-2">$0</p>
                <p className="text-gray-400">Perfect for getting started</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <span className="material-icons text-green-400 mr-3 text-sm">check</span>
                  <span>Up to 5 scores per month</span>
                </li>
                <li className="flex items-center">
                  <span className="material-icons text-green-400 mr-3 text-sm">check</span>
                  <span>1 draw entry per month</span>
                </li>
                <li className="flex items-center">
                  <span className="material-icons text-green-400 mr-3 text-sm">check</span>
                  <span>Basic performance tracking</span>
                </li>
                <li className="flex items-center">
                  <span className="material-icons text-green-400 mr-3 text-sm">check</span>
                  <span>Community access</span>
                </li>
                <li className="flex items-center">
                  <span className="material-icons text-red-400 mr-3 text-sm">close</span>
                  <span>Advanced statistics</span>
                </li>
                <li className="flex items-center">
                  <span className="material-icons text-red-400 mr-3 text-sm">close</span>
                  <span>Bulk score submission</span>
                </li>
              </ul>
              <button className="w-full py-3 px-6 bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-lg transition duration-200">
                Current Plan
              </button>
            </div>

            {/* Premium Plan */}
            <div className="bg-blue-600 p-8 rounded-lg border-2 border-blue-500 transform scale-105 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">Most Popular</span>
              </div>
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">Premium</h3>
                <p className="text-4xl font-black text-white mb-2">$19.99</p>
                <p className="text-blue-100">per month</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <span className="material-icons text-white mr-3 text-sm">check</span>
                  <span>Up to 20 scores per month</span>
                </li>
                <li className="flex items-center">
                  <span className="material-icons text-white mr-3 text-sm">check</span>
                  <span>5 draw entries per month</span>
                </li>
                <li className="flex items-center">
                  <span className="material-icons text-white mr-3 text-sm">check</span>
                  <span>2x prize multiplier</span>
                </li>
                <li className="flex items-center">
                  <span className="material-icons text-white mr-3 text-sm">check</span>
                  <span>Advanced statistics & analytics</span>
                </li>
                <li className="flex items-center">
                  <span className="material-icons text-white mr-3 text-sm">check</span>
                  <span>Bulk score submission</span>
                </li>
                <li className="flex items-center">
                  <span className="material-icons text-white mr-3 text-sm">check</span>
                  <span>Priority support</span>
                </li>
              </ul>
              <button
                onClick={() => navigate('/?modal=signup')}
                className="w-full py-3 px-6 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition duration-200"
              >
                Upgrade to Premium
              </button>
            </div>

            {/* Pro Plan */}
            <div className="bg-gray-800 p-8 rounded-lg border border-gray-700">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-purple-400 mb-2">Pro</h3>
                <p className="text-4xl font-black text-white mb-2">$49.99</p>
                <p className="text-gray-400">per month</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <span className="material-icons text-green-400 mr-3 text-sm">check</span>
                  <span>Up to 50 scores per month</span>
                </li>
                <li className="flex items-center">
                  <span className="material-icons text-green-400 mr-3 text-sm">check</span>
                  <span>10 draw entries per month</span>
                </li>
                <li className="flex items-center">
                  <span className="material-icons text-green-400 mr-3 text-sm">check</span>
                  <span>5x prize multiplier</span>
                </li>
                <li className="flex items-center">
                  <span className="material-icons text-green-400 mr-3 text-sm">check</span>
                  <span>All Premium features</span>
                </li>
                <li className="flex items-center">
                  <span className="material-icons text-green-400 mr-3 text-sm">check</span>
                  <span>API access for integrations</span>
                </li>
                <li className="flex items-center">
                  <span className="material-icons text-green-400 mr-3 text-sm">check</span>
                  <span>Dedicated account manager</span>
                </li>
              </ul>
              <button
                onClick={() => navigate('/?modal=signup')}
                className="w-full py-3 px-6 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition duration-200"
              >
                Upgrade to Pro
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gray-800">
        {/* Top transition blur */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-gray-800/60 via-gray-800/20 to-transparent backdrop-blur-sm"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="bg-gray-700 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Can I change plans anytime?</h3>
              <p className="text-gray-300">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
            </div>
            <div className="bg-gray-700 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">What happens to my data if I downgrade?</h3>
              <p className="text-gray-300">Your data is always safe. You'll retain access to historical data, but new features may be limited based on your plan.</p>
            </div>
            <div className="bg-gray-700 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Is there a free trial for premium plans?</h3>
              <p className="text-gray-300">We offer a 7-day free trial for both Premium and Pro plans. No credit card required to start.</p>
            </div>
            <div className="bg-gray-700 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">How does the prize multiplier work?</h3>
              <p className="text-gray-300">Your prize multiplier increases the value of any winnings. For example, Premium users get 2x multiplier on all prizes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        {/* Top transition blur */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-blue-600/60 via-blue-600/20 to-transparent backdrop-blur-sm"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Upgrade Your Game?</h2>
          <p className="text-xl text-blue-100 mb-8">Join thousands of golfers already using Draw5 Pro features</p>
          <button
            onClick={() => navigate('/?modal=signup')}
            className="px-12 py-4 bg-white text-blue-600 font-bold text-xl rounded-lg hover:bg-gray-100 transition duration-200 shadow-lg hover:shadow-xl"
          >
            Start Free Trial
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

export default Pricing;