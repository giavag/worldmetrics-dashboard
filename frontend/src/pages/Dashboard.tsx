import React, { useState, useEffect } from 'react';
import { metricService } from '../services/metricService';
import { etlService } from '../services/etlService';
import { authService } from '../services/authService';
import { dimensionService, type DimensionItem } from '../services/dimensionService';
import type {MetricDataPoint} from '../types/metrics';
import MetricChart, { type ChartSeries } from '../components/MetricChart';
import { Slider } from '@/components/ui/slider';

const CHART_TYPES = [
    { value: 'line', label: 'Line Chart' },
    { value: 'bar', label: 'Bar Chart' },
    { value: 'area', label: 'Area Chart' }
];

const Dashboard: React.FC = () => {
    // Dimension (Filter) States
    const [countries, setCountries] = useState<DimensionItem[]>([]);
    const [indicators, setIndicators] = useState<DimensionItem[]>([]);

    // Selection States
    const [selectedCountry, setSelectedCountry] = useState<string>('');
    const [selectedIndicator, setSelectedIndicator] = useState<string>('');
    const [chartType, setChartType] = useState<'line' | 'bar' | 'area'>('line');

    // Year States for client-side filtering
    const previousYear = new Date().getFullYear() - 1;
    const [startYear, setStartYear] = useState<number>(2000);
    const [endYear, setEndYear] = useState<number>(previousYear);

    // Chart Data State
    const [chartData, setChartData] = useState<MetricDataPoint[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // ETL Sync State
    const [isSyncing, setIsSyncing] = useState<boolean>(false);
    const [syncMessage, setSyncMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Authorization Check
    const userIsAdmin = authService.isAdmin();

    // Initialize Dashboard: Fetch dimensions first
    useEffect(() => {
        const fetchDimensions = async () => {
            try {
                const [countriesData, indicatorsData] = await Promise.all([
                    dimensionService.getCountries(),
                    dimensionService.getIndicators()
                ]);

                setCountries(countriesData);
                setIndicators(indicatorsData);

                // Set initial selections if data is available
                if (countriesData.length > 0) setSelectedCountry(countriesData[0].code);
                if (indicatorsData.length > 0) setSelectedIndicator(indicatorsData[0].code);

            } catch (err) {
                console.error("Failed to fetch dimensions:", err);
                setError("Failed to load filter options.");
            }
        };

        fetchDimensions();
    }, []);

    // Fetch chart data automatically when filters change
    useEffect(() => {
        const fetchMetrics = async () => {
            if (!selectedCountry || !selectedIndicator) return;

            try {
                setLoading(true);
                const response = await metricService.getMetricsSeries(selectedCountry, selectedIndicator);
                setChartData(response.data.data);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch metrics:", err);
                setError("Failed to load chart data. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchMetrics();
    }, [selectedCountry, selectedIndicator]);

    // Handle ETL Sync execution
    const handleSyncData = async () => {
        try {
            setIsSyncing(true);
            setSyncMessage(null);

            await etlService.syncAllData();

            setSyncMessage({ type: 'success', text: 'Data synchronization completed successfully!' });

            // Re-fetch current chart data after sync
            if (selectedCountry && selectedIndicator) {
                setLoading(true);
                const response = await metricService.getMetricsSeries(selectedCountry, selectedIndicator);
                setChartData(response.data.data);
                setLoading(false);
            }
        } catch (err) {
            console.error("Sync failed:", err);
            setSyncMessage({ type: 'error', text: 'Synchronization failed. Please check the backend logs.' });
        } finally {
            setIsSyncing(false);
        }
    };

    const currentCountryName = countries.find(c => c.code === selectedCountry)?.name || selectedCountry;
    const currentIndicatorName = indicators.find(i => i.code === selectedIndicator)?.name || selectedIndicator;
    const chartTitle = selectedCountry && selectedIndicator
        ? `${currentIndicatorName} (${currentCountryName})`
        : 'Loading...';

    // Create a single series configuration for the Overview chart
    const chartSeries: ChartSeries[] = [{
        dataKey: 'value',
        name: currentCountryName,
        color: '#1d4ed8'
    }];

    // Client-side data filtering based on selected year range
    const filteredChartData = chartData.filter(point => {
        const pointYear = parseInt(point.year, 10);
        return pointYear >= startYear && pointYear <= endYear;
    });

    // Export the *filtered* data to CSV
    const handleExportCSV = () => {
        if (!filteredChartData || filteredChartData.length === 0) {
            alert("No data available to export.");
            return;
        }

        const headers = ['Year', 'Value'];
        const csvRows = [headers.join(',')];

        filteredChartData.forEach(row => {
            csvRows.push(`${row.year},${row.value}`);
        });

        const csvContent = "data:text/csv;charset=utf-8," + csvRows.join('\n');
        const encodedUri = encodeURI(csvContent);

        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "world_metrics_export.csv");

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="bg-white p-6 rounded shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-semibold text-wm-dark mb-2">Overview</h2>
                    <p className="text-slate-600">
                        Monitoring the World Bank's key indicators.
                    </p>
                </div>

                {userIsAdmin && (
                    <button
                        onClick={handleSyncData}
                        disabled={isSyncing}
                        className="bg-wm-primary hover:bg-wm-secondary text-white font-medium py-2 px-6 rounded transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[140px]"
                    >
                        {isSyncing ? 'Syncing...' : 'Sync Data'}
                    </button>
                )}
            </div>

            {/* Sync Status Messages */}
            {syncMessage && (
                <div className={`p-4 rounded border ${syncMessage.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
                    {syncMessage.text}
                </div>
            )}

            {/* Filters Section */}
            <div className="bg-white p-6 rounded shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 flex-wrap">
                <div className="flex-1 min-w-[150px]">
                    <label htmlFor="country-select" className="block text-sm font-medium text-slate-700 mb-1">
                        Country
                    </label>
                    <select
                        id="country-select"
                        value={selectedCountry}
                        onChange={(e) => setSelectedCountry(e.target.value)}
                        disabled={countries.length === 0}
                        className="w-full border border-slate-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-wm-primary focus:border-wm-primary disabled:bg-slate-100"
                    >
                        {countries.map((country) => (
                            <option key={country.code} value={country.code}>
                                {country.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex-1 min-w-[150px]">
                    <label htmlFor="indicator-select" className="block text-sm font-medium text-slate-700 mb-1">
                        Indicator
                    </label>
                    <select
                        id="indicator-select"
                        value={selectedIndicator}
                        onChange={(e) => setSelectedIndicator(e.target.value)}
                        disabled={indicators.length === 0}
                        className="w-full border border-slate-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-wm-primary focus:border-wm-primary disabled:bg-slate-100"
                    >
                        {indicators.map((indicator) => (
                            <option key={indicator.code} value={indicator.code}>
                                {indicator.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex-1 min-w-[150px]">
                    <label htmlFor="chart-type-select" className="block text-sm font-medium text-slate-700 mb-1">
                        Chart Type
                    </label>
                    <select
                        id="chart-type-select"
                        value={chartType}
                        onChange={(e) => setChartType(e.target.value as 'line' | 'bar' | 'area')}
                        className="w-full border border-slate-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-wm-primary focus:border-wm-primary"
                    >
                        {CHART_TYPES.map((type) => (
                            <option key={type.value} value={type.value}>
                                {type.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Client-side Range Slider */}
                <div className="flex-1 min-w-[250px] flex flex-col justify-center px-4">
                    <div className="flex justify-between items-center mb-4">
                        <label className="text-sm font-medium text-slate-700">
                            Year Range
                        </label>
                        <span className="text-sm font-bold text-wm-primary bg-blue-50 px-2 py-1 rounded">
                            {startYear} - {endYear}
                        </span>
                    </div>
                    <Slider
                        defaultValue={[startYear, endYear]}
                        min={2000}
                        max={previousYear}
                        step={1}
                        minStepsBetweenValues={1}
                        onValueChange={(values) => {
                            if (Array.isArray(values)) {
                                setStartYear(values[0]);
                                setEndYear(values[1]);
                            }
                        }}
                        className="w-full"
                    />
                </div>
            </div>

            {/* Chart Error Handling */}
            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded border border-red-200">
                    {error}
                </div>
            )}

            {/* Render Loading State or the Chart */}
            {loading ? (
                <div className="bg-white p-6 rounded shadow-sm border border-slate-200 h-96 flex items-center justify-center">
                    <div className="text-slate-500 font-medium animate-pulse">
                        Fetching data from the World Bank...
                    </div>
                </div>
            ) : !error && (
                <div className="grid grid-cols-1 gap-4">
                    <div className="flex justify-end">
                        <button
                            onClick={handleExportCSV}
                            className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded shadow-sm hover:bg-slate-50 hover:text-wm-primary font-medium text-sm transition-colors"
                        >
                            Export to CSV
                        </button>
                    </div>
                    <MetricChart
                        title={chartTitle}
                        data={filteredChartData}
                        series={chartSeries}
                        chartType={chartType}
                    />
                </div>
            )}
        </div>
    );
};

export default Dashboard;