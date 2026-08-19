import api from './api';
import type {SavedWidgetRequest, SavedWidgetResponse} from '../types/savedWidget';

const WIDGETS_API_URL = '/widgets';

export const savedWidgetService = {

    saveWidget: async (request: SavedWidgetRequest): Promise<SavedWidgetResponse> => {
        const response = await api.post<SavedWidgetResponse>(WIDGETS_API_URL, request);
        return response.data;
    },

    getUserWidgets: async (): Promise<SavedWidgetResponse[]> => {
        const response = await api.get<SavedWidgetResponse[]>(WIDGETS_API_URL);
        return response.data;
    },

    deleteWidget: async (widgetId: number): Promise<void> => {
        await api.delete(`${WIDGETS_API_URL}/${widgetId}`);
    }
};