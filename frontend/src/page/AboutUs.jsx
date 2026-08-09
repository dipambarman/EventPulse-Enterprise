import React from 'react';
import '../styles/index.css';

const AboutUsPage = () => {
  return (
    <div className="ep-page-container ep-animate-fade-in" style={{ paddingTop: '80px', paddingBottom: '60px' }}>
      <div className="ep-container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span className="ep-badge ep-badge-primary">Our Story</span>
          <h1 style={{ fontSize: '3rem', fontWeight: '800', marginTop: '1rem', color: 'var(--text-main)' }}>
            Elevating Experiences, <span style={{ color: 'var(--brand-primary)' }}>Empowering Connections</span>
          </h1>
          <p style={{ maxWidth: '700px', margin: '1rem auto', fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
            EventPulse is a premier enterprise event management platform designed to orchestrate seamless, scalable, and unforgettable corporate and luxury events worldwide.
          </p>
        </div>

        <div className="ep-grid" style={{ gap: '2rem', marginBottom: '4rem' }}>
          <div className="ep-card">
            <h3>Our Mission</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '1rem', lineHeight: '1.6' }}>
              To transform complex event logistics into frictionless digital experiences, allowing organizers to focus on what truly matters: creating moments that resonate and inspire.
            </p>
          </div>
          <div className="ep-card">
            <h3>Our Vision</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '1rem', lineHeight: '1.6' }}>
              We envision a future where every milestone, whether a corporate summit or a luxury destination wedding, is executed with absolute precision through intelligent technology.
            </p>
          </div>
        </div>

        <div className="ep-card" style={{ background: 'var(--surface-sunken)', textAlign: 'center', padding: '3rem' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>Why Choose EventPulse?</h2>
          <div className="ep-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
            <div>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🚀</div>
              <h4>Scalable Tech</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Built on a robust microservices architecture to handle high-traffic enterprise demands.</p>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔒</div>
              <h4>Enterprise Security</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Bank-grade encryption, JWT authentication, and strict Role-Based Access Control.</p>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>✨</div>
              <h4>Premium Design</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>A beautiful, intuitive interface crafted for high-end clientele and seamless operations.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;
