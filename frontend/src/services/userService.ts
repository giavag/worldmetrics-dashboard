import api from './api';

export interface UserReadOnly {
    uuid: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
}

export const userService = {
    getAllUsers: async (): Promise<UserReadOnly[]> => {
        const response = await api.get<UserReadOnly[]>('/users');
        return response.data;
    },

    deleteUser: async (uuid: string): Promise<void> => {
        await api.delete(`/users/${uuid}`);
    }
};