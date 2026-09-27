import api from '../api/axios';

export const userService = {
  getAll: () => api.get('/users'),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  changeRole: (id, role) => api.put(`/users/${id}/role`, { role }),
  remove: (id) => api.delete(`/users/${id}`),
};