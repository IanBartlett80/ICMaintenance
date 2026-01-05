import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../App'

interface LayoutProps {
  children: React.ReactNode
  title: string
}

export default function DashboardLayout({ children, title }: LayoutProps) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-8">
              <Link to="/dashboard" className="text-xl font-bold text-blue-600">
                ICMaintenance <span className="text-sm text-gray-500">Trades</span>
              </Link>
              <div className="flex gap-6">
                <Link to="/dashboard" className="text-gray-700 hover:text-gray-900">Dashboard</Link>
                <Link to="/jobs" className="text-gray-700 hover:text-gray-900">My Jobs</Link>
                <Link to="/quotes" className="text-gray-700 hover:text-gray-900">Quotes</Link>
                <Link to="/profile" className="text-gray-700 hover:text-gray-900">Profile</Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{user?.first_name} {user?.last_name}</span>
              <button onClick={handleLogout} className="text-sm text-gray-600 hover:text-gray-900">Logout</button>
            </div>
          </div>
        </div>
      </nav>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{title}</h1>
        {children}
      </div>
    </div>
  )
}
