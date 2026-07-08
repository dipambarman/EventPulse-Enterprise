import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCurrentUser, logout } from '../services/authService';
import '../styles/navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = React.useState(getCurrentUser());
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Listen for storage changes to update user state on login/logout in other tabs
    const handleStorageChange = () => {
      setUser(getCurrentUser());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-text">GUEP</span>
          {/* Placeholder for logo image that can be added later */}
          {/* <img src="/path-to-logo.png" alt="GUEP Logo" className="logo-image" /> */}
        </Link>
        
        <button 
          className={`navbar-toggle ${isOpen ? 'open' : ''}`} 
          onClick={toggleMenu} 
          aria-label="Toggle menu"
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
        
        <div className={`navbar-menu-container ${isOpen ? 'active' : ''}`}>
          <ul className="navbar-menu">
            <li className="navbar-item">
              <Link to="/" className="navbar-link" onClick={() => setIsOpen(false)}>
                Home
              </Link>
            </li>
            <li className="navbar-item">
              <Link to="/themes" className="navbar-link" onClick={() => setIsOpen(false)}>
                Themes
              </Link>
            </li>
            <li className="navbar-item">
              <Link to="/booking" className="navbar-link" onClick={() => setIsOpen(false)}>
                Booking
              </Link>
            </li>
            <li className="navbar-item">
              <Link to="/payment" className="navbar-link" onClick={() => setIsOpen(false)}>
                Payment
              </Link>
            </li>
            <li className="navbar-item">
              <Link to="/confirmation" className="navbar-link" onClick={() => setIsOpen(false)}>
                Confirmation
              </Link>
            </li>
            <li className="navbar-item">
              <Link to="/about-us" className="navbar-link" onClick={() => setIsOpen(false)}>
                About Us
              </Link>
            </li>
          </ul>
          
          <div className="navbar-auth">
            {!user ? (
              <>
                <Link to="/login" className="auth-button login-button" onClick={() => setIsOpen(false)}>
                  Login
                </Link>
                <Link to="/register" className="auth-button register-button" onClick={() => setIsOpen(false)}>
                  Register
                </Link>
              </>
            ) : (
              <div className="user-section">
                <span className="user-greeting">Hello, {user.username || user.name || 'User'}</span>
                <button className="auth-button logout-button" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile menu backdrop */}
      {isOpen && <div className="menu-backdrop" onClick={() => setIsOpen(false)}></div>}
    </nav>
  );
};

export default Navbar;
