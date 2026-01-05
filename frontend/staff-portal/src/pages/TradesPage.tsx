import React, { useState, useEffect } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import { dataAPI } from '../services/api'

export default function TradesPage() {
  const [trades, setTrades] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    email: '', password: '', first_name: '', last_name: '', company_name: '', phone: '', license_number: ''
  })

  useEffect(() => {
    fetchTrades()
  }, [])

  const fetchTrades = async () => {
    try {
      const response = await dataAPI.getTradeSpecialists()
      setTrades(response.data.data || [])
    } catch (err) {
      console.error('Failed to load trades:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await dataAPI.createTradeSpecialist(formData)
      alert('Trade specialist added successfully')
      setShowForm(false)
      setFormData({ email: '', password: '', first_name: '', last_name: '', company_name: '', phone: '', license_number: '' })
      fetchTrades()
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to add trade specialist')
    }
  }

  return (
    <DashboardLayout title="Trade Specialists">
      <div className="mb-6">
        <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
          {showForm ? 'Cancel' : '+ Add Trade Specialist'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h3 className="text-xl font-bold mb-4">Add Trade Specialist</h3>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
            <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="px-4 py-2 border rounded-lg" required />
            <input type="password" placeholder="Password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="px-4 py-2 border rounded-lg" required />
            <input type="text" placeholder="First Name" value={formData.first_name} onChange={(e) => setFormData({...formData, first_name: e.target.value})} className="px-4 py-2 border rounded-lg" required />
            <input type="text" placeholder="Last Name" value={formData.last_name} onChange={(e) => setFormData({...formData, last_name: e.target.value})} className="px-4 py-2 border rounded-lg" required />
            <input type="text" placeholder="Company Name" value={formData.company_name} onChange={(e) => setFormData({...formData, company_name: e.target.value})} className="px-4 py-2 border rounded-lg" required />
            <input type="tel" placeholder="Phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="px-4 py-2 border rounded-lg" />
            <input type="text" placeholder="License Number" value={formData.license_number} onChange={(e) => setFormData({...formData, license_number: e.target.value})} className="px-4 py-2 border rounded-lg" />
            <button type="submit" className="md:col-span-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">Add Trade Specialist</button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12"><p className="text-gray-500">Loading...</p></div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trades.map((trade) => (
            <div key={trade.id} className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-bold text-lg">{trade.company_name}</h3>
              <p className="text-sm text-gray-600">{trade.first_name} {trade.last_name}</p>
              <div className="mt-3 space-y-1 text-sm">
                <div>📧 {trade.email}</div>
                <div>📱 {trade.phone || 'N/A'}</div>
                <div>⭐ Rating: {trade.rating || 'Not rated'}</div>
                <div>✓ Verified: {trade.is_verified ? 'Yes' : 'No'}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
