import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { projectAPI, clientAPI, contactAPI, newsletterAPI } from '../services/api';
import ProjectManagement from '../components/admin/ProjectManagement';
import ClientManagement from '../components/admin/ClientManagement';
import ContactsList from '../components/admin/ContactsList';
import NewsletterList from '../components/admin/NewsletterList';
import './AdminPanel.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    projects: 0,
    clients: 0,
    contacts: 0,
    subscribers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      console.log('Fetching stats from:', process.env.REACT_APP_API_URL);
      const [projects, clients, contacts, newsletter] = await Promise.all([
        projectAPI.getAll(),
        clientAPI.getAll(),
        contactAPI.getAll(),
        newsletterAPI.getAll()
      ]);
      setStats({
        projects: projects.data.length,
        clients: clients.data.length,
        contacts: contacts.data.length,
        subscribers: newsletter.data.length
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stats:', error);
      console.error('API URL:', process.env.REACT_APP_API_URL);
      // Still show the dashboard even if API fails
      setStats({
        projects: 0,
        clients: 0,
        contacts: 0,
        subscribers: 0
      });
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="dashboard-loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <div className="admin-header">
        <h1>Dashboard Overview</h1>
        <p>Welcome to the admin panel. Manage your content below.</p>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card stat-projects">
          <div className="stat-icon">📁</div>
          <div className="stat-info">
            <h3>{stats.projects}</h3>
            <p>Total Projects</p>
          </div>
        </div>
        
        <div className="stat-card stat-clients">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>{stats.clients}</h3>
            <p>Client Testimonials</p>
          </div>
        </div>
        
        <div className="stat-card stat-contacts">
          <div className="stat-icon">✉️</div>
          <div className="stat-info">
            <h3>{stats.contacts}</h3>
            <p>Contact Submissions</p>
          </div>
        </div>
        
        <div className="stat-card stat-subscribers">
          <div className="stat-icon">📧</div>
          <div className="stat-info">
            <h3>{stats.subscribers}</h3>
            <p>Newsletter Subscribers</p>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <Link to="/admin/projects" className="action-btn">
            <span>➕</span> Add New Project
          </Link>
          <Link to="/admin/clients" className="action-btn">
            <span>➕</span> Add Client Testimonial
          </Link>
          <Link to="/admin/contacts" className="action-btn">
            <span>📋</span> View Contact Forms
          </Link>
          <Link to="/admin/newsletter" className="action-btn">
            <span>📧</span> Manage Subscribers
          </Link>
        </div>
      </div>
    </div>
  );
};

const AdminPanel = () => {
  const location = useLocation();

  return (
    <div className="admin-panel">
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">🏠</span>
            <h2>Real Trust Admin</h2>
          </div>
        </div>
        <nav className="sidebar-nav">
          <Link 
            to="/admin" 
            className={location.pathname === '/admin' ? 'nav-link active' : 'nav-link'}
          >
            <span className="nav-icon">📊</span> Dashboard
          </Link>
          <Link 
            to="/admin/projects" 
            className={location.pathname === '/admin/projects' ? 'nav-link active' : 'nav-link'}
          >
            <span className="nav-icon">📁</span> Projects
          </Link>
          <Link 
            to="/admin/clients" 
            className={location.pathname === '/admin/clients' ? 'nav-link active' : 'nav-link'}
          >
            <span className="nav-icon">👥</span> Clients
          </Link>
          <Link 
            to="/admin/contacts" 
            className={location.pathname === '/admin/contacts' ? 'nav-link active' : 'nav-link'}
          >
            <span className="nav-icon">✉️</span> Contact Forms
          </Link>
          <Link 
            to="/admin/newsletter" 
            className={location.pathname === '/admin/newsletter' ? 'nav-link active' : 'nav-link'}
          >
            <span className="nav-icon">📧</span> Newsletter
          </Link>
        </nav>
        <div className="sidebar-footer">
          <Link to="/" className="btn btn-secondary">
            <span>🏠</span> Back to Website
          </Link>
        </div>
      </aside>

      <main className="admin-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/projects" element={<ProjectManagement />} />
          <Route path="/clients" element={<ClientManagement />} />
          <Route path="/contacts" element={<ContactsList />} />
          <Route path="/newsletter" element={<NewsletterList />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminPanel;
