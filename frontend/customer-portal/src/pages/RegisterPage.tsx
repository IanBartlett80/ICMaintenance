import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../App'

interface FormData {
  step: number
  companyName: string
  contactName: string
  email: string
  phone: string
  industry: string
  adminUsername: string
  adminPassword: string
  confirmPassword: string
}

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    step: 1,
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    industry: '',
    adminUsername: '',
    adminPassword: '',
    confirmPassword: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleNextStep = () => {
    if (step < 4) {
      setStep(step + 1)
    }
  }

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (formData.adminPassword !== formData.confirmPassword) {
        throw new Error('Passwords do not match')
      }

      await register({
        email: formData.email,
        password: formData.adminPassword,
        role: 'customer',
        first_name: formData.contactName.split(' ')[0] || formData.contactName,
        last_name: formData.contactName.split(' ').slice(1).join(' ') || '',
        phone: formData.phone,
        organization_name: formData.companyName,
        organization_type: formData.industry,
      })

      setSuccess(true)
      setTimeout(() => {
        navigate('/sign-in?registered=true')
      }, 2000)
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Registration failed. Please try again.'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-neutral-800 border border-neutral-700 rounded-2xl p-8">
          <div className="text-5xl mb-4 text-center">✅</div>
          <h1 className="text-3xl font-bold text-white mb-4 text-center">Registration Successful!</h1>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
            <p className="text-blue-300 text-sm">
              Your account has been created successfully. You can now sign in.
            </p>
          </div>

          <p className="text-neutral-400 text-center mb-6">Redirecting to sign in in 2 seconds...</p>

          <div className="text-center">
            <Link to="/sign-in?registered=true" className="text-blue-400 hover:text-blue-300">
              Go to Sign In Now
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="flex justify-center mb-4 hover:opacity-80 transition">
            <img src="/ICMaintenance_logo.png" alt="ICMaintenance" className="h-48" />
          </Link>
          <h1 className="text-4xl font-bold text-white mt-4">Register Your Company</h1>
          <p className="text-neutral-400 mt-2">Step {step} of 4</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 flex gap-2">
          {[1, 2, 3, 4].map(i => (
            <div
              key={i}
              className={`flex-1 h-2 rounded-full ${i <= step ? 'bg-blue-600' : 'bg-neutral-700'}`}
            />
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-neutral-800 border border-neutral-700 rounded-2xl p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Step 1: Company Information */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Company Information</h2>

              <div>
                <label className="block text-white font-medium mb-2">Company Name *</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:border-blue-500 focus:outline-none"
                  placeholder="Your Company Name"
                  required
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Industry *</label>
                <select
                  name="industry"
                  value={formData.industry}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:border-blue-500 focus:outline-none [&>option]:bg-neutral-700 [&>option]:text-white"
                  required
                >
                  <option value="">Select an industry</option>
                  <option value="construction">Construction & Maintenance</option>
                  <option value="facilities">Facilities Management</option>
                  <option value="property">Property Management</option>
                  <option value="sporting">Sporting Organization</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 2: Contact Information */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Contact Information</h2>

              <div>
                <label className="block text-white font-medium mb-2">Contact Person Name *</label>
                <input
                  type="text"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:border-blue-500 focus:outline-none"
                  placeholder="Full Name"
                  required
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:border-blue-500 focus:outline-none"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:border-blue-500 focus:outline-none"
                  placeholder="(123) 456-7890"
                  required
                />
              </div>
            </div>
          )}

          {/* Step 3: Admin Account */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Admin Account Setup</h2>

              <div>
                <label className="block text-white font-medium mb-2">Username *</label>
                <input
                  type="text"
                  name="adminUsername"
                  value={formData.adminUsername}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:border-blue-500 focus:outline-none"
                  placeholder="your_username"
                />
                <p className="text-sm text-neutral-400 mt-2">You'll use this to sign in.</p>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Password *</label>
                <input
                  type="password"
                  name="adminPassword"
                  value={formData.adminPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:border-blue-500 focus:outline-none"
                  placeholder="••••••••"
                />
                <p className="text-sm text-neutral-400 mt-2">At least 8 characters, with uppercase, lowercase, and number.</p>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Confirm Password *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:border-blue-500 focus:outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>
          )}

          {/* Step 4: Review & Confirm */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Review & Confirm</h2>

              <div className="bg-neutral-700/50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-neutral-400">Company Name:</span>
                  <span className="text-white font-medium">{formData.companyName}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-neutral-400">Industry:</span>
                  <span className="text-white font-medium">{formData.industry}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-neutral-400">Contact Person:</span>
                  <span className="text-white font-medium">{formData.contactName}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-neutral-400">Email:</span>
                  <span className="text-white font-medium">{formData.email}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-neutral-400">Phone:</span>
                  <span className="text-white font-medium">{formData.phone}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-neutral-400">Admin Username:</span>
                  <span className="text-white font-medium">{formData.adminUsername}</span>
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <p className="text-blue-300 text-sm">
                  Click "Complete Registration" below to create your account. You'll be able to sign in immediately.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-8">
            {step > 1 && (
              <button
                type="button"
                onClick={handlePrevStep}
                className="flex-1 px-6 py-3 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg font-semibold transition"
              >
                Previous
              </button>
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg font-semibold transition"
              >
                {loading ? 'Registering...' : 'Complete Registration'}
              </button>
            )}
          </div>
        </form>

        {/* Sign In Link */}
        <p className="text-center text-neutral-400 mt-6">
          Already have an account?{' '}
          <Link to="/sign-in" className="text-blue-400 hover:text-blue-300">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}
