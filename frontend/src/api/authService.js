import { api } from './axiosClient';

export const authService = {
    register: (data) => api.post('/auth/register', data).then(r => r.data),
    login:    (data) => api.post('/auth/login', data).then(r => r.data),
    googleLogin: () => {
        window.location.href = 'http://localhost:8087/oauth2/authorization/google';
    },
};
