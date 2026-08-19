import React, {type JSX} from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Compare from './pages/Compare';
import { MyDashboards } from './pages/MyDashboards';
import AdminPanel from './pages/AdminPanel';
import Layout from './shared/layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Register from './pages/Register';
import { authService } from './services/authService';

const AdminRoute = ({ children }: { children: JSX.Element }) => {
    return authService.isAdmin() ? children : <Navigate to="/dashboard" replace />;
};

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Routes */}
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />

                {/* Protected Routes (Require single Login) */}
                <Route element={<ProtectedRoute />}>
                    <Route element={<Layout />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/compare" element={<Compare />} />

                        <Route path="/dashboards" element={<MyDashboards />} />

                        <Route
                            path="/admin"
                            element={
                                <AdminRoute>
                                    <AdminPanel />
                                </AdminRoute>
                            }
                        />
                    </Route>
                </Route>

                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;