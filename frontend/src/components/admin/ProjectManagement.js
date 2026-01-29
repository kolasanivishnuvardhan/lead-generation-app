import React, { useState, useEffect } from 'react';
import { projectAPI } from '../../services/api';

const ProjectManagement = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: null
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await projectAPI.getAll();
      setProjects(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching projects:', error);
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
      setMessage('Error: Project name is required');
      return;
    }
    if (!formData.description.trim()) {
      setMessage('Error: Project description is required');
      return;
    }
    if (!editingProject && !formData.image) {
      setMessage('Error: Project image is required');
      return;
    }
    
    const data = new FormData();
    data.append('name', formData.name.trim());
    data.append('description', formData.description.trim());
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      if (editingProject) {
        await projectAPI.update(editingProject._id, data);
        setMessage('✅ Project updated successfully!');
      } else {
        await projectAPI.create(data);
        setMessage('✅ Project created successfully!');
      }
      
      fetchProjects();
      resetForm();
      setTimeout(() => setMessage(''), 5000);
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to save project. Please try again.';
      setMessage('❌ Error: ' + errorMsg);
      console.error('Error:', error);
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      description: project.description,
      image: null
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await projectAPI.delete(id);
        setMessage('Project deleted successfully!');
        fetchProjects();
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        setMessage('Error deleting project.');
        console.error('Error:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', image: null });
    setEditingProject(null);
    setShowForm(false);
  };

  if (loading) {
    return <div className="loading">Loading projects...</div>;
  }

  return (
    <div className="project-management">
      <div className="admin-header">
        <h1>Project Management</h1>
        <p>Manage your projects that appear on the landing page</p>
      </div>

      <div className="admin-actions">
        <button 
          className="btn btn-primary" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Add New Project'}
        </button>
      </div>

      {message && (
        <div className={message.includes('Error') ? 'error' : 'success'}>
          {message}
        </div>
      )}

      {showForm && (
        <div className="admin-form">
          <h2>{editingProject ? 'Edit Project' : 'Add New Project'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Project Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Project Image</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleInputChange}
                required={!editingProject}
              />
              <small>Image will be automatically cropped to 450x350</small>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-success">
                {editingProject ? 'Update Project' : 'Create Project'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-table">
        {projects.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project._id}>
                  <td>
                    <img 
                      src={`http://localhost:5000${project.image}`} 
                      alt={project.name}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/60';
                      }}
                    />
                  </td>
                  <td>{project.name}</td>
                  <td>{project.description.substring(0, 100)}...</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn btn-primary" 
                        onClick={() => handleEdit(project)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-danger" 
                        onClick={() => handleDelete(project._id)}
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
            <h3>No Projects Yet</h3>
            <p>Click "Add New Project" to create your first project</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectManagement;
