import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar: React.FC = () => {
    return (
        <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col min-h-full">
            <div className="p-4 flex-1">
                <nav className="space-y-2">
                    <NavLink
                        to="/dashboard"
                        end
                        className={({ isActive }) =>
                            `block px-4 py-2 rounded transition-colors ${
                                isActive
                                    ? 'bg-wm-primary text-white font-medium shadow-sm'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'
                            }`
                        }
                    >
                        Overview
                    </NavLink>

                    {/* Analysis Section */}
                    <div className="pt-4 mt-4 border-t border-slate-100">
                        <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                            Analysis
                        </p>

                        <NavLink
                            to="/compare"
                            className={({ isActive }) =>
                                `block px-4 py-2 rounded transition-colors ${
                                    isActive
                                        ? 'bg-wm-primary text-white font-medium shadow-sm'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'
                                }`
                            }
                        >
                            Compare
                        </NavLink>

                        <span className="block px-4 py-2 text-slate-400 cursor-not-allowed font-medium mt-1">
                            My Dashboards (Coming Soon)
                        </span>
                    </div>
                </nav>
            </div>

            <div className="p-4 border-t border-slate-200">
                <div className="text-xs text-slate-500 text-center">
                    WorldMetrics BI v1.0
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;