import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../components/DashboardLayout'
import { useAuth } from '../App'

interface Service {
  id: string
  title: string
  description: string
  icon: string
  href: string
  cta: string
  disabled?: boolean
  color: string
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [weeklyStats, setWeeklyStats] = useState({
    activeJobs: 0,
    pendingQuotes: 0,
    completedJobs: 0,
    upcomingMaintenance: 0,
  })

  useEffect(() => {
    // Fetch dashboard stats
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      // TODO: Replace with actual API call
      setWeeklyStats({
        activeJobs: 5,
        pendingQuotes: 3,
        completedJobs: 12,
        upcomingMaintenance: 2,
      })
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  const services: Service[] = [
    {
      id: 'jobs',
      title: 'Job Management',
      description: 'Create, track, and manage maintenance jobs and work orders',
      icon: '📋',
      color: 'from-blue-600 to-blue-700',
      href: '/jobs',
      cta: 'Manage Jobs',
      disabled: false,
    },
    {
      id: 'quotes',
      title: 'Quotes & Estimates',
      description: 'Generate and manage quotes for customer projects',
      icon: '💰',
      color: 'from-green-600 to-green-700',
      href: '/quotes',
      cta: 'View Quotes',
      disabled: false,
    },
    {
      id: 'reports',
      title: 'Reports & Analytics',
      description: 'Generate reports and analyze maintenance trends',
      icon: '📈',
      color: 'from-purple-600 to-purple-700',
      href: '/reports',
      cta: 'View Reports',
      disabled: false,
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Manage alerts and notifications for jobs and tasks',
      icon: '🔔',
      color: 'from-orange-600 to-orange-700',
      href: '/notifications',
      cta: 'View Notifications',
      disabled: false,
    },
  ]

  return (
    <DashboardLayout title="Dashboard">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome, {user?.first_name} {user?.last_name}!
          </h2>
          <p className="text-gray-600">
            Manage your maintenance operations and track jobs efficiently
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <p className="text-gray-600 text-sm mb-2">Active Jobs</p>
            <p className="text-3xl font-bold text-gray-900">{weeklyStats.activeJobs}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <p className="text-gray-600 text-sm mb-2">Pending Quotes</p>
            <p className="text-3xl font-bold text-gray-900">{weeklyStats.pendingQuotes}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <p className="text-gray-600 text-sm mb-2">Completed Jobs</p>
            <p className="text-3xl font-bold text-gray-900">{weeklyStats.completedJobs}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <p className="text-gray-600 text-sm mb-2">Upcoming Maintenance</p>
            <p className="text-3xl font-bold text-gray-900">{weeklyStats.upcomingMaintenance}</p>
          </div>
        </div>

        {/* Services Section */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Services</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <Link
                key={service.id}
                to={service.disabled ? '#' : service.href}
                className={`group relative rounded-xl overflow-hidden transition-transform hover:scale-105 ${
                  service.disabled ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <div className={`bg-gradient-to-br ${service.color} p-6 h-48 flex flex-col justify-between`}>
                  <div>
                    <div className="text-5xl mb-3">{service.icon}</div>
                    <h4 className="text-white font-bold text-lg mb-2">{service.title}</h4>
                    <p className="text-white/90 text-sm">{service.description}</p>
                  </div>
                  <button
                    className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-4 rounded-lg transition"
                    onClick={(e) => {
                      if (service.disabled) {
                        e.preventDefault()
                        e.stopPropagation()
                      }
                    }}
                  >
                    {service.cta}
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
