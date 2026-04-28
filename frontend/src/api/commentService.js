import { api } from './axiosClient';

export const commentService = {
    getByTicket: (ticketId) =>
        api.get(`/tickets/${ticketId}/comments`).then(r => r.data),

    add: (ticketId, content) =>
        api.post(`/tickets/${ticketId}/comments`, { content }).then(r => r.data),

    update: (ticketId, commentId, content) =>
        api.put(`/tickets/${ticketId}/comments/${commentId}`, { content }).then(r => r.data),

    delete: (ticketId, commentId) =>
        api.delete(`/tickets/${ticketId}/comments/${commentId}`).then(r => r.data),
};
