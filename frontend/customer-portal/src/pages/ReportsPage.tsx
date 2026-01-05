import React, { useState, useEffect } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import { reportAPI } from '../services/api'

interface ReportData {
  total_jobs: number
  completed_jobs: number
  in_progress_jobs: number
  pending_jobs: number
  total_spent: number
  average_job_cost: number
  jobs_by_category: { category: string; count: number; total_cost: number }[]
  jobs_by_priority: { priority: string; count: number }[]
  monthly_spending: { month: string; amount: number }[]
}

export default function ReportsPage() {
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState({
    start_date: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0],
  })

  useEffect(() => {
    fetchReport()
  }, [dateRange])

  const fetchReport = async () => {
    try {
      setLoading(true)
      const response = await reportAPI.getCustomerReport(dateRange)
      setReportData(response.data.data)
    } catch (err: any) {
      console.error('Failed to load report:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  return (
    <DashboardLayout title="Reports" backTo={{ label: 'Back to Dashboard', href: '/dashboard' }}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>
          <p className="text-gray-600 mt-1">View your maintenance statistics and spending analysis</p>
        </div>

        {/* Date Range Filter */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={dateRange.start_date}
                onChange={(e) => setDateRange({ ...dateRange, start_date: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                value={dateRange.end_date}
                onChange={(e) => setDateRange({ ...dateRange, end_date: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={fetchReport}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
              >
                Update Report
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading report...</p>
          </div>
        ) : !reportData ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <p className="text-gray-500">No data available for the selected period.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                <div className="text-3xl font-bold">{reportData.total_jobs}</div>
                <div className="text-blue-100 mt-1">Total Jobs</div>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
                <div className="text-3xl font-bold">{reportData.completed_jobs}</div>
                <div className="text-green-100 mt-1">Completed</div>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white">
                <div className="text-3xl font-bold">{reportData.in_progress_jobs}</div>
                <div className="text-orange-100 mt-1">In Progress</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                <div className="text-3xl font-bold">{reportData.pending_jobs}</div>
                <div className="text-purple-100 mt-1">Pending</div>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Financial Summary</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Total Spent</div>
                  <div className="text-3xl font-bold text-gray-900">{formatCurrency(reportData.total_spent)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Average Job Cost</div>
                  <div className="text-3xl font-bold text-gray-900">{formatCurrency(reportData.average_job_cost)}</div>
                </div>
              </div>
            </div>

            {/* Jobs by Category */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Jobs by Category</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Jobs</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total Cost</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Avg Cost</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {reportData.jobs_by_category.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">{item.category}</td>
                        <td className="px-4 py-3 text-right text-gray-900">{item.count}</td>
                        <td className="px-4 py-3 text-right text-gray-900">{formatCurrency(item.total_cost)}</td>
                        <td className="px-4 py-3 text-right text-gray-600">{formatCurrency(item.total_cost / item.count)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Jobs by Priority */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Jobs by Priority</h3>
              <div className="grid md:grid-cols-4 gap-4">
                {reportData.jobs_by_priority.map((item, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-gray-900">{item.count}</div>
                    <div className="text-sm text-gray-600 mt-1">{item.priority}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Monthly Spending Chart */}
            {reportData.monthly_spending && reportData.monthly_spending.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Monthly Spending</h3>
                <div className="space-y-3">
                  {reportData.monthly_spending.map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-24 text-sm font-medium text-gray-700">{item.month}</div>
                      <div className="flex-1">
                        <div className="h-8 bg-gray-100 rounded-lg overflow-hidden">
                          <div
                            className="h-full bg-blue-600"
                            style={{
                              width: `${(item.amount / Math.max(...reportData.monthly_spending.map(m => m.amount))) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                      <div className="w-32 text-right font-medium text-gray-900">{formatCurrency(item.amount)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
