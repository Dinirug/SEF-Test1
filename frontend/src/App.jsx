import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManagementPage from './pages/admin/ManagementPage';
import RecordsPage from './pages/admin/RecordsPage';
import TransactionsPage from './pages/admin/TransactionsPage';
import ReportsPage from './pages/admin/ReportsPage';
import UserDashboard from './pages/user/UserDashboard';

// Helper component for Root Route redirect
const RootRedirect = () => {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role === 'Admin') return <Navigate to="/admin/dashboard" replace />;
  return <Navigate to="/user/dashboard" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/management" element={<ManagementPage />} />
            <Route path="/admin/records" element={<RecordsPage />} />
            <Route path="/admin/transactions" element={<TransactionsPage />} />
            <Route path="/admin/reports" element={<ReportsPage />} />
          </Route>

          {/* Protected User Routes */}
          <Route element={<ProtectedRoute allowedRoles={['User', 'Admin']} />}>
            <Route path="/user/dashboard" element={<UserDashboard />} />
          </Route>

          {/* Root and Catch-All Redirection */}
          <Route path="/" element={<RootRedirect />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
