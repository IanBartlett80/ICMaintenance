import React, { useState, useEffect } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import { dataAPI } from '../services/api'

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ name: '', description: '', icon: '🔧' })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await dataAPI.getCategories()
      setCategories(response.data.data || [])
    } catch (err) {
      console.error('Failed to load categories:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await dataAPI.createCategory(formData)
      alert('Category added successfully')
      setShowForm(false)
      setFormData({ name: '', description: '', icon: '🔧' })
      fetchCategories()
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to add category')
    }
  }

  const icons = ['🔧', '💡', '🔨', '🚿', '🔥', '❄️', '🎨', '🪵', '🏠', '🌿', '🪟', '🚪', '🔒', '🧹', '🪲']

  return (
    <DashboardLayout title="Categories">
      <div className="mb-6">
        <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
          {showForm ? 'Cancel' : '+ Add Category'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h3 className="text-xl font-bold mb-4">Add New Category</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Category Name</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border rounded-lg" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <input type="text" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Icon</label>
              <div className="flex gap-2 flex-wrap">
                {icons.map(icon => (
                  <button key={icon} type="button" onClick={() => setFormData({...formData, icon})} className={`text-2xl p-2 border rounded ${formData.icon === icon ? 'bg-blue-100 border-blue-500' : 'hover:bg-gray-100'}`}>
                    {icon}
                  </button>
                ))}
              </div>
            </div>
            <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">Add Category</button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12"><p className="text-gray-500">Loading...</p></div>
      ) : (
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <div key={category.id} className="bg-white rounded-lg border border-gray-200 p-4 text-center">
              <div className="text-4xl mb-2">{category.icon}</div>
              <div className="font-bold">{category.name}</div>
              <div className="text-xs text-gray-500 mt-1">{category.description}</div>
              <div className="mt-2 text-xs">
                <span className={category.is_active ? 'text-green-600' : 'text-red-600'}>
                  {category.is_active ? '✓ Active' : '✗ Inactive'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
