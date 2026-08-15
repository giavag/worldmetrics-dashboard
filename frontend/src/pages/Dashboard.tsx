import React, { useState, useEffect } from 'react';
import { metricService } from '../services/metricService';
import { etlService } from '../services/etlService';
import { authService } from '../services/authService';
import { dimensionService, type DimensionItem } from '../services/dimensionService';
import type {MetricDataPoint} from '../types/metrics';
import MetricChart from '../components/MetricChart';

const CHART_TYPES = [
    { value: 'line', label: 'Line Chart' },
    { value: 'bar', label: 'Bar Chart' },
    { value: 'area', label: 'Area Chart' }
];

const Dashboard: React.FC = () => {
    // 1. Dimension (Filter) States
    const [countries, setCountries] = useState<DimensionItem[]>([]);
    const [indicators, setIndicators] = useState<DimensionItem[]>([]);

    // 2. Selection States
    const [selectedCountry, setSelectedCountry] = useState<string>('');
    const [selectedIndicator, setSelectedIndicator] = useState<string>('');
    const [chartType, setChartType] = useState<'line' | 'bar' | 'area'>('line');

    // 3. Chart Data State
    const [chartData, setChartData] = useState<MetricDataPoint[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // 4. ETL Sync State
    const [isSyncing, setIsSyncing] = useState<boolean>(false);
    const [syncMessage, setSyncMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // 5. Authorization Check
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
                setChartData(response.data);
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
                setChartData(response.data);
                setLoading(false);
            }
        } catch (err) {
            console.error("Sync failed:", err);
            setSyncMessage({ type: 'error', text: 'Synchronization failed. Please check the backend logs.' });
        } finally {
            setIsSyncing(false);
        }
    };

    // Determine the dynamic chart title safely
    const currentCountryName = countries.find(c => c.code === selectedCountry)?.name || selectedCountry;
    const currentIndicatorName = indicators.find(i => i.code === selectedIndicator)?.name || selectedIndicator;
    const chartTitle = selectedCountry && selectedIndicator
        ? `${currentIndicatorName} (${currentCountryName})`
        : 'Loading...';

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
            <div className="bg-white p-6 rounded shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
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

                <div className="flex-1">
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

                <div className="flex-1">
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
                <div className="grid grid-cols-1 gap-6">
                    <MetricChart
                        title={chartTitle}
                        data={chartData}
                        color="#1d4ed8"
                        chartType={chartType}
                    />
                </div>
            )}
        </div>
    );
};

export default Dashboard;