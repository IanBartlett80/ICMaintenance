import React, { useState, useEffect } from 'react'
import DashboardLayout from '../components/DashboardLayout'

export default function ReportsPage() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Fetch reports from API
    setReports([])
    setLoading(false)
  }, [])

  return (
    <DashboardLayout title="Reports" backTo={{ label: 'Back to Dashboard', href: '/dashboard' }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium transition">
            + Generate Report
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading reports...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Report Cards */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Job Summary</h3>
              <p className="text-gray-600 text-sm mb-4">Overview of completed and pending jobs</p>
              <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">View Report →</button>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Revenue Analytics</h3>
              <p className="text-gray-600 text-sm mb-4">Track revenue and financial performance</p>
              <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">View Report →</button>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Team Performance</h3>
              <p className="text-gray-600 text-sm mb-4">Team productivity and efficiency metrics</p>
              <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">View Report →</button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
