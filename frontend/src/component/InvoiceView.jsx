import React from 'react';
import '../styles/InvoiceView.css';

const InvoiceView = ({ invoiceData }) => {
  if (!invoiceData) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="ep-invoice-paper" id="printable-invoice">
      <div className="ep-invoice-actions ep-no-print">
        <button className="ep-btn ep-btn-primary ep-btn-sm" onClick={handlePrint}>
          🖨️ Print / Download PDF
        </button>
      </div>

      {/* Header */}
      <div className="ep-inv-header">
        <div className="ep-inv-brand">
          <div className="ep-inv-logo">EventPulse Enterprise</div>
          <p className="ep-inv-org">EventPulse Operations Pvt Ltd</p>
          <p>GS Road, Christian Basti, Guwahati, Assam - 781005</p>
          <p>GSTIN: 18AABCE1234F1Z9 | CIN: U74999AS2024PTC012345</p>
          <p>Email: billing@eventpulse.io | Phone: +91 98765 43210</p>
        </div>

        <div className="ep-inv-meta">
          <h2 className="ep-inv-type-title">TAX INVOICE</h2>
          <div className="ep-inv-meta-row">
            <span>Invoice No:</span>
            <strong>{invoiceData.invoiceNumber || 'INV-2026-001'}</strong>
          </div>
          <div className="ep-inv-meta-row">
            <span>Date:</span>
            <span>{invoiceData.date}</span>
          </div>
          <div className="ep-inv-meta-row">
            <span>Event Date:</span>
            <span>{invoiceData.eventDate}</span>
          </div>
        </div>
      </div>

      <div className="ep-inv-divider"></div>

      {/* Bill To & Event Details */}
      <div className="ep-inv-parties">
        <div className="ep-inv-billto">
          <h4>Billed To (Client)</h4>
          <p className="name">{invoiceData.clientName}</p>
          <p>{invoiceData.clientEmail}</p>
          <p>{invoiceData.clientPhone}</p>
        </div>

        <div className="ep-inv-event-details">
          <h4>Event Destination</h4>
          <p className="name">{invoiceData.eventName}</p>
          <p>Location: {invoiceData.location}</p>
        </div>
      </div>

      {/* Table */}
      <table className="ep-inv-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Item / Service Description</th>
            <th className="text-right">Rate / Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {invoiceData.items?.map((item, idx) => (
            <tr key={idx}>
              <td>{idx + 1}</td>
              <td>
                <strong>{item.name}</strong>
                {item.description && <div className="desc">{item.description}</div>}
              </td>
              <td className="text-right">₹{item.amount.toLocaleString('en-IN')}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals Breakdown */}
      <div className="ep-inv-totals-section">
        <div className="ep-inv-notes">
          <h4>Terms & Payment Instructions</h4>
          <ul>
            <li>Deposit paid reserves date and locks equipment schedule.</li>
            <li>Remaining balance due 7 business days prior to event date.</li>
            <li>Bank Transfer: HDFC Bank | A/C: 50200012345678 | IFSC: HDFC0001234</li>
          </ul>
        </div>

        <div className="ep-inv-totals-box">
          <div className="row">
            <span>Subtotal</span>
            <span>₹{(invoiceData.total - invoiceData.tax).toLocaleString('en-IN')}</span>
          </div>
          <div className="row">
            <span>CGST (9%) + SGST (9%)</span>
            <span>₹{invoiceData.tax.toLocaleString('en-IN')}</span>
          </div>
          <div className="row grand-total">
            <span>Total Contract Value</span>
            <strong>₹{invoiceData.total.toLocaleString('en-IN')}</strong>
          </div>
          <div className="row text-success">
            <span>Paid Advance Deposit</span>
            <span>- ₹{invoiceData.paidAmount.toLocaleString('en-IN')}</span>
          </div>
          <div className="row balance-due text-danger">
            <span>Balance Due</span>
            <strong>₹{invoiceData.balanceDue.toLocaleString('en-IN')}</strong>
          </div>
        </div>
      </div>

      {/* Signatures */}
      <div className="ep-inv-signatures">
        <div className="sig-block">
          <div className="line"></div>
          <p>Client Acceptance Signature</p>
        </div>
        <div className="sig-block text-right">
          <div className="line"></div>
          <p>For EventPulse Operations Pvt Ltd</p>
        </div>
      </div>
    </div>
  );
};

export default InvoiceView;
