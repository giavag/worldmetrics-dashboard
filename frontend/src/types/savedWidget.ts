export interface SavedWidgetRequest {
    title: string;
    countries: string;
    indicatorCode: string;
    chartType: string;
    startYear: number;
    endYear: number;
}

export interface SavedWidgetResponse {
    id: number;
    title: string;
    countries: string;
    indicatorCode: string;
    chartType: string;
    startYear: number;
    endYear: number;
}