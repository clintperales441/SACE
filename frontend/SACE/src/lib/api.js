import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
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

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  register: (userData) => api.post('/api/auth/signup', userData),
  googleLogin: (token) => api.post('/api/auth/google', { token }),
  logout: () => api.post('/api/auth/logout'),
  getUser: (email) => api.get(`/api/auth/user/${email}`),
};

export const userAPI = {
  updateCurrentUser: (userData) => api.put('/api/users/me', userData),
  changePassword: (passwordData) => api.put('/api/users/me/password', passwordData),
  deleteCurrentUser: () => api.delete('/api/users/me'),
};

export default api;
