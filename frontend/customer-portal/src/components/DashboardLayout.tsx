import React, { useState, useEffect, ReactNode } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../App'

interface User {
  id: string
  username: string
  email: string
  fullName: string
  role: string
  clubId?: string
  clubName?: string
}

interface DashboardLayoutProps {
  children: ReactNode
  title?: string
  backTo?: { label: string; href: string }
}

export interface { children }: DashboardLayoutProps;
DashboardLayout.defaultProps = { children: null };

export default function DashboardLayout({ children, title, backTo }: DashboardLayoutProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/sign-in')
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
          {!sidebarCollapsed && <span className="text-xl font-bold text-gray-900">ICMaintenance</span>}
        </Link>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {/* Main Services */}
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
                to="/quotes"
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                  isActive('/quotes')
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="text-xl">💰</span>
                {!sidebarCollapsed && <span className="text-sm font-medium">Quotes</span>}
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
            <li>
              <Link
                to="/notifications"
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                  isActive('/notifications')
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="text-xl">🔔</span>
                {!sidebarCollapsed && <span className="text-sm font-medium">Notifications</span>}
              </Link>
            </li>
          </ul>
        </nav>

        {/* Collapse Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full flex items-center justify-center p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
          >
            {sidebarCollapsed ? '→' : '←'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 ${sidebarCollapsed ? 'ml-0' : 'ml-0'} transition-all duration-300`}>
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
          <div className="px-6 py-4 flex items-center justify-between">
            {/* Logo and Back Navigation */}
            <div className="flex flex-col gap-2">
              <Link to="/dashboard" className="flex items-center gap-2">
                <div className="text-2xl font-bold text-blue-600">ICMaintenance</div>
              </Link>
              {backTo && (
                <Link
                  to={backTo.href}
                  className="text-gray-600 hover:text-blue-600 transition flex items-center gap-2 whitespace-nowrap font-medium text-sm"
                >
                  <span>←</span>
                  <span>{backTo.label}</span>
                </Link>
              )}
            </div>

            {/* Page Title */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <h1 className="text-2xl font-bold text-gray-900">{title || 'Dashboard'}</h1>
            </div>

            {/* User Menu */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{user.fullName}</p>
                    <p className="text-xs text-gray-500">{user.role}</p>
                  </div>
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>
                </button>

                {showUserMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                      <div className="p-4 border-b border-gray-200">
                        <p className="font-medium text-gray-900">{user.fullName}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                      <ul className="py-2">
                        <li>
                          <Link
                            to="/profile"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setShowUserMenu(false)}
                          >
                            Profile Settings
                          </Link>
                        </li>
                        <li>
                          <button
                            onClick={() => {
                              setShowUserMenu(false)
                              handleLogout()
                            }}
                            className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            Logout
                          </button>
                        </li>
                      </ul>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
