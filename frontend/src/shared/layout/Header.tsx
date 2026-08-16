import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';

const Header: React.FC = () => {
    const navigate = useNavigate();
    const isAdmin = authService.isAdmin();

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    return (
        <header className="bg-wm-dark text-white shadow-md w-full">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">

                <div className="flex items-center gap-8">
                    <Link to="/dashboard" className="text-2xl font-bold tracking-wide hover:text-wm-secondary transition-colors">
                        WorldMetrics
                    </Link>

                    <nav className="hidden sm:flex gap-5 text-sm font-medium mt-1 text-slate-200">
                        <Link to="/dashboard" className="hover:text-white transition-colors">
                            Dashboard
                        </Link>

                        {isAdmin && (
                            <Link to="/admin" className="hover:text-white transition-colors">
                                Admin Panel
                            </Link>
                        )}
                    </nav>
                </div>

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