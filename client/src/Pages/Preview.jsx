import React, { useEffect, useState } from 'react'
import Footer from '../components/Global/Footer'
import { useParams, Link } from 'react-router-dom'
import { resumeAPI } from '../services/api';
import ClassicTemplate from '../components/templates/ClassicTemplate';
import ModernTemplate from '../components/templates/ModernTemplate';
import MinimalTemplate from '../components/templates/MinimalTemplate';
import MinimalImageTemplate from '../components/templates/MinimalImageTemplate';
import { ArrowLeftIcon, DownloadIcon } from 'lucide-react'
import SEO from '../components/SEO/SEO'
import toast from 'react-hot-toast'

const Preview = () => {
  const { resumeId } = useParams();
  const [resumeData, setresumeData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadResumeData = async () => {
    try {
      const response = await resumeAPI.getPublicResume(resumeId);
      const parsedData = response.data;

      setresumeData({
        ...parsedData,
        template: parsedData.template || 'Classic',
        accentColor: parsedData.accent_color || '#4f46e5'
      });
    } catch (error) {
      console.error('Error loading resume:', error);
      setresumeData(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadResumeData()
  }, [resumeId])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading Preview...</div>;
  }

  if (!resumeData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Resume not found</h2>
        <p className="text-gray-500 mb-6">The resume you are looking for does not exist or has been removed.</p>
        <Link to="/" className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">
          Go to Homepage
        </Link>
      </div>
    );
  }

  const templates = {
    'Classic': ClassicTemplate,
    'Modern': ModernTemplate,
    'Minimal': MinimalTemplate,
    'Minimal Image': MinimalImageTemplate
  };

  const handleDownload = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Track download and send email if user is logged in
        await fetch(`${import.meta.env.VITE_API_URL}/api/resume/track-download`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ resumeId })
        });
        toast.success('Resume downloaded! Check your email (including spam folder) for details.', {
          duration: 5000,
        });
      } catch (error) {
        console.log('Error tracking download:', error);
      }
    }

    // Use browser's native print-to-PDF (more reliable than html2pdf.js)
    // Browser's print dialog allows saving as PDF with perfect CSS support
    window.print();
  };

  const TemplateComponent = templates[resumeData.template] || ClassicTemplate;

  // Generate dynamic SEO data
  const seoTitle = resumeData.personal_info?.full_name
    ? `${resumeData.personal_info.full_name}'s Resume - ${resumeData.personal_info.profession || 'Professional'}`
    : 'Professional Resume Preview';
  const seoDescription = resumeData.personal_info?.full_name
    ? `View ${resumeData.personal_info.full_name}'s professional resume. ${resumeData.personal_info.profession || 'Experienced professional'} with expertise in ${resumeData.skills?.slice(0, 3).join(', ') || 'various fields'}.`
    : 'View this professional resume created with ResumeAI';
  const seoSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": resumeData.personal_info?.full_name || "Professional",
    "jobTitle": resumeData.personal_info?.profession || "Professional",
    "description": resumeData.professional_summary || "Professional resume",
    "knowsAbout": resumeData.skills || [],
    "url": `${window.location.origin}/view/${resumeId}`
  };

  return (
    <div className='min-h-screen bg-gray-50 flex flex-col print:bg-white'>
      <SEO
        title={seoTitle}
        description={seoDescription}
        keywords={`resume, CV, ${resumeData.personal_info?.profession || 'professional'}, ${resumeData.skills?.join(', ') || 'skills'}`}
        canonicalUrl={`${window.location.origin}/view/${resumeId}`}
        ogType="profile"
        schema={seoSchema}
      />
      <style type="text/css" media="print">{`
        @page { size: A4; margin: 0; }
        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      `}</style>

      {/* Top Header */}
      <div className='bg-white p-4 shadow-sm border-b border-gray-200 flex items-center justify-between shrink-0 print:hidden'>
        <Link to="/" className='flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium transition-colors'>
          <ArrowLeftIcon className='w-4 h-4' />
          Create Your Own Resume
        </Link>
        <button onClick={handleDownload} className='flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-sm cursor-pointer'>
          <DownloadIcon className='w-4 h-4' />
          Save / Print
        </button>
      </div>

      {/* Resume Preview */}
      <div className='flex-grow py-10 flex justify-center print:p-0'>
        <div className='w-full max-w-[210mm] min-h-[297mm] bg-white shadow-2xl overflow-visible shrink-0 print:m-0 print:shadow-none print:w-[210mm] print:min-h-auto print:overflow-visible'>
          <TemplateComponent data={resumeData} accentColor={resumeData.accentColor || '#4f46e5'} />
        </div>
      </div>

      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  )
}

export default Preview
