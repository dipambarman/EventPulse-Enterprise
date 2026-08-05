import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { getBookingById } from '../services/bookingService';
import '../styles/components.css';

const Confirmation = () => {
  const { bookingId } = useParams();
  const location = useLocation();
  const [booking, setBooking] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Extract bookingId and paymentId from query params if not in URL params
  const queryParams = new URLSearchParams(location.search);
  const queryBookingId = queryParams.get('bookingId');
  const paymentId = queryParams.get('paymentId');

  const effectiveBookingId = bookingId || queryBookingId;

  useEffect(() => {
    const fetchDetails = async () => {
      if (!effectiveBookingId) {
        setError('Booking ID is missing. Please check your booking link.');
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        const bookingData = await getBookingById(effectiveBookingId);
        setBooking(bookingData);

        if (paymentId) {
          // Fetch payment details from backend
          const response = await fetch(`/api/payments/razorpay/payment/${paymentId}`, {
            credentials: 'include'
          });
          if (!response.ok) {
            throw new Error('Failed to fetch payment details');
          }
          const paymentData = await response.json();
          setPaymentDetails(paymentData);
        }

        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching details:', err);
        setError('Failed to load booking or payment details. Please contact support.');
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [effectiveBookingId, paymentId]);

  const formatDate = (dateString) => {
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (isLoading) {
    return <div className="loading-spinner">Loading confirmation details...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  if (!booking) {
    return <div className="error-container">Booking not found.</div>;
  }

  return (
    <div className="confirmation-page-container">
      <div className="confirmation-header">
        <div className="confirmation-icon">✓</div>
        <h1>Booking Confirmed!</h1>
        <p>Your event has been successfully booked.</p>
      </div>

      <div className="confirmation-details">
        <div className="confirmation-number">
          <span>Confirmation Number:</span>
          <span className="booking-reference">{booking.referenceNumber}</span>
        </div>

        <div className="confirmation-card">
          <h2>Event Details</h2>
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">Theme:</span>
              <span className="detail-value">{booking.theme.name}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Date:</span>
              <span className="detail-value">{formatDate(booking.date)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Number of Guests:</span>
              <span className="detail-value">{booking.guestCount}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Venue Type:</span>
              <span className="detail-value">
                {booking.venueType === 'provided' ? 'Our Venue' : 'Your Venue'}
              </span>
            </div>
            {booking.venueType === 'customer' && (
              <div className="detail-item">
                <span className="detail-label">Venue Address:</span>
                <span className="detail-value">{booking.venue}</span>
              </div>
            )}
          </div>
        </div>

        <div className="confirmation-card">
          <h2>Payment Summary</h2>
          <div className="payment-summary">
            <div className="summary-row">
              <span>Base Price:</span>
              <span>${booking.basePrice.toFixed(2)}</span>
            </div>
            {booking.addOnsPrice > 0 && (
              <div className="summary-row">
                <span>Add-ons:</span>
                <span>{booking.addOnsPrice.toFixed(2)}</span>
              </div>
            )}
            {booking.extraGuestsPrice > 0 && (
              <div className="summary-row">
                <span>Extra Guests:</span>
                <span>${booking.extraGuestsPrice.toFixed(2)}</span>
              </div>
            )}
            {booking.venueType === 'customer' && booking.venueDiscount > 0 && (
              <div className="summary-row discount">
                <span>Venue Discount:</span>
                <span>-${booking.venueDiscount.toFixed(2)}</span>
              </div>
            )}
            <div className="summary-row total">
              <span>Total Paid:</span>
              <span>{booking.totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {paymentDetails && (
          <div className="confirmation-card">
            <h2>Payment Details</h2>
            <div className="payment-info">
              <div className="info-row">
                <span>Payment ID:</span>
                <span>{paymentDetails.id}</span>
              </div>
              <div className="info-row">
                <span>Status:</span>
                <span>{paymentDetails.status}</span>
              </div>
              <div className="info-row">
                <span>Method:</span>
                <span>{paymentDetails.method}</span>
              </div>
              <div className="info-row">
                <span>Amount:</span>
                <span>${(paymentDetails.amount / 100).toFixed(2)}</span>
              </div>
              <div className="info-row">
                <span>Currency:</span>
                <span>{paymentDetails.currency}</span>
              </div>
              <div className="info-row">
                <span>Created At:</span>
                <span>{new Date(paymentDetails.created_at * 1000).toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        <div className="confirmation-card">
          <h2>What's Next?</h2>
          <div className="next-steps">
            <div className="step-item">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Confirmation Email</h3>
                <p>You will receive a confirmation email shortly with all the details of your booking.</p>
              </div>
            </div>
            <div className="step-item">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Prepare for Your Event</h3>
                <p>Start planning your event! If you have any questions, feel free to reach out to our support team.</p>
              </div>
            </div>
            <div className="step-item">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Follow Us on Social Media</h3>
                <p>Stay updated with our latest themes and offers by following us on our social media channels.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="confirmation-footer">
          <Link to="/" className="btn btn-primary">Back to Home</Link>
          <Link to="/themes" className="btn btn-secondary">Explore More Themes</Link>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
