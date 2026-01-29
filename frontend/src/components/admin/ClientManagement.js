import React, { useState, useEffect } from 'react';
import { clientAPI } from '../../services/api';

const ClientManagement = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    designation: '',
    image: null
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await clientAPI.getAll();
      setClients(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching clients:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.name === 'image') {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name.trim()) {
      setMessage('Error: Client name is required');
      return;
    }
    if (!formData.description.trim()) {
      setMessage('Error: Testimonial description is required');
      return;
    }
    if (!formData.designation.trim()) {
      setMessage('Error: Client designation is required');
      return;
    }
    if (!editingClient && !formData.image) {
      setMessage('Error: Client image is required');
      return;
    }
    
    const data = new FormData();
    data.append('name', formData.name.trim());
    data.append('description', formData.description.trim());
    data.append('designation', formData.designation.trim());
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      if (editingClient) {
        await clientAPI.update(editingClient._id, data);
        setMessage('✅ Client testimonial updated successfully!');
      } else {
        await clientAPI.create(data);
        setMessage('✅ Client testimonial created successfully!');
      }
      
      fetchClients();
      resetForm();
      setTimeout(() => setMessage(''), 5000);
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to save client. Please try again.';
      setMessage('❌ Error: ' + errorMsg);
      console.error('Error:', error);
    }
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      description: client.description,
      designation: client.designation,
      image: null
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        await clientAPI.delete(id);
        setMessage('Client deleted successfully!');
        fetchClients();
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        setMessage('Error deleting client.');
        console.error('Error:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', designation: '', image: null });
    setEditingClient(null);
    setShowForm(false);
  };

  if (loading) {
    return <div className="loading">Loading clients...</div>;
  }

  return (
    <div className="client-management">
      <div className="admin-header">
        <h1>Client Management</h1>
        <p>Manage client testimonials that appear on the landing page</p>
      </div>

      <div className="admin-actions">
        <button 
          className="btn btn-primary" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Add New Client'}
        </button>
      </div>

      {message && (
        <div className={message.includes('Error') ? 'error' : 'success'}>
          {message}
        </div>
      )}

      {showForm && (
        <div className="admin-form">
          <h2>{editingClient ? 'Edit Client' : 'Add New Client'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Client Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Designation</label>
                <input
                  type="text"
                  name="designation"
                  placeholder="e.g., CEO, Web Developer"
                  value={formData.designation}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Testimonial</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Client Image</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleInputChange}
                required={!editingClient}
              />
              <small>Image will be automatically cropped to 450x350</small>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-success">
                {editingClient ? 'Update Client' : 'Create Client'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-table">
        {clients.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Designation</th>
                <th>Testimonial</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client._id}>
                  <td>
                    <img 
                      src={`http://localhost:5000${client.image}`} 
                      alt={client.name}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/60';
                      }}
                    />
                  </td>
                  <td>{client.name}</td>
                  <td>{client.designation}</td>
                  <td>{client.description.substring(0, 80)}...</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn btn-primary" 
                        onClick={() => handleEdit(client)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-danger" 
                        onClick={() => handleDelete(client._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <h3>No Clients Yet</h3>
            <p>Click "Add New Client" to add your first client testimonial</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientManagement;
