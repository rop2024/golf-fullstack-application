import React from 'react'
import { useNavigate } from 'react-router-dom'

const Terms = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gray-800">
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-gray-800/60 via-gray-800/20 to-transparent backdrop-blur-sm"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Terms of Service
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Please read these terms carefully before using Draw5.
          </p>
        </div>
      </header>

      {/* Content */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800 rounded-xl shadow-lg p-8 md:p-12 border border-gray-700">
            <div className="prose prose-lg max-w-none prose-invert">
              <p className="text-sm text-gray-400 mb-8">
                <strong>Last updated:</strong> March 26, 2024
              </p>

              <h2 className="text-2xl font-bold mb-6 text-gray-900">1. Agreement to Terms</h2>
              <p className="mb-6 text-gray-700">
                By accessing or using Draw5 ("the Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these terms, you may not access the Service.
              </p>

              <h2 className="text-2xl font-bold mb-6 text-gray-900">2. Description of Service</h2>
              <p className="mb-6 text-gray-700">
                Draw5 is a golf lottery platform that converts your golf scores into lottery entries. Users can track scores, participate in draws, and win prizes based on number matching. The service includes free and premium subscription tiers with different features and limits.
              </p>

              <h2 className="text-2xl font-bold mb-6 text-gray-900">3. User Accounts</h2>

              <h3 className="text-xl font-semibold mb-4 text-gray-800">Account Creation</h3>
              <p className="mb-4 text-gray-700">To use Draw5, you must:</p>
              <ul className="list-disc pl-6 mb-6 text-gray-700">
                <li>Be at least 18 years old</li>
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Accept responsibility for all activities under your account</li>
              </ul>

              <h3 className="text-xl font-semibold mb-4 text-gray-800">Account Termination</h3>
              <p className="mb-6 text-gray-700">
                We reserve the right to terminate or suspend your account at our discretion, with or without cause, and with or without notice.
              </p>

              <h2 className="text-2xl font-bold mb-6 text-gray-900">4. Subscription and Payment</h2>

              <h3 className="text-xl font-semibold mb-4 text-gray-800">Subscription Plans</h3>
              <p className="mb-4 text-gray-700">Draw5 offers three subscription tiers:</p>
              <ul className="list-disc pl-6 mb-6 text-gray-700">
                <li><strong>Free:</strong> 5 scores/month, 1 draw entry/month, 1x prize multiplier</li>
                <li><strong>Premium:</strong> 20 scores/month, 5 entries/month, 2x multiplier ($19.99/month)</li>
                <li><strong>Pro:</strong> 50 scores/month, 10 entries/month, 5x multiplier ($49.99/month)</li>
              </ul>

              <h3 className="text-xl font-semibold mb-4 text-gray-800">Billing and Payment</h3>
              <ul className="list-disc pl-6 mb-6 text-gray-700">
                <li>Subscriptions are billed monthly in advance</li>
                <li>Payment is processed securely through third-party providers</li>
                <li>Failed payments may result in service suspension</li>
                <li>Refunds are provided according to our refund policy</li>
              </ul>

              <h2 className="text-2xl font-bold mb-6 text-gray-900">5. Lottery System and Prizes</h2>

              <h3 className="text-xl font-semibold mb-4 text-gray-800">How It Works</h3>
              <ul className="list-disc pl-6 mb-6 text-gray-700">
                <li>Your golf scores (0-100) are converted to lottery numbers (1-50)</li>
                <li>Latest 5 scores generate your 5 lottery numbers</li>
                <li>Monthly draws determine winning numbers</li>
                <li>Prizes are awarded based on number matches (3, 4, or 5 matches)</li>
                <li>Subscription multipliers increase prize values</li>
              </ul>

              <h3 className="text-xl font-semibold mb-4 text-gray-800">Prize Distribution</h3>
              <ul className="list-disc pl-6 mb-6 text-gray-700">
                <li>3 matches: $50 base prize</li>
                <li>4 matches: $200 base prize</li>
                <li>5 matches: $1,000 base prize</li>
                <li>Prizes are multiplied by subscription tier (Premium 2x, Pro 5x)</li>
              </ul>

              <h2 className="text-2xl font-bold mb-6 text-gray-900">6. User Conduct and Responsibilities</h2>

              <h3 className="text-xl font-semibold mb-4 text-gray-800">Permitted Use</h3>
              <p className="mb-4 text-gray-700">You agree to:</p>
              <ul className="list-disc pl-6 mb-6 text-gray-700">
                <li>Use the service only for lawful purposes</li>
                <li>Provide accurate golf scores</li>
                <li>Respect other users and our staff</li>
                <li>Comply with all applicable laws and regulations</li>
              </ul>

              <h3 className="text-xl font-semibold mb-4 text-gray-800">Prohibited Activities</h3>
              <p className="mb-4 text-gray-700">You may not:</p>
              <ul className="list-disc pl-6 mb-6 text-gray-700">
                <li>Submit fraudulent or manipulated scores</li>
                <li>Attempt to manipulate the lottery system</li>
                <li>Use automated tools or bots</li>
                <li>Share account credentials</li>
                <li>Harass other users or staff</li>
                <li>Reverse engineer or tamper with the service</li>
              </ul>

              <h2 className="text-2xl font-bold mb-6 text-gray-900">7. Intellectual Property</h2>
              <p className="mb-6 text-gray-700">
                The Service and its original content, features, and functionality are owned by Draw5 and are protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.
              </p>

              <h2 className="text-2xl font-bold mb-6 text-gray-900">8. Disclaimers and Limitations</h2>

              <h3 className="text-xl font-semibold mb-4 text-gray-800">Service Availability</h3>
              <p className="mb-6 text-gray-700">
                The Service is provided "as is" and "as available." We do not guarantee uninterrupted or error-free operation. We reserve the right to modify or discontinue the service at any time.
              </p>

              <h3 className="text-xl font-semibold mb-4 text-gray-800">No Gambling</h3>
              <p className="mb-6 text-gray-700">
                Draw5 is a skill-based lottery system where participation requires golf performance. While prizes are awarded, this is not considered gambling under most jurisdictions as it requires skill (golf performance) rather than pure chance.
              </p>

              <h3 className="text-xl font-semibold mb-4 text-gray-800">Limitation of Liability</h3>
              <p className="mb-6 text-gray-700">
                Draw5 shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the service. Our total liability shall not exceed the amount paid by you for the service in the 12 months preceding the claim.
              </p>

              <h2 className="text-2xl font-bold mb-6 text-gray-900">9. Dispute Resolution</h2>
              <p className="mb-6 text-gray-700">
                Any disputes arising from these Terms or your use of the Service shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association. You agree to submit to the personal jurisdiction of the courts located in [Your Jurisdiction].
              </p>

              <h2 className="text-2xl font-bold mb-6 text-gray-900">10. Governing Law</h2>
              <p className="mb-6 text-gray-700">
                These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law provisions.
              </p>

              <h2 className="text-2xl font-bold mb-6 text-gray-900">11. Changes to Terms</h2>
              <p className="mb-6 text-gray-700">
                We reserve the right to modify these Terms at any time. We will notify users of material changes via email or through the Service. Continued use of the Service after changes constitutes acceptance of the new Terms.
              </p>

              <h2 className="text-2xl font-bold mb-6 text-gray-900">12. Contact Information</h2>
              <p className="mb-6 text-gray-700">
                If you have questions about these Terms, please contact us at:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <p className="text-gray-700">
                  <strong>Email:</strong> legal@draw5.com<br />
                  <strong>Address:</strong> Draw5 Legal Department<br />
                  123 Golf Course Drive, Fairway City, FC 12345
                </p>
              </div>

              <div className="mt-12 p-6 bg-blue-50 rounded-lg">
                <p className="text-blue-800 text-center">
                  <strong>By using Draw5, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.</strong>
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

export default Terms