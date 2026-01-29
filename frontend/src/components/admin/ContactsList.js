import React, { useState, useEffect } from 'react';
import { contactAPI } from '../../services/api';

const ContactsList = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await contactAPI.getAll();
      setContacts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        await contactAPI.delete(id);
        setMessage('Contact deleted successfully!');
        fetchContacts();
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        setMessage('Error deleting contact.');
        console.error('Error:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  if (loading) {
    return <div className="loading">Loading contacts...</div>;
  }

  return (
    <div className="contacts-list">
      <div className="admin-header">
        <h1>Contact Form Submissions</h1>
        <p>View and manage contact form submissions from the landing page</p>
      </div>

      {message && (
        <div className={message.includes('Error') ? 'error' : 'success'}>
          {message}
        </div>
      )}

      <div className="admin-table">
        {contacts.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>City</th>
                <th>Submitted At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact) => (
                <tr key={contact._id}>
                  <td>{contact.fullName}</td>
                  <td>{contact.email}</td>
                  <td>{contact.mobile}</td>
                  <td>{contact.city}</td>
                  <td>{formatDate(contact.createdAt)}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn btn-danger" 
                        onClick={() => handleDelete(contact._id)}
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
            <h3>No Contact Submissions Yet</h3>
            <p>Contact form submissions will appear here</p>
          </div>
        )}
      </div>

      {contacts.length > 0 && (
        <div style={{ marginTop: '20px', padding: '15px', background: 'white', borderRadius: '5px' }}>
          <strong>Total Submissions: {contacts.length}</strong>
        </div>
      )}
    </div>
  );
};

export default ContactsList;
