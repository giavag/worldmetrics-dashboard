import api from './api';
import type {MetricSeriesResponse} from '../types/metrics';

export const metricService = {

    getMetricsSeries: async (country: string, indicator: string): Promise<MetricSeriesResponse> => {
        const response = await api.get<MetricSeriesResponse>('/metrics', {
            params: {
                country: country,
                indicator: indicator
            }
        });
        return response.data;
    }
};