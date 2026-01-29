import React, { useState, useEffect } from 'react';
import { newsletterAPI } from '../../services/api';

const NewsletterList = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const response = await newsletterAPI.getAll();
      setSubscribers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this subscriber?')) {
      try {
        await newsletterAPI.delete(id);
        setMessage('Subscriber deleted successfully!');
        fetchSubscribers();
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        setMessage('Error deleting subscriber.');
        console.error('Error:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Email', 'Subscribed At'],
      ...subscribers.map(sub => [sub.email, formatDate(sub.subscribedAt)])
    ]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'newsletter-subscribers.csv';
    a.click();
  };

  if (loading) {
    return <div className="loading">Loading subscribers...</div>;
  }

  return (
    <div className="newsletter-list">
      <div className="admin-header">
        <h1>Newsletter Subscribers</h1>
        <p>View and manage newsletter subscriptions from the landing page</p>
      </div>

      <div className="admin-actions">
        {subscribers.length > 0 && (
          <button className="btn btn-success" onClick={exportToCSV}>
            Export to CSV
          </button>
        )}
      </div>

      {message && (
        <div className={message.includes('Error') ? 'error' : 'success'}>
          {message}
        </div>
      )}

      <div className="admin-table">
        {subscribers.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Email Address</th>
                <th>Subscribed At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((subscriber, index) => (
                <tr key={subscriber._id}>
                  <td>{index + 1}</td>
                  <td>{subscriber.email}</td>
                  <td>{formatDate(subscriber.subscribedAt)}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn btn-danger" 
                        onClick={() => handleDelete(subscriber._id)}
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
            <h3>No Newsletter Subscribers Yet</h3>
            <p>Newsletter subscriptions will appear here</p>
          </div>
        )}
      </div>

      {subscribers.length > 0 && (
        <div style={{ marginTop: '20px', padding: '15px', background: 'white', borderRadius: '5px' }}>
          <strong>Total Subscribers: {subscribers.length}</strong>
        </div>
      )}
    </div>
  );
};

export default NewsletterList;
