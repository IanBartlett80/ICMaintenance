import React, { useState, useEffect } from 'react'
import DashboardLayout from '../components/DashboardLayout'

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'success' | 'error'
  read: boolean
  createdAt: string
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Fetch notifications from API
    setNotifications([])
    setLoading(false)
  }, [])

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'error':
        return 'bg-red-100 text-red-800 border-red-300'
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      default:
        return 'bg-blue-100 text-blue-800 border-blue-300'
    }
  }

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const clearAll = () => {
    setNotifications([])
  }

  return (
    <DashboardLayout title="Notifications" backTo={{ label: 'Back to Dashboard', href: '/dashboard' }}>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
          {notifications.length > 0 && (
            <button
              onClick={clearAll}
              className="text-red-600 hover:text-red-800 font-medium text-sm"
            >
              Clear All
            </button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <p className="text-gray-500">No notifications yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`border rounded-lg p-4 ${getTypeColor(notification.type)} ${
                  !notification.read ? 'border-l-4' : ''
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{notification.title}</h3>
                    <p className="text-sm">{notification.message}</p>
                    <p className="text-xs opacity-75 mt-2">{notification.createdAt}</p>
                  </div>
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="ml-4 text-xs font-medium hover:underline"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
