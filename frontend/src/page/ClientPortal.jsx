import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getCurrentUser } from '../services/authService';
import InvoiceView from '../component/InvoiceView';
import '../styles/ClientPortal.css';

const ClientPortal = () => {
  const user = getCurrentUser() || { username: 'Valued Client', email: 'client@example.com' };
  const [activeTab, setActiveTab] = useState('upcoming');
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Mock client events data
  const mockEvents = [
    {
      id: 'EVT-2026-9812',
      title: 'Royal Destination Wedding & Sangeet',
      themeName: 'Wedding Exclusive',
      date: '2026-11-15',
      time: '18:00',
      location: 'Grand Heritage Resort & Spa, Guwahati',
      status: 'confirmed',
      planner: {
        name: 'Vikramaditya Roy',
        role: 'Senior Event Producer',
        phone: '+91 98765 12345',
        email: 'vikram@eventpulse.io',
        avatar: 'V'
      },
      milestones: [
        { title: 'Initial Deposit & Date Lock', status: 'completed', date: '2026-07-10' },
        { title: 'Theme & Floral Concept Sign-off', status: 'completed', date: '2026-08-01' },
        { title: 'Catering Menu Tasting', status: 'current', date: '2026-09-10' },
        { title: 'Final Production Setup', status: 'pending', date: '2026-11-14' }
      ],
      pricing: {
        subtotal: 550000,
        tax: 99000,
        total: 649000,
        paid: 200000,
        balance: 449000
      }
    }
  ];

  const currentEvent = mockEvents[0];

  // Calculate countdown
  const calculateDaysLeft = (targetDateStr) => {
    const target = new Date(targetDateStr);
    const now = new Date();
    const diffTime = target - now;
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  };

  const daysRemaining = calculateDaysLeft(currentEvent.date);

  const openInvoice = (eventObj) => {
    setSelectedInvoice({
      invoiceNumber: 'INV-2026-0089',
      date: new Date().toLocaleDateString('en-IN'),
      dueDate: currentEvent.date,
      clientName: user.username || 'Valued Client',
      clientEmail: user.email || 'client@example.com',
      clientPhone: '+91 98765 00000',
      eventName: currentEvent.title,
      eventDate: currentEvent.date,
      location: currentEvent.location,
      items: [
        { name: `${currentEvent.themeName} Package`, description: 'Full decor, venue discount, stage setup & sound', amount: 450000 },
        { name: '4K Cinematic Video & Photo Addon', description: '2 videographers + drone coverage', amount: 60000 },
        { name: 'Exotic Entrance Floral Arch', description: 'Fresh orchid & marigold setup', amount: 40000 }
      ],
      tax: currentEvent.pricing.tax,
      total: currentEvent.pricing.total,
      paidAmount: currentEvent.pricing.paid,
      balanceDue: currentEvent.pricing.balance
    });
    setShowInvoiceModal(true);
  };

  return (
    <div className="ep-portal-page" id="client-portal-page">
      <div className="ep-portal-header">
        <div className="ep-container">
          <div className="ep-portal-welcome">
            <div className="ep-client-avatar">
              {(user.username || 'C').charAt(0).toUpperCase()}
            </div>
            <div>
              <span className="ep-badge ep-badge-primary">Client Workspace</span>
              <h1 className="ep-portal-name">Welcome back, {user.username || 'Client'}</h1>
              <p className="ep-portal-email">{user.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="ep-container ep-portal-content">
        {/* Navigation Tabs */}
        <div className="ep-portal-tabs">
          <button
            className={`ep-portal-tab ${activeTab === 'upcoming' ? 'active' : ''}`}
            onClick={() => setActiveTab('upcoming')}
          >
            Active Events (1)
          </button>
          <button
            className={`ep-portal-tab ${activeTab === 'invoices' ? 'active' : ''}`}
            onClick={() => setActiveTab('invoices')}
          >
            Invoices & Payments
          </button>
        </div>

        {activeTab === 'upcoming' && (
          <div className="ep-portal-grid">
            
            {/* Left Column: Countdown & Milestones */}
            <div className="ep-portal-left">
              
              {/* Event Countdown Card */}
              <div className="ep-countdown-card ep-card">
                <div className="ep-countdown-badge">Upcoming Event</div>
                <h2 className="ep-event-title">{currentEvent.title}</h2>
                <div className="ep-event-meta">
                  <span>📅 {new Date(currentEvent.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  <span>📍 {currentEvent.location}</span>
                </div>

                <div className="ep-countdown-timer">
                  <div className="ep-timer-block">
                    <span className="number">{daysRemaining}</span>
                    <span className="unit">Days Left</span>
                  </div>
                  <div className="ep-timer-colon">:</div>
                  <div className="ep-timer-block">
                    <span className="number">14</span>
                    <span className="unit">Hours</span>
                  </div>
                  <div className="ep-timer-colon">:</div>
                  <div className="ep-timer-block">
                    <span className="number">32</span>
                    <span className="unit">Mins</span>
                  </div>
                </div>

                <div className="ep-event-status-strip">
                  <span>Status: <strong className="ep-status-confirmed">Confirmed & Production Ready</strong></span>
                  <button className="ep-btn ep-btn-outline ep-btn-sm" onClick={() => openInvoice(currentEvent)}>
                    📄 View Invoice PDF
                  </button>
                </div>
              </div>

              {/* Milestone Checklist Card */}
              <div className="ep-milestones-card ep-card">
                <h3>Event Production Milestones</h3>
                <p className="subtitle">Track live setup progress from date reservation to showtime.</p>

                <div className="ep-milestone-timeline">
                  {currentEvent.milestones.map((m, idx) => (
                    <div key={idx} className={`ep-timeline-item ${m.status}`}>
                      <div className="ep-timeline-icon">
                        {m.status === 'completed' && '✓'}
                        {m.status === 'current' && '⏳'}
                        {m.status === 'pending' && '○'}
                      </div>
                      <div className="ep-timeline-content">
                        <h4>{m.title}</h4>
                        <span className="date">{m.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column: Financial Summary & Assigned Planner */}
            <div className="ep-portal-right">
              
              {/* Assigned Planner Card */}
              <div className="ep-planner-card ep-card">
                <h3>Your Assigned Event Director</h3>
                <div className="ep-planner-profile">
                  <div className="ep-planner-avatar">{currentEvent.planner.avatar}</div>
                  <div>
                    <h4>{currentEvent.planner.name}</h4>
                    <p>{currentEvent.planner.role}</p>
                  </div>
                </div>
                <div className="ep-planner-contacts">
                  <a href={`tel:${currentEvent.planner.phone}`} className="ep-btn ep-btn-ghost ep-btn-block">
                    📞 Call Producer ({currentEvent.planner.phone})
                  </a>
                  <a href={`mailto:${currentEvent.planner.email}`} className="ep-btn ep-btn-outline ep-btn-block">
                    ✉️ Email Producer
                  </a>
                </div>
              </div>

              {/* Financial Balance Summary Card */}
              <div className="ep-balance-card ep-card">
                <h3>Financial Summary</h3>
                <div className="ep-balance-row">
                  <span>Total Event Contract:</span>
                  <strong>₹{currentEvent.pricing.total.toLocaleString('en-IN')}</strong>
                </div>
                <div className="ep-balance-row">
                  <span>Advance Deposit Paid:</span>
                  <span className="text-success">₹{currentEvent.pricing.paid.toLocaleString('en-IN')}</span>
                </div>
                <div className="ep-balance-divider"></div>
                <div className="ep-balance-row ep-balance-due">
                  <span>Remaining Balance Due:</span>
                  <strong className="text-danger">₹{currentEvent.pricing.balance.toLocaleString('en-IN')}</strong>
                </div>

                <Link
                  to={`/payment/${currentEvent.id}`}
                  className="ep-btn ep-btn-accent ep-btn-block ep-pay-now-btn"
                >
                  💳 Pay Remaining Balance
                </Link>
              </div>

            </div>

          </div>
        )}

        {activeTab === 'invoices' && (
          <div className="ep-invoices-tab ep-animate-fade-in">
            <div className="ep-card ep-invoices-table-card">
              <h3>Invoices & Receipts</h3>
              <table className="ep-table">
                <thead>
                  <tr>
                    <th>Invoice ID</th>
                    <th>Event</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Paid</th>
                    <th>Balance</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>INV-2026-0089</strong></td>
                    <td>{currentEvent.title}</td>
                    <td>{currentEvent.date}</td>
                    <td>₹{currentEvent.pricing.total.toLocaleString('en-IN')}</td>
                    <td className="text-success">₹{currentEvent.pricing.paid.toLocaleString('en-IN')}</td>
                    <td className="text-danger">₹{currentEvent.pricing.balance.toLocaleString('en-IN')}</td>
                    <td><span className="ep-badge ep-badge-warning">Partial Deposit</span></td>
                    <td>
                      <button className="ep-btn ep-btn-ghost ep-btn-sm" onClick={() => openInvoice(currentEvent)}>
                        View & Print
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Invoice Modal */}
      {showInvoiceModal && selectedInvoice && (
        <div className="ep-modal-overlay" onClick={() => setShowInvoiceModal(false)}>
          <div className="ep-modal-container" onClick={(e) => e.stopPropagation()}>
            <button className="ep-modal-close" onClick={() => setShowInvoiceModal(false)}>✕</button>
            <InvoiceView invoiceData={selectedInvoice} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientPortal;
