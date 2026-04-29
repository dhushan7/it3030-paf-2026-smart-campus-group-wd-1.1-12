import { api } from './axiosClient';

export const notificationService = {
    getAll:        ()   => api.get('/notifications').then(r => r.data),
    getUnreadCount: ()  => api.get('/notifications/unread-count').then(r => r.data.count),
    markAsRead:    (id) => api.put(`/notifications/${id}/read`).then(r => r.data),
    markAllAsRead: ()   => api.put('/notifications/read-all').then(r => r.data),
};
