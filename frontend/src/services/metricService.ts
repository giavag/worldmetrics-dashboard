import api from './api';
import type { MetricSeriesResponse } from '../types/metrics';

export const metricService = {
    getMetricsSeries: async (countryIsoCode: string, indicatorCode: string) => {
        const response = await api.get<MetricSeriesResponse>('/metrics', {
            params: { country: countryIsoCode, indicator: indicatorCode }
        });
        return response;
    },

    getCompareMetricsSeries: async (countryIsoCodes: string[], indicatorCode: string) => {
        const response = await api.get<MetricSeriesResponse[]>('/metrics/compare', {
            params: {
                countries: countryIsoCodes.join(','),
                indicator: indicatorCode
            }
        });
        return response.data;
    }
};