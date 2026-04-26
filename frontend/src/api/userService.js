import { api } from './axiosClient';

export const userService = {
    getMe:            ()          => api.get('/users/me').then(r => r.data),
    getAll:           ()          => api.get('/users').then(r => r.data),
    getTechnicians:   ()          => api.get('/users/technicians').then(r => r.data),
    updateRole:       (id, role)  => api.put(`/users/${id}/role`, { role }).then(r => r.data),
    getAnalytics:     ()          => api.get('/users/admin/analytics').then(r => r.data),
};
