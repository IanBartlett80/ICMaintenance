import React from 'react'
import { Link } from 'react-router-dom'

export default function LandingPage() {
  const features = [
    {
      icon: '🔧',
      title: 'Simple Request Submission',
      description: 'Submit maintenance requests in seconds with our intuitive form. Upload photos, set priorities, and track everything in one place.',
    },
    {
      icon: '📱',
      title: 'Real-Time Tracking',
      description: 'Stay informed with live status updates. Know exactly where your maintenance request stands at every stage.',
    },
    {
      icon: '💰',
      title: 'Competitive Quotes',
      description: 'Get multiple quotes from verified trade specialists. Compare, approve, and pay - all within the platform.',
    },
    {
      icon: '📊',
      title: 'Comprehensive Reports',
      description: 'Access detailed analytics on maintenance spend, job history, and performance metrics. Export data when you need it.',
    },
    {
      icon: '🔔',
      title: 'Smart Notifications',
      description: 'Never miss an update. Receive instant notifications for quote submissions, job updates, and completions.',
    },
    {
      icon: '⚡',
      title: 'Fast Response Times',
      description: 'Priority-based workflow ensures critical issues get immediate attention. SLA-backed response times you can count on.',
    },
  ]

  const benefits = [
    {
      title: 'For Property Managers',
      description: 'Manage multiple properties effortlessly. Track maintenance across your entire portfolio from one central dashboard.',
      icon: '🏢',
    },
    {
      title: 'For Homeowners',
      description: 'Keep your home in perfect condition. Schedule preventive maintenance and handle emergencies with ease.',
      icon: '🏠',
    },
    {
      title: 'For Sporting Organizations',
      description: 'Maintain your facilities at peak condition. Ensure safety and compliance with streamlined maintenance workflows.',
      icon: '⚽',
    },
  ]

  const stats = [
    { value: '500+', label: 'Active Users' },
    { value: '10K+', label: 'Jobs Completed' },
    { value: '98%', label: 'Satisfaction Rate' },
    { value: '24/7', label: 'Support Available' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-neutral-900/80 backdrop-blur-lg border-b border-neutral-700 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/sign-in"
                className="text-white hover:text-blue-400 font-medium transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-4">
              <img src="/ICMaintenance_logo.png" alt="ICMaintenance" className="h-40" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              Building Maintenance
              <span className="text-blue-500"> Simplified</span>
            </h1>
            <p className="text-lg sm:text-xl text-neutral-300 mb-6 leading-relaxed">
              The all-in-one platform for managing maintenance operations. 
              From request to completion, we've got you covered.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold text-base transition transform hover:scale-105"
              >
                Start Free Trial
              </Link>
              <Link
                to="/sign-in"
                className="bg-neutral-700 hover:bg-neutral-600 text-white px-6 py-3 rounded-lg font-bold text-base transition transform hover:scale-105"
              >
                View Demo
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-blue-500 mb-2">{stat.value}</div>
                <div className="text-neutral-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-neutral-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-neutral-300 max-w-2xl mx-auto">
              Powerful features designed to streamline your maintenance operations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-neutral-800 border border-neutral-700 rounded-2xl p-8 hover:border-blue-500/50 transition transform hover:scale-105"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-neutral-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Built For Your Industry
            </h2>
            <p className="text-xl text-neutral-300 max-w-2xl mx-auto">
              Tailored solutions for different property types and organizations
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-neutral-800 to-neutral-900 border border-neutral-700 rounded-2xl p-8 text-center"
              >
                <div className="text-6xl mb-4">{benefit.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-4">{benefit.title}</h3>
                <p className="text-neutral-400">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-neutral-800/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-neutral-300">
              Get started in three simple steps
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                1
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Submit Your Request</h3>
                <p className="text-neutral-400 text-lg">
                  Create a maintenance request with details and photos. Select priority level and preferred timing.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                2
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Review Quotes</h3>
                <p className="text-neutral-400 text-lg">
                  Receive competitive quotes from verified trade specialists. Compare pricing and timelines side-by-side.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                3
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Track to Completion</h3>
                <p className="text-neutral-400 text-lg">
                  Monitor progress with real-time updates. Review completed work and provide feedback.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-12 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join hundreds of satisfied customers managing their maintenance operations efficiently
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-lg font-bold text-lg transition transform hover:scale-105"
              >
                Create Free Account
              </Link>
              <Link
                to="/sign-in"
                className="bg-blue-800 hover:bg-blue-900 text-white px-8 py-4 rounded-lg font-bold text-lg transition transform hover:scale-105"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-700 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <Link to="/" className="text-2xl font-bold text-blue-500 hover:text-blue-400 transition">
                ICMaintenance
              </Link>
              <p className="text-neutral-400 mt-4 max-w-md">
                The comprehensive SaaS platform for managing building maintenance operations. 
                Streamline your workflow from request to completion.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><Link to="#" className="text-neutral-400 hover:text-blue-400 transition">Features</Link></li>
                <li><Link to="#" className="text-neutral-400 hover:text-blue-400 transition">Pricing</Link></li>
                <li><Link to="#" className="text-neutral-400 hover:text-blue-400 transition">Security</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link to="#" className="text-neutral-400 hover:text-blue-400 transition">About</Link></li>
                <li><Link to="#" className="text-neutral-400 hover:text-blue-400 transition">Contact</Link></li>
                <li><Link to="#" className="text-neutral-400 hover:text-blue-400 transition">Support</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-neutral-700 mt-12 pt-8 text-center text-neutral-400">
            <p>&copy; {new Date().getFullYear()} ICMaintenance. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
