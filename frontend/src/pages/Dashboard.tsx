import React from 'react';

const Dashboard: React.FC = () => {
    return (
        <div className="bg-white p-6 rounded shadow-sm border border-slate-200">
            <h2 className="text-xl font-semibold text-wm-dark mb-4">Overview</h2>
            <p className="text-slate-600">Welcome! World Bank data will be displayed here.</p>
        </div>
    );
};

export default Dashboard;