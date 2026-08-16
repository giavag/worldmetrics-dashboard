import api from './api';
import type {AuthenticationRequestDTO, AuthenticationResponseDTO, RegisterRequestDTO} from '../types/auth';

export const authService = {

    // Performs the login request and stores the JWT token
    login: async (credentials: AuthenticationRequestDTO): Promise<string> => {
        const response = await api.post<AuthenticationResponseDTO>('/auth/login', credentials);
        const token = response.data.token;
        localStorage.setItem('jwt_token', token);
        return token;
    },

    // Clears the JWT token to log the user out
    logout: () => {
        localStorage.removeItem('jwt_token');
    },

    // Registers a new user
    register: async (userData: RegisterRequestDTO): Promise<void> => {
        await api.post('/auth/register', userData);
    },

    // Checks if the currently logged-in user has the ADMIN role
    isAdmin: (): boolean => {
        const token = localStorage.getItem('jwt_token');
        if (!token) return false;

        try {
            // Get the payload part of the JWT
            const base64Url = token.split('.')[1];
            // Convert Base64Url to Base64
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            // Decode Base64 to string handling Unicode correctly
            const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            const payload = JSON.parse(jsonPayload);

            const roles = payload.role || payload.roles || payload.authorities || '';
            return JSON.stringify(roles).includes('ADMIN');

        } catch (error) {
            console.error("Failed to decode JWT token:", error);
            return false;
        }
    }
};