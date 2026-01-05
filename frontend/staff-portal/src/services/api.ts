import axios, { AxiosInstance, AxiosResponse } from 'axios'

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api'

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
api.interceptors.request.use((config) => {
  const userData = localStorage.getItem('staff_userData')
  if (userData) {
    const token = localStorage.getItem('staff_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('staff_userData')
      localStorage.removeItem('staff_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth APIs
export const authAPI = {
  login: (credentials: { email: string; password: string }): Promise<AxiosResponse> =>
    api.post('/auth/login', credentials),
  register: (userData: any): Promise<AxiosResponse> =>
    api.post('/auth/register', userData),
  getProfile: (): Promise<AxiosResponse> =>
    api.get('/auth/profile'),
  updateProfile: (data: any): Promise<AxiosResponse> =>
    api.put('/auth/profile', data),
  changePassword: (data: any): Promise<AxiosResponse> =>
    api.post('/auth/change-password', data),
}

// Job APIs
export const jobAPI = {
  getJobs: (params?: any): Promise<AxiosResponse> =>
    api.get('/jobs', { params }),
  getJobById: (id: string): Promise<AxiosResponse> =>
    api.get(`/jobs/${id}`),
  createJob: (data: any): Promise<AxiosResponse> =>
    api.post('/jobs', data),
  updateJob: (id: string, data: any): Promise<AxiosResponse> =>
    api.put(`/jobs/${id}`, data),
  uploadAttachment: (formData: FormData): Promise<AxiosResponse> =>
    api.post('/jobs/attachments', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  deleteAttachment: (id: string): Promise<AxiosResponse> =>
    api.delete(`/jobs/attachments/${id}`),
}

// Quote APIs
export const quoteAPI = {
  getQuotesByJob: (jobId: string): Promise<AxiosResponse> =>
    api.get(`/quotes/job/${jobId}`),
  createQuote: (data: any): Promise<AxiosResponse> =>
    api.post('/quotes', data),
  updateQuoteStatus: (id: string, data: any): Promise<AxiosResponse> =>
    api.put(`/quotes/${id}/status`, data),
  withdrawQuote: (id: string): Promise<AxiosResponse> =>
    api.put(`/quotes/${id}/withdraw`),
  getQuoteComparison: (jobId: string): Promise<AxiosResponse> =>
    api.get(`/quotes/job/${jobId}/comparison`),
}

// Data APIs
export const dataAPI = {
  getCategories: (): Promise<AxiosResponse> =>
    api.get('/data/categories'),
  createCategory: (data: any): Promise<AxiosResponse> =>
    api.post('/data/categories', data),
  getPriorities: (): Promise<AxiosResponse> =>
    api.get('/data/priorities'),
  getStatuses: (): Promise<AxiosResponse> =>
    api.get('/data/statuses'),
  getTradeSpecialists: (params?: any): Promise<AxiosResponse> =>
    api.get('/data/trade-specialists', { params }),
  getTradeSpecialistById: (id: string): Promise<AxiosResponse> =>
    api.get(`/data/trade-specialists/${id}`),
  createTradeSpecialist: (data: any): Promise<AxiosResponse> =>
    api.post('/data/trade-specialists', data),
  updateTradeSpecialist: (id: string, data: any): Promise<AxiosResponse> =>
    api.put(`/data/trade-specialists/${id}`, data),
  getCustomers: (): Promise<AxiosResponse> =>
    api.get('/data/customers'),
  getCustomerById: (id: string): Promise<AxiosResponse> =>
    api.get(`/data/customers/${id}`),
}

// Notification APIs
export const notificationAPI = {
  getNotifications: (params?: any): Promise<AxiosResponse> =>
    api.get('/notifications', { params }),
  getUnreadCount: (): Promise<AxiosResponse> =>
    api.get('/notifications/unread-count'),
  markAsRead: (id: string): Promise<AxiosResponse> =>
    api.put(`/notifications/${id}/read`),
  markAllAsRead: (): Promise<AxiosResponse> =>
    api.put('/notifications/read-all'),
  deleteNotification: (id: string): Promise<AxiosResponse> =>
    api.delete(`/notifications/${id}`),
}

// Report APIs
export const reportAPI = {
  getDashboardStats: (): Promise<AxiosResponse> =>
    api.get('/reports/dashboard'),
  getJobStatistics: (params?: any): Promise<AxiosResponse> =>
    api.get('/reports/job-statistics', { params }),
  getFinancialReport: (params?: any): Promise<AxiosResponse> =>
    api.get('/reports/financial', { params }),
  getPerformanceMetrics: (params?: any): Promise<AxiosResponse> =>
    api.get('/reports/performance', { params }),
  getCustomerReport: (params?: any): Promise<AxiosResponse> =>
    api.get('/reports/customer', { params }),
}

export default api
