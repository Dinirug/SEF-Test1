import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import DashboardCard from '../../components/DashboardCard';
import { LoadingSpinner } from '../../components/LoadingState';
import ErrorAlert from '../../components/ErrorAlert';
import api from '../../services/api';
import { FolderKanban, FileText, CreditCard, BarChart3, Sparkles } from 'lucide-react';

const AdminDashboard = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSummary = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/GenericItems');
      setItems(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch items summary from backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const counts = {
    management: items.filter((i) => i.category?.toLowerCase() === 'management').length,
    records: items.filter((i) => i.category?.toLowerCase() === 'records').length,
    transactions: items.filter((i) => i.category?.toLowerCase() === 'transactions').length,
    reports: items.filter((i) => i.category?.toLowerCase() === 'reports').length,
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Navbar title="Admin Command Dashboard" />
        <main className="page-wrapper animate-fade-in">
          {/* Welcome Banner */}
          <div
            className="glass-panel"
            style={{
              padding: '2rem',
              marginBottom: '2rem',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(17, 24, 39, 0.7) 100%)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                <Sparkles size={16} />
                <span>SEFF STARTER CONTROL CENTER</span>
              </div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                System Administration Overview
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.35rem', maxWidth: '650px' }}>
                Manage all generic system modules below. Changes submitted here immediately persist to PostgreSQL via ASP.NET Core API and EF Core.
              </p>
            </div>
          </div>

          <ErrorAlert message={error} onClose={() => setError(null)} />

          {loading ? (
            <LoadingSpinner text="Fetching real-time backend statistics..." />
          ) : (
            <>
              {/* 4 Large Clickable Cards in a 2x2 Grid */}
              <div className="grid-2x2" style={{ marginBottom: '2.5rem' }}>
                <DashboardCard
                  title="1. Management"
                  count={counts.management}
                  description="Configure core system rules, user preferences, and module configurations."
                  icon={FolderKanban}
                  path="/admin/management"
                  color="var(--accent-primary)"
                />

                <DashboardCard
                  title="2. Records"
                  count={counts.records}
                  description="Access persistent data records, activity logs, and system audit history."
                  icon={FileText}
                  path="/admin/records"
                  color="var(--accent-emerald)"
                />

                <DashboardCard
                  title="3. Transactions"
                  count={counts.transactions}
                  description="Monitor active transactions, financial allocations, and flow history."
                  icon={CreditCard}
                  path="/admin/transactions"
                  color="var(--accent-amber)"
                />

                <DashboardCard
                  title="4. Reports"
                  count={counts.reports}
                  description="Generate analytical summaries, performance reports, and system insights."
                  icon={BarChart3}
                  path="/admin/reports"
                  color="var(--accent-cyan)"
                />
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
