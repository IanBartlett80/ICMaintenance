import React, { useState, useEffect, ReactNode } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import { authAPI } from './services/api'

interface User {
  id: number
  email: string
  first_name: string
  last_name: string
  role: string
  tradeId?: number
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = React.useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem('trades_userData')
    if (userData) setUser(JSON.parse(userData))
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const response = await authAPI.login({ email, password })
    const userData = response.data.user
    if (userData.role !== 'trade') throw new Error('Unauthorized: Trade specialist access only')
    localStorage.setItem('trades_token', response.data.token)
    localStorage.setItem('trades_userData', JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('trades_userData')
    localStorage.removeItem('trades_token')
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>
}

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>
  return user ? <>{children}</> : <Navigate to="/login" />
}

const LoginPage = React.lazy(() => import('./pages/LoginPage'))
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'))
const JobsPage = React.lazy(() => import('./pages/JobsPage'))
const QuotesPage = React.lazy(() => import('./pages/QuotesPage'))
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'))

function App() {
  return (
    <Router>
      <AuthProvider>
        <React.Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/jobs" element={<ProtectedRoute><JobsPage /></ProtectedRoute>} />
            <Route path="/quotes" element={<ProtectedRoute><QuotesPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </React.Suspense>
      </AuthProvider>
    </Router>
  )
}

export default App
