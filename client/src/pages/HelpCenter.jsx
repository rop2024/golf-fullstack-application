import React from 'react'
import { useNavigate } from 'react-router-dom'

const HelpCenter = () => {
  const navigate = useNavigate()

  const faqs = [
    {
      question: "How do I add my golf scores?",
      answer: "Go to the Scores page from your dashboard, click 'Add Score', and enter your score (0-100). Your scores are automatically saved and used to generate lottery entries."
    },
    {
      question: "How are lottery numbers generated?",
      answer: "Your latest 5 golf scores are automatically converted into 5 unique lottery numbers between 1-50 using our proprietary algorithm. Better scores can lead to better number combinations."
    },
    {
      question: "When do draws happen?",
      answer: "Draws are executed automatically on the 1st of each month. All active entries are processed, and winners are determined based on number matches."
    },
    {
      question: "How do I claim my winnings?",
      answer: "Winners are automatically determined after each draw. Visit the Winners page to see your winnings and click 'Claim' to add the prize amount to your balance."
    },
    {
      question: "What are the subscription limits?",
      answer: "Free: 5 scores/month, Premium: 20 scores/month, Pro: 50 scores/month. Draw entries: Free (1), Premium (5), Pro (10). Prize multipliers: Free (1x), Premium (2x), Pro (5x)."
    },
    {
      question: "How do I upgrade my subscription?",
      answer: "Visit the Subscription page from your dashboard, choose your desired plan, and complete the payment process. Changes take effect immediately."
    },
    {
      question: "Can I change my subscription anytime?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. Upgrades take effect immediately, while downgrades may take effect at the next billing cycle."
    },
    {
      question: "What happens to my data if I delete my account?",
      answer: "Your account and all associated data (scores, entries, winnings) will be permanently deleted. This action cannot be undone."
    }
  ]

  const categories = [
    {
      title: "Getting Started",
      icon: "play_circle",
      items: ["Creating an account", "Adding your first score", "Understanding the dashboard"]
    },
    {
      title: "Score Management",
      icon: "edit",
      items: ["Adding scores", "Viewing statistics", "Editing/deleting scores"]
    },
    {
      title: "Lottery System",
      icon: "casino",
      items: ["How draws work", "Number generation", "Prize distribution"]
    },
    {
      title: "Subscriptions",
      icon: "credit_card",
      items: ["Plan comparison", "Upgrading/downgrading", "Billing questions"]
    },
    {
      title: "Account & Security",
      icon: "security",
      items: ["Password reset", "Account settings", "Data privacy"]
    }
  ]

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gray-800">
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-gray-800/60 via-gray-800/20 to-transparent backdrop-blur-sm"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Help Center
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Find answers to common questions and get the help you need
          </p>
          <button
            onClick={() => navigate('/contact')}
            className="px-8 py-4 bg-blue-600 text-white font-bold text-lg rounded-lg hover:bg-blue-700 transition duration-200 shadow-lg hover:shadow-xl"
          >
            Contact Support
          </button>
        </div>
      </header>

      {/* Help Categories */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
            Browse by Category
          </h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.map((category, index) => (
              <div key={index} className="bg-gray-800 rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition duration-200 border border-gray-700">
                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-icons text-gray-300 text-2xl">{category.icon}</span>
                </div>
                <h3 className="text-lg font-semibold mb-3 text-white">{category.title}</h3>
                <ul className="text-sm text-gray-400 space-y-1">
                  {category.items.slice(0, 3).map((item, itemIndex) => (
                    <li key={itemIndex}>• {item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-gray-700 rounded-lg shadow-md p-6 border border-gray-600">
                <h3 className="text-lg font-semibold mb-3 text-white">{faq.question}</h3>
                <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Still Need Help?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Our support team is here to help you with any questions or issues
          </p>
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-700">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-icons text-gray-300 text-2xl">email</span>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">Email Support</h3>
              <p className="text-gray-400 mb-4">Get help via email</p>
              <a href="mailto:support@draw5.com" className="text-blue-400 hover:text-blue-300 font-medium">
                support@draw5.com
              </a>
            </div>
            <div className="bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-700">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-icons text-gray-300 text-2xl">forum</span>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">Community Forum</h3>
              <p className="text-gray-400 mb-4">Connect with other users</p>
              <button className="text-green-400 hover:text-green-300 font-medium">
                Visit Forum
              </button>
            </div>
          </div>
          <button
            onClick={() => navigate('/contact')}
            className="px-8 py-4 bg-blue-600 text-white font-bold text-lg rounded-lg hover:bg-blue-700 transition duration-200 shadow-lg hover:shadow-xl"
          >
            Contact Us
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-4 sm:px-6 lg:px-8 bg-gray-900 border-t border-gray-800">
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

export default HelpCenter