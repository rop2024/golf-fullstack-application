import React from 'react'
import { useNavigate } from 'react-router-dom'

const Legal = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gray-800">
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-gray-800/60 via-gray-800/20 to-transparent backdrop-blur-sm"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Legal Information
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Important legal notices and disclaimers for Draw5.
          </p>
        </div>
      </header>

      {/* Content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Table of Contents */}
          <div className="bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 border border-gray-700 mb-8">
            <h2 className="text-xl font-bold mb-4 text-white">Table of Contents</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <ul className="space-y-2 text-gray-300">
                <li><a href="#disclaimer" className="hover:text-white transition-colors">1. Legal Disclaimer</a></li>
                <li><a href="#regulations" className="hover:text-white transition-colors">2. Gambling and Lottery Regulations</a></li>
                <li><a href="#fair-play" className="hover:text-white transition-colors">3. Fair Play and Randomness</a></li>
                <li><a href="#prizes" className="hover:text-white transition-colors">4. Prize Distribution</a></li>
                <li><a href="#responsible" className="hover:text-white transition-colors">5. Responsible Gaming</a></li>
              </ul>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#intellectual" className="hover:text-white transition-colors">6. Intellectual Property</a></li>
                <li><a href="#disputes" className="hover:text-white transition-colors">7. Dispute Resolution</a></li>
                <li><a href="#liability" className="hover:text-white transition-colors">8. Limitation of Liability</a></li>
                <li><a href="#privacy" className="hover:text-white transition-colors">9. Data Protection and Privacy</a></li>
                <li><a href="#changes" className="hover:text-white transition-colors">10. Changes to Legal Information</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">11. Contact Information</a></li>
              </ul>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            <div className="bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 border border-gray-700">
              <p className="text-sm text-gray-400 mb-8">
                <strong>Last updated:</strong> March 26, 2024
              </p>

              <div id="disclaimer" className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-white border-b border-gray-700 pb-2">1. Legal Disclaimer</h2>
                <div className="bg-yellow-900/20 border-l-4 border-yellow-600 p-4 mb-6">
                  <div className="flex">
                    <div className="ml-3">
                      <p className="text-sm text-yellow-200">
                        <strong>Important Notice:</strong> Draw5 is a lottery platform. Participation involves risk. Please read all terms and conditions carefully.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div id="regulations" className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-white border-b border-gray-700 pb-2">2. Gambling and Lottery Regulations</h2>
                <p className="mb-6 text-gray-300 leading-relaxed">
                  Draw5 operates in compliance with applicable gambling and lottery regulations. Users are responsible for ensuring their participation is legal in their jurisdiction.
                </p>

                <h3 className="text-xl font-semibold mb-4 text-gray-200">Age Restrictions</h3>
                <p className="mb-6 text-gray-300 leading-relaxed">
                  You must be at least 18 years old (or the legal gambling age in your jurisdiction, whichever is higher) to participate in Draw5 lotteries. We verify age through our registration process and reserve the right to request additional verification.
                </p>

                <h3 className="text-xl font-semibold mb-4 text-gray-200">Jurisdictional Compliance</h3>
                <p className="mb-6 text-gray-300 leading-relaxed">
                  Draw5 is available in jurisdictions where lottery participation is permitted. It is your responsibility to ensure compliance with local laws. We do not accept entries from jurisdictions where lottery participation is prohibited.
                </p>
              </div>

              <div id="fair-play" className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-white border-b border-gray-700 pb-2">3. Fair Play and Randomness</h2>
                <p className="mb-6 text-gray-300 leading-relaxed">
                  All Draw5 draws use cryptographically secure random number generation to ensure fair and unbiased results. Our system is regularly audited and tested for randomness and fairness.
                </p>

                <h3 className="text-xl font-semibold mb-4 text-gray-200">Draw Integrity</h3>
                <ul className="list-disc pl-6 mb-6 text-gray-300 space-y-2">
                  <li>All draws are conducted automatically at predetermined times</li>
                  <li>Results are recorded and stored immutably</li>
                  <li>Draw outcomes cannot be manipulated or altered</li>
                  <li>Independent audits may be conducted periodically</li>
                </ul>
              </div>

              <div id="prizes" className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-white border-b border-gray-700 pb-2">4. Prize Distribution</h2>
                <p className="mb-6 text-gray-300 leading-relaxed">
                  Prizes are distributed automatically to winners within 24-48 hours of the draw. All prize distributions are final and non-negotiable.
                </p>

                <h3 className="text-xl font-semibold mb-4 text-gray-200">Prize Claims</h3>
                <ul className="list-disc pl-6 mb-6 text-gray-300 space-y-2">
                  <li>Winners must claim prizes within 30 days of the draw</li>
                  <li>Unclaimed prizes may be redistributed or donated to charity</li>
                  <li>Prize values are guaranteed at the time of the draw</li>
                  <li>Tax implications are the responsibility of the winner</li>
                </ul>
              </div>

              <div id="responsible" className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-white border-b border-gray-700 pb-2">5. Responsible Gaming</h2>
                <p className="mb-6 text-gray-300 leading-relaxed">
                  Draw5 is committed to promoting responsible gaming practices. We provide tools and resources to help users maintain control over their participation.
                </p>

                <h3 className="text-xl font-semibold mb-4 text-gray-200">Self-Exclusion</h3>
                <p className="mb-4 text-gray-300 leading-relaxed">Users can request temporary or permanent self-exclusion:</p>
                <ul className="list-disc pl-6 mb-6 text-gray-300 space-y-2">
                  <li>Contact our support team to initiate self-exclusion</li>
                  <li>Self-exclusion periods can range from 24 hours to permanent</li>
                  <li>During exclusion, account access is restricted</li>
                  <li>Self-exclusion requests are processed within 24 hours</li>
                </ul>

                <h3 className="text-xl font-semibold mb-4 text-gray-200">Support Resources</h3>
                <p className="mb-6 text-gray-300 leading-relaxed">
                  If you or someone you know has a gambling problem, please seek help from professional organizations:
                </p>
                <ul className="list-disc pl-6 mb-6 text-gray-300 space-y-2">
                  <li><strong>Gamblers Anonymous:</strong> <a href="https://www.gamblersanonymous.org" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">gamblersanonymous.org</a></li>
                  <li><strong>National Council on Problem Gambling:</strong> <a href="https://www.ncpgambling.org" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">ncpgambling.org</a></li>
                  <li><strong>BeGambleAware:</strong> <a href="https://www.begambleaware.org" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">begambleaware.org</a></li>
                </ul>
              </div>

              <div id="intellectual" className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-white border-b border-gray-700 pb-2">6. Intellectual Property</h2>
                <p className="mb-6 text-gray-300 leading-relaxed">
                  All content, trademarks, and intellectual property associated with Draw5 are protected by applicable laws. Unauthorized use is prohibited.
                </p>

                <h3 className="text-xl font-semibold mb-4 text-gray-200">Copyright Notice</h3>
                <p className="mb-6 text-gray-300 leading-relaxed">
                  © 2024 Draw5. All rights reserved. The Draw5 name, logo, and associated content are trademarks of Draw5. Reproduction or distribution without permission is prohibited.
                </p>
              </div>

              <div id="disputes" className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-white border-b border-gray-700 pb-2">7. Dispute Resolution</h2>
                <p className="mb-6 text-gray-300 leading-relaxed">
                  In the event of disputes, Draw5 follows a structured resolution process to ensure fair outcomes for all parties.
                </p>

                <h3 className="text-xl font-semibold mb-4 text-gray-200">Resolution Process</h3>
                <ol className="list-decimal pl-6 mb-6 text-gray-300 space-y-2">
                  <li>Contact our support team with details of the dispute</li>
                  <li>Initial review conducted within 48 hours</li>
                  <li>Mediation offered for unresolved issues</li>
                  <li>Final resolution provided within 14 days</li>
                </ol>
              </div>

              <div id="liability" className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-white border-b border-gray-700 pb-2">8. Limitation of Liability</h2>
                <p className="mb-6 text-gray-300 leading-relaxed">
                  Draw5's liability is limited to the extent permitted by applicable law. We are not liable for indirect, incidental, or consequential damages.
                </p>

                <h3 className="text-xl font-semibold mb-4 text-gray-200">Service Availability</h3>
                <p className="mb-6 text-gray-300 leading-relaxed">
                  While we strive for 99.9% uptime, we do not guarantee uninterrupted service. Scheduled maintenance and unforeseen technical issues may temporarily affect availability.
                </p>
              </div>

              <div id="privacy" className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-white border-b border-gray-700 pb-2">9. Data Protection and Privacy</h2>
                <p className="mb-6 text-gray-300 leading-relaxed">
                  Your privacy is important to us. Please refer to our Privacy Policy for detailed information about how we collect, use, and protect your personal data.
                </p>
              </div>

              <div id="changes" className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-white border-b border-gray-700 pb-2">10. Changes to Legal Information</h2>
                <p className="mb-6 text-gray-300 leading-relaxed">
                  This legal information may be updated periodically. Material changes will be communicated to users through our platform or email notifications.
                </p>
              </div>

              <div id="contact" className="mb-8">
                <h2 className="text-2xl font-bold mb-6 text-white border-b border-gray-700 pb-2">11. Contact Information</h2>
                <p className="mb-6 text-gray-300 leading-relaxed">
                  For legal inquiries or concerns, please contact our legal team:
                </p>
                <div className="bg-gray-700 p-6 rounded-lg mb-6 border border-gray-600">
                  <p className="text-gray-300">
                    <strong>Email:</strong> legal@draw5.com<br />
                    <strong>Subject:</strong> Legal Inquiry<br />
                    <strong>Response Time:</strong> Within 48 hours
                  </p>
                </div>
              </div>

              <div className="mt-12 p-6 bg-red-900/20 rounded-lg border border-red-600">
                <h3 className="text-lg font-semibold text-red-300 mb-2">Important Notice</h3>
                <p className="text-red-200">
                  This legal information is provided for general guidance only and does not constitute legal advice. For specific legal concerns, please consult with qualified legal professionals in your jurisdiction.
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
                <li><a href="#" onClick={() => navigate('/legal')} className="hover:text-white cursor-pointer">Legal</a></li>
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

export default Legal