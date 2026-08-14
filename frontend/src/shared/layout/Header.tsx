import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        console.log("Logging out...");
        navigate('/login');
    };

    return (
        <header className="bg-wm-dark text-white shadow-md w-full">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <Link to="/dashboard" className="text-2xl font-bold tracking-wide hover:text-wm-secondary transition-colors">
                    WorldMetrics
                </Link>
                <button
                    onClick={handleLogout}
                    className="bg-wm-primary hover:bg-wm-secondary text-white font-medium py-2 px-5 rounded cursor-pointer transition-colors"
                >
                    Logout
                </button>
            </div>
        </header>
    );
};

export default Header;