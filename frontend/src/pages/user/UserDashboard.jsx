import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import DataTable from '../../components/DataTable';
import { LoadingSpinner } from '../../components/LoadingState';
import ErrorAlert from '../../components/ErrorAlert';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Eye, Layers, Filter, CheckCircle } from 'lucide-react';

const UserDashboard = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const fetchUserItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = selectedCategory === 'all'
        ? '/GenericItems'
        : `/GenericItems?category=${selectedCategory}`;
      const response = await api.get(url);
      setItems(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to retrieve system records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserItems();
  }, [selectedCategory]);

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'management', label: 'Management' },
    { id: 'records', label: 'Records' },
    { id: 'transactions', label: 'Transactions' },
    { id: 'reports', label: 'Reports' },
  ];

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Navbar title="User Portal Dashboard" />
        <main className="page-wrapper animate-fade-in">
          {/* Welcome User Banner */}
          <div
            className="glass-panel"
            style={{
              padding: '1.75rem',
              marginBottom: '2rem',
              background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(17, 24, 39, 0.7) 100%)',
              border: '1px solid rgba(6, 182, 212, 0.3)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-cyan)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>
              <Eye size={16} />
              <span>LIVE DATA FEED</span>
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Welcome, {user?.fullName || 'User'}!
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              Browse and review live records, transactions, and reports created and updated by the Administrator.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              overflowX: 'auto',
              paddingBottom: '0.5rem',
              marginBottom: '1.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, paddingRight: '0.5rem' }}>
              <Filter size={16} /> Filter:
            </div>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className="btn"
                style={{
                  padding: '0.5rem 1rem',
                  fontSize: '0.85rem',
                  borderRadius: '9999px',
                  background: selectedCategory === cat.id ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.05)',
                  color: selectedCategory === cat.id ? '#ffffff' : 'var(--text-secondary)',
                  border: selectedCategory === cat.id ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
                  fontWeight: selectedCategory === cat.id ? 700 : 500,
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <ErrorAlert message={error} onClose={() => setError(null)} />

          {loading ? (
            <LoadingSpinner text="Fetching backend data..." />
          ) : (
            <DataTable
              items={items}
              title={`System ${selectedCategory.toUpperCase()} View`}
              category={selectedCategory}
              isAdmin={false}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
