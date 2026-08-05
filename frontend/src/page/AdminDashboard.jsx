import React, { useState } from 'react';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock Business Analytics
  const analyticsData = {
    totalRevenue: 2485000,
    monthlyRevenue: 680000,
    activeBookings: 14,
    conversionRate: 34.2,
    monthlyChart: [
      { month: 'Jan', revenue: 320000 },
      { month: 'Feb', revenue: 410000 },
      { month: 'Mar', revenue: 380000 },
      { month: 'Apr', revenue: 520000 },
      { month: 'May', revenue: 610000 },
      { month: 'Jun', revenue: 680000 }
    ]
  };

  // Mock Bookings Kanban / Table
  const [bookings, setBookings] = useState([
    { id: 'EVT-101', client: 'Aarav Sharma', theme: 'Wedding Exclusive', date: '2026-09-12', amount: 750000, status: 'confirmed', stage: 'In Planning' },
    { id: 'EVT-102', client: 'TechCorp India', theme: 'Corporate Premium', date: '2026-08-28', amount: 250000, status: 'confirmed', stage: 'Deposit Paid' },
    { id: 'EVT-103', client: 'Neha Kapoor', theme: 'Birthday Standard', date: '2026-08-15', amount: 45000, status: 'pending', stage: 'Quote Sent' },
    { id: 'EVT-104', client: 'Sunita & Raj', theme: 'Wedding Standard', date: '2026-10-04', amount: 350000, status: 'confirmed', stage: 'In Planning' },
    { id: 'EVT-105', client: 'Global Systems Ltd', theme: 'Corporate Exclusive', date: '2026-08-20', amount: 500000, status: 'completed', stage: 'Completed' }
  ]);

  // Mock Inventory / Theme Packages
  const [packages, setPackages] = useState([
    { id: 'b1', name: 'Birthday Standard', category: 'Birthday', price: 15000, status: 'Active' },
    { id: 'c1', name: 'Corporate Summit', category: 'Corporate', price: 120000, status: 'Active' },
    { id: 'w1', name: 'Royal Heritage Wedding', category: 'Wedding', price: 750000, status: 'Active' },
    { id: 't1', name: 'Meghalaya Retreat Package', category: 'Travel', price: 50000, status: 'Active' }
  ]);

  const updateBookingStatus = (id, newStatus) => {
    setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus } : b));
  };

  return (
    <div className="ep-admin-page" id="admin-dashboard-page">
      
      {/* Top Header */}
      <div className="ep-admin-header">
        <div className="ep-container ep-admin-header-flex">
          <div>
            <span className="ep-badge ep-badge-accent">Enterprise B2B Command Center</span>
            <h1 className="ep-admin-title">Business Admin Dashboard</h1>
          </div>
          <div className="ep-admin-header-actions">
            <button className="ep-btn ep-btn-primary ep-btn-sm" onClick={() => alert('Exporting monthly P&L Report...')}>
              📊 Export Financial Report
            </button>
          </div>
        </div>
      </div>

      <div className="ep-container ep-admin-content">
        
        {/* Navigation Sidebar / Tabs */}
        <div className="ep-admin-tabs">
          <button
            className={`ep-admin-tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 Executive Analytics
          </button>
          <button
            className={`ep-admin-tab ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            📅 Booking CRM Pipeline
          </button>
          <button
            className={`ep-admin-tab ${activeTab === 'packages' ? 'active' : ''}`}
            onClick={() => setActiveTab('packages')}
          >
            📦 Theme Package Manager
          </button>
        </div>

        {/* Tab 1: Executive Analytics */}
        {activeTab === 'overview' && (
          <div className="ep-admin-overview-tab ep-animate-fade-in">
            {/* KPI Cards */}
            <div className="ep-kpi-grid">
              <div className="ep-kpi-card ep-card">
                <div className="ep-kpi-label">Total Contract Revenue</div>
                <div className="ep-kpi-value">₹{analyticsData.totalRevenue.toLocaleString('en-IN')}</div>
                <div className="ep-kpi-sub text-success">↑ +18.4% from last month</div>
              </div>

              <div className="ep-kpi-card ep-card">
                <div className="ep-kpi-label">Monthly Gross Revenue</div>
                <div className="ep-kpi-value">₹{analyticsData.monthlyRevenue.toLocaleString('en-IN')}</div>
                <div className="ep-kpi-sub text-success">Target: ₹8,00,000</div>
              </div>

              <div className="ep-kpi-card ep-card">
                <div className="ep-kpi-label">Active Bookings</div>
                <div className="ep-kpi-value">{analyticsData.activeBookings}</div>
                <div className="ep-kpi-sub">5 pending quotes</div>
              </div>

              <div className="ep-kpi-card ep-card">
                <div className="ep-kpi-label">Lead Conversion Rate</div>
                <div className="ep-kpi-value">{analyticsData.conversionRate}%</div>
                <div className="ep-kpi-sub text-success">Top Tier Industry Benchmark</div>
              </div>
            </div>

            {/* Revenue Chart Simulation & Performance */}
            <div className="ep-charts-grid">
              <div className="ep-chart-card ep-card">
                <h3>Monthly Revenue Pipeline (₹)</h3>
                <div className="ep-bar-chart">
                  {analyticsData.monthlyChart.map((item, idx) => (
                    <div key={idx} className="ep-bar-group">
                      <div
                        className="ep-bar"
                        style={{ height: `${(item.revenue / 700000) * 180}px` }}
                      >
                        <span className="ep-bar-tooltip">₹{(item.revenue / 1000).toFixed(0)}k</span>
                      </div>
                      <span className="ep-bar-label">{item.month}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="ep-chart-card ep-card">
                <h3>Event Category Distribution</h3>
                <div className="ep-category-distribution">
                  <div className="ep-dist-row">
                    <span>Wedding & Sangeet (55%)</span>
                    <div className="ep-dist-bar-wrapper"><div className="ep-dist-bar" style={{ width: '55%', background: '#6C3CE1' }}></div></div>
                  </div>
                  <div className="ep-dist-row">
                    <span>Corporate Summits (25%)</span>
                    <div className="ep-dist-bar-wrapper"><div className="ep-dist-bar" style={{ width: '25%', background: '#F97316' }}></div></div>
                  </div>
                  <div className="ep-dist-row">
                    <span>Birthdays & Galas (12%)</span>
                    <div className="ep-dist-bar-wrapper"><div className="ep-dist-bar" style={{ width: '12%', background: '#10B981' }}></div></div>
                  </div>
                  <div className="ep-dist-row">
                    <span>Travel Retreats (8%)</span>
                    <div className="ep-dist-bar-wrapper"><div className="ep-dist-bar" style={{ width: '8%', background: '#3B82F6' }}></div></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Booking CRM Pipeline */}
        {activeTab === 'bookings' && (
          <div className="ep-admin-bookings-tab ep-animate-fade-in">
            <div className="ep-card ep-admin-table-card">
              <div className="ep-table-header-flex">
                <h3>Live Bookings & Pipeline</h3>
                <div className="ep-filter-btns">
                  {['all', 'confirmed', 'pending', 'completed'].map((st) => (
                    <button
                      key={st}
                      className={`ep-filter-btn ${filterStatus === st ? 'active' : ''}`}
                      onClick={() => setFilterStatus(st)}
                    >
                      {st.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <table className="ep-table">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Client Name</th>
                    <th>Package Theme</th>
                    <th>Event Date</th>
                    <th>Total Contract</th>
                    <th>Pipeline Stage</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings
                    .filter(b => filterStatus === 'all' || b.status === filterStatus)
                    .map((b) => (
                      <tr key={b.id}>
                        <td><strong>{b.id}</strong></td>
                        <td>{b.client}</td>
                        <td>{b.theme}</td>
                        <td>{b.date}</td>
                        <td>₹{b.amount.toLocaleString('en-IN')}</td>
                        <td><span className="ep-stage-tag">{b.stage}</span></td>
                        <td>
                          <span className={`ep-badge ${b.status === 'confirmed' ? 'ep-badge-success' : b.status === 'pending' ? 'ep-badge-warning' : 'ep-badge-primary'}`}>
                            {b.status}
                          </span>
                        </td>
                        <td>
                          {b.status === 'pending' && (
                            <button className="ep-btn ep-btn-primary ep-btn-sm" onClick={() => updateBookingStatus(b.id, 'confirmed')}>
                              Approve
                            </button>
                          )}
                          {b.status === 'confirmed' && (
                            <button className="ep-btn ep-btn-ghost ep-btn-sm" onClick={() => updateBookingStatus(b.id, 'completed')}>
                              Mark Complete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Package Manager */}
        {activeTab === 'packages' && (
          <div className="ep-admin-packages-tab ep-animate-fade-in">
            <div className="ep-card ep-admin-table-card">
              <div className="ep-table-header-flex">
                <h3>Configured Theme Packages</h3>
                <button className="ep-btn ep-btn-accent ep-btn-sm" onClick={() => alert('New Package Form Opened')}>
                  + Add New Package
                </button>
              </div>

              <table className="ep-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Package Name</th>
                    <th>Category</th>
                    <th>Base Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {packages.map((p) => (
                    <tr key={p.id}>
                      <td><strong>{p.id}</strong></td>
                      <td>{p.name}</td>
                      <td>{p.category}</td>
                      <td>₹{p.price.toLocaleString('en-IN')}</td>
                      <td><span className="ep-badge ep-badge-success">{p.status}</span></td>
                      <td>
                        <button className="ep-btn ep-btn-ghost ep-btn-sm">Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
