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

    // For Admins / Technicians: Fetch all tickets in the system
    getAll: () => api.get('/tickets').then(r => r.data),

    // For Regular Users: Fetch only their tickets
    getMyTickets: () => api.get('/tickets/mine').then(r => r.data), // <-- ADD THIS LINE

    getById: (id) => api.get(`/tickets/${id}`).then(r => r.data),

    updateStatus: (id, data) =>
        api.put(`/tickets/${id}/status`, data).then(r => r.data),

    delete: (id) => api.delete(`/tickets/${id}`).then(r => r.data),
};