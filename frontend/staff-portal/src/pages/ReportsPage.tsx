import React, { useState, useEffect } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import { reportAPI } from '../services/api'

export default function ReportsPage() {
  const [reportData, setReportData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState({
    start_date: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    fetchReport()
  }, [])

  const fetchReport = async () => {
    try {
      const response = await reportAPI.getJobStatistics(dateRange)
      setReportData(response.data.data)
    } catch (err) {
      console.error('Failed to load report:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout title="Reports & Analytics">
      <div className="mb-6 bg-white rounded-lg border p-4 flex gap-4 items-end">
        <div>
          <label className="block text-sm font-medium mb-1">Start Date</label>
          <input type="date" value={dateRange.start_date} onChange={(e) => setDateRange({...dateRange, start_date: e.target.value})} className="px-3 py-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">End Date</label>
          <input type="date" value={dateRange.end_date} onChange={(e) => setDateRange({...dateRange, end_date: e.target.value})} className="px-3 py-2 border rounded" />
        </div>
        <button onClick={fetchReport} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Update</button>
      </div>

      {loading ? (
        <div className="text-center py-12"><p className="text-gray-500">Loading...</p></div>
      ) : reportData ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
            <div className="text-3xl font-bold">{reportData.total_jobs || 0}</div>
            <div className="text-blue-100">Total Jobs</div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
            <div className="text-3xl font-bold">{reportData.completed_jobs || 0}</div>
            <div className="text-green-100">Completed</div>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white">
            <div className="text-3xl font-bold">{reportData.in_progress_jobs || 0}</div>
            <div className="text-orange-100">In Progress</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
            <div className="text-3xl font-bold">${reportData.total_revenue?.toLocaleString() || 0}</div>
            <div className="text-purple-100">Total Revenue</div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg border p-8 text-center text-gray-500">No data available</div>
      )}
    </DashboardLayout>
  )
}
