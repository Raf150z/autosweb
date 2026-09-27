import api from '../api/axios';

export const carService = {
  getAll: (params) => api.get('/cars', { params }),
  getById: (id) => api.get(`/cars/${id}`),
  create: (data) => api.post('/cars', data),
  update: (id, data) => api.put(`/cars/${id}`, data),
  remove: (id) => api.delete(`/cars/${id}`),
};

export const categoryService = {
  getAll: () => api.get('/categories'),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  remove: (id) => api.delete(`/categories/${id}`),
};

export const brandService = {
  getAll: () => api.get('/brands'),
  create: (data) => api.post('/brands', data),
  update: (id, data) => api.put(`/brands/${id}`, data),
  remove: (id) => api.delete(`/brands/${id}`),
};