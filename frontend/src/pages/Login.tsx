import React from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
    const navigate = useNavigate();

    // Temporary navigation function (mock login)
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Simulating login...");
        navigate('/dashboard');
    };

    return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h1>WorldMetrics Dashboard</h1>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div style={{ marginBottom: '1rem' }}>
                    <input type="email" placeholder="Email" required />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <input type="password" placeholder="Password" required />
                </div>
                <button type="submit">Sign In</button>
            </form>
        </div>
    );
};

export default Login;