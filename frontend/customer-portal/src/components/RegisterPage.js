import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';

function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    // Organization Info
    organizationName: '',
    organizationType: 'residential',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    phone: '',
    
    // Admin Account
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    
    agreeToTerms: false,
  });

  const organizationTypes = [
    { value: 'residential', label: 'Residential Property' },
    { value: 'property_management', label: 'Property Management Company' },
    { value: 'sporting', label: 'Sporting Organization' },
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validateStep = (currentStep) => {
    setError('');
    
    if (currentStep === 1) {
      if (!formData.organizationName) {
        setError('Organization name is required');
        return false;
      }
      if (!formData.organizationType) {
        setError('Organization type is required');
        return false;
      }
    } else if (currentStep === 2) {
      if (!formData.address || !formData.city || !formData.state || !formData.postalCode || !formData.phone) {
        setError('All address fields are required');
        return false;
      }
    } else if (currentStep === 3) {
      if (!formData.firstName || !formData.lastName || !formData.email) {
        setError('All account fields are required');
        return false;
      }
      if (!formData.password || formData.password.length < 8) {
        setError('Password must be at least 8 characters');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
      if (!formData.agreeToTerms) {
        setError('You must agree to the terms and conditions');
        return false;
      }
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(3)) return;

    setLoading(true);
    setError('');

    try {
      await authAPI.register({
        organization_name: formData.organizationName,
        organization_type: formData.organizationType,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        postal_code: formData.postalCode,
        phone: formData.phone,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        password: formData.password,
      });
      
      setSuccess(true);
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/login?registered=true');
      }, 2000);
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Registration failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-neutral-800 border border-neutral-700 rounded-2xl p-8">
          <div className="text-5xl mb-4 text-center">✅</div>
          <h1 className="text-3xl font-bold text-white mb-4 text-center">Registration Successful!</h1>
          
          <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 mb-6">
            <p className="text-primary font-semibold mb-2">📧 Email Verification</p>
            <p className="text-sm text-neutral-300">
              We've sent a verification link to your email address. Please check your inbox and verify your account before signing in.
            </p>
          </div>

          <div className="space-y-3 mb-6">
            <p className="text-neutral-400 text-sm"><strong>What's next?</strong></p>
            <ul className="text-neutral-400 text-sm space-y-2">
              <li className="flex gap-2">
                <span>1️⃣</span>
                <span>Check your email (spam folder too)</span>
              </li>
              <li className="flex gap-2">
                <span>2️⃣</span>
                <span>Click the verification link</span>
              </li>
              <li className="flex gap-2">
                <span>3️⃣</span>
                <span>Return here and sign in</span>
              </li>
            </ul>
          </div>

          <Link
            to="/login"
            className="block w-full px-4 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-semibold transition text-center"
          >
            Go to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-bold text-primary hover:text-primary-dark transition">
            IC Maintenance
          </Link>
          <h1 className="text-4xl font-bold text-white mt-4">Register Your Organization</h1>
          <p className="text-neutral-400 mt-2">Step {step} of 3</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 flex gap-2">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className={`flex-1 h-2 rounded-full ${i <= step ? 'bg-primary' : 'bg-neutral-700'}`}
            />
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-neutral-800 border border-neutral-700 rounded-2xl p-8">
          {error && (
            <div className="mb-6 p-4 bg-error/10 border border-error/30 rounded-lg text-error">
              {error}
            </div>
          )}

          {/* Step 1: Organization Information */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Organization Information</h2>
              <div>
                <label className="block text-white font-medium mb-2">Organization Name</label>
                <input
                  type="text"
                  name="organizationName"
                  value={formData.organizationName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:border-primary focus:outline-none"
                  placeholder="e.g., Sunset Apartments"
                />
              </div>
              <div>
                <label className="block text-white font-medium mb-2">Organization Type</label>
                <select
                  name="organizationType"
                  value={formData.organizationType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:border-primary focus:outline-none"
                >
                  {organizationTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Step 2: Address Information */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Location Details</h2>
              <div>
                <label className="block text-white font-medium mb-2">Street Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:border-primary focus:outline-none"
                  placeholder="e.g., 123 Main Street"
                />
              </div>
              <div>
                <label className="block text-white font-medium mb-2">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:border-primary focus:outline-none"
                  placeholder="e.g., Sydney"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-medium mb-2">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:border-primary focus:outline-none"
                    placeholder="e.g., NSW"
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">Postal Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:border-primary focus:outline-none"
                    placeholder="e.g., 2000"
                  />
                </div>
              </div>
              <div>
                <label className="block text-white font-medium mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:border-primary focus:outline-none"
                  placeholder="e.g., +61 2 9000 0000"
                />
              </div>
            </div>
          )}

          {/* Step 3: Admin Account */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Admin Account Setup</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-medium mb-2">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:border-primary focus:outline-none"
                    placeholder="e.g., John"
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:border-primary focus:outline-none"
                    placeholder="e.g., Smith"
                  />
                </div>
              </div>
              <div>
                <label className="block text-white font-medium mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:border-primary focus:outline-none"
                  placeholder="e.g., admin@example.com"
                />
                <p className="text-sm text-neutral-400 mt-2">You'll use this to sign in</p>
              </div>
              <div>
                <label className="block text-white font-medium mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:border-primary focus:outline-none"
                  placeholder="••••••••"
                />
                <p className="text-sm text-neutral-400 mt-2">At least 8 characters</p>
              </div>
              <div>
                <label className="block text-white font-medium mb-2">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:border-primary focus:outline-none"
                  placeholder="••••••••"
                />
              </div>
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  className="mt-1 w-4 h-4 bg-neutral-700 border border-neutral-600 rounded cursor-pointer"
                />
                <label className="text-neutral-300 text-sm">
                  I agree to the{' '}
                  <Link to="#" className="text-primary hover:text-primary-light">
                    Terms and Conditions
                  </Link>{' '}
                  and{' '}
                  <Link to="#" className="text-primary hover:text-primary-light">
                    Privacy Policy
                  </Link>
                </label>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-8">
            {step > 1 && (
              <button
                type="button"
                onClick={handlePreviousStep}
                className="flex-1 px-6 py-3 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg font-semibold transition"
              >
                Previous
              </button>
            )}
            {step < 3 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="flex-1 px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-semibold transition"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-primary hover:bg-primary-dark disabled:opacity-50 text-white rounded-lg font-semibold transition"
              >
                {loading ? 'Registering...' : 'Complete Registration'}
              </button>
            )}
          </div>
        </form>

        {/* Sign In Link */}
        <p className="text-center text-neutral-400 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:text-primary-light">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
