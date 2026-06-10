import React from 'react'
import { Link } from 'react-router-dom'
import { FileText, Sparkles, Zap, ArrowRight, CheckCircle } from 'lucide-react'

const HeroSection = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false)
  return (
    <>
      <section className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50">
        {/* Navigation */}
        <nav className="flex flex-col items-center w-full">
          <div className="flex items-center justify-between p-4 md:px-16 lg:px-24 xl:px-32 md:py-4 w-full">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-pink-500 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent">ResumeAI</span>
            </Link>
            <div id="menu" className={`${mobileOpen ? 'max-md:w-full' : 'max-md:w-0'} max-md:fixed max-md:top-0 max-md:z-10 max-md:left-0 max-md:transition-all max-md:duration-300 max-md:overflow-hidden max-md:h-screen max-md:bg-white/25 max-md:backdrop-blur max-md:flex-col max-md:justify-center flex items-center gap-8 text-sm`}>
              <Link to="/" onClick={() => setMobileOpen(false)} className="text-gray-700 hover:text-indigo-600 font-medium">Home</Link>
              <a href="#features" onClick={() => setMobileOpen(false)} className="text-gray-700 hover:text-indigo-600 font-medium">Features</a>
              <a href="#pricing" onClick={() => setMobileOpen(false)} className="text-gray-700 hover:text-indigo-600 font-medium">Pricing</a>
              <button id="close-menu" onClick={() => setMobileOpen(false)} className="md:hidden bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-md aspect-square font-medium transition">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                </svg>
              </button>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <Link to={'/login'}>
                <button className="active:scale-95 hover:bg-indigo-50 transition px-4 py-2 border border-indigo-600 rounded-md text-indigo-600 font-medium cursor-pointer">
                  Sign in
                </button>
              </Link>
              <Link to={"/register"}>
                <button className="text-white px-4 py-2 bg-indigo-600 active:scale-95 hover:bg-indigo-700 transition rounded-md font-medium cursor-pointer">
                  Get Started Free
                </button>
              </Link>
            </div>
            <button id="open-menu" onClick={() => setMobileOpen(true)}
              className="md:hidden bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-md aspect-square font-medium transition">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"> <path d="M4 12h16" /> <path d="M4 18h16" /> <path d="M4 6h16" /> </svg>
            </button>
          </div>
          <div className="w-full border-b border-gray-200"></div>
        </nav>

        {/* Hero Content */}
        <div className="flex flex-col items-center justify-center px-4 py-16 md:py-24">
          {/* Badge */}
          <div className="flex items-center gap-2 bg-gradient-to-r from-indigo-100 to-pink-100 rounded-full p-1 pr-4 text-sm mb-8">
            <span className="bg-gradient-to-r from-indigo-600 to-pink-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
              NEW
            </span>
            <p className="flex items-center gap-2 text-gray-700">
              <span className='text-sm font-medium'>AI-powered resume builder</span>
              <ArrowRight className="w-4 h-4" />
            </p>
          </div>

          {/* Main Heading */}
          <h1 className="text-center text-gray-900 text-4xl md:text-5xl lg:text-6xl font-bold max-w-4xl leading-tight mb-6">
            Build Your Perfect Resume
            <br />
            <span className='bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent'>With AI Assistance</span>
          </h1>

          {/* Subheading */}
          <p className="text-center text-lg text-gray-600 max-w-2xl mb-10">
            Create professional resumes in minutes with our AI-powered builder.
            Enhance your summary, job descriptions, and even upload existing resumes to get started.
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center gap-4 mb-16">
            <Link to="/register">
              <button className="bg-gradient-to-r from-indigo-600 to-pink-500 hover:from-indigo-700 hover:to-pink-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center gap-2">
                Start Building Free
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </div>

          {/* Pricing Banner */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6 max-w-2xl w-full mb-12">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">AI Resume Upload</h3>
                  <p className="text-sm text-gray-600">Upload your PDF and let AI extract the data</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-amber-600">$2</div>
                <div className="text-xs text-gray-500">one-time payment</div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div id='features' className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full px-4 scroll-mt-20">
            <div onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer border border-gray-100 hover:border-indigo-300 hover:scale-105">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">AI Enhancement</h3>
              <p className="text-gray-600 text-sm">Enhance your professional summary and job descriptions with AI</p>
            </div>
            <div onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer border border-gray-100 hover:border-pink-300 hover:scale-105">
              <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Quick Upload</h3>
              <p className="text-gray-600 text-sm">Upload your existing PDF resume and let AI extract the data</p>
            </div>
            <div onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer border border-gray-100 hover:border-green-300 hover:scale-105">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Professional Templates</h3>
              <p className="text-gray-600 text-sm">Choose from multiple professional templates to stand out</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default HeroSection
