import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation, Link } from 'react-router-dom';
import { getThemeById } from '../services/themeService';
import { checkAvailability, createBooking } from '../services/bookingService';
import BookingForm from '../component/BookingForm';
import '../styles/Booking.css';

const Booking = () => {
  const navigate = useNavigate();
  const { themeId } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  // If themeId is not present in params, try to get it from query params
  const effectiveThemeId = themeId || queryParams.get('themeId');

  const [theme, setTheme] = useState(null);
  const [addOns, setAddOns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [bookingData, setBookingData] = useState(null);

  useEffect(() => {
    const fetchThemeData = async () => {
      if (!effectiveThemeId) {
        setError('Please select your desired event package to continue.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        const themeData = await getThemeById(effectiveThemeId);

        setTheme(themeData);
        setAddOns([]);

        const today = new Date();
        const twoMonthsLater = new Date();
        twoMonthsLater.setDate(today.getDate() + 60);

        const availabilityData = await checkAvailability(
          effectiveThemeId,
          today,
          twoMonthsLater
        );

        setAvailableDates(Array.isArray(availabilityData.availableDates) ? availabilityData.availableDates : []);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching theme data:', err);
        setError('Failed to load theme details. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchThemeData();
  }, [effectiveThemeId]);

  const handleCreateBooking = async (formData) => {
    try {
      const bookingPayload = {
        themeId: effectiveThemeId,
        date: formData.selectedDate,
        guestCount: 1,
        venueType: formData.venueType,
        venue: formData.venueType === 'customer' ? formData.customVenueAddress : null,
        totalPrice: formData.totalPrice,
        customerInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          specialRequests: formData.specialRequests
        }
      };

      const result = await createBooking(bookingPayload);
      setBookingData(result);
      // Navigate to payment page with booking ID only, no state
      navigate(`/payment/${result.id}`);
    } catch (err) {
      console.error('Error creating booking:', err);
      setError('Failed to create booking. Please try again.');
    }
  };

  if (isLoading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        {!effectiveThemeId && (
          <Link to="/themes">
            <button className="redirect-button">Go to Themes</button>
          </Link>
        )}
      </div>
    );
  }

  if (!theme) {
    return <div className="error-container">Theme not found.</div>;
  }

  return (
    <div className="booking-page-container">
      <BookingForm
        theme={theme}
        availableDates={availableDates}
        onCreateBooking={handleCreateBooking}
        error={error}
      />
    </div>
  );
};

export default Booking;
