import api from './api';
import type {AuthenticationRequestDTO, AuthenticationResponseDTO} from '../types/auth';

export const authService = {

    // Performs the login request and stores the JWT token
    login: async (credentials: AuthenticationRequestDTO): Promise<string> => {
        const response = await api.post<AuthenticationResponseDTO>('/auth/login', credentials);

        const token = response.data.token;

        // Persist the token in the browser's local storage
        localStorage.setItem('jwt_token', token);

        return token;
    },

    // Clears the JWT token to log the user out
    logout: () => {
        localStorage.removeItem('jwt_token');
    }
};