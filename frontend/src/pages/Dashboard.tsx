import React, { useState, useEffect } from 'react';
import { metricService } from '../services/metricService';
import { etlService } from '../services/etlService';
import { authService } from '../services/authService';
import type {MetricDataPoint} from '../types/metrics';
import MetricChart from '../components/MetricChart';

const Dashboard: React.FC = () => {
    // 1. Chart Data State
    const [chartData, setChartData] = useState<MetricDataPoint[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // 2. ETL Sync State
    const [isSyncing, setIsSyncing] = useState<boolean>(false);
    const [syncMessage, setSyncMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // 3. Authorization Check
    const userIsAdmin = authService.isAdmin();

    // Fetch initial chart data
    const fetchMetrics = async () => {
        try {
            setLoading(true);
            const response = await metricService.getMetricsSeries("GRC", "NY.GDP.MKTP.CD");
            setChartData(response.data);
            setError(null);
        } catch (err) {
            console.error("Failed to fetch metrics:", err);
            setError("Failed to load data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMetrics();
    }, []);

    // Handle ETL Sync execution
    const handleSyncData = async () => {
        try {
            setIsSyncing(true);
            setSyncMessage(null);

            await etlService.syncAllData();

            setSyncMessage({ type: 'success', text: 'Data synchronization completed successfully!' });
            await fetchMetrics();
        } catch (err) {
            console.error("Sync failed:", err);
            setSyncMessage({ type: 'error', text: 'Synchronization failed. Please check the backend logs.' });
        } finally {
            setIsSyncing(false);
        }
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

                {/* Render the Sync Button ONLY if the user is an ADMIN */}
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
                        title="Gross Domestic Product (Greece)"
                        data={chartData}
                        color="#1d4ed8"
                    />
                </div>
            )}
        </div>
    );
};

export default Dashboard;