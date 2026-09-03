import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner = ({ text = 'Loading data...' }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem',
      gap: '1rem',
      color: 'var(--text-secondary)',
    }}
  >
    <Loader2 className="animate-spin" size={36} style={{ color: 'var(--accent-primary)' }} />
    <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>{text}</span>
  </div>
);

export const SkeletonRow = ({ rows = 4 }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1rem' }}>
    {Array.from({ length: rows }).map((_, index) => (
      <div
        key={index}
        style={{
          height: '40px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '8px',
          animation: 'fadeIn 0.6s infinite alternate',
        }}
      />
    ))}
  </div>
);
