import axios from 'axios';

// Create a centralized Axios instance
const api = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Attach JWT token unless it is an authentication request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwt_token');

        // Prevent attaching the token to login or register requests
        const isAuthRequest = config.url?.includes('/login') || config.url?.includes('/register') || config.url?.includes('/auth');

        if (token && config.headers && !isAuthRequest) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Handle global 401 Unauthorized errors
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token has expired or is invalid
            localStorage.removeItem('jwt_token');

            // Redirect user to the login page
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;