import React, { useState, useEffect } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import { jobAPI, quoteAPI } from '../services/api'

interface Quote {
  id: number
  job_id: number
  job_title: string
  trade_specialist_name: string
  trade_company_name: string
  total_price: number
  status: string
  created_at: string
  valid_until: string
  notes?: string
  line_items?: QuoteLineItem[]
}

interface QuoteLineItem {
  id: number
  description: string
  quantity: number
  unit_price: number
  total_price: number
}

interface Job {
  id: number
  job_number: string
  title: string
  quotes_count: number
}

export default function QuotesPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null)
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingQuotes, setLoadingQuotes] = useState(false)
  const [expandedQuote, setExpandedQuote] = useState<number | null>(null)

  useEffect(() => {
    fetchJobsWithQuotes()
  }, [])

  const fetchJobsWithQuotes = async () => {
    try {
      setLoading(true)
      const response = await jobAPI.getJobs({ has_quotes: true })
      const jobsData = response.data.data || []
      setJobs(jobsData)
      
      if (jobsData.length > 0) {
        setSelectedJobId(jobsData[0].id)
        fetchQuotesForJob(jobsData[0].id)
      }
    } catch (err: any) {
      console.error('Failed to load jobs:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchQuotesForJob = async (jobId: number) => {
    try {
      setLoadingQuotes(true)
      const response = await quoteAPI.getQuotesByJob(jobId.toString())
      setQuotes(response.data.data || [])
    } catch (err: any) {
      console.error('Failed to load quotes:', err)
      setQuotes([])
    } finally {
      setLoadingQuotes(false)
    }
  }

  const handleJobSelect = (jobId: number) => {
    setSelectedJobId(jobId)
    fetchQuotesForJob(jobId)
  }

  const handleApproveQuote = async (quoteId: number) => {
    if (!window.confirm('Are you sure you want to approve this quote? This action will reject other quotes for this job.')) {
      return
    }

    try {
      await quoteAPI.updateQuoteStatus(quoteId.toString(), { status: 'approved' })
      alert('Quote approved successfully!')
      if (selectedJobId) {
        fetchQuotesForJob(selectedJobId)
      }
      fetchJobsWithQuotes()
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to approve quote')
    }
  }

  const handleRejectQuote = async (quoteId: number) => {
    if (!window.confirm('Are you sure you want to reject this quote?')) {
      return
    }

    try {
      await quoteAPI.updateQuoteStatus(quoteId.toString(), { status: 'rejected' })
      alert('Quote rejected')
      if (selectedJobId) {
        fetchQuotesForJob(selectedJobId)
      }
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to reject quote')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'withdrawn':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  return (
    <DashboardLayout title="Quotes" backTo={{ label: 'Back to Dashboard', href: '/dashboard' }}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Quotes & Estimates</h2>
          <p className="text-gray-600 mt-1">Review and approve quotes from trade specialists</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading jobs...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <p className="text-gray-500 mb-4">No jobs with quotes yet.</p>
            <p className="text-sm text-gray-400">Quotes will appear here once trade specialists submit them for your jobs.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {/* Jobs List */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="font-bold text-gray-900 mb-4">Jobs with Quotes</h3>
                <div className="space-y-2">
                  {jobs.map(job => (
                    <button
                      key={job.id}
                      onClick={() => handleJobSelect(job.id)}
                      className={`w-full text-left p-3 rounded-lg transition ${
                        selectedJobId === job.id
                          ? 'bg-blue-50 border-2 border-blue-600'
                          : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                      }`}
                    >
                      <div className="font-medium text-gray-900">{job.job_number}</div>
                      <div className="text-sm text-gray-600 truncate">{job.title}</div>
                      <div className="text-xs text-blue-600 mt-1">
                        {job.quotes_count} {job.quotes_count === 1 ? 'quote' : 'quotes'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quotes List */}
            <div className="md:col-span-2">
              {loadingQuotes ? (
                <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                  <p className="text-gray-500">Loading quotes...</p>
                </div>
              ) : quotes.length === 0 ? (
                <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                  <p className="text-gray-500">No quotes found for this job.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {quotes.map(quote => (
                    <div key={quote.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                      {/* Quote Header */}
                      <div className="p-6 border-b border-gray-200">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{quote.trade_company_name}</h3>
                            <p className="text-sm text-gray-600">{quote.trade_specialist_name}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-gray-900">{formatCurrency(quote.total_price)}</div>
                            <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full mt-2 ${getStatusColor(quote.status)}`}>
                              {quote.status}
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 flex items-center gap-6 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Submitted:</span> {new Date(quote.created_at).toLocaleDateString()}
                          </div>
                          <div>
                            <span className="font-medium">Valid until:</span> {new Date(quote.valid_until).toLocaleDateString()}
                          </div>
                        </div>

                        {quote.notes && (
                          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-700"><span className="font-medium">Notes:</span> {quote.notes}</p>
                          </div>
                        )}
                      </div>

                      {/* Line Items */}
                      {quote.line_items && quote.line_items.length > 0 && (
                        <div className="p-6 bg-gray-50">
                          <button
                            onClick={() => setExpandedQuote(expandedQuote === quote.id ? null : quote.id)}
                            className="text-blue-600 hover:text-blue-800 font-medium text-sm mb-3"
                          >
                            {expandedQuote === quote.id ? '▼ Hide' : '▶ View'} Line Items
                          </button>

                          {expandedQuote === quote.id && (
                            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                              <table className="w-full text-sm">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                  <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Qty</th>
                                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Unit Price</th>
                                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                  {quote.line_items.map(item => (
                                    <tr key={item.id}>
                                      <td className="px-4 py-2">{item.description}</td>
                                      <td className="px-4 py-2 text-right">{item.quantity}</td>
                                      <td className="px-4 py-2 text-right">{formatCurrency(item.unit_price)}</td>
                                      <td className="px-4 py-2 text-right font-medium">{formatCurrency(item.total_price)}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Actions */}
                      {quote.status.toLowerCase() === 'pending' && (
                        <div className="p-6 bg-gray-50 border-t border-gray-200 flex gap-3">
                          <button
                            onClick={() => handleApproveQuote(quote.id)}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition"
                          >
                            ✓ Approve Quote
                          </button>
                          <button
                            onClick={() => handleRejectQuote(quote.id)}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition"
                          >
                            ✗ Reject Quote
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
