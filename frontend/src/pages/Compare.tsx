import React, { useState, useEffect } from 'react';
import { metricService } from '../services/metricService';
import { etlService } from '../services/etlService';
import { authService } from '../services/authService';
import { dimensionService, type DimensionItem } from '../services/dimensionService';
import MetricChart, {type ChartSeries } from '../components/MetricChart';
import { savedWidgetService } from '../services/savedWidgetService';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

const CHART_TYPES = [
    { value: 'line', label: 'Line Chart' },
    { value: 'bar', label: 'Bar Chart' },
    { value: 'area', label: 'Area Chart' }
];

const CHART_COLORS = ['#1d4ed8', '#059669', '#dc2626', '#d97706', '#7c3aed', '#db2777'];

const Compare: React.FC = () => {
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [countries, setCountries] = useState<DimensionItem[]>([]);
    const [indicators, setIndicators] = useState<DimensionItem[]>([]);

    // Change selectedCountry to an array
    const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
    const [selectedIndicator, setSelectedIndicator] = useState<string>('');
    const [chartType, setChartType] = useState<'line' | 'bar' | 'area'>('line');

    const [chartData, setChartData] = useState<any[]>([]);
    const [chartSeries, setChartSeries] = useState<ChartSeries[]>([]);

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [isSyncing, setIsSyncing] = useState<boolean>(false);
    const [syncMessage, setSyncMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const userIsAdmin = authService.isAdmin();

    useEffect(() => {
        const fetchDimensions = async () => {
            try {
                const [countriesData, indicatorsData] = await Promise.all([
                    dimensionService.getCountries(),
                    dimensionService.getIndicators()
                ]);

                setCountries(countriesData);
                setIndicators(indicatorsData);

                if (countriesData.length > 0) setSelectedCountries([countriesData[0].code]);
                if (indicatorsData.length > 0) setSelectedIndicator(indicatorsData[0].code);

            } catch (err) {
                console.error("Failed to fetch dimensions:", err);
                setError("Failed to load filter options.");
            }
        };
        fetchDimensions();
    }, []);

    useEffect(() => {
        const fetchMetrics = async () => {
            if (selectedCountries.length === 0 || !selectedIndicator) return;

            try {
                setLoading(true);
                const responseData = await metricService.getCompareMetricsSeries(selectedCountries, selectedIndicator);

                const yearMap = new Map<string, any>();
                const newSeries: ChartSeries[] = [];

                responseData.forEach((countryData: any, index: number) => {
                    const color = CHART_COLORS[index % CHART_COLORS.length];

                    newSeries.push({
                        dataKey: countryData.countryIsoCode,
                        name: countryData.countryName,
                        color: color
                    });

                    countryData.data.forEach((point: { year: string, value: number }) => {
                        if (!yearMap.has(point.year)) {
                            yearMap.set(point.year, { year: point.year });
                        }
                        const yearData = yearMap.get(point.year);
                        yearData[countryData.countryIsoCode] = point.value;
                    });
                });

                const pivotedData = Array.from(yearMap.values()).sort((a, b) => a.year.localeCompare(b.year));

                setChartData(pivotedData);
                setChartSeries(newSeries);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch metrics:", err);
                setError("Failed to load chart data. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchMetrics();
    }, [selectedCountries, selectedIndicator]);

    const handleSyncData = async () => {
        try {
            setIsSyncing(true);
            setSyncMessage(null);

            await etlService.syncAllData();

            setSyncMessage({ type: 'success', text: 'Data synchronization completed successfully!' });

            setSelectedCountries([...selectedCountries]);
        } catch (err) {
            console.error("Sync failed:", err);
            setSyncMessage({ type: 'error', text: 'Synchronization failed. Please check the backend logs.' });
        } finally {
            setIsSyncing(false);
        }
    };

    const handleSaveWidget = async () => {
        if (selectedCountries.length === 0 || !selectedIndicator) return;

        try {
            setIsSaving(true);
            await savedWidgetService.saveWidget({
                title: `${currentIndicatorName} - Comparison`, // Φτιάχνουμε έναν ωραίο τίτλο
                countries: selectedCountries.join(','),
                indicatorCode: selectedIndicator,
                chartType: chartType
            });
            alert("Widget saved successfully to My Dashboards!");
        } catch (err) {
            console.error("Failed to save widget:", err);
            alert("Failed to save widget. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
        if (selectedOptions.length <= 5) {
            setSelectedCountries(selectedOptions);
        } else {
            alert("You can compare up to 5 countries at once.");
        }
    };

    const currentIndicatorName = indicators.find(i => i.code === selectedIndicator)?.name || selectedIndicator;
    const chartTitle = selectedIndicator ? `${currentIndicatorName} (Comparison)` : 'Loading...';

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="bg-white p-6 rounded shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-semibold text-wm-dark mb-2">Compare Analysis</h2>
                    <p className="text-slate-600">Hold Ctrl/Cmd to select multiple countries.</p>
                </div>

                <div className="flex gap-3">
                    <Button
                        onClick={handleSaveWidget}
                        disabled={isSaving || selectedCountries.length === 0 || !selectedIndicator}
                        className="flex items-center gap-2"
                    >
                        <Save className="w-4 h-4" />
                        {isSaving ? 'Saving...' : 'Save to Dashboard'}
                    </Button>

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
            </div>

            {syncMessage && (
                <div className={`p-4 rounded border ${syncMessage.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
                    {syncMessage.text}
                </div>
            )}

            {/* Filters Section */}
            <div className="bg-white p-6 rounded shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        Countries (Select up to 5)
                    </label>
                    <select
                        multiple
                        value={selectedCountries}
                        onChange={handleCountryChange}
                        disabled={countries.length === 0}
                        className="w-full h-24 border border-slate-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-wm-primary disabled:bg-slate-100"
                    >
                        {countries.map((country) => (
                            <option key={country.code} value={country.code}>
                                {country.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex-1 flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Indicator</label>
                        <select
                            value={selectedIndicator}
                            onChange={(e) => setSelectedIndicator(e.target.value)}
                            disabled={indicators.length === 0}
                            className="w-full border border-slate-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-wm-primary"
                        >
                            {indicators.map((indicator) => (
                                <option key={indicator.code} value={indicator.code}>{indicator.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Chart Type</label>
                        <select
                            value={chartType}
                            onChange={(e) => setChartType(e.target.value as 'line' | 'bar' | 'area')}
                            className="w-full border border-slate-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-wm-primary"
                        >
                            {CHART_TYPES.map((type) => (
                                <option key={type.value} value={type.value}>{type.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="bg-white p-6 rounded shadow-sm h-96 flex items-center justify-center">
                    <div className="text-slate-500 animate-pulse">Fetching comparison data...</div>
                </div>
            ) : !error && (
                <div className="grid grid-cols-1 gap-4">
                    <MetricChart
                        title={chartTitle}
                        data={chartData}
                        series={chartSeries}
                        chartType={chartType}
                    />
                </div>
            )}
        </div>
    );
};

export default Compare;