import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import FormInput from '../../components/FormInput';
import Button from '../../components/Button';
import ErrorAlert from '../../components/ErrorAlert';
import { LoadingSpinner } from '../../components/LoadingState';
import api from '../../services/api';
import { Save, Plus } from 'lucide-react';

const AdminCrudPage = ({ category = 'management', title = 'Management Module' }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Active',
    amount: '',
  });

  const fetchCategoryItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/GenericItems?category=${category}`);
      setItems(response.data);
    } catch (err) {
      setError(err.response?.data?.message || `Failed to fetch ${category} items.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryItems();
  }, [category]);

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      description: '',
      status: 'Active',
      amount: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description || '',
      status: item.status || 'Active',
      amount: item.amount != null ? item.amount.toString() : '',
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccessMessage('');

    const payload = {
      title: formData.title,
      description: formData.description,
      status: formData.status,
      amount: formData.amount ? parseFloat(formData.amount) : null,
    };

    try {
      if (editingItem) {
        // PUT update
        await api.put(`/GenericItems/${editingItem.id}`, payload);
        setSuccessMessage(`Updated item "${formData.title}" successfully.`);
      } else {
        // POST create
        await api.post('/GenericItems', {
          ...payload,
          category: category,
        });
        setSuccessMessage(`Created new ${category} entry "${formData.title}" successfully.`);
      }
      handleCloseModal();
      fetchCategoryItems();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save item. Please verify your inputs.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/GenericItems/${id}`);
      setSuccessMessage('Record deleted successfully.');
      fetchCategoryItems();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete record.');
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Navbar title={title} />
        <main className="page-wrapper animate-fade-in">
          {successMessage && (
            <div className="alert alert-success animate-fade-in" style={{ marginBottom: '1.25rem' }}>
              <span>{successMessage}</span>
            </div>
          )}

          <ErrorAlert message={error} onClose={() => setError(null)} />

          {loading ? (
            <LoadingSpinner text={`Loading ${title}...`} />
          ) : (
            <DataTable
              items={items}
              title={title}
              category={category}
              onAddNew={handleOpenAddModal}
              onEdit={handleOpenEditModal}
              onDelete={handleDeleteItem}
              isAdmin={true}
            />
          )}

          {/* Reusable CRUD Modal */}
          <Modal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            title={editingItem ? `Edit ${category.toUpperCase()} Entry` : `Create New ${category.toUpperCase()} Entry`}
          >
            <form onSubmit={handleSubmitForm}>
              <FormInput
                label="Title / Name"
                type="text"
                placeholder="e.g. Master Configuration Entry"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />

              <FormInput
                label="Description"
                type="text"
                placeholder="e.g. System metadata details..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />

              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  className="form-input"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>

              <FormInput
                label="Amount / Value ($)"
                type="number"
                step="0.01"
                placeholder="e.g. 150.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <Button variant="secondary" onClick={handleCloseModal}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" isLoading={submitting} icon={Save}>
                  {editingItem ? 'Save Changes' : 'Create Entry'}
                </Button>
              </div>
            </form>
          </Modal>
        </main>
      </div>
    </div>
  );
};

export default AdminCrudPage;
