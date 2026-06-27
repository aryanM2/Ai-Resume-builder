import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
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

// Auth API
export const authAPI = {
  register: (data) => api.post('/api/users/register', data),
  login: (data) => api.post('/api/users/login', data),
  getProfile: () => api.get('/api/users/profile'),
};

// Resume API
export const resumeAPI = {
  createResume: (data) => api.post('/api/resume', data),
  getUserResumes: (userId) => api.get(`/api/resume/user/${userId}`),
  getPublicResume: (id) => api.get(`/api/resume/public/${id}`),
  updateResume: (data) => api.put('/api/resume/update', data),
  deleteResume: (id) => api.delete(`/api/resume/${id}`),
};

// AI API
export const aiAPI = {
  enhanceSummary: (data) => api.post('/api/ai/enhance-summary', data),
  enhanceJD: (data) => api.post('/api/ai/enhance-jd', data),
  enhanceProject: (data) => api.post('/api/ai/enhance-project', data),
  analyzeAts: (data) => api.post('/api/ai/analyze-ats', data),
};

export const paymentAPI = {
  createOrder: () => api.post('/api/payment/order'),
  verifyPayment: (data) => api.post('/api/payment/verify', data),
};

export default api;
