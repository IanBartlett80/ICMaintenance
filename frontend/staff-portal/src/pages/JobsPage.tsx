import React, { useState, useEffect } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import { jobAPI, dataAPI } from '../services/api'

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([])
  const [trades, setTrades] = useState<any[]>([])
  const [statuses, setStatuses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedJob, setSelectedJob] = useState<any>(null)
  const [assignTrade, setAssignTrade] = useState('')
  const [updateStatus, setUpdateStatus] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [jobsRes, tradesRes, statusesRes] = await Promise.all([
        jobAPI.getJobs(),
        dataAPI.getTradeSpecialists(),
        dataAPI.getStatuses()
      ])
      setJobs(jobsRes.data.data || [])
      setTrades(tradesRes.data.data || [])
      setStatuses(statusesRes.data.data || [])
    } catch (err) {
      console.error('Failed to load data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAssignTrade = async () => {
    if (!selectedJob || !assignTrade) return
    try {
      await jobAPI.updateJob(selectedJob.id, { assigned_trade_id: assignTrade })
      alert('Trade assigned successfully')
      fetchData()
      setSelectedJob(null)
      setAssignTrade('')
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to assign trade')
    }
  }

  const handleUpdateStatus = async () => {
    if (!selectedJob || !updateStatus) return
    try {
      await jobAPI.updateJob(selectedJob.id, { status_id: updateStatus })
      alert('Status updated successfully')
      fetchData()
      setSelectedJob(null)
      setUpdateStatus('')
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to update status')
    }
  }

  return (
    <DashboardLayout title="Jobs Management">
      {loading ? (
        <div className="text-center py-12"><p className="text-gray-500">Loading...</p></div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Job #</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned To</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium">{job.job_number}</td>
                    <td className="px-6 py-4 text-sm">{job.title}</td>
                    <td className="px-6 py-4 text-sm">{job.customer_name}</td>
                    <td className="px-6 py-4"><span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">{job.status_name}</span></td>
                    <td className="px-6 py-4"><span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">{job.priority_name}</span></td>
                    <td className="px-6 py-4 text-sm">{job.assigned_trade_name || 'Unassigned'}</td>
                    <td className="px-6 py-4">
                      <button onClick={() => setSelectedJob(job)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">Manage</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selectedJob && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h3 className="text-xl font-bold mb-4">Manage Job #{selectedJob.job_number}</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Assign to Trade</label>
                    <select value={assignTrade} onChange={(e) => setAssignTrade(e.target.value)} className="w-full px-3 py-2 border rounded-lg">
                      <option value="">Select trade specialist</option>
                      {trades.map(t => <option key={t.id} value={t.id}>{t.company_name}</option>)}
                    </select>
                    <button onClick={handleAssignTrade} className="mt-2 w-full bg-blue-600 text-white px-4 py-2 rounded-lg">Assign</button>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Update Status</label>
                    <select value={updateStatus} onChange={(e) => setUpdateStatus(e.target.value)} className="w-full px-3 py-2 border rounded-lg">
                      <option value="">Select status</option>
                      {statuses.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                    <button onClick={handleUpdateStatus} className="mt-2 w-full bg-green-600 text-white px-4 py-2 rounded-lg">Update</button>
                  </div>
                  <button onClick={() => setSelectedJob(null)} className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-lg">Close</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  )
}
