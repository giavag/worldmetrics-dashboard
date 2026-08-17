import React from 'react';
import {
    LineChart, Line,
    BarChart, Bar,
    AreaChart, Area,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

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

    const formatTooltipValue = (value: any) => {
        return new Intl.NumberFormat('en-US').format(Number(value));
    };

    const renderChart = () => {
        switch (chartType) {
            case 'bar':
                return (
                    <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="year" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} dy={10}/>
                        <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} width={80} tickFormatter={(value) => new Intl.NumberFormat('en-US', { notation: "compact", compactDisplay: "short" }).format(value)} />
                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} formatter={formatTooltipValue} labelStyle={{ color: '#0f172a', fontWeight: 'bold', marginBottom: '4px' }} />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                        {series.map((s) => (
                            <Bar key={s.dataKey} dataKey={s.dataKey} name={s.name} fill={s.color} radius={[4, 4, 0, 0]} />
                        ))}
                    </BarChart>
                );

            case 'area':
                return (
                    <AreaChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="year" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} dy={10}/>
                        <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} width={80} tickFormatter={(value) => new Intl.NumberFormat('en-US', { notation: "compact", compactDisplay: "short" }).format(value)} />
                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} formatter={formatTooltipValue} labelStyle={{ color: '#0f172a', fontWeight: 'bold', marginBottom: '4px' }} />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                        {series.map((s) => (
                            <Area key={s.dataKey} type="monotone" dataKey={s.dataKey} name={s.name} stroke={s.color} fill={s.color} fillOpacity={0.2} strokeWidth={3} />
                        ))}
                    </AreaChart>
                );

            case 'line':
            default:
                return (
                    <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="year" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} dy={10}/>
                        <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} width={80} tickFormatter={(value) => new Intl.NumberFormat('en-US', { notation: "compact", compactDisplay: "short" }).format(value)} />
                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} formatter={formatTooltipValue} labelStyle={{ color: '#0f172a', fontWeight: 'bold', marginBottom: '4px' }} />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                        {series.map((s) => (
                            <Line key={s.dataKey} type="monotone" dataKey={s.dataKey} name={s.name} stroke={s.color} strokeWidth={3} dot={{ r: 0 }} activeDot={{ r: 6, fill: s.color, stroke: '#fff', strokeWidth: 2 }} />
                        ))}
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