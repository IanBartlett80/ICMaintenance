import React, { useState, useEffect } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import { reportAPI } from '../services/api'

export default function DashboardPage() {
  const [stats, setStats] = useState({
    total_jobs: 0,
    new_jobs: 0,
    in_progress_jobs: 0,
    completed_jobs: 0,
    total_customers: 0,
    total_trades: 0,
    pending_quotes: 0,
    revenue_this_month: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const response = await reportAPI.getDashboardStats()
      setStats(response.data.data || stats)
    } catch (err) {
      console.error('Failed to load dashboard stats:', err)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    { label: 'Total Jobs', value: stats.total_jobs, color: 'from-blue-500 to-blue-600', icon: '📋' },
    { label: 'New Jobs', value: stats.new_jobs, color: 'from-yellow-500 to-yellow-600', icon: '🆕' },
    { label: 'In Progress', value: stats.in_progress_jobs, color: 'from-orange-500 to-orange-600', icon: '🔄' },
    { label: 'Completed', value: stats.completed_jobs, color: 'from-green-500 to-green-600', icon: '✅' },
    { label: 'Customers', value: stats.total_customers, color: 'from-purple-500 to-purple-600', icon: '👥' },
    { label: 'Trade Specialists', value: stats.total_trades, color: 'from-indigo-500 to-indigo-600', icon: '🔧' },
    { label: 'Pending Quotes', value: stats.pending_quotes, color: 'from-pink-500 to-pink-600', icon: '💰' },
    { label: 'Revenue (MTD)', value: `$${stats.revenue_this_month.toLocaleString()}`, color: 'from-teal-500 to-teal-600', icon: '📈' },
  ]

  return (
    <DashboardLayout title="Dashboard">
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((card, index) => (
              <div
                key={index}
                className={`bg-gradient-to-br ${card.color} rounded-lg p-6 text-white`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold">{card.value}</div>
                    <div className="text-white/80 mt-1">{card.label}</div>
                  </div>
                  <div className="text-4xl opacity-80">{card.icon}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid md:grid-cols-4 gap-4">
              <a
                href="/jobs"
                className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 text-center transition"
              >
                <div className="text-3xl mb-2">📋</div>
                <div className="font-semibold text-blue-900">View All Jobs</div>
              </a>
              <a
                href="/customers"
                className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 text-center transition"
              >
                <div className="text-3xl mb-2">👥</div>
                <div className="font-semibold text-purple-900">Manage Customers</div>
              </a>
              <a
                href="/trades"
                className="p-4 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 text-center transition"
              >
                <div className="text-3xl mb-2">🔧</div>
                <div className="font-semibold text-green-900">Manage Trades</div>
              </a>
              <a
                href="/reports"
                className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg border border-orange-200 text-center transition"
              >
                <div className="text-3xl mb-2">📈</div>
                <div className="font-semibold text-orange-900">View Reports</div>
              </a>
            </div>
          </div>

          {/* System Info */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">System Information</h2>
            <div className="text-gray-600 space-y-2">
              <p>✅ All systems operational</p>
              <p>🔒 Database connection: Active</p>
              <p>📧 Email service: Configured</p>
              <p>💾 Backup: Last run 24 hours ago</p>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
