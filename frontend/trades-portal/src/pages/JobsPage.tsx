import React, { useState, useEffect } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import { jobAPI } from '../services/api'
import { useAuth } from '../App'

export default function JobsPage() {
  const { user } = useAuth()
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedJob, setSelectedJob] = useState<any>(null)

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      const response = await jobAPI.getJobs({ assigned_trade_id: user?.tradeId })
      setJobs(response.data.data || [])
    } catch (err) {
      console.error('Failed to load jobs:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout title="My Assigned Jobs">
      {loading ? (
        <div className="text-center py-12"><p className="text-gray-500">Loading...</p></div>
      ) : jobs.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <div className="text-6xl mb-4">📋</div>
          <p className="text-gray-500 text-lg">No jobs assigned yet</p>
          <p className="text-sm text-gray-400 mt-2">You'll see your assigned jobs here once staff assigns them to you</p>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="text-lg font-bold">{job.job_number} - {job.title}</div>
                  <div className="text-gray-600">{job.category_name} • {job.priority_name}</div>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded">{job.status_name}</span>
              </div>
              
              <div className="mb-4">
                <div className="font-medium mb-1">Description:</div>
                <p className="text-gray-700">{job.description}</p>
              </div>

              {job.location && (
                <div className="mb-2"><span className="font-medium">Location:</span> {job.location}</div>
              )}
              
              <div className="mb-2"><span className="font-medium">Customer:</span> {job.customer_name}</div>
              <div className="mb-2"><span className="font-medium">Created:</span> {new Date(job.created_at).toLocaleDateString()}</div>
              
              {job.estimated_cost && (
                <div className="mb-2"><span className="font-medium">Estimated Cost:</span> ${job.estimated_cost.toLocaleString()}</div>
              )}

              <div className="mt-4 flex gap-3">
                <button onClick={() => setSelectedJob(job)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  View Details
                </button>
                {job.status_name === 'Awaiting Quotes' && (
                  <a href={`/quotes?job_id=${job.id}`} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 inline-block">
                    Submit Quote
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-4">{selectedJob.job_number}</h3>
            <div className="space-y-3">
              <div><span className="font-medium">Title:</span> {selectedJob.title}</div>
              <div><span className="font-medium">Category:</span> {selectedJob.category_name}</div>
              <div><span className="font-medium">Priority:</span> {selectedJob.priority_name}</div>
              <div><span className="font-medium">Status:</span> {selectedJob.status_name}</div>
              <div><span className="font-medium">Description:</span> <p className="mt-1 text-gray-700">{selectedJob.description}</p></div>
              {selectedJob.location && <div><span className="font-medium">Location:</span> {selectedJob.location}</div>}
              <div><span className="font-medium">Customer:</span> {selectedJob.customer_name}</div>
              <div><span className="font-medium">Created:</span> {new Date(selectedJob.created_at).toLocaleString()}</div>
            </div>
            <button onClick={() => setSelectedJob(null)} className="mt-6 w-full bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300">
              Close
            </button>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
