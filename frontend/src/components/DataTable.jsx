import React, { useState } from 'react';
import { Search, Edit3, Trash2, Plus, Calendar, User, Tag } from 'lucide-react';
import Button from './Button';

const DataTable = ({
  items = [],
  title = 'Data Records',
  category = '',
  onAddNew,
  onEdit,
  onDelete,
  isAdmin = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = items.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      item.title?.toLowerCase().includes(term) ||
      item.description?.toLowerCase().includes(term) ||
      item.status?.toLowerCase().includes(term) ||
      item.createdBy?.toLowerCase().includes(term)
    );
  });

  const getStatusBadge = (status) => {
    const s = status?.toLowerCase() || '';
    if (s === 'active' || s === 'completed') return 'badge-active';
    if (s === 'pending') return 'badge-pending';
    return 'badge-user';
  };

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
      {/* Header & Actions */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '1.25rem',
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {title}
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Showing {filteredItems.length} of {items.length} total entries
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Search Input */}
          <div style={{ position: 'relative', minWidth: '240px' }}>
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
              }}
            />
            <input
              type="text"
              placeholder="Search records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '2.4rem', paddingAbove: '0.5rem', paddingBottom: '0.5rem', fontSize: '0.85rem' }}
            />
          </div>

          {/* Add New Button for Admin */}
          {isAdmin && onAddNew && (
            <Button variant="primary" icon={Plus} onClick={onAddNew}>
              Add {category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Item'}
            </Button>
          )}
        </div>
      </div>

      {/* Table Area */}
      <div className="table-responsive">
        {filteredItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-secondary)' }}>
            <Tag size={40} style={{ margin: '0 auto 0.75rem', opacity: 0.4, color: 'var(--accent-primary)' }} />
            <p style={{ fontSize: '1rem', fontWeight: 600 }}>No entries found</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {searchTerm ? 'Try adjusting your search criteria.' : 'Create a new record using the button above.'}
            </p>
          </div>
        ) : (
          <table className="custom-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title & Description</th>
                <th>Status</th>
                <th>Amount ($)</th>
                <th>Created By</th>
                <th>Updated Date</th>
                {isAdmin && <th style={{ textAlign: 'right' }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id}>
                  <td style={{ fontWeight: 700, color: 'var(--text-muted)', width: '60px' }}>
                    #{item.id}
                  </td>
                  <td style={{ maxWidth: '300px' }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.15rem' }}>
                      {item.title}
                    </div>
                    <div
                      style={{
                        fontSize: '0.8rem',
                        color: 'var(--text-secondary)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {item.description || 'No description provided.'}
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${getStatusBadge(item.status)}`}>
                      {item.status || 'Active'}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600, color: item.amount ? 'var(--accent-emerald)' : 'var(--text-muted)' }}>
                    {item.amount != null ? `$${Number(item.amount).toFixed(2)}` : '—'}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem' }}>
                      <User size={14} style={{ color: 'var(--accent-primary)' }} />
                      <span>{item.createdBy || 'Admin'}</span>
                    </div>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Calendar size={13} />
                      <span>{new Date(item.updatedAt || item.createdAt).toLocaleDateString()}</span>
                    </div>
                  </td>
                  {isAdmin && (
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.4rem' }}>
                        <button
                          onClick={() => onEdit(item)}
                          className="btn-ghost"
                          style={{ padding: '0.4rem', borderRadius: '6px', color: 'var(--accent-primary)' }}
                          title="Edit Item"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => onDelete(item.id)}
                          className="btn-ghost"
                          style={{ padding: '0.4rem', borderRadius: '6px', color: 'var(--accent-rose)' }}
                          title="Delete Item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DataTable;
