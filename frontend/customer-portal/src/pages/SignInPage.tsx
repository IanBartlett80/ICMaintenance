import React, { useState } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../App'

interface FormData {
  email: string
  password: string
}

export default function SignInPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { login } = useAuth()
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const registered = searchParams.get('registered') === 'true'
  const verified = searchParams.get('verified') === 'true'

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await login(formData.email, formData.password)
      navigate('/dashboard')
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Sign in failed. Please try again.'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-bold text-blue-500 hover:text-blue-400 transition">
            ICMaintenance
          </Link>
          <h1 className="text-4xl font-bold text-white mt-6">Sign In</h1>
          <p className="text-neutral-400 mt-2">Welcome back to ICMaintenance</p>
        </div>

        {/* Success Message */}
        {registered && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400">
            Registration successful! Please check your email to verify your account before signing in.
          </div>
        )}

        {verified && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400">
            ✅ Email verified! Your account is now active. You can sign in below.
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-neutral-800 border border-neutral-700 rounded-2xl p-8 space-y-6">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-white font-medium mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:border-blue-500 focus:outline-none transition"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-white font-medium mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:border-blue-500 focus:outline-none transition"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg font-semibold transition"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Links */}
        <div className="mt-6 space-y-3">
          <div className="text-center">
            <Link to="#" className="text-blue-400 hover:text-blue-300 text-sm">
              Forgot your password?
            </Link>
          </div>
          <div className="text-center text-neutral-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-400 hover:text-blue-300">
              Register your company
            </Link>
          </div>
        </div>

        {/* Support */}
        <div className="mt-8 p-4 bg-neutral-800/50 border border-neutral-700 rounded-lg text-center">
          <p className="text-neutral-400 text-sm">
            Need help?{' '}
            <Link to="mailto:support@icmaintenance.com" className="text-blue-400 hover:text-blue-300">
              Contact support
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
