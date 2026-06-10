import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Footer from '../components/Global/Footer'
import SEO from '../components/SEO/SEO'

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [tokenValid, setTokenValid] = useState(true);
    const { token } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            setTokenValid(false);
            setError('Invalid or missing reset token');
        }
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setMessage('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setIsLoading(false);
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token, newPassword: password }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Password has been reset successfully. Redirecting to login...');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                setError(data.message || 'Failed to reset password. Please try again.');
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!tokenValid) {
        return (
            <>
                <SEO
                    title="Invalid Token - ResumeAI"
                    description="Invalid or expired password reset token"
                    canonicalUrl={`${window.location.origin}/reset-password`}
                />
                <div className="flex items-center justify-center min-h-screen bg-gray-50 w-full">
                    <div className="bg-white text-gray-500 max-w-[400px] w-full mx-4 md:p-8 p-6 py-10 text-left rounded-xl shadow-[0px_0px_10px_0px] shadow-black/10">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Invalid Reset Link</h2>
                            <p className="text-sm text-gray-600">This password reset link is invalid or has expired.</p>
                        </div>
                        <Link to="/forgot-password" className="block w-full text-center bg-indigo-600 hover:bg-indigo-700 transition py-3 rounded-lg text-white font-medium">
                            Request New Reset Link
                        </Link>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <SEO
                title="Reset Password - ResumeAI"
                description="Reset your ResumeAI password. Enter your new password to complete the password reset process."
                keywords="reset password, change password, new password"
                canonicalUrl={`${window.location.origin}/reset-password`}
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
                        <p className="text-sm text-gray-600">Enter your new password below</p>
                    </div>

                    {message && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-sm text-green-700">{message}</p>
                        </div>
                    )}

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
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
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
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
                            {isLoading ? 'Resetting...' : 'Reset Password'}
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

export default ResetPassword;
