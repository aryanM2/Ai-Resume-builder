import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeftIcon, PlusIcon, TrashIcon, DownloadIcon, GripVerticalIcon, Share2Icon, SparklesIcon, SaveIcon } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { updateResume, enhanceSummary, enhanceJD, enhanceProject, getUserResumes } from '../app/resumeSlice'
import ClassicTemplate from '../components/templates/ClassicTemplate'
import ModernTemplate from '../components/templates/ModernTemplate'
import MinimalTemplate from '../components/templates/MinimalTemplate'
import MinimalImageTemplate from '../components/templates/MinimalImageTemplate'
import SEO from '../components/SEO/SEO'
import toast from 'react-hot-toast'

const ResumeBuilder = () => {
  const { resumeId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { resumes, isLoading, enhancedSummary, enhancedJD, enhancedProject } = useSelector((state) => state.resume);

  // State to hold all the resume fields
  const [resumeData, setResumeData] = useState({
    personal_info: {
      full_name: '',
      profession: '',
      location: '',
      phone: '',
      email: '',
      linkedin: '',
      website: ''
    },
    professional_summary: '',
    experience: [],
    project: [],
    education: [],
    skills: []
  });

  // Fetch matching resume from Redux
  useEffect(() => {
    if (resumeId && resumes.length > 0) {
      const foundResume = resumes.find(item => item._id === resumeId);
      if (foundResume) {
        setResumeData(foundResume);
        setSelectedTemplate(foundResume.template || 'Classic');
        setAccentColor(foundResume.accent_color || '#4f46e5');
      }
    }
  }, [resumeId, resumes]);

  // Fetch resumes from API on page reload if Redux is empty
  useEffect(() => {
    if (user._id && resumes.length === 0) {
      dispatch(getUserResumes(user._id));
    }
  }, [user._id, resumes.length, dispatch]);

  // Update resume data when AI enhancement completes
  useEffect(() => {
    if (enhancedSummary) {
      setResumeData(prev => ({ ...prev, professional_summary: enhancedSummary }));
    }
  }, [enhancedSummary]);

  const handleSave = async () => {
    const result = await dispatch(updateResume({
      resumeId,
      resumeData: JSON.stringify(resumeData),
      accentColor,
      selectedTemplate,
      userId: user._id
    }));
    if (result.type === 'resume/update/fulfilled') {
      toast.success('Resume saved successfully!');
    }
  };

  const handleEnhanceSummary = async () => {
    if (resumeData.professional_summary && resumeData.professional_summary.trim()) {
      const result = await dispatch(enhanceSummary(resumeData.professional_summary));
      if (result.type === 'resume/enhanceSummary/fulfilled') {
        if (enhancedSummary && enhancedSummary.trim()) {
          setResumeData(prev => ({ ...prev, professional_summary: enhancedSummary }));
        } else {
          toast.error('AI enhancement failed. Please try again.');
        }
      } else if (result.type === 'resume/enhanceSummary/rejected') {
        toast.error(result.payload || 'Failed to enhance summary');
      }
    } else {
      toast.error('Please enter a professional summary first');
    }
  };

  const handleEnhanceJD = async (description, index) => {
    if (description && description.trim()) {
      const result = await dispatch(enhanceJD(description));
      if (result.type === 'resume/enhanceJD/fulfilled') {
        if (enhancedJD && enhancedJD.trim()) {
          handleArrayChange('experience', index, 'description', enhancedJD);
        } else {
          toast.error('AI enhancement failed. Please try again.');
        }
      } else if (result.type === 'resume/enhanceJD/rejected') {
        toast.error(result.payload || 'Failed to enhance job description');
      }
    } else {
      toast.error('Please enter a job description first');
    }
  };

  const handleEnhanceProject = async (description, index) => {
    if (description && description.trim()) {
      const result = await dispatch(enhanceProject(description));
      if (result.type === 'resume/enhanceProject/fulfilled') {
        if (enhancedProject && enhancedProject.trim()) {
          handleArrayChange('project', index, 'description', enhancedProject);
        } else {
          toast.error('AI enhancement failed. Please try again.');
        }
      } else if (result.type === 'resume/enhanceProject/rejected') {
        toast.error(result.payload || 'Failed to enhance project description');
      }
    } else {
      toast.error('Please enter a project description first');
    }
  };


  const [selectedTemplate, setSelectedTemplate] = useState('Classic');
  const [accentColor, setAccentColor] = useState('#4f46e5');

  const templates = {
    'Classic': ClassicTemplate,
    'Modern': ModernTemplate,
    'Minimal': MinimalTemplate,
    'Minimal Image': MinimalImageTemplate
  };

  const TemplateComponent = templates[selectedTemplate] || ClassicTemplate;

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setResumeData(prev => ({
      ...prev,
      personal_info: { ...prev.personal_info, [name]: value }
    }));
  };

  const handleArrayChange = (section, index, field, value) => {
    setResumeData(prev => {
      const newArray = [...(prev[section] || [])];
      newArray[index] = { ...newArray[index], [field]: value };
      return { ...prev, [section]: newArray };
    });
  };

  const addArrayItem = (section, defaultItem) => {
    setResumeData(prev => ({
      ...prev,
      [section]: [...(prev[section] || []), defaultItem]
    }));
  };

  const removeArrayItem = (section, index) => {
    setResumeData(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };

  const handleSkillsChange = (e) => {
    const skillsArray = e.target.value.split(',').map(skill => skill.trim());
    setResumeData(prev => ({ ...prev, skills: skillsArray }));
  };

  // Drag and Drop Handlers
  const [draggedItem, setDraggedItem] = useState(null);

  const handleDragStart = (e, section, index) => {
    setDraggedItem({ section, index });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, section, dropIndex) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.section !== section) return;

    const dragIndex = draggedItem.index;
    if (dragIndex === dropIndex) {
      setDraggedItem(null);
      return;
    }

    setResumeData(prev => {
      const newArray = [...(prev[section] || [])];
      const dragged = newArray[dragIndex];
      newArray.splice(dragIndex, 1);
      newArray.splice(dropIndex, 0, dragged);
      return { ...prev, [section]: newArray };
    });
    setDraggedItem(null);
  };

  const handleDownload = async () => {
    try {
      // Track download and send email
      await fetch(`${import.meta.env.VITE_API_URL}/api/resume/track-download`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ resumeId })
      });
      toast.success('Resume downloaded! Check your email (including spam folder) for details.', {
        duration: 5000,
      });
    } catch (error) {
      console.log('Error tracking download:', error);
    }

    // Use browser's native print-to-PDF (more reliable than html2pdf.js)
    // Browser's print dialog allows saving as PDF with perfect CSS support
    window.print();
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/view/${resumeId}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: resumeData.personal_info?.full_name ? `${resumeData.personal_info.full_name}'s Resume` : 'My Resume',
          text: 'Check out my professional resume!',
          url: shareUrl,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast.success('Preview link copied to clipboard!');
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 flex flex-col print:bg-white'>
      <SEO
        title="Resume Builder - ResumeAI"
        description="Build your professional resume with our AI-powered resume builder. Choose from multiple templates, enhance with AI, and download as PDF."
        keywords="resume builder, create resume, resume templates, AI resume, professional resume, CV maker"
        canonicalUrl={`${window.location.origin}/app/builder/${resumeId}`}
      />
      <style type="text/css" media="print">{`
        @page { 
            size: A4;
            margin: 0; 
        }
        body { 
            -webkit-print-color-adjust: exact; 
            print-color-adjust: exact; 
        }
      `}</style>

      {/* Top Header */}
      <div className='bg-white p-4 shadow-sm border-b border-gray-200 flex items-center justify-between shrink-0 print:hidden'>
        <div className='flex items-center gap-4 md:gap-8'>
          <button onClick={() => navigate('/app')} className='flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium transition-colors'>
            <ArrowLeftIcon className='w-4 h-4' />
            <span className='hidden sm:inline'>Back</span>
          </button>
          <h1 className='text-lg md:text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'>ResumeAI</h1>
        </div>
        <div className='flex items-center gap-2 md:gap-4'>
          <p className='text-sm text-gray-500 hidden md:block'>Editing ID: <span className='font-mono bg-gray-100 px-2 py-1 rounded text-gray-700'>{resumeId}</span></p>
          <button onClick={handleSave} disabled={isLoading} className='flex items-center gap-1 md:gap-2 px-2 md:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-sm cursor-pointer disabled:opacity-50'>
            <SaveIcon className='w-4 h-4' /> <span className='hidden sm:inline'>Save</span>
          </button>
          <button onClick={handleShare} className='flex items-center gap-1 md:gap-2 px-2 md:px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium shadow-sm cursor-pointer'>
            <Share2Icon className='w-4 h-4' />
            <span className='hidden sm:inline'>Share</span>
          </button>
          <button onClick={handleDownload} className='flex items-center gap-1 md:gap-2 px-2 md:px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-sm cursor-pointer'>
            <DownloadIcon className='w-4 h-4' />
            <span className='hidden sm:inline'>Download</span>
          </button>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className='flex flex-col md:flex-row flex-grow w-full max-w-[1600px] mx-auto overflow-hidden print:overflow-visible print:block print:max-w-none print:w-full'>

        {/* Left Panel: Editing Interface */}
        <div className='w-full md:w-1/2 p-2 md:p-6 overflow-y-auto h-[calc(100vh-73px)] border-r border-gray-200 custom-scrollbar print:hidden'>
          <h2 className='text-lg md:text-2xl font-bold text-gray-800 mb-3 md:mb-6'>Edit Details</h2>

          <div className='space-y-3 md:space-y-6'>
            {/* Template & Color Selector */}
            <div className='bg-white p-3 md:p-5 rounded-xl shadow-sm border border-gray-200 flex flex-col gap-4'>
              <h3 className='text-base md:text-lg font-semibold text-gray-700'>Template Settings</h3>
              <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6'>
                <div className='flex-1 w-full'>
                  <label className='block text-sm text-gray-600 mb-1'>Select Template</label>
                  <select value={selectedTemplate} onChange={(e) => setSelectedTemplate(e.target.value)} className='w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500'>
                    {Object.keys(templates).map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className='block text-sm text-gray-600 mb-1'>Accent Color</label>
                  <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className='w-11 h-11 rounded cursor-pointer border-0 p-0' />
                </div>
              </div>
            </div>

            {/* Personal Info Section */}
            <div className='bg-white p-3 md:p-5 rounded-xl shadow-sm border border-gray-200'>
              <h3 className='text-base md:text-lg font-semibold text-gray-700 mb-4'>Personal Information</h3>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                <input type='text' name='full_name' value={resumeData.personal_info?.full_name || ''} onChange={handlePersonalInfoChange} placeholder='Full Name' className='px-2 py-1.5 text-sm md:px-3 md:py-2 md:text-base border border-gray-300 rounded-lg w-full col-span-1 sm:col-span-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none' />
                <input type='text' name='profession' value={resumeData.personal_info?.profession || ''} onChange={handlePersonalInfoChange} placeholder='Profession / Job Title' className='px-2 py-1.5 text-sm md:px-3 md:py-2 md:text-base border border-gray-300 rounded-lg w-full col-span-1 sm:col-span-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none' />
                <input type='email' name='email' value={resumeData.personal_info?.email || ''} onChange={handlePersonalInfoChange} placeholder='Email Address' className='px-2 py-1.5 text-sm md:px-3 md:py-2 md:text-base border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:outline-none' />
                <input type='text' name='phone' value={resumeData.personal_info?.phone || ''} onChange={handlePersonalInfoChange} placeholder='Phone Number' className='px-2 py-1.5 text-sm md:px-3 md:py-2 md:text-base border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:outline-none' />
                <input type='text' name='location' value={resumeData.personal_info?.location || ''} onChange={handlePersonalInfoChange} placeholder='Location / Address' className='px-2 py-1.5 text-sm md:px-3 md:py-2 md:text-base border border-gray-300 rounded-lg w-full col-span-1 sm:col-span-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none' />
                <input type='text' name='linkedin' value={resumeData.personal_info?.linkedin || ''} onChange={handlePersonalInfoChange} placeholder='LinkedIn URL' className='px-2 py-1.5 text-sm md:px-3 md:py-2 md:text-base border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:outline-none' />
                <input type='text' name='website' value={resumeData.personal_info?.website || ''} onChange={handlePersonalInfoChange} placeholder='Website URL' className='px-2 py-1.5 text-sm md:px-3 md:py-2 md:text-base border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:outline-none' />
              </div>
            </div>

            {/* Summary Section */}
            <div className='bg-white p-3 md:p-5 rounded-xl shadow-sm border border-gray-200'>
              <div className='flex justify-between items-center mb-4'>
                <h3 className='text-base md:text-lg font-semibold text-gray-700'>Professional Summary</h3>
                <button type="button" onClick={handleEnhanceSummary} disabled={isLoading} className='flex items-center gap-1.5 px-2 md:px-3 py-1.5 text-xs md:text-sm bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 rounded-lg transition-colors font-medium shadow-sm cursor-pointer disabled:opacity-50'>
                  <SparklesIcon className='w-3 h-3 md:w-4 md:h-4' /> <span className='hidden sm:inline'>{isLoading ? 'Enhancing...' : 'AI Enhance'}</span>
                </button>
              </div>
              <textarea value={resumeData.professional_summary || ''} onChange={(e) => setResumeData({ ...resumeData, professional_summary: e.target.value })} placeholder='Write a brief professional summary...' className='px-2 py-1.5 text-sm md:px-4 md:py-3 md:text-base border border-gray-300 rounded-lg w-full h-32 resize-none focus:ring-2 focus:ring-indigo-500 focus:outline-none'></textarea>
            </div>

            {/* Experience Section */}
            <div className='bg-white p-3 md:p-5 rounded-xl shadow-sm border border-gray-200'>
              <h3 className='text-base md:text-lg font-semibold text-gray-700 mb-4'>Experience</h3>
              {(resumeData.experience || []).map((exp, index) => (
                <div key={index}
                  draggable
                  onDragStart={(e) => handleDragStart(e, 'experience', index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, 'experience', index)}
                  className={`p-1 md:p-4 border border-gray-200 rounded-lg mb-4 relative bg-gray-50/50 group transition-all ${draggedItem?.section === 'experience' && draggedItem?.index === index ? 'opacity-40 scale-[0.98]' : ''}`}>
                  <div className="absolute top-1/2 -left-1 -translate-y-1/2 text-gray-400 cursor-move opacity-0 group-hover:opacity-100 transition-opacity">
                    <GripVerticalIcon className="w-5 h-5" />
                  </div>
                  <div className='flex justify-end mb-2'>
                    <button type="button" onClick={() => removeArrayItem('experience', index)} className='text-red-400 hover:text-red-600 transition-colors z-10'>
                      <TrashIcon className='w-4 h-4' />
                    </button>
                  </div>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3 pl-2 pr-2 md:pl-4 md:pr-6'>
                    <input type='text' placeholder='Position / Title' value={exp.position || ''} onChange={e => handleArrayChange('experience', index, 'position', e.target.value)} className='px-2 py-1.5 text-sm md:px-3 md:py-2 md:text-base border border-gray-300 rounded-md w-full focus:ring-1 focus:ring-indigo-500 focus:outline-none' />
                    <input type='text' placeholder='Company' value={exp.company || ''} onChange={e => handleArrayChange('experience', index, 'company', e.target.value)} className='px-2 py-1.5 text-sm md:px-3 md:py-2 md:text-base border border-gray-300 rounded-md w-full focus:ring-1 focus:ring-indigo-500 focus:outline-none' />
                    <input type='month' placeholder='Start Date' value={exp.start_date || ''} onChange={e => handleArrayChange('experience', index, 'start_date', e.target.value)} className='px-2 py-1.5 text-sm md:px-3 md:py-2 md:text-base border border-gray-300 rounded-md w-full focus:ring-1 focus:ring-indigo-500 focus:outline-none' />
                    <div className='flex items-center gap-2'>
                      <input type='month' placeholder='End Date' disabled={exp.is_current} value={exp.end_date || ''} onChange={e => handleArrayChange('experience', index, 'end_date', e.target.value)} className='px-2 py-1.5 text-sm md:px-3 md:py-2 md:text-base border border-gray-300 rounded-md w-full focus:ring-1 focus:ring-indigo-500 focus:outline-none disabled:opacity-50' />
                      <label className='flex items-center gap-1 text-xs md:text-sm text-gray-600 whitespace-nowrap cursor-pointer'>
                        <input type='checkbox' checked={exp.is_current || false} onChange={e => handleArrayChange('experience', index, 'is_current', e.target.checked)} className='rounded text-indigo-600 w-4 h-4' /> Present
                      </label>
                    </div>
                  </div>
                  <div className='pl-2 pr-2 md:pl-4 md:pr-6'>
                    <div className='flex justify-between items-center mb-2'>
                      <label className='text-xs md:text-sm text-gray-600'>Job Description</label>
                      <button type="button" onClick={() => handleEnhanceJD(exp.description, index)} disabled={isLoading} className='flex items-center gap-1 px-2 py-1 text-xs bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 rounded transition-colors font-medium shadow-sm cursor-pointer disabled:opacity-50'>
                        <SparklesIcon className='w-3 h-3' /> <span className='hidden sm:inline'>{isLoading ? 'Enhancing...' : 'AI Enhance'}</span>
                      </button>
                    </div>
                    <textarea placeholder='Description' value={exp.description || ''} onChange={e => handleArrayChange('experience', index, 'description', e.target.value)} className='px-2 py-1.5 text-sm md:px-3 md:py-2 md:text-base border border-gray-300 rounded-md w-full h-24 resize-none focus:ring-1 focus:ring-indigo-500 focus:outline-none'></textarea>
                  </div>
                </div>
              ))}
              <button onClick={() => addArrayItem('experience', { company: '', position: '', start_date: '', end_date: '', is_current: false, description: '' })} className='flex items-center justify-center gap-2 w-full py-2.5 border-2 border-dashed border-indigo-200 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors font-medium cursor-pointer'>
                <PlusIcon className='w-4 h-4' /> Add Experience
              </button>
            </div>

            {/* Education Section */}
            <div className='bg-white p-3 md:p-5 rounded-xl shadow-sm border border-gray-200'>
              <h3 className='text-base md:text-lg font-semibold text-gray-700 mb-4'>Education</h3>
              {(resumeData.education || []).map((edu, index) => (
                <div key={index}
                  draggable
                  onDragStart={(e) => handleDragStart(e, 'education', index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, 'education', index)}
                  className={`p-1 md:p-4 border border-gray-200 rounded-lg mb-4 relative bg-gray-50/50 group transition-all ${draggedItem?.section === 'education' && draggedItem?.index === index ? 'opacity-40 scale-[0.98]' : ''}`}>
                  <div className="absolute top-1/2 -left-1 -translate-y-1/2 text-gray-400 cursor-move opacity-0 group-hover:opacity-100 transition-opacity">
                    <GripVerticalIcon className="w-5 h-5" />
                  </div>
                  <div className='flex justify-end mb-2'>
                    <button type="button" onClick={() => removeArrayItem('education', index)} className='text-red-400 hover:text-red-600 transition-colors z-10'>
                      <TrashIcon className='w-4 h-4' />
                    </button>
                  </div>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 pl-2 pr-2 md:pl-4 md:pr-6'>
                    <input type='text' placeholder='Institution / University' value={edu.institution || ''} onChange={e => handleArrayChange('education', index, 'institution', e.target.value)} className='px-2 py-1.5 text-sm md:px-3 md:py-2 md:text-base border border-gray-300 rounded-md w-full col-span-1 sm:col-span-2 focus:ring-1 focus:ring-indigo-500 focus:outline-none' />
                    <input type='text' placeholder='Degree (e.g., BSc)' value={edu.degree || ''} onChange={e => handleArrayChange('education', index, 'degree', e.target.value)} className='px-2 py-1.5 text-sm md:px-3 md:py-2 md:text-base border border-gray-300 rounded-md w-full focus:ring-1 focus:ring-indigo-500 focus:outline-none' />
                    <input type='text' placeholder='Field of Study' value={edu.field || ''} onChange={e => handleArrayChange('education', index, 'field', e.target.value)} className='px-2 py-1.5 text-sm md:px-3 md:py-2 md:text-base border border-gray-300 rounded-md w-full focus:ring-1 focus:ring-indigo-500 focus:outline-none' />
                    <input type='month' placeholder='Graduation Date' value={edu.graduation_date || ''} onChange={e => handleArrayChange('education', index, 'graduation_date', e.target.value)} className='px-2 py-1.5 text-sm md:px-3 md:py-2 md:text-base border border-gray-300 rounded-md w-full focus:ring-1 focus:ring-indigo-500 focus:outline-none' />
                    <input type='text' placeholder='GPA (Optional)' value={edu.gpa || ''} onChange={e => handleArrayChange('education', index, 'gpa', e.target.value)} className='px-2 py-1.5 text-sm md:px-3 md:py-2 md:text-base border border-gray-300 rounded-md w-full focus:ring-1 focus:ring-indigo-500 focus:outline-none' />
                  </div>
                </div>
              ))}
              <button onClick={() => addArrayItem('education', { institution: '', degree: '', field: '', graduation_date: '', gpa: '' })} className='flex items-center justify-center gap-2 w-full py-2.5 border-2 border-dashed border-indigo-200 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors font-medium cursor-pointer'>
                <PlusIcon className='w-4 h-4' /> Add Education
              </button>
            </div>

            {/* Projects Section */}
            <div className='bg-white p-3 md:p-5 rounded-xl shadow-sm border border-gray-200'>
              <h3 className='text-base md:text-lg font-semibold text-gray-700 mb-4'>Projects</h3>
              {(resumeData.project || []).map((proj, index) => (
                <div key={index}
                  draggable
                  onDragStart={(e) => handleDragStart(e, 'project', index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, 'project', index)}
                  className={`p-1 md:p-4 border border-gray-200 rounded-lg mb-4 relative bg-gray-50/50 group transition-all ${draggedItem?.section === 'project' && draggedItem?.index === index ? 'opacity-40 scale-[0.98]' : ''}`}>
                  <div className="absolute top-1/2 -left-1 -translate-y-1/2 text-gray-400 cursor-move opacity-0 group-hover:opacity-100 transition-opacity">
                    <GripVerticalIcon className="w-5 h-5" />
                  </div>
                  <div className='flex justify-end mb-2'>
                    <button type="button" onClick={() => removeArrayItem('project', index)} className='text-red-400 hover:text-red-600 transition-colors z-10'>
                      <TrashIcon className='w-4 h-4' />
                    </button>
                  </div>
                  <div className='grid grid-cols-1 gap-3 pl-2 pr-2 md:pl-4 md:pr-6 mb-3'>
                    <input type='text' placeholder='Project Name' value={proj.name || ''} onChange={e => handleArrayChange('project', index, 'name', e.target.value)} className='px-2 py-1.5 text-sm md:px-3 md:py-2 md:text-base border border-gray-300 rounded-md w-full focus:ring-1 focus:ring-indigo-500 focus:outline-none' />
                  </div>
                  <div className='pl-2 pr-2 md:pl-4 md:pr-6'>
                    <div className='flex justify-between items-center mb-2'>
                      <label className='text-xs md:text-sm text-gray-600'>Project Description</label>
                      <button type="button" onClick={() => handleEnhanceProject(proj.description, index)} disabled={isLoading} className='flex items-center gap-1 px-2 py-1 text-xs bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 rounded transition-colors font-medium shadow-sm cursor-pointer disabled:opacity-50'>
                        <SparklesIcon className='w-3 h-3' /> <span className='hidden sm:inline'>{isLoading ? 'Enhancing...' : 'AI Enhance'}</span>
                      </button>
                    </div>
                    <textarea placeholder='Project Description' value={proj.description || ''} onChange={e => handleArrayChange('project', index, 'description', e.target.value)} className='px-2 py-1.5 text-sm md:px-3 md:py-2 md:text-base border border-gray-300 rounded-md w-full h-24 resize-none focus:ring-1 focus:ring-indigo-500 focus:outline-none'></textarea>
                  </div>
                </div>
              ))}
              <button onClick={() => addArrayItem('project', { name: '', description: '' })} className='flex items-center justify-center gap-2 w-full py-2.5 border-2 border-dashed border-indigo-200 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors font-medium cursor-pointer'>
                <PlusIcon className='w-4 h-4' /> Add Project
              </button>
            </div>

            {/* Skills Section */}
            <div className='bg-white p-3 md:p-5 rounded-xl shadow-sm border border-gray-200'>
              <h3 className='text-base md:text-lg font-semibold text-gray-700 mb-4'>Core Skills</h3>
              <p className='text-sm text-gray-500 mb-2'>Enter your skills separated by commas (e.g., React, JavaScript, Node.js)</p>
              <textarea value={(resumeData.skills || []).join(', ')} onChange={handleSkillsChange} placeholder='React, JavaScript, Node.js, etc.' className='px-2 py-1.5 text-sm md:px-4 md:py-3 md:text-base border border-gray-300 rounded-lg w-full h-24 resize-none focus:ring-2 focus:ring-indigo-500 focus:outline-none'></textarea>
            </div>
          </div>
        </div>

        {/* Right Panel: Live Preview */}
        <div className='w-full md:w-1/2 bg-gray-200 p-4 md:p-6 overflow-y-auto h-[calc(100vh-73px)] flex justify-center custom-scrollbar print:p-0 print:w-full print:h-auto print:bg-white print:overflow-visible'>
          <div className='w-full max-w-[210mm] min-h-[297mm] bg-white shadow-2xl overflow-visible shrink-0 print:m-0 print:shadow-none print:w-[210mm] print:min-h-auto print:overflow-visible'>
            <TemplateComponent data={resumeData} accentColor={accentColor} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResumeBuilder
