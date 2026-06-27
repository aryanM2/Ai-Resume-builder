import React, { useEffect, useState } from 'react'
import Navbar from '../components/Global/Navbar'
import { PlusIcon, XIcon, EditIcon, TrashIcon, FileTextIcon, ClockIcon, SparklesIcon, SearchIcon, TargetIcon, LoaderIcon, ZapIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUserResumes, createResume, deleteResume, updateResume, analyzeAtsScore } from '../app/resumeSlice';
import { logoutUser, updateUserSubscription, fetchUserProfile } from '../app/authSlice';
import SEO from '../components/SEO/SEO';
import toast from 'react-hot-toast'
import { paymentAPI } from '../services/api';

function Dashboard() {
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
    const [showAtsModal, setShowAtsModal] = useState(false);
    const [editResumeId, setEditResumeId] = useState(null);
    const [editResumeTitle, setEditResumeTitle] = useState('');
    const [newResumeTitle, setNewResumeTitle] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedResumeForAts, setSelectedResumeForAts] = useState('');
    const [jobDescriptionForAts, setJobDescriptionForAts] = useState('');
    const [isPaying, setIsPaying] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { resumes, isLoading } = useSelector((state) => state.resume);

    const updateResumeAhead = async (e) => {
        e.preventDefault();
        const currentResume = resumes.find(r => r._id === editResumeId);
        if (!currentResume) {
            toast.error('Resume not found');
            return;
        }

        const updatedResumeData = {
            ...currentResume,
            title: editResumeTitle
        };

        const result = await dispatch(updateResume({
            resumeId: editResumeId,
            resumeData: JSON.stringify(updatedResumeData),
            accentColor: currentResume.accent_color || '#4f46e5',
            selectedTemplate: currentResume.template || 'Classic',
            userId: user._id
        }));
        setEditResumeId(null);
        setEditResumeTitle('');
        if (result.type === 'resume/update/fulfilled') {
            toast.success('Resume title updated successfully');
        } else {
            toast.error('Failed to update resume title');
        }
    }

    const createResumeAhead = async (e) => {
        e.preventDefault()
        if (!user || !user._id) {
            console.error("User is not authenticated");
            return;
        }
        const result = await dispatch(createResume({ title: newResumeTitle, userId: user._id }));
        setShowCreateModal(false);
        setNewResumeTitle('');
        if (result.type === 'resume/create/fulfilled') {
            navigate(`/app/builder/${result.payload._id}`);
        }
        else {
            console.log(error)
        }
    }

    const convertResumeToText = (resume) => {
    if (!resume) return "";

    return `
Name: ${resume.personal_info?.full_name || ""}
Role: ${resume.personal_info?.profession || ""}
Skills:
${resume.skills?.join(", ") || ""}
Experience:
${resume.experience
    ?.map(
        exp =>
            `${exp.position} | ${exp.company} | ${exp.start_date}-${exp.is_current ? "Present" : exp.end_date}`
    )
    .join("\n") || ""}
Projects:
${resume.project?.map(p => p.name).join(", ") || ""}
Education:
${resume.education
    ?.map(e => `${e.degree} ${e.field}`)
    .join(", ") || ""}
`;
};
    
    const handleDelete = async (resumeId) => {
        toast((t) => (
            <div className="flex items-center gap-3">
                <div className="flex-1">
                    <p className="font-medium">Delete this resume?</p>
                    <p className="text-sm text-gray-400">This action cannot be undone</p>
                </div>
                <button
                    onClick={() => {
                        dispatch(deleteResume(resumeId));
                        toast.dismiss(t.id);
                        toast.success('Resume deleted successfully');
                    }}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                    Delete
                </button>
                <button
                    onClick={() => toast.dismiss(t.id)}
                    className="px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                    Cancel
                </button>
            </div>
        ));
    }

    
    useEffect(() => {
        if (user) {
            dispatch(getUserResumes(user._id));
            // Fetch latest user profile from server to sync subscription status
            dispatch(fetchUserProfile());
        }
    }, [dispatch, user])

    const filteredResumes = resumes?.filter(resume =>
        resume.title.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    const { isAtsLoading, atsAnalysisResult, atsError } = useSelector((state) => state.resume);



    const handleAtsAnalysis = async () => {
        if (!selectedResumeForAts || !jobDescriptionForAts) {
            toast.error('Please select a resume and paste a job description.');
            return;
        }
        const resume = resumes.find(r => r._id === selectedResumeForAts);
        const resumeText = convertResumeToText(resume);
       console.log(resumeText)
        dispatch(analyzeAtsScore({ resumeText, jobDescription: jobDescriptionForAts }));
    };

    const handleAtsClick = () => {
        if (user?.isSubscribed) {
            setShowAtsModal(true);
        } else {
            setShowSubscriptionModal(true);
        }
    };

    const handlePayment = async () => {
        setIsPaying(true);
        try {
            // Verify Razorpay script is loaded
            if (!window.Razorpay) {
                toast.error('Razorpay payment gateway failed to load. Please refresh and try again.');
                setIsPaying(false);
                return;
            }

            const orderResponse = await paymentAPI.createOrder();
            const order = orderResponse.data;

            const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
            if (!razorpayKey) {
                toast.error('Payment configuration error. Please contact support.');
                console.error("VITE_RAZORPAY_KEY_ID is not configured");
                setIsPaying(false);
                return;
            }

            const options = {
                key: razorpayKey,
                amount: order.amount,
                currency: order.currency,
                name: "ResumeAI ATS Analyzer",
                description: "One-time fee for lifetime access",
                order_id: order.id,
                // Enable payment methods including UPI
                method: {
                    upi: true,
                    netbanking: true,
                    card: true,
                    wallet: true
                },
                // Set UPI as the first/default method
                method_order: ['upi', 'card', 'netbanking', 'wallet'],
                handler: async function (response) {
                    try {
                        const verificationResponse = await paymentAPI.verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        });
                        dispatch(updateUserSubscription(verificationResponse.data.user));
                        toast.success('Payment Successful! You now have lifetime access.');
                        setShowSubscriptionModal(false);
                        setShowAtsModal(true);
                    } catch (error) {
                        toast.error('Payment verification failed. Please contact support.');
                        console.error("Verification error:", error);
                    } finally {
                        setIsPaying(false);
                    }
                },
                modal: {
                    ondismiss: function () {
                        toast.info('Payment cancelled. You can try again anytime.');
                        setIsPaying(false);
                    }
                },
                prefill: { 
                    name: user.name, 
                    email: user.email 
                },
                theme: { 
                    color: '#4f46e5' 
                },
                retry: { enabled: true, max: 3 },
                notes: {
                    purpose: 'ResumeAI ATS Analyzer Lifetime Access'
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response) {
                toast.error(`Payment failed: ${response.error.description}`);
                console.error("Payment error:", response.error);
                setIsPaying(false);
            });
            rzp.open();
        } catch (error) {
            toast.error('Could not initiate payment. Please try again.');
            console.error("Payment initiation error:", error);
            setIsPaying(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50">
            <SEO
                title="Dashboard - ResumeAI"
                description="Manage your resumes, create new ones, and track your job applications with our AI-powered resume builder dashboard."
                keywords="resume dashboard, manage resumes, resume builder dashboard, career tools"
                canonicalUrl={`${window.location.origin}/app`}
            />
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Welcome Header */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-2">
                                Welcome back, <span className="text-indigo-600">{user?.name?.split(' ')[0] || 'User'}</span>! 👋
                            </h1>
                            <p className="text-gray-600">Manage your resumes and build your career with AI-powered tools</p>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-medium shadow-lg shadow-indigo-500/30 transition-all hover:scale-105">
                                <PlusIcon className="w-5 h-5" />
                                Create Resume
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                                <FileTextIcon className="w-6 h-6 text-indigo-600" />
                            </div>
                            <span className="text-3xl font-bold text-gray-900">{resumes?.length || 0}</span>
                        </div>
                        <p className="text-gray-600 font-medium">Total Resumes</p>
                        <p className="text-sm text-gray-400 mt-1">Created and managed by you</p>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                <SparklesIcon className="w-6 h-6 text-green-600" />
                            </div>
                            <span className="text-3xl font-bold text-gray-900">AI</span>
                        </div>
                        <p className="text-gray-600 font-medium">AI-Powered</p>
                        <p className="text-sm text-gray-400 mt-1">Smart resume enhancement</p>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                <ClockIcon className="w-6 h-6 text-purple-600" />
                            </div>
                            <span className="text-3xl font-bold text-gray-900">24/7</span>
                        </div>
                        <p className="text-gray-600 font-medium">Always Available</p>
                        <p className="text-sm text-gray-400 mt-1">Access your resumes anytime</p>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="mb-6">
                    <div className="relative">
                        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search your resumes..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
                        />
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <button onClick={() => setShowCreateModal(true)} className="group relative cursor-pointer overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-left hover:shadow-xl transition-all">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500"></div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm">
                                <PlusIcon className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Create New Resume</h3>
                            <p className="text-indigo-100 text-sm">Start from scratch with AI assistance</p>
                        </div>
                    </button>
                    <button onClick={handleAtsClick} className={`group relative overflow-hidden bg-gradient-to-br rounded-2xl p-6 text-left transition-all ${user?.isSubscribed ? 'from-teal-500 to-cyan-600 hover:shadow-xl' : 'from-gray-400 to-gray-500 opacity-75 cursor-pointer'}`}>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500"></div>
                        <div className="relative z-10">
                            {!user?.isSubscribed && (
                                <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-semibold">LOCKED</div>
                            )}
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm ${user?.isSubscribed ? 'bg-white/20' : 'bg-white/10'}`}>
                                <TargetIcon className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">ATS Score Checker</h3>
                            <p className="text-white/80 text-sm">
                                {user?.isSubscribed ? 'Analyze resume against a job description' : 'Unlock with premium access'}
                            </p>
                        </div>
                    </button>
                </div>

                {/* Resumes Section */}
                <div className="mb-4">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Resumes</h2>

                    {filteredResumes.length === 0 ? (
                        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
                            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <FileTextIcon className="w-10 h-10 text-indigo-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No resumes yet</h3>
                            <p className="text-gray-600 mb-6">Create your first resume to get started</p>
                            <button onClick={() => setShowCreateModal(true)} className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors">
                                <PlusIcon className="w-5 h-5" />
                                Create Your First Resume
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredResumes.map((resume, index) => (
                                <div key={index} onClick={() => navigate(`/app/builder/${resume._id}`)} className="group relative bg-white rounded-2xl border-2 border-gray-200 hover:border-indigo-500 hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden">
                                    <div className="absolute top-0 right-0 flex gap-2 opacity-0 group-hover:opacity-100 transition-all z-10 p-4">
                                        <button title="Edit" onClick={(e) => {
                                            e.stopPropagation();
                                            setEditResumeId(resume._id);
                                            setEditResumeTitle(resume.title);
                                        }} className="p-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-600 rounded-xl shadow-sm transition-all hover:shadow-md">
                                            <EditIcon className="w-4 h-4" />
                                        </button>
                                        <button title="Delete" onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(resume._id);
                                        }} className="p-2 bg-white hover:bg-red-50 border border-gray-200 hover:border-red-200 text-red-600 rounded-xl shadow-sm transition-all hover:shadow-md">
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="p-6">
                                        <div className="w-full h-44 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 rounded-xl flex items-center justify-center mb-4 group-hover:from-indigo-200 group-hover:via-purple-200 group-hover:to-pink-200 transition-colors shadow-inner">
                                            <div className="w-16 h-20 bg-white border-2 border-indigo-300 rounded-lg shadow-md p-3 flex flex-col gap-2">
                                                <div className="w-full h-1.5 bg-indigo-400 rounded-full"></div>
                                                <div className="w-3/4 h-1.5 bg-purple-400 rounded-full"></div>
                                                <div className="w-full h-1.5 bg-indigo-400 rounded-full"></div>
                                                <div className="w-5/6 h-1.5 bg-purple-400 rounded-full"></div>
                                                <div className="w-full h-1.5 bg-indigo-400 rounded-full"></div>
                                            </div>
                                        </div>
                                        <h3 className="font-semibold text-gray-900 text-lg mb-2 group-hover:text-indigo-600 transition-colors truncate">{resume.title}</h3>
                                        <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                                            <ClockIcon className="w-4 h-4" />
                                            <span>Updated {new Date(resume.updatedAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <div>
                {showCreateModal && (
                    <form onSubmit={createResumeAhead} className='fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
                        <div className='bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative'>
                            <div className='flex justify-between items-center mb-2'>
                                <h2 className='text-xl font-bold text-gray-800'>Create New Resume</h2>
                                <XIcon className='text-gray-400 hover:text-gray-600 cursor-pointer transition-colors' onClick={() => setShowCreateModal(false)} />
                            </div>
                            <p className='text-sm text-gray-500 mb-5'>Give your new resume a title to get started.</p>
                            <input autoFocus required type="text" value={newResumeTitle} onChange={(e) => setNewResumeTitle(e.target.value)} placeholder='e.g., Software Engineer Resume' className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent mb-6 text-gray-700 placeholder-gray-400' />
                            <div className='flex justify-end gap-3'>
                                <button type="button" onClick={() => setShowCreateModal(false)} className='px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium cursor-pointer'>Cancel</button>
                                <button type="submit" className='px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium shadow-sm cursor-pointer'>Create</button>
                            </div>
                        </div>
                    </form>
                )}

                {showSubscriptionModal && !user?.isSubscribed && (
                    <div className='fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
                        <div className='bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative text-center'>
                            <button onClick={() => setShowSubscriptionModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                                <XIcon className="w-6 h-6" />
                            </button>
                            <div className='w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4'>
                                <ZapIcon className="w-8 h-8 text-white" />
                            </div>
                            <h2 className='text-2xl font-bold text-gray-800 mb-2'>Unlock ATS Score Checker</h2>
                            <p className='text-gray-600 mb-6'>Get lifetime access to our powerful AI-powered ATS analyzer to optimize your resume for any job.</p>
                            
                            <div className='bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-4 mb-6'>
                                <div className='flex items-center justify-between'>
                                    <span className='text-gray-700 font-medium'>One-Time Payment</span>
                                    <span className='text-3xl font-bold text-teal-600'>₹69</span>
                                </div>
                                <p className='text-sm text-gray-500 mt-1'>Secure payment via Razorpay</p>
                            </div>

                            <button onClick={handlePayment} disabled={isPaying} className='w-full px-5 py-3 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white rounded-lg transition-all font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed'>
                                {isPaying ? 'Processing...' : 'Pay and Unlock'}
                            </button>
                        </div>
                    </div>
                )}


                {showAtsModal && (
                    <div className='fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
                        <div className='bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 relative'>
                            <div className='flex justify-between items-center mb-2'>
                                <h2 className='text-xl font-bold text-gray-800'>ATS Score Analyzer</h2>
                                <XIcon className='text-gray-400 hover:text-gray-600 cursor-pointer transition-colors' onClick={() => setShowAtsModal(false)} />
                            </div>
                            <p className='text-sm text-gray-500 mb-5'>Check how well your resume matches a job description.</p>

                            {!atsAnalysisResult && !isAtsLoading && (
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="resume-select" className="block text-sm font-medium text-gray-700 mb-1">Select Resume</label>
                                        <select id="resume-select" value={selectedResumeForAts} onChange={(e) => setSelectedResumeForAts(e.target.value)} className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500'>
                                            <option value="" disabled>-- Select a resume --</option>
                                            {resumes.map(r => <option key={r._id} value={r._id}>{r.title}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="job-description" className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
                                        <textarea id="job-description" value={jobDescriptionForAts} onChange={(e) => setJobDescriptionForAts(e.target.value)} rows="8" placeholder='Paste the job description here...' className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none'></textarea>
                                    </div>
                                </div>
                            )}

                            {isAtsLoading && (
                                <div className="flex flex-col items-center justify-center h-64">
                                    <LoaderIcon className="w-12 h-12 text-indigo-500 animate-spin" />
                                    <p className="mt-4 text-gray-600">Analyzing... this might take a moment.</p>
                                </div>
                            )}

                            {atsError && <p className="text-red-500 text-center">{atsError}</p>}

                            {atsAnalysisResult && (
                                <div className="space-y-4">
                                    <div className="text-center">
                                        <p className="text-lg font-medium text-gray-600">Match Score</p>
                                        <p className="text-6xl font-bold text-indigo-600">{atsAnalysisResult.matchScore}%</p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-800">Summary</h4>
                                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{atsAnalysisResult.matchSummary}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-800">Missing Keywords</h4>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {atsAnalysisResult.missingKeywords.map((kw, i) => <span key={i} className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{kw}</span>)}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-800">Improvement Suggestions</h4>
                                        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg whitespace-pre-wrap">{atsAnalysisResult.improvementSuggestions}</div>
                                    </div>
                                </div>
                            )}

                            <div className='flex justify-end gap-3 mt-6'>
                                <button type="button" onClick={() => setShowAtsModal(false)} className='px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium cursor-pointer'>Close</button>
                                {!atsAnalysisResult && <button onClick={handleAtsAnalysis} disabled={isAtsLoading} className='px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium shadow-sm cursor-pointer disabled:opacity-50'>{isAtsLoading ? 'Analyzing...' : 'Analyze'}</button>}
                            </div>

                        </div>
                    </div>
                )}

                {editResumeId && (
                    <form onSubmit={updateResumeAhead} className='fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
                        <div className='bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative'>
                            <div className='flex justify-between items-center mb-2'>
                                <h2 className='text-xl font-bold text-gray-800'>Edit Resume Title</h2>
                                <XIcon className='text-gray-400 hover:text-gray-600 cursor-pointer transition-colors' onClick={() => setEditResumeId(null)} />
                            </div>
                            <p className='text-sm text-gray-500 mb-5'>Update the title of your resume.</p>
                            <input autoFocus required type="text" value={editResumeTitle} onChange={(e) => setEditResumeTitle(e.target.value)} placeholder='e.g., Software Engineer Resume' className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent mb-6 text-gray-700 placeholder-gray-400' />
                            <div className='flex justify-end gap-3'>
                                <button type="button" onClick={() => setEditResumeId(null)} className='px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium cursor-pointer'>Cancel</button>
                                <button type="submit" className='px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium shadow-sm cursor-pointer'>Update</button>
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </div>

    )
}

export default Dashboard
