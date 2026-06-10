import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Footer from '../components/Global/Footer'
import SEO from '../components/SEO/SEO'
import axios from 'axios'
import toast from 'react-hot-toast'

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match');
            setIsLoading(false);
            return;
        }

        if (newPassword.length < 6) {
            toast.error('Password must be at least 6 characters long');
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/auth/forgot-password`, {
                email,
                newPassword
            });

            toast.success('Password updated successfully! Redirecting to login...');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update password. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <SEO
                title="Forgot Password - ResumeAI"
                description="Reset your ResumeAI password. Enter your email and new password to update your account."
                keywords="forgot password, reset password, update password"
                canonicalUrl={`${window.location.origin}/forgot-password`}
            />
            <div className="flex items-center justify-center min-h-screen bg-gray-50 w-full">
                <div className="bg-white text-gray-500 max-w-[400px] w-full mx-4 md:p-8 p-6 py-10 text-left rounded-xl shadow-[0px_0px_10px_0px] shadow-black/10">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11.536 16.536c.576.576 1.536.576 2.112 0l2.728-2.728a6 6 0 01-7.743-5.743L11.536 8.464c-.576-.576-1.536-.576-2.112 0l-2.728 2.728a6 6 0 015.743 7.743L15 17zm0 0V9a2 2 0 012-2h3a2 2 0 012 2v10a2 2 0 01-2 2h-3a2 2 0 01-2-2V9z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Reset Password</h2>
                        <p className="text-sm text-gray-600">Enter your email and new password</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                            <div className="flex items-center border bg-indigo-50/50 border-gray-300 rounded-lg px-3">
                                <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                </svg>
                                <input
                                    className="w-full outline-none bg-transparent py-3 text-sm"
                                    type="email"
                                    placeholder="Enter your email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                            <div className="flex items-center border bg-indigo-50/50 border-gray-300 rounded-lg px-3">
                                <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                <input
                                    className="w-full outline-none bg-transparent py-3 text-sm"
                                    type="password"
                                    placeholder="Enter new password"
                                    required
                                    minLength={6}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                            <div className="flex items-center border bg-indigo-50/50 border-gray-300 rounded-lg px-3">
                                <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                <input
                                    className="w-full outline-none bg-transparent py-3 text-sm"
                                    type="password"
                                    placeholder="Confirm new password"
                                    required
                                    minLength={6}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 transition py-3 rounded-lg text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Updating...' : 'Update Password'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <Link to="/login" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                            ← Back to Login
                        </Link>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ForgotPassword;