import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getBookingById } from '../services/bookingService';
import PaymentForm from '../component/PaymentForm';
import '../styles/components.css';

const Payment = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [booking, setBooking] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchBookingFromSession = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/bookings/session/booking', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          credentials: 'include'
        });
        if (!response.ok) {
          throw new Error('No booking data found in session');
        }
        const bookingData = await response.json();
        setBooking(bookingData);
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading booking from session:', err);
        setError('Failed to load booking information. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchBookingFromSession();
  }, []);

  const handlePaymentSuccess = (paymentId) => {
    navigate(`/confirmation/${bookingId}`);
  };

  if (isLoading) {
    return <div className="loading-spinner">Loading payment details...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  if (!booking) {
    return <div className="error-container">Booking not found.</div>;
  }

  return (
    <div className="payment-page-container">
      <PaymentForm
        bookingDetails={booking}
        totalAmount={booking.totalPrice}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default Payment;
