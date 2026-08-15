import api from './api';

export const etlService = {
    // Triggers the massive sync operation on the backend
    syncAllData: async (): Promise<string> => {
        const response = await api.post<string>('/etl/sync-all');
        return response.data;
    }
};