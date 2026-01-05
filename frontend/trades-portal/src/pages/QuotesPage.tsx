import React, { useState, useEffect } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import { quoteAPI, jobAPI } from '../services/api'
import { useAuth } from '../App'

export default function QuotesPage() {
  const { user } = useAuth()
  const [jobs, setJobs] = useState<any[]>([])
  const [selectedJob, setSelectedJob] = useState<any>(null)
  const [lineItems, setLineItems] = useState([{ description: '', quantity: 1, unit_price: 0 }])
  const [notes, setNotes] = useState('')
  const [validUntil, setValidUntil] = useState(new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0])
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchJobsNeedingQuotes()
  }, [])

  const fetchJobsNeedingQuotes = async () => {
    try {
      const response = await jobAPI.getJobs({ assigned_trade_id: user?.tradeId, status: 'Awaiting Quotes' })
      setJobs(response.data.data || [])
    } catch (err) {
      console.error('Failed to load jobs:', err)
    }
  }

  const addLineItem = () => {
    setLineItems([...lineItems, { description: '', quantity: 1, unit_price: 0 }])
  }

  const updateLineItem = (index: number, field: string, value: any) => {
    const updated = [...lineItems]
    updated[index] = { ...updated[index], [field]: value }
    setLineItems(updated)
  }

  const removeLineItem = (index: number) => {
    setLineItems(lineItems.filter((_, i) => i !== index))
  }

  const calculateTotal = () => {
    return lineItems.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedJob) return

    setSubmitting(true)
    try {
      await quoteAPI.createQuote({
        job_id: selectedJob.id,
        line_items: lineItems,
        notes,
        valid_until: validUntil,
        total_price: calculateTotal()
      })
      alert('Quote submitted successfully!')
      setSelectedJob(null)
      setLineItems([{ description: '', quantity: 1, unit_price: 0 }])
      setNotes('')
      fetchJobsNeedingQuotes()
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to submit quote')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <DashboardLayout title="Submit Quotes">
      {!selectedJob ? (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-900">Select a job below to submit a quote</p>
          </div>
          
          {jobs.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <p className="text-gray-500">No jobs awaiting quotes</p>
            </div>
          ) : (
            jobs.map((job) => (
              <div key={job.id} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-lg">{job.job_number} - {job.title}</div>
                    <div className="text-gray-600">{job.category_name}</div>
                    <p className="text-gray-700 mt-2">{job.description}</p>
                  </div>
                  <button onClick={() => setSelectedJob(job)} className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
                    Submit Quote
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold">{selectedJob.job_number} - {selectedJob.title}</h2>
            <p className="text-gray-600">{selectedJob.description}</p>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold">Line Items</h3>
              <button type="button" onClick={addLineItem} className="text-blue-600 hover:text-blue-800 text-sm">+ Add Item</button>
            </div>
            
            {lineItems.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) => updateLineItem(index, 'description', e.target.value)}
                  className="col-span-5 px-3 py-2 border rounded"
                  required
                />
                <input
                  type="number"
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={(e) => updateLineItem(index, 'quantity', parseFloat(e.target.value))}
                  className="col-span-2 px-3 py-2 border rounded"
                  min="0.01"
                  step="0.01"
                  required
                />
                <input
                  type="number"
                  placeholder="Unit Price"
                  value={item.unit_price}
                  onChange={(e) => updateLineItem(index, 'unit_price', parseFloat(e.target.value))}
                  className="col-span-2 px-3 py-2 border rounded"
                  min="0"
                  step="0.01"
                  required
                />
                <div className="col-span-2 px-3 py-2 bg-gray-50 border rounded text-right">
                  ${(item.quantity * item.unit_price).toFixed(2)}
                </div>
                <button type="button" onClick={() => removeLineItem(index)} className="col-span-1 text-red-600 hover:text-red-800">✕</button>
              </div>
            ))}

            <div className="mt-4 text-right">
              <span className="text-xl font-bold">Total: ${calculateTotal().toFixed(2)}</span>
            </div>
          </div>

          <div className="mb-6">
            <label className="block font-medium mb-2">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border rounded"
              placeholder="Additional information about your quote..."
            />
          </div>

          <div className="mb-6">
            <label className="block font-medium mb-2">Valid Until</label>
            <input
              type="date"
              value={validUntil}
              onChange={(e) => setValidUntil(e.target.value)}
              className="px-3 py-2 border rounded"
              required
            />
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={submitting} className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 disabled:opacity-50">
              {submitting ? 'Submitting...' : 'Submit Quote'}
            </button>
            <button type="button" onClick={() => setSelectedJob(null)} className="bg-gray-200 text-gray-700 px-6 py-3 rounded hover:bg-gray-300">
              Cancel
            </button>
          </div>
        </form>
      )}
    </DashboardLayout>
  )
}
