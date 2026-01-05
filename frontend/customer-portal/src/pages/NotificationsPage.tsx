import React, { useState, useEffect } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import { notificationAPI } from '../services/api'

interface Notification {
  id: number
  type: string
  message: string
  is_read: boolean
  created_at: string
  job_id?: number
  job_number?: string
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const response = await notificationAPI.getNotifications()
      setNotifications(response.data.data || [])
    } catch (err: any) {
      console.error('Failed to load notifications:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (id: number) => {
    try {
      await notificationAPI.markAsRead(id.toString())
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, is_read: true } : n
      ))
    } catch (err: any) {
      console.error('Failed to mark notification as read:', err)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead()
      setNotifications(notifications.map(n => ({ ...n, is_read: true })))
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to mark all as read')
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this notification?')) {
      return
    }

    try {
      await notificationAPI.deleteNotification(id.toString())
      setNotifications(notifications.filter(n => n.id !== id))
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to delete notification')
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'job_created':
        return '📋'
      case 'quote_received':
        return '💰'
      case 'quote_approved':
        return '✅'
      case 'job_completed':
        return '✓'
      case 'job_assigned':
        return '👤'
      default:
        return '🔔'
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'job_created':
        return 'bg-blue-50 border-blue-200'
      case 'quote_received':
        return 'bg-green-50 border-green-200'
      case 'quote_approved':
        return 'bg-purple-50 border-purple-200'
      case 'job_completed':
        return 'bg-green-50 border-green-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(n => !n.is_read)

  const unreadCount = notifications.filter(n => !n.is_read).length

  return (
    <DashboardLayout title="Notifications" backTo={{ label: 'Back to Dashboard', href: '/dashboard' }}>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
            <p className="text-gray-600 mt-1">
              {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-blue-600 hover:text-blue-800 font-medium text-sm"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg border border-gray-200 p-2 mb-6 flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${
              filter === 'unread'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Unread ({unreadCount})
          </button>
        </div>

        {/* Notifications List */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading notifications...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <div className="text-6xl mb-4">🔔</div>
            <p className="text-gray-500 text-lg">
              {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
            </p>
            <p className="text-gray-400 text-sm mt-2">
              {filter === 'unread' 
                ? 'All your notifications have been read' 
                : 'You will see updates about your jobs here'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map(notification => (
              <div
                key={notification.id}
                className={`relative ${getNotificationColor(notification.type)} border rounded-lg p-4 transition ${
                  !notification.is_read ? 'border-l-4' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="text-2xl flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <p className={`text-gray-900 ${!notification.is_read ? 'font-semibold' : ''}`}>
                        {notification.message}
                      </p>
                      {!notification.is_read && (
                        <span className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span>{new Date(notification.created_at).toLocaleString()}</span>
                      {notification.job_number && (
                        <span className="text-blue-600">Job #{notification.job_number}</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mt-3">
                  {!notification.is_read && (
                    <button
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Mark as read
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(notification.id)}
                    className="text-xs text-red-600 hover:text-red-800 font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
