import React, { useEffect, useState } from 'react';
import type {SavedWidgetResponse} from '../types/savedWidget';
import { CartesianGrid, Line, LineChart, Bar, BarChart, Area, AreaChart, XAxis, YAxis } from 'recharts';
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
    type ChartConfig
} from '@/components/ui/chart';
import { metricService } from '../services/metricService';

const CHART_COLORS = ['#1d4ed8', '#059669', '#dc2626', '#d97706', '#7c3aed', '#db2777'];

interface DashboardWidgetProps {
    widget: SavedWidgetResponse;
}

export const DashboardWidget: React.FC<DashboardWidgetProps> = ({ widget }) => {
    const [chartData, setChartData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [chartConfig, setChartConfig] = useState<ChartConfig>({});

    useEffect(() => {
        const fetchWidgetData = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const countriesArray = widget.countries.split(',');
                const apiResponse = await metricService.getCompareMetricsSeries(
                    countriesArray,
                    widget.indicatorCode
                );

                const dataByYear = new Map<string, any>();

                apiResponse.forEach(series => {
                    const countryIso = series.countryIsoCode;

                    series.data.forEach(point => {
                        if (!dataByYear.has(point.year)) {
                            dataByYear.set(point.year, { year: point.year });
                        }
                        const yearData = dataByYear.get(point.year);
                        yearData[countryIso] = point.value;
                    });
                });

                const finalChartData = Array.from(dataByYear.values())
                    .sort((a, b) => parseInt(a.year) - parseInt(b.year));

                const startYear = widget.startYear ?? 2000;
                const endYear = widget.endYear ?? new Date().getFullYear() - 1;

                const filteredChartData = finalChartData.filter(point => {
                    const pointYear = parseInt(point.year, 10);
                    return pointYear >= startYear && pointYear <= endYear;
                });

                setChartData(filteredChartData);

                const newConfig: ChartConfig = {};
                apiResponse.forEach((series, index) => {
                    newConfig[series.countryIsoCode] = {
                        label: series.countryName,
                        color: CHART_COLORS[index % CHART_COLORS.length],
                    };
                });

                setChartConfig(newConfig);
            } catch (err) {
                console.error("Failed to fetch widget data:", err);
                setError("Could not load chart data.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchWidgetData();
    }, [widget]);

    if (isLoading) return <div className="flex h-full items-center justify-center text-sm text-gray-500">Loading chart...</div>;
    if (error) return <div className="flex h-full items-center justify-center text-sm text-red-500">{error}</div>;
    if (!chartData.length) return <div className="flex h-full items-center justify-center text-sm text-gray-500">No data available</div>;

    const countriesArray = widget.countries.split(',');

    const formatYAxis = (value: number) => {
        if (value >= 1e12) return `${(value / 1e12).toFixed(1)}T`;
        if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
        if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
        if (value >= 1e3) return `${(value / 1e3).toFixed(1)}k`;
        return `${value}`;
    };

    const renderChart = () => {
        switch (widget.chartType.toLowerCase()) {
            case 'bar':
                return (
                    <BarChart data={chartData} accessibilityLayer>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis dataKey="year" tickLine={false} tickMargin={10} axisLine={false} />
                        <YAxis tickLine={false} axisLine={false} width={50} tickFormatter={formatYAxis} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <ChartLegend content={<ChartLegendContent />} />
                        {countriesArray.map((country) => (
                            <Bar key={country} dataKey={country} fill={`var(--color-${country})`} radius={4} />
                        ))}
                    </BarChart>
                );
            case 'area':
                return (
                    <AreaChart data={chartData} accessibilityLayer>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis dataKey="year" tickLine={false} tickMargin={10} axisLine={false} />
                        <YAxis tickLine={false} axisLine={false} width={50} tickFormatter={formatYAxis} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <ChartLegend content={<ChartLegendContent />} />
                        {countriesArray.map((country) => (
                            <Area key={country} type="monotone" dataKey={country} fill={`var(--color-${country})`} stroke={`var(--color-${country})`} fillOpacity={0.4} />
                        ))}
                    </AreaChart>
                );
            case 'line':
            default:
                return (
                    <LineChart data={chartData} accessibilityLayer>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis dataKey="year" tickLine={false} tickMargin={10} axisLine={false} />
                        <YAxis tickLine={false} axisLine={false} width={50} tickFormatter={formatYAxis} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <ChartLegend content={<ChartLegendContent />} />
                        {countriesArray.map((country) => (
                            <Line key={country} type="monotone" dataKey={country} stroke={`var(--color-${country})`} strokeWidth={2} dot={false} />
                        ))}
                    </LineChart>
                );
        }
    };

    return (
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
            {renderChart()}
        </ChartContainer>
    );
};