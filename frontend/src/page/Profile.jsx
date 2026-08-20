import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserBookings } from '../services/bookingService';
import '../styles/Profile.css';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const data = await getUserBookings();
        const bookingsArray = Array.isArray(data) ? data : (data.bookings || []);
        setBookings(bookingsArray);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError('Unable to load your bookings right now.');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Separate bookings into upcoming & past
  const now = new Date();
  const upcomingBookings = bookings.filter(b => new Date(b.date) >= now && b.status !== 'cancelled');
  const pastBookings = bookings.filter(b => new Date(b.date) < now || b.status === 'cancelled');

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const map = {
      confirmed: { label: 'Confirmed', cls: 'ep-badge-success' },
      pending: { label: 'Pending', cls: 'ep-badge-warning' },
      completed: { label: 'Completed', cls: 'ep-badge-primary' },
      cancelled: { label: 'Cancelled', cls: 'ep-badge-danger' },
      paid: { label: 'Paid', cls: 'ep-badge-success' },
    };
    const info = map[status] || { label: status || 'Unknown', cls: 'ep-badge-neutral' };
    return <span className={`ep-profile-badge ${info.cls}`}>{info.label}</span>;
  };

  const displayBookings = activeTab === 'upcoming' ? upcomingBookings : pastBookings;

  return (
    <div className="ep-profile-page" id="profile-page">
      {/* Profile Header */}
      <div className="ep-profile-header">
        <div className="ep-profile-header-bg">
          <div className="ep-profile-orb ep-profile-orb-1"></div>
          <div className="ep-profile-orb ep-profile-orb-2"></div>
        </div>
        <div className="ep-container ep-profile-header-content">
          <div className="ep-profile-avatar-large">
            {(user?.username || user?.name || 'U').charAt(0).toUpperCase()}
          </div>
          <div className="ep-profile-info">
            <h1 className="ep-profile-name">{user?.username || user?.name || 'User'}</h1>
            <p className="ep-profile-email">{user?.email || ''}</p>
            <div className="ep-profile-meta">
              <span className="ep-profile-meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                {bookings.length} Total Booking{bookings.length !== 1 ? 's' : ''}
              </span>
              <span className="ep-profile-meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                {upcomingBookings.length} Upcoming
              </span>
              {user?.role === 'admin' && (
                <span className="ep-profile-meta-item ep-admin-badge-meta">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  Admin
                </span>
              )}
            </div>
          </div>
          <div className="ep-profile-actions">
            <Link to="/client-portal" className="ep-btn ep-btn-outline ep-btn-sm ep-profile-header-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
              Client Portal
            </Link>
            <button onClick={handleLogout} className="ep-btn ep-btn-ghost ep-btn-sm ep-profile-header-btn ep-logout-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Bookings Section */}
      <div className="ep-container ep-profile-body">
        {/* Tab Switcher */}
        <div className="ep-profile-tabs">
          <button
            className={`ep-profile-tab ${activeTab === 'upcoming' ? 'active' : ''}`}
            onClick={() => setActiveTab('upcoming')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            Upcoming ({upcomingBookings.length})
          </button>
          <button
            className={`ep-profile-tab ${activeTab === 'past' ? 'active' : ''}`}
            onClick={() => setActiveTab('past')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
            Past Bookings ({pastBookings.length})
          </button>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="ep-profile-loading">
            <div className="ep-loader-spinner"></div>
            <p>Loading your bookings...</p>
          </div>
        ) : error ? (
          <div className="ep-profile-empty-state ep-card">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--ep-error)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <h3>{error}</h3>
            <button className="ep-btn ep-btn-primary ep-btn-sm" onClick={() => window.location.reload()}>Try Again</button>
          </div>
        ) : displayBookings.length === 0 ? (
          <div className="ep-profile-empty-state ep-card">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="var(--ep-gray-300)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="10" y1="14" x2="14" y2="18"/><line x1="14" y1="14" x2="10" y2="18"/></svg>
            <h3>{activeTab === 'upcoming' ? 'No Upcoming Bookings' : 'No Past Bookings'}</h3>
            <p>{activeTab === 'upcoming' ? "You don't have any upcoming events. Browse themes to book your next event!" : "You haven't completed any events yet."}</p>
            {activeTab === 'upcoming' && (
              <Link to="/themes" className="ep-btn ep-btn-primary ep-btn-sm">Browse Event Packages</Link>
            )}
          </div>
        ) : (
          <div className="ep-bookings-grid">
            {displayBookings.map((booking) => (
              <div key={booking._id || booking.bookingId || booking.id} className="ep-booking-card ep-card">
                <div className="ep-booking-card-header">
                  <div className="ep-booking-theme-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  </div>
                  <div className="ep-booking-header-info">
                    <h3 className="ep-booking-title">
                      {booking.theme?.name || booking.themeName || 'Event Booking'}
                    </h3>
                    <span className="ep-booking-ref">
                      Ref: {booking.referenceNumber || booking.bookingId || booking._id?.slice(-8)}
                    </span>
                  </div>
                  {getStatusBadge(booking.status)}
                </div>

                <div className="ep-booking-card-body">
                  <div className="ep-booking-detail">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    <span>{formatDate(booking.date)}</span>
                  </div>
                  {booking.venue && (
                    <div className="ep-booking-detail">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      <span>{booking.venue}</span>
                    </div>
                  )}
                  <div className="ep-booking-detail">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    <span>{booking.guestCount || 'N/A'} Guests</span>
                  </div>
                </div>

                <div className="ep-booking-card-footer">
                  <div className="ep-booking-price">
                    <span className="ep-price-label">Total</span>
                    <span className="ep-price-value">₹{(booking.totalPrice || 0).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="ep-booking-card-actions">
                    {activeTab === 'upcoming' && booking.status !== 'cancelled' && (
                      <Link
                        to={`/payment/${booking.bookingId || booking._id}`}
                        className="ep-btn ep-btn-primary ep-btn-xs"
                      >
                        View Details
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Links Section */}
        <div className="ep-profile-quick-links">
          <h3 className="ep-quick-links-title">Quick Actions</h3>
          <div className="ep-quick-links-grid">
            <Link to="/themes" className="ep-quick-link-card ep-card">
              <div className="ep-quick-link-icon" style={{ background: 'linear-gradient(135deg, #6C3CE1, #8B5CF6)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
              </div>
              <span>Browse Themes</span>
            </Link>
            <Link to="/calculator" className="ep-quick-link-card ep-card">
              <div className="ep-quick-link-icon" style={{ background: 'linear-gradient(135deg, #F97316, #FB923C)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="8" y2="10.01"/><line x1="12" y1="10" x2="12" y2="10.01"/><line x1="16" y1="10" x2="16" y2="10.01"/><line x1="8" y1="14" x2="8" y2="14.01"/><line x1="12" y1="14" x2="12" y2="14.01"/></svg>
              </div>
              <span>Cost Estimator</span>
            </Link>
            <Link to="/client-portal" className="ep-quick-link-card ep-card">
              <div className="ep-quick-link-icon" style={{ background: 'linear-gradient(135deg, #10B981, #34D399)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <span>Client Portal</span>
            </Link>
            <Link to="/contact" className="ep-quick-link-card ep-card">
              <div className="ep-quick-link-icon" style={{ background: 'linear-gradient(135deg, #3B82F6, #60A5FA)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </div>
              <span>Contact Support</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
