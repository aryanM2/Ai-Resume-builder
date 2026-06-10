import React from 'react'
import SEO from '../components/SEO/SEO';
import Footer from '../components/Global/Footer';

const Privacy = () => {
    return (
        <>
            <SEO
                title="Privacy Policy - ResumeAI"
                description="Learn how ResumeAI collects, uses, and protects your personal information. Read our comprehensive privacy policy."
                keywords="privacy policy, data protection, personal information, GDPR, data security"
                canonicalUrl={`${window.location.origin}/privacy`}
            />
            <div className="min-h-screen bg-gray-50 py-16 px-4">
                <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 md:p-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
                    <p className="text-gray-600 mb-8">Last updated: June 2025</p>

                    <div className="space-y-8 text-gray-700">
                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
                            <p className="mb-4">At ResumeAI, we collect information you provide directly to us, including:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>Name and email address when you create an account</li>
                                <li>Resume data and personal information you input</li>
                                <li>Job descriptions and career information</li>
                                <li>Payment information (processed securely through third-party providers)</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
                            <p className="mb-4">We use your information to:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>Provide and improve our resume building services</li>
                                <li>Generate AI-powered resume enhancements</li>
                                <li>Process payments and manage subscriptions</li>
                                <li>Send you important updates and support communications</li>
                                <li>Ensure security and prevent fraud</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Data Security</h2>
                            <p>We implement industry-standard security measures to protect your personal information. This includes encryption, secure servers, and regular security audits. However, no method of transmission over the internet is 100% secure.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Third-Party Services</h2>
                            <p>We may use third-party services to help operate our business, including payment processors, email services, and analytics providers. These services have access to your personal information only to perform specific tasks on our behalf.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Your Rights</h2>
                            <p className="mb-4">You have the right to:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>Access your personal information</li>
                                <li>Correct inaccurate information</li>
                                <li>Delete your account and associated data</li>
                                <li>Opt-out of marketing communications</li>
                                <li>Export your data</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Cookies</h2>
                            <p>We use cookies and similar technologies to improve your experience, analyze usage, and assist in marketing efforts. You can control cookie settings through your browser preferences.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Children's Privacy</h2>
                            <p>Our services are not intended for children under 13. We do not knowingly collect personal information from children under 13.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Changes to This Policy</h2>
                            <p>We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Contact Us</h2>
                            <p>If you have questions about this privacy policy, please contact us through our <a href="/support" className="text-indigo-600 hover:text-indigo-700 underline">Support page</a>.</p>
                        </section>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Privacy;
