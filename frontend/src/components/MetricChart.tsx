import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import type {MetricDataPoint} from '../types/metrics';

interface MetricChartProps {
    data: MetricDataPoint[];
    title: string;
    color?: string;
}

const MetricChart: React.FC<MetricChartProps> = ({ data, title, color = "#1d4ed8" }) => {

    if (!data || data.length === 0) {
        return (
            <div className="bg-white p-6 rounded shadow-sm border border-slate-200 h-96 flex items-center justify-center">
                <p className="text-slate-500">Loading chart data...</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-wm-dark mb-6">{title}</h3>

            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis
                            dataKey="year"
                            tick={{ fill: '#64748b', fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                            dy={10}
                        />
                        <YAxis
                            tick={{ fill: '#64748b', fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                            width={80}
                            tickFormatter={(value) => new Intl.NumberFormat('en-US', { notation: "compact", compactDisplay: "short" }).format(value)}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            formatter={(value: any) => new Intl.NumberFormat('en-US').format(Number(value))}
                            labelStyle={{ color: '#0f172a', fontWeight: 'bold', marginBottom: '4px' }}
                        />
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke={color}
                            strokeWidth={3}
                            dot={{ r: 0 }}
                            activeDot={{ r: 6, fill: color, stroke: '#fff', strokeWidth: 2 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default MetricChart;