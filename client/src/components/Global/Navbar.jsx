import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logoutUser } from '../../app/authSlice'
import { LogOutIcon, UserIcon, MenuIcon } from 'lucide-react'

const Navbar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  const handleLogout = () => {
    dispatch(logoutUser())
    navigate('/login')
  }

  return (
    <nav className="w-full bg-white/80 backdrop-blur-lg flex items-center justify-between px-6 py-4 shadow-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
          <span className="text-white font-bold text-lg">AI</span>
        </div>
        <div>
          <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            AI Resume Builder
          </div>
          <div className="text-xs text-gray-500">Smart Resume Creation</div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-full">
          <UserIcon className="w-4 h-4 text-gray-500" />
          <div className="text-sm font-medium text-gray-700">{user?.name?.split(' ')[0] || 'User'}</div>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-medium shadow-md shadow-indigo-500/30 transition-all hover:shadow-lg hover:scale-105">
          <LogOutIcon className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </nav>
  )
}

export default Navbar
