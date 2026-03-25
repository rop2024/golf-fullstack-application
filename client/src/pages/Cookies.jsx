import React from 'react'
import { useNavigate } from 'react-router-dom'

const Cookies = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-blue-600/60 via-blue-600/20 to-transparent backdrop-blur-sm"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Cookie Policy
          </h1>
          <p className="text-xl text-blue-100 mb-8">
            Learn how we use cookies to improve your experience.
          </p>
        </div>
      </header>

      {/* Content */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
            <div className="prose prose-lg max-w-none">
              <p className="text-sm text-gray-600 mb-8">
                <strong>Last updated:</strong> March 26, 2024
              </p>

              <h2 className="text-2xl font-bold mb-6 text-gray-900">1. What Are Cookies?</h2>
              <p className="mb-6 text-gray-700">
                Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better browsing experience by remembering your preferences and understanding how you use our service.
              </p>

              <h2 className="text-2xl font-bold mb-6 text-gray-900">2. How We Use Cookies</h2>
              <p className="mb-4 text-gray-700">We use cookies for the following purposes:</p>

              <h3 className="text-xl font-semibold mb-4 text-gray-800">Essential Cookies</h3>
              <p className="mb-4 text-gray-700">These cookies are necessary for the website to function properly:</p>
              <ul className="list-disc pl-6 mb-6 text-gray-700">
                <li><strong>Authentication:</strong> Keep you logged in during your session</li>
                <li><strong>Security:</strong> Protect against fraud and unauthorized access</li>
                <li><strong>Session Management:</strong> Remember your preferences during your visit</li>
              </ul>

              <h3 className="text-xl font-semibold mb-4 text-gray-800">Analytics Cookies</h3>
              <p className="mb-4 text-gray-700">These cookies help us understand how users interact with our service:</p>
              <ul className="list-disc pl-6 mb-6 text-gray-700">
                <li><strong>Usage Patterns:</strong> Track which pages are most visited</li>
                <li><strong>Performance:</strong> Monitor loading times and errors</li>
                <li><strong>User Journey:</strong> Understand how users navigate through our app</li>
              </ul>

              <h3 className="text-xl font-semibold mb-4 text-gray-800">Functional Cookies</h3>
              <p className="mb-4 text-gray-700">These cookies enhance your experience:</p>
              <ul className="list-disc pl-6 mb-6 text-gray-700">
                <li><strong>Preferences:</strong> Remember your language and display settings</li>
                <li><strong>Features:</strong> Save your customization choices</li>
                <li><strong>Feedback:</strong> Remember if you've already provided feedback</li>
              </ul>

              <h2 className="text-2xl font-bold mb-6 text-gray-900">3. Third-Party Cookies</h2>
              <p className="mb-6 text-gray-700">
                We use third-party services that may set their own cookies. These include:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700">
                <li><strong>Supabase:</strong> For authentication and database services</li>
                <li><strong>Analytics Providers:</strong> To understand user behavior (if enabled)</li>
                <li><strong>Payment Processors:</strong> For secure payment processing</li>
              </ul>

              <h2 className="text-2xl font-bold mb-6 text-gray-900">4. Cookie Types and Duration</h2>

              <div className="overflow-x-auto mb-6">
                <table className="min-w-full bg-gray-50 rounded-lg">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Cookie Type</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Purpose</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-700">Session Cookies</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Maintain login state</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Until browser closes</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-700">Persistent Cookies</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Remember preferences</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Up to 1 year</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-700">Analytics Cookies</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Track usage patterns</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Up to 2 years</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h2 className="text-2xl font-bold mb-6 text-gray-900">5. Managing Your Cookie Preferences</h2>

              <h3 className="text-xl font-semibold mb-4 text-gray-800">Browser Settings</h3>
              <p className="mb-4 text-gray-700">You can control cookies through your browser settings:</p>
              <ul className="list-disc pl-6 mb-6 text-gray-700">
                <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data</li>
                <li><strong>Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data</li>
                <li><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</li>
                <li><strong>Edge:</strong> Settings → Cookies and site permissions</li>
              </ul>

              <h3 className="text-xl font-semibold mb-4 text-gray-800">Opt-out Options</h3>
              <p className="mb-6 text-gray-700">
                You can opt out of non-essential cookies at any time. Please note that disabling certain cookies may affect the functionality of our service.
              </p>

              <h2 className="text-2xl font-bold mb-6 text-gray-900">6. Impact of Disabling Cookies</h2>
              <p className="mb-4 text-gray-700">If you disable cookies:</p>
              <ul className="list-disc pl-6 mb-6 text-gray-700">
                <li>You may need to log in again for each session</li>
                <li>Some features may not work properly</li>
                <li>Your preferences may not be saved</li>
                <li>Analytics data may not be collected</li>
              </ul>

              <h2 className="text-2xl font-bold mb-6 text-gray-900">7. Updates to This Policy</h2>
              <p className="mb-6 text-gray-700">
                We may update this Cookie Policy from time to time to reflect changes in our practices or for legal reasons. We will notify you of any material changes and update the "Last updated" date.
              </p>

              <h2 className="text-2xl font-bold mb-6 text-gray-900">8. Contact Us</h2>
              <p className="mb-6 text-gray-700">
                If you have questions about our use of cookies or this policy, please contact us:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <p className="text-gray-700">
                  <strong>Email:</strong> privacy@draw5.com<br />
                  <strong>Subject:</strong> Cookie Policy Inquiry
                </p>
              </div>

              <div className="mt-12 p-6 bg-blue-50 rounded-lg">
                <p className="text-blue-800 text-center">
                  <strong>Cookies help us provide you with the best possible experience.</strong> You can manage your cookie preferences at any time through your browser settings.
                </p>
              </div>
            </div>
          </div>
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

export default Cookies