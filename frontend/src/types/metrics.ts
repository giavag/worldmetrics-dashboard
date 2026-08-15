export interface MetricDataPoint {
    year: string;
    value: number;
}

export interface MetricSeriesResponse {
    countryIsoCode: string;
    countryName: string;
    indicatorCode: string;
    indicatorName: string;
    data: MetricDataPoint[];
}