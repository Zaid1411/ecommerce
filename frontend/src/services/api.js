import axios from 'axios';
import { MOCK_PRODUCTS } from '../data/mockProducts';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 8000,
});

// Request interceptor: Attach JWT token if stored
api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('woodwright_user');
    if (userInfo) {
      try {
        const { token } = JSON.parse(userInfo);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (err) {
        console.error('Failed to parse user auth token', err);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: graceful error messaging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected network error occurred.';
    return Promise.reject(new Error(message));
  }
);

// Product API with transparent mock fallback
export const productService = {
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/products', { params });
      return response.data;
    } catch (err) {
      console.warn('Backend API unavailable, serving local mock data', err.message);
      let products = [...MOCK_PRODUCTS];

      if (params.category && params.category !== 'All') {
        products = products.filter(
          (p) => p.category.toLowerCase() === params.category.toLowerCase()
        );
      }
      if (params.search) {
        const q = params.search.toLowerCase();
        products = products.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q)
        );
      }
      if (params.sort === 'price-asc') {
        products.sort((a, b) => a.price - b.price);
      } else if (params.sort === 'price-desc') {
        products.sort((a, b) => b.price - a.price);
      } else if (params.sort === 'rating') {
        products.sort((a, b) => b.rating - a.rating);
      }

      return {
        products,
        page: 1,
        pages: 1,
        total: products.length,
      };
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (err) {
      console.warn('Backend API unavailable, using local mock item', err.message);
      const product = MOCK_PRODUCTS.find((p) => p.id === id || p._id === id);
      if (product) return product;
      throw new Error('Product not found');
    }
  },

  create: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  update: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};

// Auth API Service
export const authService = {
  login: async (email, password) => {
    const response = await api.post('/users/login', { email, password });
    return response.data;
  },

  register: async (name, email, password) => {
    const response = await api.post('/users', { name, email, password });
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  updateProfile: async (userData) => {
    const response = await api.put('/users/profile', userData);
    return response.data;
  },
};

// Orders API Service
export const orderService = {
  create: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  getMyOrders: async () => {
    const response = await api.get('/orders/myorders');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  getAllAdmin: async () => {
    const response = await api.get('/orders');
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await api.put(`/orders/${id}/status`, { status });
    return response.data;
  },
};

export default api;
