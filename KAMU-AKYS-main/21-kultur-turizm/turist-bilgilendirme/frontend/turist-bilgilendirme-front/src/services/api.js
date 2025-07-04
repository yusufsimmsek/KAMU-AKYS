import axios from 'axios';

// API base URL - Backend localhost:8080'de çalışıyor
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api';

// Axios instance oluştur
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token'ı localStorage'dan al
const getToken = () => {
  return localStorage.getItem('token');
};

// Request interceptor - token ekle
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - hata yönetimi
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorMessage = error.response?.data?.message || 'Bir hata oluştu';
    
    if (error.response?.status === 401) {
      // Token geçersiz, kullanıcıyı çıkış yap
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return Promise.reject({
      ...error,
      message: errorMessage
    });
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
  logout: () => api.post('/auth/logout'),
  verifyToken: () => api.get('/auth/verify'),
};

// Destinations API
export const destinationsAPI = {
  getAll: (params = {}) => api.get('/destinations', { params }),
  getById: (id, params = {}) => api.get(`/destinations/${id}`, { params }),
  create: (data) => api.post('/destinations', data),
  update: (id, data) => api.put(`/destinations/${id}`, data),
  delete: (id) => api.delete(`/destinations/${id}`),
  getNearby: (id, params = {}) => api.get(`/destinations/${id}/nearby`, { params }),
  getCategories: () => api.get('/destinations/categories/list'),
};

// Events API
export const eventsAPI = {
  getAll: (params = {}) => api.get('/events', { params }),
  getById: (id, params = {}) => api.get(`/events/${id}`, { params }),
  create: (data) => api.post('/events', data),
  update: (id, data) => api.put(`/events/${id}`, data),
  delete: (id) => api.delete(`/events/${id}`),
  getUpcoming: (params = {}) => api.get('/events/upcoming/list', { params }),
};

// Accommodations API
export const accommodationsAPI = {
  getAll: (params = {}) => api.get('/accommodations', { params }),
  getById: (id, params = {}) => api.get(`/accommodations/${id}`, { params }),
  create: (data) => api.post('/accommodations', data),
  update: (id, data) => api.put(`/accommodations/${id}`, data),
  delete: (id) => api.delete(`/accommodations/${id}`),
};

// Restaurants API
export const restaurantsAPI = {
  getAll: (params = {}) => api.get('/restaurants', { params }),
  getById: (id, params = {}) => api.get(`/restaurants/${id}`, { params }),
  create: (data) => api.post('/restaurants', data),
  update: (id, data) => api.put(`/restaurants/${id}`, data),
  delete: (id) => api.delete(`/restaurants/${id}`),
};

// Reviews API
export const reviewsAPI = {
  getByEntity: (entityType, entityId, params = {}) => 
    api.get(`/reviews/${entityType}/${entityId}`, { params }),
  create: (data) => api.post('/reviews', data),
  update: (id, data) => api.put(`/reviews/${id}`, data),
  delete: (id) => api.delete(`/reviews/${id}`),
  like: (id) => api.post(`/reviews/${id}/like`),
  dislike: (id) => api.post(`/reviews/${id}/dislike`),
  moderate: (id, data) => api.patch(`/reviews/${id}/moderate`, data),
};

// Weather API
export const weatherAPI = {
  getByCity: (city, params = {}) => api.get(`/weather/${city}`, { params }),
  getByCoordinates: (lat, lng, params = {}) => 
    api.get(`/weather/coordinates/${lat}/${lng}`, { params }),
};

// Health check
export const healthAPI = {
  check: () => api.get('/health'),
};

export default api; 