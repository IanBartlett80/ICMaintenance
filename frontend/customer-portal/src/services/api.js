import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.post('/auth/change-password', data),
};

// Job APIs
export const jobAPI = {
  getJobs: (params) => api.get('/jobs', { params }),
  getJobById: (id) => api.get(`/jobs/${id}`),
  createJob: (data) => api.post('/jobs', data),
  updateJob: (id, data) => api.put(`/jobs/${id}`, data),
  uploadAttachment: (formData) => api.post('/jobs/attachments', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  deleteAttachment: (id) => api.delete(`/jobs/attachments/${id}`),
};

// Quote APIs
export const quoteAPI = {
  getQuotesByJob: (jobId) => api.get(`/quotes/job/${jobId}`),
  createQuote: (data) => api.post('/quotes', data),
  updateQuoteStatus: (id, data) => api.put(`/quotes/${id}/status`, data),
  withdrawQuote: (id) => api.put(`/quotes/${id}/withdraw`),
  getQuoteComparison: (jobId) => api.get(`/quotes/job/${jobId}/comparison`),
};

// Data APIs
export const dataAPI = {
  getCategories: () => api.get('/data/categories'),
  createCategory: (data) => api.post('/data/categories', data),
  getPriorities: () => api.get('/data/priorities'),
  getStatuses: () => api.get('/data/statuses'),
  getTradeSpecialists: (params) => api.get('/data/trade-specialists', { params }),
  getTradeSpecialistById: (id) => api.get(`/data/trade-specialists/${id}`),
  createTradeSpecialist: (data) => api.post('/data/trade-specialists', data),
  updateTradeSpecialist: (id, data) => api.put(`/data/trade-specialists/${id}`, data),
  getCustomers: () => api.get('/data/customers'),
  getCustomerById: (id) => api.get(`/data/customers/${id}`),
};

// Notification APIs
export const notificationAPI = {
  getNotifications: (params) => api.get('/notifications', { params }),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  deleteNotification: (id) => api.delete(`/notifications/${id}`),
};

// Report APIs
export const reportAPI = {
  getDashboardStats: () => api.get('/reports/dashboard'),
  getJobStatistics: (params) => api.get('/reports/job-statistics', { params }),
  getFinancialReport: (params) => api.get('/reports/financial', { params }),
  getPerformanceMetrics: (params) => api.get('/reports/performance', { params }),
};

export default api;
