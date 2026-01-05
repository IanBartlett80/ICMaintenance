import React, { useState, useEffect } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import { dataAPI, authAPI } from '../services/api'
import { useAuth } from '../App'

export default function ProfilePage() {
  const { user } = useAuth()
  const [profileData, setProfileData] = useState<any>({})
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [profileRes, categoriesRes] = await Promise.all([
        dataAPI.getTradeSpecialistById(user?.tradeId?.toString() || ''),
        dataAPI.getCategories()
      ])
      setProfileData(profileRes.data.data)
      setCategories(categoriesRes.data.data || [])
    } catch (err) {
      console.error('Failed to load profile:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await dataAPI.updateTradeSpecialist(user?.tradeId?.toString() || '', profileData)
      alert('Profile updated successfully!')
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  return (
    <DashboardLayout title="My Profile">
      {loading ? (
        <div className="text-center py-12"><p className="text-gray-500">Loading...</p></div>
      ) : (
        <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold mb-4">Company Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-2">Company Name</label>
                <input
                  type="text"
                  value={profileData.company_name || ''}
                  onChange={(e) => setProfileData({...profileData, company_name: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-2">Phone</label>
                <input
                  type="tel"
                  value={profileData.phone || ''}
                  onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block font-medium mb-2">License Number</label>
                <input
                  type="text"
                  value={profileData.license_number || ''}
                  onChange={(e) => setProfileData({...profileData, license_number: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block font-medium mb-2">Insurance Details</label>
                <input
                  type="text"
                  value={profileData.insurance_details || ''}
                  onChange={(e) => setProfileData({...profileData, insurance_details: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold mb-4">Service Areas</h3>
            <textarea
              value={profileData.service_areas || ''}
              onChange={(e) => setProfileData({...profileData, service_areas: e.target.value})}
              rows={3}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="e.g., Sydney Metro, North Shore, Eastern Suburbs"
            />
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold mb-4">Rating & Verification</h3>
            <div className="space-y-2">
              <div>⭐ Rating: {profileData.rating || 'Not rated'} / 5.0</div>
              <div>✓ Verified: {profileData.is_verified ? 'Yes' : 'No'}</div>
            </div>
          </div>

          <button type="submit" disabled={saving} className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      )}
    </DashboardLayout>
  )
}
