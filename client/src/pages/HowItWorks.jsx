import React from 'react'
import { useNavigate } from 'react-router-dom'

const HowItWorks = () => {
  const navigate = useNavigate()

  const steps = [
    {
      number: 1,
      title: "Track Your Golf Scores",
      description: "Log your golf scores (0-100) in your dashboard. Each score represents your performance on the course.",
      icon: "golf_course",
      details: [
        "Add scores through the Scores page",
        "Track your progress over time",
        "View detailed statistics and trends",
        "Subscription tiers offer different limits"
      ]
    },
    {
      number: 2,
      title: "Automatic Number Generation",
      description: "Your latest 5 scores automatically convert into 5 unique lottery numbers between 1-50.",
      icon: "shuffle",
      details: [
        "Algorithm converts scores to lottery numbers",
        "Each score generates one unique number",
        "Numbers range from 1-50",
        "Better scores can lead to better numbers"
      ]
    },
    {
      number: 3,
      title: "Enter Active Draws",
      description: "Submit your generated numbers to participate in active lottery draws with prize pools.",
      icon: "casino",
      details: [
        "View active draws on the Draw page",
        "Submit your 5 generated numbers",
        "Each draw has its own prize pool",
        "Subscription tier determines entry limits"
      ]
    },
    {
      number: 4,
      title: "Draw Execution & Winners",
      description: "Monthly draws are executed automatically, and winners are determined by number matches.",
      icon: "celebration",
      details: [
        "Draws run on the 1st of each month",
        "Winning numbers are randomly selected",
        "Prizes awarded for 3, 4, or 5 matches",
        "Prize amounts based on match count and subscription multiplier"
      ]
    },
    {
      number: 5,
      title: "Claim Your Winnings",
      description: "View your winnings in the Winners section and claim prizes to add to your balance.",
      icon: "account_balance_wallet",
      details: [
        "Check winnings in the Winners page",
        "Claim prizes to add to your balance",
        "Balance can be used for future entries",
        "Track your winning history"
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        {/* Top transition blur */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-blue-600/60 via-blue-600/20 to-transparent backdrop-blur-sm"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            How Draw5 Works
          </h1>
          <p className="text-xl text-blue-100 mb-8">
            Turn your golf scores into lottery entries and win prizes based on your performance
          </p>
          <button
            onClick={() => navigate('/?modal=signup')}
            className="px-8 py-4 bg-white text-blue-600 font-bold text-lg rounded-lg hover:bg-gray-100 transition duration-200 shadow-lg hover:shadow-xl"
          >
            Start Playing Now
          </button>
        </div>
      </header>

      {/* Steps Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              5 Simple Steps to Win
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From tracking your golf game to claiming prizes, here's how the Draw5 lottery system works
            </p>
          </div>

          <div className="space-y-16">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                {/* Connection Line */}
                {index < steps.length - 1 && (
                  <div className="absolute left-8 top-24 w-0.5 h-32 bg-gradient-to-b from-blue-300 to-purple-300"></div>
                )}

                <div className="flex flex-col md:flex-row items-start gap-8">
                  {/* Step Number & Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                      <span className="material-icons text-white text-2xl">{step.icon}</span>
                    </div>
                    <div className="mt-4 text-center">
                      <span className="inline-block w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {step.number}
                      </span>
                    </div>
                  </div>

                  {/* Step Content */}
                  <div className="flex-1 bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                    <h3 className="text-2xl font-bold mb-4 text-gray-900">
                      {step.title}
                    </h3>
                    <p className="text-lg text-gray-600 mb-6">
                      {step.description}
                    </p>

                    {/* Details List */}
                    <div className="grid md:grid-cols-2 gap-4">
                      {step.details.map((detail, detailIndex) => (
                        <div key={detailIndex} className="flex items-start">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span className="text-gray-700">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Prize Distribution Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              Prize Distribution
            </h2>
            <p className="text-xl text-gray-600">
              Win prizes based on how many of your numbers match the winning numbers
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center border-2 border-green-200">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-icons text-white text-2xl">looks_3</span>
              </div>
              <h3 className="text-2xl font-bold mb-2 text-green-600">3 Matches</h3>
              <p className="text-gray-600 mb-4">Small Prize</p>
              <div className="text-3xl font-bold text-green-600">$50</div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 text-center border-2 border-blue-200">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-icons text-white text-2xl">looks_4</span>
              </div>
              <h3 className="text-2xl font-bold mb-2 text-blue-600">4 Matches</h3>
              <p className="text-gray-600 mb-4">Medium Prize</p>
              <div className="text-3xl font-bold text-blue-600">$200</div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 text-center border-2 border-purple-200">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-icons text-white text-2xl">looks_5</span>
              </div>
              <h3 className="text-2xl font-bold mb-2 text-purple-600">5 Matches</h3>
              <p className="text-gray-600 mb-4">Jackpot!</p>
              <div className="text-3xl font-bold text-purple-600">$1,000</div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <div className="bg-blue-50 rounded-lg p-6 inline-block">
              <p className="text-lg text-blue-800">
                <span className="font-semibold">Pro Tip:</span> Premium and Pro subscribers get 2x and 5x prize multipliers respectively!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Subscription Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
            Boost Your Chances with Subscriptions
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Higher subscription tiers give you more entries and bigger prize multipliers
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
              <h3 className="text-xl font-bold mb-4 text-gray-900">Free</h3>
              <div className="text-3xl font-bold text-gray-600 mb-2">$0</div>
              <ul className="text-left space-y-2 text-gray-600">
                <li>✓ 5 scores per month</li>
                <li>✓ 1 draw entry per month</li>
                <li>✓ 1x prize multiplier</li>
                <li>✓ Basic features</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg p-8 border-2 border-blue-300 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">Popular</span>
              </div>
              <h3 className="text-xl font-bold mb-4 text-blue-600">Premium</h3>
              <div className="text-3xl font-bold text-blue-600 mb-2">$19.99/mo</div>
              <ul className="text-left space-y-2 text-gray-700">
                <li>✓ 20 scores per month</li>
                <li>✓ 5 draw entries per month</li>
                <li>✓ 2x prize multiplier</li>
                <li>✓ Advanced statistics</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-lg p-8 border-2 border-purple-300">
              <h3 className="text-xl font-bold mb-4 text-purple-600">Pro</h3>
              <div className="text-3xl font-bold text-purple-600 mb-2">$49.99/mo</div>
              <ul className="text-left space-y-2 text-gray-700">
                <li>✓ 50 scores per month</li>
                <li>✓ 10 draw entries per month</li>
                <li>✓ 5x prize multiplier</li>
                <li>✓ All premium features</li>
              </ul>
            </div>
          </div>

          <div className="mt-12">
            <button
              onClick={() => navigate('/pricing')}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-lg hover:from-blue-700 hover:to-purple-700 transition duration-200 shadow-lg hover:shadow-xl"
            >
              View Detailed Pricing →
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        {/* Top transition blur */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-blue-600/60 via-blue-600/20 to-transparent backdrop-blur-sm"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Ready to Turn Your Golf Game into Winnings?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of golfers already winning with Draw5
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/?modal=signup')}
              className="px-8 py-4 bg-white text-blue-600 font-bold text-lg rounded-lg hover:bg-gray-100 transition duration-200 shadow-lg hover:shadow-xl"
            >
              Start Playing Now
            </button>
            <button
              onClick={() => navigate('/features')}
              className="px-8 py-4 bg-blue-500 text-white font-bold text-lg rounded-lg hover:bg-blue-400 transition duration-200 shadow-lg hover:shadow-xl"
            >
              Learn More
            </button>
          </div>
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
                <li><a href="#" className="hover:text-white">FAQ</a></li>
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
            © 2024 Draw5. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HowItWorks