import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

const App: React.FC = () => {
  return (
      <BrowserRouter>
        <Routes>
          {/* Default route redirecting to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Public Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Route (For now it's just a simple route, later we will add a Route Guard) */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Catch-all route for undefined paths - redirects to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
  );
};

export default App;