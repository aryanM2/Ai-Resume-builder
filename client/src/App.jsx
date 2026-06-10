
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './Pages/Home'
import Dashboard from './Pages/Dashboard'
import ResumeBuilder from './Pages/ResumeBuilder'
import Preview from './Pages/Preview'
import Layout from './Pages/Layout'
import Login from './Pages/login'
import Register from './Pages/Register'
import ForgotPassword from './Pages/ForgotPassword'
import AuthCallback from './Pages/AuthCallback'
import ProtectedRoute from './components/Global/ProtectedRoute'


const App = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='app' element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path='builder/:resumeId' element={<ResumeBuilder />} />
        </Route>
        <Route path='view/:resumeId' element={<Preview />} />
        <Route path='login' element={<Login />} />
        <Route path='register' element={<Register />} />
        <Route path='forgot-password' element={<ForgotPassword />} />
        <Route path='auth/callback' element={<AuthCallback />} />

      </Routes>
    </>
  )
}

export default App
