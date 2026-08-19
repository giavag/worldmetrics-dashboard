import api from './api';

export interface UserReadOnly {
    uuid: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
}

export interface UpdateUserRequest {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
}

export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}

export const userService = {
    getAllUsers: async (): Promise<UserReadOnly[]> => {
        const response = await api.get<PageResponse<UserReadOnly>>('/users');
        return response.data.content; // <--- Εδώ είναι η διόρθωση!
    },

    deleteUser: async (uuid: string): Promise<void> => {
        await api.delete(`/users/${uuid}`);
    },

    updateUser: async (uuid: string, userData: UpdateUserRequest): Promise<UserReadOnly> => {
        const response = await api.put<UserReadOnly>(`/users/${uuid}`, userData);
        return response.data;
    }
};