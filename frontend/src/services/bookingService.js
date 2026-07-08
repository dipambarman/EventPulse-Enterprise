// bookingService.js - Handles booking-related API calls

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Check available dates for booking
 * @param {string} themeId - Theme ID
 * @param {Date} startDate - Start date for availability check
 * @param {Date} endDate - End date for availability check
 * @returns {Promise} - Promise resolving to available dates
 */
export const checkAvailability = async (themeId, startDate, endDate) => {
  try {
    const formattedStartDate = startDate.toISOString().split('T')[0];
    const formattedEndDate = endDate.toISOString().split('T')[0];
    
    const response = await fetch(
      `${API_URL}/bookings/availability?themeId=${themeId}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`
    );
    
    if (!response.ok) {
      throw new Error(`Error checking availability: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Availability check error:', error);
    throw error;
  }
};

/**
 * Create a new booking
 * @param {Object} bookingData - Booking information
 * @returns {Promise} - Promise resolving to booking confirmation
 */
export const createBooking = async (bookingData) => {
  try {
    const response = await fetch(`${API_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      credentials: 'include',
      body: JSON.stringify(bookingData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Backend error response:', errorData);
      throw new Error(errorData.message || `Error creating booking: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Booking creation error:', error);
    throw error;
  }
};

/**
 * Get a booking by ID
 * @param {string} bookingId - Booking ID
 * @returns {Promise} - Promise resolving to booking object
 */
export const getBookingById = async (bookingId) => {
  try {
    const response = await fetch(`${API_URL}/bookings/${bookingId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error fetching booking: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching booking ${bookingId}:`, error);
    throw error;
  }
};

/**
 * Get booking data from session
 * @returns {Promise} - Promise resolving to booking data from session
 */
export const getBookingFromSession = async () => {
  try {
    const response = await fetch(`${API_URL}/bookings/session/booking`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      credentials: 'include'
    });
    if (!response.ok) {
      throw new Error('No booking data found in session');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching booking from session:', error);
    throw error;
  }
};

/**
 * Update a booking
 * @param {string} bookingId - Booking ID
 * @param {Object} updateData - Data to update
 * @returns {Promise} - Promise resolving to updated booking
 */
export const updateBooking = async (bookingId, updateData) => {
  try {
    const response = await fetch(`${API_URL}/bookings/${bookingId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(updateData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error updating booking: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error updating booking ${bookingId}:`, error);
    throw error;
  }
};

/**
 * Cancel a booking
 * @param {string} bookingId - Booking ID
 * @param {Object} cancellationData - Cancellation reason and details
 * @returns {Promise} - Promise resolving to cancellation confirmation
 */
export const cancelBooking = async (bookingId, cancellationData = {}) => {
  try {
    const response = await fetch(`${API_URL}/bookings/${bookingId}/cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(cancellationData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error cancelling booking: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error cancelling booking ${bookingId}:`, error);
    throw error;
  }
};

/**
 * Get user's booking history
 * @param {Object} filters - Optional filters like status, date range
 * @returns {Promise} - Promise resolving to bookings array
 */
export const getUserBookings = async (filters = {}) => {
  try {
    // Build query string from filters
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        queryParams.append(key, value);
      }
    });
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    
    const response = await fetch(`${API_URL}/bookings/user${queryString}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error fetching user bookings: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    throw error;
  }
};
