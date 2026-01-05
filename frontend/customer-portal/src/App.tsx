import React, { useState, useEffect, ReactNode } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import { authAPI } from './services/api'

// Types
interface User {
  id: string
  username: string
  email: string
  fullName: string
  role: string
  clubId?: string
  clubName?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  register: (data: any) => Promise<void>
}

// Auth Context
const AuthContext = React.createContext<AuthContextType | undefined>(undefined)

function useAuth() {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

// Auth Provider
function AuthProvider({ children }: { children: ReactNode | undefined }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem('userData')
    if (userData) {
      setUser(JSON.parse(userData))
    }
    setLoading(false)
  }, [])

  const login = async (username: string, password: string) => {
    try {
      const response = await authAPI.login({ username, password })
      const userData = response.data.user
      localStorage.setItem('userData', JSON.stringify(userData))
      setUser(userData)
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('userData')
    setUser(null)
  }

  const register = async (data: any) => {
    try {
      await authAPI.register(data)
    } catch (error) {
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}

// Protected Route Component
function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-900">Loading...</div>
      </div>
    )
  }

  return user ? <>{children}</> : <Navigate to="/sign-in" />
}

// Lazy load pages
const SignInPage = React.lazy(() => import('./pages/SignInPage'))
const RegisterPage = React.lazy(() => import('./pages/RegisterPage'))
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'))
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'))
const JobsPage = React.lazy(() => import('./pages/JobsPage'))
const QuotesPage = React.lazy(() => import('./pages/QuotesPage'))
const ReportsPage = React.lazy(() => import('./pages/ReportsPage'))
const NotificationsPage = React.lazy(() => import('./pages/NotificationsPage'))

function App() {
  return (
    <Router>
      <AuthProvider>
        <React.Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
          <Routes>
            <Route path="/sign-in" element={<SignInPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/jobs"
              element={
                <ProtectedRoute>
                  <JobsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/quotes"
              element={
                <ProtectedRoute>
                  <QuotesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <ReportsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <NotificationsPage />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </React.Suspense>
      </AuthProvider>
    </Router>
  )
}

export default App
export { useAuth, AuthContext }
export type { User, AuthContextType }
