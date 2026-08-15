import React from 'react';
import {
    LineChart, Line,
    BarChart, Bar,
    AreaChart, Area,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import type {MetricDataPoint} from '../types/metrics';

interface MetricChartProps {
    data: MetricDataPoint[];
    title: string;
    color?: string;
    // Added chartType prop to support dynamic rendering
    chartType?: 'line' | 'bar' | 'area';
}

const MetricChart: React.FC<MetricChartProps> = ({
                                                     data,
                                                     title,
                                                     color = "#1d4ed8",
                                                     chartType = 'line' // Default to line chart if not provided
                                                 }) => {

    // Loading state handler
    if (!data || data.length === 0) {
        return (
            <div className="bg-white p-6 rounded shadow-sm border border-slate-200 h-96 flex items-center justify-center">
                <p className="text-slate-500">Loading chart data...</p>
            </div>
        );
    }

    // Formatter function for the Tooltip to handle Recharts typing safely
    const formatTooltipValue = (value: any) => {
        return new Intl.NumberFormat('en-US').format(Number(value));
    };

    // Helper function to render the correct chart type based on the prop
    const renderChart = () => {
        switch (chartType) {
            case 'bar':
                return (
                    <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="year" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} dy={10}/>
                        <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} width={80} tickFormatter={(value) => new Intl.NumberFormat('en-US', { notation: "compact", compactDisplay: "short" }).format(value)} />
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            formatter={formatTooltipValue}
                            labelStyle={{ color: '#0f172a', fontWeight: 'bold', marginBottom: '4px' }}
                        />
                        <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} />
                    </BarChart>
                );

            case 'area':
                return (
                    <AreaChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="year" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} dy={10}/>
                        <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} width={80} tickFormatter={(value) => new Intl.NumberFormat('en-US', { notation: "compact", compactDisplay: "short" }).format(value)} />
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            formatter={formatTooltipValue}
                            labelStyle={{ color: '#0f172a', fontWeight: 'bold', marginBottom: '4px' }}
                        />
                        <Area type="monotone" dataKey="value" stroke={color} fill={color} fillOpacity={0.2} strokeWidth={3} />
                    </AreaChart>
                );

            case 'line':
            default:
                return (
                    <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="year" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} dy={10}/>
                        <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} width={80} tickFormatter={(value) => new Intl.NumberFormat('en-US', { notation: "compact", compactDisplay: "short" }).format(value)} />
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            formatter={formatTooltipValue}
                            labelStyle={{ color: '#0f172a', fontWeight: 'bold', marginBottom: '4px' }}
                        />
                        <Line type="monotone" dataKey="value" stroke={color} strokeWidth={3} dot={{ r: 0 }} activeDot={{ r: 6, fill: color, stroke: '#fff', strokeWidth: 2 }} />
                    </LineChart>
                );
        }
    };

    return (
        <div className="bg-white p-6 rounded shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-wm-dark mb-6">{title}</h3>

            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    {renderChart()}
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default MetricChart;