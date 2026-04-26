import { api } from './axiosClient';

export const ticketService = {
    /** Create ticket — files is an array of File objects (max 3) */
    create: (ticketData, files = []) => {
        const form = new FormData();
        form.append('ticket', new Blob([JSON.stringify(ticketData)],
            { type: 'application/json' }));
        files.slice(0, 3).forEach(f => form.append('files', f));
        return api.post('/tickets', form, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }).then(r => r.data);
    },

    getAll: () => api.get('/tickets').then(r => r.data),

    getById: (id) => api.get(`/tickets/${id}`).then(r => r.data),

    updateStatus: (id, data) =>
        api.put(`/tickets/${id}/status`, data).then(r => r.data),

    delete: (id) => api.delete(`/tickets/${id}`).then(r => r.data),
};
