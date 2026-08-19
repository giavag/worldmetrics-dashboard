export interface SavedWidgetRequest {
    title: string;
    countries: string;
    indicatorCode: string;
    chartType: string;
}

export interface SavedWidgetResponse {
    id: number;
    title: string;
    countries: string;
    indicatorCode: string;
    chartType: string;
}