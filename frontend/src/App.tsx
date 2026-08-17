import React, {type JSX} from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Compare from './pages/Compare'; // Προσθήκη του νέου Component
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
                        {/* Η βασική σελίδα (Single Country) */}
                        <Route path="/dashboard" element={<Dashboard />} />

                        {/* Η νέα σελίδα σύγκρισης (Multiple Countries) */}
                        <Route path="/compare" element={<Compare />} />

                        {/* Protected Route (Requires ADMIN role) */}
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

                {/* Fallback for unknown URLs */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;