import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
  };

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/themes', label: 'Themes' },
    { path: '/calculator', label: 'Cost Estimator' },
    { path: '/about-us', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <nav className={`ep-navbar ${scrolled ? 'ep-navbar-scrolled' : ''}`} id="main-nav">
        <div className="ep-navbar-container">
          {/* Logo */}
          <Link to="/" className="ep-navbar-logo" id="nav-logo">
            <div className="ep-logo-icon">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="28" height="28" rx="8" fill="url(#logo-gradient)"/>
                <path d="M8 10h12M8 14h8M8 18h10" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="21" cy="18" r="3" fill="#F97316"/>
                <defs>
                  <linearGradient id="logo-gradient" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#6C3CE1"/>
                    <stop offset="1" stopColor="#8B5CF6"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span className="ep-logo-text">Event<span className="ep-logo-accent">Pulse</span></span>
          </Link>

          {/* Desktop Navigation */}
          <div className={`ep-navbar-menu-wrapper ${isOpen ? 'active' : ''}`}>
            <ul className="ep-navbar-menu" id="nav-menu">
              {navLinks.map((link) => (
                <li key={link.path} className="ep-navbar-item">
                  <Link
                    to={link.path}
                    className={`ep-navbar-link ${isActive(link.path) ? 'active' : ''}`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                    <span className="ep-navbar-link-indicator"></span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Auth Section */}
            <div className="ep-navbar-auth" id="nav-auth">
              {!user ? (
                <>
                  <Link to="/login" className="ep-nav-btn ep-nav-btn-ghost" onClick={() => setIsOpen(false)}>
                    Sign In
                  </Link>
                  <Link to="/register" className="ep-nav-btn ep-nav-btn-primary" onClick={() => setIsOpen(false)}>
                    Get Started
                  </Link>
                </>
              ) : (
                <div className="ep-user-section">
                  <div className="ep-user-avatar">
                    {(user.username || user.name || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div className="ep-user-info">
                    <span className="ep-user-name">{user.username || user.name || 'User'}</span>
                    <div className="ep-user-dropdown">
                      <Link to="/client-portal" className="ep-dropdown-item" onClick={() => setIsOpen(false)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        My Events
                      </Link>
                      <Link to="/admin" className="ep-dropdown-item" onClick={() => setIsOpen(false)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                        Admin Dashboard
                      </Link>
                      <div className="ep-dropdown-divider"></div>
                      <button className="ep-dropdown-item ep-dropdown-logout" onClick={handleLogout}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Toggle */}
          <button
            className={`ep-navbar-toggle ${isOpen ? 'open' : ''}`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
            id="nav-toggle"
          >
            <span className="ep-bar"></span>
            <span className="ep-bar"></span>
            <span className="ep-bar"></span>
          </button>
        </div>
      </nav>

      {/* Mobile backdrop */}
      {isOpen && <div className="ep-menu-backdrop" onClick={() => setIsOpen(false)}></div>}
    </>
  );
};

export default Navbar;
