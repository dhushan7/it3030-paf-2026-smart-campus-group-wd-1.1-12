import axios from 'axios';

// 1. Create the base instance without hardcoded auth
export const api = axios.create({
    baseURL: 'http://localhost:8087/api/v1',
    headers: {
        'Content-Type': 'application/json'
    }
});

// 2. Interceptor: Inject the Bearer Token before every request
api.interceptors.request.use(
    (config) => {
        // Grab the token that was saved when you logged in
        const token = localStorage.getItem('token'); 
        
        if (token) {
            // Spring Boot expects this exact format: "Bearer <token>"
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 3. Interceptor: Handle expired tokens globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.error("Session expired or unauthorized. Redirecting to login...");
            localStorage.removeItem('token');
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);