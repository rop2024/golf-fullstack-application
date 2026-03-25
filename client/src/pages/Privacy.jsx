import React from 'react'
import { useNavigate } from 'react-router-dom'

const Privacy = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-blue-600/60 via-blue-600/20 to-transparent backdrop-blur-sm"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Privacy Policy
          </h1>
          <p className="text-xl text-blue-100 mb-8">
            Your privacy is important to us. Learn how we protect your data.
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

              <h2 className="text-2xl font-bold mb-6 text-gray-900">1. Introduction</h2>
              <p className="mb-6 text-gray-700">
                Draw5 ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our golf lottery application and services.
              </p>

              <h2 className="text-2xl font-bold mb-6 text-gray-900">2. Information We Collect</h2>

              <h3 className="text-xl font-semibold mb-4 text-gray-800">Personal Information</h3>
              <ul className="list-disc pl-6 mb-6 text-gray-700">
                <li>Name and email address</li>
                <li>Profile information you provide</li>
                <li>Payment information (processed securely by third-party providers)</li>
                <li>Communication preferences</li>
              </ul>

              <h3 className="text-xl font-semibold mb-4 text-gray-800">Usage Data</h3>
              <ul className="list-disc pl-6 mb-6 text-gray-700">
                <li>Golf scores and performance data</li>
                <li>Draw entries and participation history</li>
                <li>Login times and session information</li>
                <li>Device and browser information</li>
                <li>IP address and location data</li>
              </ul>

              <h2 className="text-2xl font-bold mb-6 text-gray-900">3. How We Use Your Information</h2>
              <p className="mb-4 text-gray-700">We use collected information for:</p>
              <ul className="list-disc pl-6 mb-6 text-gray-700">
                <li>Providing and maintaining our services</li>
                <li>Processing lottery draws and prize distribution</li>
                <li>Managing your account and subscriptions</li>
                <li>Communicating with you about your account and our services</li>
                <li>Improving our services and developing new features</li>
                <li>Ensuring security and preventing fraud</li>
                <li>Complying with legal obligations</li>
              </ul>

              <h2 className="text-2xl font-bold mb-6 text-gray-900">4. Information Sharing and Disclosure</h2>
              <p className="mb-4 text-gray-700">We do not sell, trade, or otherwise transfer your personal information to third parties except:</p>
              <ul className="list-disc pl-6 mb-6 text-gray-700">
                <li>With your explicit consent</li>
                <li>To trusted service providers who assist in operating our services</li>
                <li>When required by law or to protect our rights</li>
                <li>In connection with a business transfer or acquisition</li>
                <li>To protect against fraud or security threats</li>
              </ul>

              <h2 className="text-2xl font-bold mb-6 text-gray-900">5. Data Security</h2>
              <p className="mb-6 text-gray-700">
                We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes encryption of sensitive data, secure server infrastructure, and regular security assessments.
              </p>

              <h2 className="text-2xl font-bold mb-6 text-gray-900">6. Data Retention</h2>
              <p className="mb-6 text-gray-700">
                We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this policy. Account data is retained while your account is active and for a reasonable period thereafter for legal, regulatory, and business purposes.
              </p>

              <h2 className="text-2xl font-bold mb-6 text-gray-900">7. Your Rights and Choices</h2>
              <p className="mb-4 text-gray-700">You have the right to:</p>
              <ul className="list-disc pl-6 mb-6 text-gray-700">
                <li>Access and review your personal information</li>
                <li>Correct inaccurate or incomplete data</li>
                <li>Delete your account and associated data</li>
                <li>Object to or restrict certain data processing</li>
                <li>Data portability</li>
                <li>Withdraw consent where applicable</li>
              </ul>

              <h2 className="text-2xl font-bold mb-6 text-gray-900">8. Cookies and Tracking</h2>
              <p className="mb-6 text-gray-700">
                We use cookies and similar technologies to enhance your experience, analyze usage patterns, and provide personalized content. You can control cookie preferences through your browser settings. For more details, see our <a href="#" onClick={() => navigate('/cookies')} className="text-blue-600 hover:text-blue-700">Cookie Policy</a>.
              </p>

              <h2 className="text-2xl font-bold mb-6 text-gray-900">9. Third-Party Services</h2>
              <p className="mb-6 text-gray-700">
                Our service integrates with third-party providers including Supabase for backend services and payment processors. These providers have their own privacy policies, and we encourage you to review them. We only share necessary information required for service provision.
              </p>

              <h2 className="text-2xl font-bold mb-6 text-gray-900">10. International Data Transfers</h2>
              <p className="mb-6 text-gray-700">
                Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data during such transfers.
              </p>

              <h2 className="text-2xl font-bold mb-6 text-gray-900">11. Children's Privacy</h2>
              <p className="mb-6 text-gray-700">
                Our services are not intended for children under 13. We do not knowingly collect personal information from children under 13. If we become aware of such collection, we will delete the information promptly.
              </p>

              <h2 className="text-2xl font-bold mb-6 text-gray-900">12. Changes to This Policy</h2>
              <p className="mb-6 text-gray-700">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date.
              </p>

              <h2 className="text-2xl font-bold mb-6 text-gray-900">13. Contact Us</h2>
              <p className="mb-6 text-gray-700">
                If you have any questions about this Privacy Policy or our data practices, please contact us at:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <p className="text-gray-700">
                  <strong>Email:</strong> privacy@draw5.com<br />
                  <strong>Address:</strong> Draw5 Privacy Team<br />
                  123 Golf Course Drive, Fairway City, FC 12345
                </p>
              </div>

              <div className="mt-12 p-6 bg-blue-50 rounded-lg">
                <p className="text-blue-800 text-center">
                  <strong>Your privacy matters to us.</strong> We're committed to being transparent about our data practices and protecting your personal information.
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

export default Privacy