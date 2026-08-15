import api from './api';

export interface DimensionItem {
    code: string;
    name: string;
}

export const dimensionService = {
    // Fetches all available countries from the backend
    getCountries: async (): Promise<DimensionItem[]> => {
        const response = await api.get<DimensionItem[]>('/dimensions/countries');
        return response.data;
    },

    // Fetches all available indicators from the backend
    getIndicators: async (): Promise<DimensionItem[]> => {
        const response = await api.get<DimensionItem[]>('/dimensions/indicators');
        return response.data;
    }
};