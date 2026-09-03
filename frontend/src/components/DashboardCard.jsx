import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const DashboardCard = ({
  title,
  count = 0,
  description,
  icon: Icon,
  path,
  color = 'var(--accent-primary)',
}) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(path)}
      className="glass-card animate-slide-up"
      style={{
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '210px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Accent Glow */}
      <div
        style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '130px',
          height: '130px',
          borderRadius: '50%',
          background: color,
          opacity: 0.12,
          filter: 'blur(30px)',
          pointerEvents: 'none',
        }}
      />

      <div>
        {/* Top Bar: Icon and Count Badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: `rgba(255, 255, 255, 0.05)`,
              border: `1px solid ${color}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: color,
            }}
          >
            {Icon && <Icon size={24} />}
          </div>
          <span
            style={{
              fontSize: '1.75rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
            }}
          >
            {count}
          </span>
        </div>

        {/* Title & Description */}
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
          {title}
        </h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          {description}
        </p>
      </div>

      {/* Footer Navigation Trigger */}
      <div
        style={{
          marginTop: '1.5rem',
          paddingTop: '0.85rem',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.85rem',
          fontWeight: 600,
          color: color,
        }}
      >
        <span>Manage & View</span>
        <ArrowRight size={16} />
      </div>
    </div>
  );
};

export default DashboardCard;
