import React, { useState, ReactNode } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../App'

interface DashboardLayoutProps {
  children: ReactNode
  title?: string
}

export default function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/')

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarCollapsed ? 'w-16' : 'w-64'
        } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <Link
          to="/dashboard"
          className="flex items-center gap-3 px-6 py-4 border-b border-gray-200 hover:bg-gray-50 transition"
        >
          <div className="text-2xl font-bold text-blue-600">IC</div>
          {!sidebarCollapsed && (
            <div>
              <span className="text-xl font-bold text-gray-900">ICMaintenance</span>
              <div className="text-xs text-gray-500">Staff Portal</div>
            </div>
          )}
        </Link>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <ul className="space-y-2">
            <li>
              <Link
                to="/dashboard"
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                  isActive('/dashboard')
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="text-xl">📊</span>
                {!sidebarCollapsed && <span className="text-sm font-medium">Dashboard</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/jobs"
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                  isActive('/jobs')
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="text-xl">📋</span>
                {!sidebarCollapsed && <span className="text-sm font-medium">Jobs</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/customers"
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                  isActive('/customers')
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="text-xl">👥</span>
                {!sidebarCollapsed && <span className="text-sm font-medium">Customers</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/trades"
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                  isActive('/trades')
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="text-xl">🔧</span>
                {!sidebarCollapsed && <span className="text-sm font-medium">Trade Specialists</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/categories"
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                  isActive('/categories')
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="text-xl">📁</span>
                {!sidebarCollapsed && <span className="text-sm font-medium">Categories</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/reports"
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                  isActive('/reports')
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="text-xl">📈</span>
                {!sidebarCollapsed && <span className="text-sm font-medium">Reports</span>}
              </Link>
            </li>
          </ul>
        </nav>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 p-4">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition"
          >
            {sidebarCollapsed ? '→' : '← Collapse'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              {title && <h1 className="text-2xl font-bold text-gray-900">{title}</h1>}
            </div>
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
              >
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {user?.first_name} {user?.last_name}
                  </div>
                  <div className="text-xs text-gray-500">Staff Member</div>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                  {user?.first_name?.[0]}{user?.last_name?.[0]}
                </div>
              </button>
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
