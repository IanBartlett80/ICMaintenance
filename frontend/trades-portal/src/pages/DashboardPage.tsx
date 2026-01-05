import React, { useState, useEffect } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import { jobAPI } from '../services/api'
import { useAuth } from '../App'

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState({ assigned: 0, pending_quotes: 0, completed: 0, earnings: 0 })
  const [recentJobs, setRecentJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await jobAPI.getJobs({ assigned_trade_id: user?.tradeId, limit: 5 })
      const jobs = response.data.data || []
      setRecentJobs(jobs)
      setStats({
        assigned: jobs.length,
        pending_quotes: jobs.filter((j: any) => j.status_name === 'Awaiting Quotes').length,
        completed: jobs.filter((j: any) => j.status_name === 'Completed').length,
        earnings: jobs.reduce((sum: number, j: any) => sum + (j.actual_cost || 0), 0)
      })
    } catch (err) {
      console.error('Failed to load dashboard:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout title="Dashboard">
      {loading ? (
        <div className="text-center py-12"><p className="text-gray-500">Loading...</p></div>
      ) : (
        <div className="space-y-6">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
              <div className="text-3xl font-bold">{stats.assigned}</div>
              <div className="text-blue-100">Assigned Jobs</div>
            </div>
            <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg p-6 text-white">
              <div className="text-3xl font-bold">{stats.pending_quotes}</div>
              <div className="text-yellow-100">Pending Quotes</div>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
              <div className="text-3xl font-bold">{stats.completed}</div>
              <div className="text-green-100">Completed</div>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
              <div className="text-3xl font-bold">${stats.earnings.toLocaleString()}</div>
              <div className="text-purple-100">Total Earnings</div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold mb-4">Recent Assigned Jobs</h2>
            {recentJobs.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No jobs assigned yet</p>
            ) : (
              <div className="space-y-3">
                {recentJobs.map((job) => (
                  <div key={job.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold">{job.job_number} - {job.title}</div>
                        <div className="text-sm text-gray-600">{job.category_name}</div>
                      </div>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded">{job.status_name}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
