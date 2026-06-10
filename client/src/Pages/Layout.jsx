import React from 'react'
import { Outlet } from 'react-router-dom'
import Footer from '../components/Global/Footer'

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
       <div className="flex-grow">
           <Outlet />
       </div>
       <div className="print:hidden">
           <Footer />
       </div>
    </div>
  )
}

export default Layout
