import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        console.log("Logging out...");
        navigate('/login');
    };

    return (
        <div style={{ padding: '2rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>📊 My Dashboard</h1>
                <button onClick={handleLogout} style={{ backgroundColor: '#ff4d4f', color: 'white', border: 'none', padding: '0.5rem 1rem', cursor: 'pointer' }}>
                    Logout
                </button>
            </header>

            <hr />

            <main style={{ marginTop: '2rem' }}>
                <p>Welcome! World Bank data will be displayed here.</p>
            </main>
        </div>
    );
};

export default Dashboard;