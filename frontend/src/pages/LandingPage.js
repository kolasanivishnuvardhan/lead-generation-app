import React, { useEffect, useState } from 'react';
import { projectAPI, clientAPI, contactAPI, newsletterAPI } from '../services/api';
import './LandingPage.css';

const LandingPage = () => {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    city: ''
  });
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [message, setMessage] = useState('');
  const [newsletterMessage, setNewsletterMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [projectsRes, clientsRes] = await Promise.all([
        projectAPI.getAll(),
        clientAPI.getAll()
      ]);
      setProjects(projectsRes.data);
      setClients(clientsRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    try {
      await contactAPI.create(formData);
      setMessage('Thank you! Your message has been submitted successfully.');
      setFormData({ fullName: '', email: '', mobile: '', city: '' });
      setTimeout(() => setMessage(''), 5000);
    } catch (error) {
      setMessage('Error submitting form. Please try again.');
    }
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    try {
      await newsletterAPI.subscribe(newsletterEmail);
      setNewsletterMessage('Successfully subscribed to our newsletter!');
      setNewsletterEmail('');
      setTimeout(() => setNewsletterMessage(''), 5000);
    } catch (error) {
      setNewsletterMessage(error.response?.data?.message || 'Error subscribing. Please try again.');
    }
  };

  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    const section = document.querySelector(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="navbar">
        <div className="container">
          <div className="nav-content">
            <div className="logo">
              <span className="logo-icon">🏠</span>
              <span className="logo-text">Real Trust</span>
            </div>
            <ul className="nav-links">
              <li><a href="#home" onClick={(e) => scrollToSection(e, '#home')}>HOME</a></li>
              <li><a href="#services" onClick={(e) => scrollToSection(e, '#services')}>SERVICES</a></li>
              <li><a href="#projects" onClick={(e) => scrollToSection(e, '#projects')}>ABOUT / PROJECTS</a></li>
              <li><a href="#contact" onClick={(e) => scrollToSection(e, '#contact')}>GET IN TOUCH</a></li>
            </ul>
            <a href="#contact" onClick={(e) => scrollToSection(e, '#contact')} className="btn btn-orange">SCHEDULE</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-content">
              <h1>Consultation,<br/>Design,<br/>& Marketing</h1>
              <p className="hero-subtitle">We are here to help you achieve your goals</p>
            </div>
            <div id="contact" className="hero-form-card">
              <h3>Get a Free<br/>Consultation</h3>
              <form onSubmit={handleContactSubmit} className="consultation-form">
                <input
                  type="text"
                  name="fullName"
                  placeholder="FULL NAME"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="EMAIL"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="tel"
                  name="mobile"
                  placeholder="PHONE NUMBER"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  name="city"
                  placeholder="CITY"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
                <button type="submit" className="btn btn-orange btn-block">
                  GET FREE CONSULTATION
                </button>
              </form>
              {message && <div className={message.includes('Error') ? 'error-msg' : 'success-msg'}>{message}</div>}
            </div>
          </div>
        </div>
      </section>

      {/* Not Your Average Realtor Section */}
      <section className="realtor-section">
        <div className="container">
          <div className="realtor-grid">
            <div className="realtor-text">
              <span className="section-badge">🔵</span>
              <h2>Not Your Average Realtor</h2>
              <p>Real estate is not just about selling properties; it's about understanding the unique needs of each client and delivering personalized solutions that exceed expectations.</p>
              <div className="dots-indicator">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot active"></span>
              </div>
            </div>
            <div className="realtor-images">
              <div className="image-collage">
                <div className="collage-item large-circle"></div>
                <div className="collage-item small-circle top-right"></div>
                <div className="collage-item small-circle bottom-right"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section id="services" className="why-choose-section">
        <div className="container">
          <h2 className="section-title">Why Choose Us?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="50" height="50" viewBox="0 0 24 24" fill="none">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="#4A90E2" strokeWidth="2"/>
                </svg>
              </div>
              <h3>Potential ROI</h3>
              <p>Lorem ipsum dolor sit amet consectetur adipiscing elit dolor posuere vel venenatis eu sit massa volutpat.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="50" height="50" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#4A90E2" strokeWidth="2"/>
                </svg>
              </div>
              <h3>Design</h3>
              <p>Lorem ipsum dolor sit amet consectetur adipiscing elit dolor posuere vel venenatis eu sit massa volutpat.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="50" height="50" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="#4A90E2" strokeWidth="2"/>
                  <path d="M12 6v6l4 2" stroke="#4A90E2" strokeWidth="2"/>
                </svg>
              </div>
              <h3>Marketing</h3>
              <p>Lorem ipsum dolor sit amet consectetur adipiscing elit dolor posuere vel venenatis eu sit massa volutpat.</p>
            </div>
          </div>
          <div className="arrow-nav">
            <button className="arrow-btn">›</button>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="about-section">
        <div className="container">
          <div className="about-images-grid">
            <div className="about-image"></div>
            <div className="about-image"></div>
            <div className="about-image"></div>
          </div>
          <h2 className="section-title">About Us</h2>
          <p className="about-text">
            Fifteen years of Consultation in not just the standard. I am the standard. With the drive of a 
            business man and the creative thinking I am always able to help you with not just selling the 
            house but with all aspects of Real Estate and development of a product that can one day be
            completely yours effectively.
          </p>
          <button className="btn btn-outline">LEARN MORE</button>
        </div>
      </section>

      {/* Our Projects Section */}
      <section className="projects-section" id="projects">
        <div className="container">
          <h2 className="section-title">Our Projects</h2>
          <p className="section-subtitle">We know what buyers are looking for and suggest projects that will bring buyers top dollar for the sale of their homes</p>
          <div className="projects-grid">
            {projects.length > 0 ? (
              projects.map((project) => (
                <div key={project._id} className="project-card">
                  <div className="project-image">
                    <img 
                      src={`http://localhost:5000${project.image}`} 
                      alt={project.name}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x250?text=Project';
                      }}
                    />
                  </div>
                  <div className="project-info">
                    <h4>{project.name}</h4>
                    <p className="project-location">Miami, Arizona - {project.description.substring(0, 30)}...</p>
                    <button className="btn btn-orange btn-sm">READ MORE</button>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data">No projects available at the moment.</p>
            )}
          </div>
        </div>
      </section>

      {/* Happy Clients Section */}
      <section className="clients-section" id="clients">
        <div className="container">
          <h2 className="section-title">Happy Clients</h2>
          <div className="clients-carousel">
            {clients.length > 0 ? (
              clients.map((client) => (
                <div key={client._id} className="client-testimonial">
                  <div className="client-avatar">
                    <img 
                      src={`http://localhost:5000${client.image}`} 
                      alt={client.name}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/80?text=Client';
                      }}
                    />
                  </div>
                  <p className="testimonial-text">{client.description}</p>
                  <h5 className="client-name">{client.name}</h5>
                  <p className="client-role">{client.designation}</p>
                </div>
              ))
            ) : (
              <p className="no-data">No client testimonials available.</p>
            )}
          </div>
          <div className="carousel-dots">
            <span className="dot"></span>
            <span className="dot active"></span>
            <span className="dot"></span>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-content">
            <h2>Subscribe to Our Newsletter</h2>
            <p>Get the latest updates and offers</p>
            <form onSubmit={handleNewsletterSubmit} className="newsletter-form">
              <input
                type="email"
                placeholder="Enter your email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-primary">Subscribe</button>
            </form>
            {newsletterMessage && (
              <div className={newsletterMessage.includes('Error') || newsletterMessage.includes('already') ? 'error' : 'success'}>
                {newsletterMessage}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; 2026 Lead Generation Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;