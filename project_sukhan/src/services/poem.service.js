import axios from 'axios';

const API_URL = 'http://localhost:5000/api/poems';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Add token to requests for admin routes
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const poemService = {
  // Public routes
  getAllPoems: async () => {
    const response = await api.get('/');
    return response.data;
  },

  searchPoems: async (query) => {
    const response = await api.get('/search', {
      params: { q: query }
    });
    return response.data;
  },

  getPoemsByPoet: async (poetId) => {
    const response = await api.get(`/poet/${poetId}`);
    return response.data;
  },

  getPoemsByCategory: async (categoryId) => {
    const response = await api.get(`/category/${categoryId}`);
    console.log(response)
    return response.data;
  },

  getPoemById: async (poemId) => {
    const response = await api.get(`/${poemId}`);
    return response.data;
  },

  // Admin routes
  createPoem: async (poemData) => {
    const response = await api.post('/', poemData);
    return response.data;
  },

  updatePoem: async (poemId, poemData) => {
    const response = await api.put(`/update/${poemId}`, poemData);
    return response.data;
  },

  deletePoem: async (poemId) => {
    const response = await api.delete(`/delete/${poemId}`);
    return response.data;
  }
};

export default poemService;