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

                    <div className="pt-4 mt-4 border-t border-slate-100">

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

                        <NavLink
                            to="/dashboards"
                            className={({ isActive }) =>
                                `block px-4 py-2 rounded transition-colors mt-1 ${
                                    isActive
                                        ? 'bg-wm-primary text-white font-medium shadow-sm'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'
                                }`
                            }
                        >
                            My Dashboards
                        </NavLink>
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