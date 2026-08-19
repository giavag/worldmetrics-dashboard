import React from 'react';
import {
    LineChart, Line,
    BarChart, Bar,
    AreaChart, Area,
    XAxis, YAxis, CartesianGrid
} from 'recharts';
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
    type ChartConfig
} from '@/components/ui/chart';

export interface ChartSeries {
    dataKey: string;
    name: string;
    color: string;
}

interface MetricChartProps {
    data: any[];
    series: ChartSeries[];
    title: string;
    chartType?: 'line' | 'bar' | 'area';
}

const MetricChart: React.FC<MetricChartProps> = ({
                                                     data,
                                                     series,
                                                     title,
                                                     chartType = 'line'
                                                 }) => {

    if (!data || data.length === 0 || !series || series.length === 0) {
        return (
            <div className="bg-white p-6 rounded shadow-sm border border-slate-200 h-96 flex items-center justify-center">
                <p className="text-slate-500">No data available for the selected criteria.</p>
            </div>
        );
    }

    const chartConfig: ChartConfig = {};
    series.forEach((s) => {
        chartConfig[s.dataKey] = {
            label: s.name,
            color: s.color,
        };
    });

    const yAxisFormatter = (value: number) =>
        new Intl.NumberFormat('en-US', { notation: "compact", compactDisplay: "short" }).format(value);

    const renderChart = () => {
        switch (chartType) {
            case 'bar':
                return (
                    <BarChart data={data} accessibilityLayer margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="year" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} dy={10} tickMargin={10} />
                        <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} width={50} tickFormatter={yAxisFormatter} />

                        <ChartTooltip content={<ChartTooltipContent />} />
                        <ChartLegend content={<ChartLegendContent />} />

                        {series.map((s) => (
                            <Bar
                                key={s.dataKey}
                                dataKey={s.dataKey}
                                fill={`var(--color-${s.dataKey})`}
                                radius={[4, 4, 0, 0]}
                            />
                        ))}
                    </BarChart>
                );

            case 'area':
                return (
                    <AreaChart data={data} accessibilityLayer margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="year" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} dy={10} tickMargin={10} />
                        <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} width={50} tickFormatter={yAxisFormatter} />

                        <ChartTooltip content={<ChartTooltipContent />} />
                        <ChartLegend content={<ChartLegendContent />} />

                        {series.map((s) => (
                            <Area
                                key={s.dataKey}
                                type="monotone"
                                dataKey={s.dataKey}
                                stroke={`var(--color-${s.dataKey})`}
                                fill={`var(--color-${s.dataKey})`}
                                fillOpacity={0.2}
                                strokeWidth={3}
                            />
                        ))}
                    </AreaChart>
                );

            case 'line':
            default:
                return (
                    <LineChart data={data} accessibilityLayer margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="year" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} dy={10} tickMargin={10} />
                        <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} width={50} tickFormatter={yAxisFormatter} />

                        <ChartTooltip content={<ChartTooltipContent />} />
                        <ChartLegend content={<ChartLegendContent />} />

                        {series.map((s) => (
                            <Line
                                key={s.dataKey}
                                type="monotone"
                                dataKey={s.dataKey}
                                stroke={`var(--color-${s.dataKey})`}
                                strokeWidth={3}
                                dot={{ r: 0 }}
                                activeDot={{ r: 6, fill: `var(--color-${s.dataKey})`, stroke: '#fff', strokeWidth: 2 }}
                            />
                        ))}
                    </LineChart>
                );
        }
    };

    return (
        <div className="bg-white p-6 rounded shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-wm-dark mb-6">{title}</h3>
            {/* Αντικατάσταση του ResponsiveContainer με το ChartContainer του shadcn */}
            <ChartContainer config={chartConfig} className="h-80 w-full">
                {renderChart()}
            </ChartContainer>
        </div>
    );
};

export default MetricChart;