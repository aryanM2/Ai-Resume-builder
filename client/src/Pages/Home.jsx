import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Banner from '../components/home/Banner'
import HeroSection from '../components/home/HeroSection'
import Footer from '../components/Global/Footer'
import SEO from '../components/SEO/SEO'

const Home = () => {
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    if (user) {
      navigate('/app', { replace: true })
    }
  }, [user, navigate])  
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "ResumeAI",
    "description": "AI-powered resume builder that helps create professional resumes in minutes",
    "url": "https://resumeai.com",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "description": "Free resume builder with AI enhancement features"
    },
    "featureList": [
      "AI-powered resume enhancement",
      "Professional resume templates",
      "PDF resume upload and parsing",
      "Job description enhancement",
      "Multiple resume templates"
    ]
  };

  return (
    <div>
      <SEO
        title="ResumeAI - Free AI-Powered Resume Builder | Create Professional Resumes"
        description="Create professional resumes in minutes with our AI-powered resume builder. Enhance your summary, job descriptions, and upload existing resumes with AI assistance. Free to use with premium features available."
        keywords="resume builder, AI resume, professional resume, CV builder, resume templates, job application, career tools, free resume maker, online resume"
        canonicalUrl="https://resumeai.com"
        schema={schema}
      />
      <HeroSection />
      <Footer />
    </div>
  )
}

export default Home
