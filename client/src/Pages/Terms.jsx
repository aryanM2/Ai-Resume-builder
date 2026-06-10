import React from 'react'
import SEO from '../components/SEO/SEO';
import Footer from '../components/Global/Footer';

const Terms = () => {
    return (
        <>
            <SEO
                title="Terms of Service - ResumeAI"
                description="Read our terms of service to understand the rules and guidelines for using ResumeAI's resume building platform."
                keywords="terms of service, terms and conditions, user agreement, legal terms"
                canonicalUrl={`${window.location.origin}/terms`}
            />
            <div className="min-h-screen bg-gray-50 py-16 px-4">
                <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 md:p-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-6">Terms of Service</h1>
                    <p className="text-gray-600 mb-8">Last updated: June 2025</p>
                    
                    <div className="space-y-8 text-gray-700">
                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                            <p>By accessing and using ResumeAI, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
                            <p>ResumeAI provides an AI-powered resume building platform that allows users to create, edit, and enhance professional resumes. Our services include resume templates, AI-powered content suggestions, and PDF generation tools.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Responsibilities</h2>
                            <p className="mb-4">As a user of ResumeAI, you agree to:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>Provide accurate and truthful information</li>
                                <li>Use the service for lawful purposes only</li>
                                <li>Not upload malicious or harmful content</li>
                                <li>Respect the intellectual property rights of others</li>
                                <li>Not attempt to circumvent security measures</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Account Security</h2>
                            <p>You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use of your account. ResumeAI is not liable for any loss or damage arising from your failure to protect your account information.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Intellectual Property</h2>
                            <p className="mb-4">All content, features, and functionality of ResumeAI are owned by ResumeAI and are protected by international copyright, trademark, and other intellectual property laws. You may not:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>Copy, modify, or distribute our content</li>
                                <li>Use our trademarks without permission</li>
                                <li>Reverse engineer our software</li>
                                <li>Create derivative works from our platform</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. User Content</h2>
                            <p>You retain ownership of the content you create using ResumeAI. By using our service, you grant us a license to store, process, and display your content solely for the purpose of providing our services. You represent that you have the right to use and share all content you upload to our platform.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. AI-Powered Features</h2>
                            <p>Our AI-powered features are provided "as is" and may not always be accurate. You are responsible for reviewing and verifying all AI-generated content before using it. ResumeAI is not liable for any decisions made based on AI suggestions.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Payment and Subscription</h2>
                            <p className="mb-4">For premium features, we offer subscription plans. By subscribing, you agree to:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>Pay all applicable fees and taxes</li>
                                <li>Provide accurate payment information</li>
                                <li>Cancel subscriptions before renewal to avoid charges</li>
                                <li>Understand that refunds are handled on a case-by-case basis</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Termination</h2>
                            <p>We reserve the right to suspend or terminate your account at any time for violation of these terms or for any other reason at our sole discretion. Upon termination, your right to use the service will immediately cease.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Limitation of Liability</h2>
                            <p>To the maximum extent permitted by law, ResumeAI shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our service.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Changes to Terms</h2>
                            <p>We may modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms. We will notify users of significant changes via email or through our platform.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Governing Law</h2>
                            <p>These terms shall be governed by and construed in accordance with the laws of the jurisdiction in which ResumeAI operates. Any disputes shall be resolved in the courts of that jurisdiction.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Contact Us</h2>
                            <p>If you have questions about these terms, please contact us through our <a href="/support" className="text-indigo-600 hover:text-indigo-700 underline">Support page</a>.</p>
                        </section>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Terms;
