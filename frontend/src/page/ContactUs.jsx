import React from "react";
import "../styles/index.css";
import "../styles/ContactUs.css";

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission - this would be connected to your backend
    alert("Thank you for your message! We'll get back to you soon.");
  };

  return (
    <div className="contact-container">
      {/* Hero Section */}
      <div className="contact-hero">
        <div className="hero-background">
          <div className="hero-overlay"></div>
          <div className="floating-element element-1"></div>
          <div className="floating-element element-2"></div>
        </div>
        
        <div className="hero-content">
          <h1 className="hero-title">Contact Us</h1>
          <p className="hero-subtitle">
            We'd love to hear from you! Get in touch with our team for any inquiries about our event planning services.
          </p>
        </div>
        
        <div className="wave-divider">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="#ffffff" fillOpacity="1" d="M0,192L48,176C96,160,192,128,288,128C384,128,480,160,576,181.3C672,203,768,213,864,202.7C960,192,1056,160,1152,154.7C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="contact-content">
        <div className="container">
          <div className="contact-wrapper">
            <div className="contact-info">
              <div className="info-card">
                <h2>Get In Touch</h2>
                <p>Have questions about our services? Need help planning your event? Our team is here to assist you.</p>
                
                <div className="contact-details">
                  <div className="contact-item">
                    <div className="icon-wrapper">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="contact-text">
                      <h3>Email</h3>
                      <a href="mailto:info@gueventplanner.com">info@gueventplanner.com</a>
                    </div>
                  </div>
                  
                  <div className="contact-item">
                    <div className="icon-wrapper">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div className="contact-text">
                      <h3>Phone</h3>
                      <a href="tel:7635847253">7635847253</a>
                    </div>
                  </div>
                  
                  <div className="contact-item">
                    <div className="icon-wrapper">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="contact-text">
                      <h3>Location</h3>
                      <p>Gauhati University<br />Guwahati, Assam, 781014</p>
                    </div>
                  </div>
                  
                  <div className="contact-item">
                    <div className="icon-wrapper">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="contact-text">
                      <h3>Business Hours</h3>
                      <p>Monday - Friday: 9am - 5pm<br />Weekends: Closed</p>
                    </div>
                  </div>
                </div>

                <div className="social-links">
                  <a href="#" className="social-link">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22,3.999c-0.78,0.463-2.345,1.094-3.265,1.276c-0.027,0.007-0.049,0.016-0.075,0.023c-0.813-0.802-1.927-1.299-3.16-1.299 c-2.485,0-4.5,2.015-4.5,4.5c0,0.131-0.011,0.372,0,0.5c-3.353,0-5.905-1.756-7.735-4c-0.199,0.5-0.286,1.29-0.286,2.032 c0,1.401,1.095,2.777,2.8,3.63c-0.314,0.081-0.66,0.139-1.02,0.139c-0.581,0-1.196-0.153-1.759-0.617c0,0.017,0,0.033,0,0.051 c0,1.958,2.078,3.291,3.926,3.662c-0.375,0.221-1.131,0.243-1.5,0.243c-0.26,0-1.18-0.119-1.426-0.165 c0.514,1.605,2.368,2.507,4.135,2.539c-1.382,1.084-2.341,1.486-5.171,1.486H2C3.788,19.145,6.065,20,8.347,20 C15.777,20,20,14.337,20,8.999c0-0.086-0.002-0.266-0.005-0.447C19.995,8.534,20,8.517,20,8.499c0-0.027-0.008-0.053-0.008-0.08 c-0.003-0.136-0.006-0.263-0.009-0.329c0.79-0.57,1.475-1.281,2.017-2.091c-0.725,0.322-1.503,0.538-2.32,0.636 C20.514,6.135,21.699,4.943,22,3.999z"/>
                    </svg>
                  </a>
                  <a href="#" className="social-link">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12,2C6.477,2,2,6.477,2,12c0,5.013,3.693,9.153,8.505,9.876V14.65H8.031v-2.629h2.474v-1.749 c0-2.896,1.411-4.167,3.818-4.167c1.153,0,1.762,0.085,2.051,0.124v2.294h-1.642c-1.022,0-1.379,0.969-1.379,2.061v1.437h2.995 l-0.406,2.629h-2.588v7.247C18.235,21.236,22,17.062,22,12C22,6.477,17.523,2,12,2z"/>
                    </svg>
                  </a>
                  <a href="#" className="social-link">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7.8,2H16.2C19.4,2,22,4.6,22,7.8V16.2A5.8,5.8,0,0,1,16.2,22H7.8C4.6,22,2,19.4,2,16.2V7.8A5.8,5.8,0,0,1,7.8,2M7.6,4A3.6,3.6,0,0,0,4,7.6V16.4C4,18.39,5.61,20,7.6,20H16.4A3.6,3.6,0,0,0,20,16.4V7.6C20,5.61,18.39,4,16.4,4H7.6M17.25,5.5A1.25,1.25,0,1,1,16,6.75,1.25,1.25,0,0,1,17.25,5.5M12,7A5,5,0,1,1,7,12,5,5,0,0,1,12,7M12,9A3,3,0,1,0,15,12,3,3,0,0,0,12,9Z"/>
                    </svg>
                  </a>
                  <a href="#" className="social-link">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19,3H5C3.895,3,3,3.895,3,5v14c0,1.105,0.895,2,2,2h14c1.105,0,2-0.895,2-2V5C21,3.895,20.105,3,19,3z M9,17H6.477v-7H9 V17z M7.694,8.717c-0.771,0-1.286-0.514-1.286-1.2s0.514-1.2,1.371-1.2c0.771,0,1.286,0.514,1.286,1.2S8.551,8.717,7.694,8.717z M18,17h-2.442v-3.826c0-1.058-0.651-1.302-0.895-1.302s-1.058,0.163-1.058,1.302c0,0.163,0,3.826,0,3.826h-2.523v-7h2.523v0.977 C13.93,10.407,14.581,10,15.802,10C17.023,10,18,10.977,18,13.174V17z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            
            <div className="contact-form-container">
              <div className="form-card">
                <h2>Send us a Message</h2>
                <form className="contact-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="name">Your Name</label>
                    <input type="text" id="name" placeholder="Enter your full name" required />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input type="email" id="email" placeholder="Enter your email address" required />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="subject">Subject</label>
                    <input type="text" id="subject" placeholder="What is this regarding?" required />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="message">Message</label>
                    <textarea id="message" rows="5" placeholder="How can we help you?" required></textarea>
                  </div>
                  
                  <button type="submit" className="submit-button">
                    Send Message
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="map-section">
        <div className="map-placeholder">
          <img src="/api/placeholder/1200/400" alt="Map location" />
          <div className="map-overlay">
            <div className="map-info">
              <h3>Visit Our Office</h3>
              <p>Gauhati University Campus<br />Guwahati, Assam 781014</p>
              <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="directions-button">
                Get Directions
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer
      <footer className="site-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <h3>GU Event Planner</h3>
              <p>Making your events memorable since 2023</p>
            </div>
            <div className="footer-links">
              <a href="/">Home</a>
              <a href="/themes">Themes</a>
              <a href="/about">About</a>
              <a href="/contact">Contact</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} GU Event Planner. All rights reserved.</p>
          </div>
        </div>
      </footer> */}
    </div>
  );
};

export default Contact;