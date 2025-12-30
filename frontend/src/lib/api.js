import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_BASE = `${BACKEND_URL}/api`;

// Create axios instance
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (!window.location.pathname.includes('/admin/login')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (name, email, password) => api.post('/auth/register', { name, email, password }),
  getMe: () => api.get('/auth/me'),
};

// Categories API
export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  getBySlug: (slug) => api.get(`/categories/${slug}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

// Articles API
export const articlesAPI = {
  getAll: (params) => api.get('/articles', { params }),
  getAllAdmin: () => api.get('/articles/all'),
  getBySlug: (slug) => api.get(`/articles/${slug}`),
  getWeeklyUpdates: () => api.get('/articles/weekly-updates'),
  create: (data) => api.post('/articles', data),
  update: (id, data) => api.put(`/articles/${id}`, data),
  delete: (id) => api.delete(`/articles/${id}`),
};

// Subscribers API
export const subscribersAPI = {
  subscribe: (data) => api.post('/subscribers', data),
  getAll: (params) => api.get('/subscribers', { params }),
  getStats: () => api.get('/subscribers/stats'),
  unsubscribe: (id) => api.delete(`/subscribers/${id}`),
};

// Static Content API
export const contentAPI = {
  getPage: (type) => api.get(`/content/${type}`),
};

// Dashboard Stats API
export const statsAPI = {
  getDashboard: () => api.get('/stats/dashboard'),
};

export default api;
