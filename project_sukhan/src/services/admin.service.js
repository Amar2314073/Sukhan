import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/admin',
  withCredentials: true,
});
const get_api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
});

export const adminService = {
  /* -------- DASHBOARD -------- */
  dashboard: () => api.get('/dashboard'),

  /* -------- POETS -------- */
  getPoets: () => get_api.get('/poets'),
  createPoet: (data) => api.post('/poet', data),
  updatePoet: (id, data) => api.put(`/poet/${id}`, data),
  deletePoet: (id) => api.delete(`/poet/${id}`),

  /* -------- POEMS -------- */
  getPoems: () => get_api.get('/poems'),
  createPoem: (data) => api.post('/poem', data),
  updatePoem: (id, data) => api.put(`/poem/${id}`, data),
  deletePoem: (id) => api.delete(`/poem/${id}`),
};
