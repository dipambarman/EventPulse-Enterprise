// paymentService.js - Handles payment-related API calls

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Create a payment intent
 * @param {Object} bookingDetails - Booking details including amount, currency, etc.
 * @returns {Promise} - Promise resolving to payment intent with client secret
 */
export const createPaymentIntent = async (bookingDetails) => {
  try {
    const response = await fetch(`${API_URL}/payments/create-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(bookingDetails)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error creating payment intent: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Payment intent creation error:', error);
    throw error;
  }
};

/**
 * Confirm a payment
 * @param {string} paymentIntentId - The payment intent ID
 * @param {Object} paymentData - Additional payment data
 * @returns {Promise} - Promise resolving to payment confirmation
 */
export const confirmPayment = async (paymentIntentId, paymentData) => {
  try {
    const response = await fetch(`${API_URL}/payments/confirm/${paymentIntentId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(paymentData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error confirming payment: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error confirming payment ${paymentIntentId}:`, error);
    throw error;
  }
};

/**
 * Process a payment by creating intent and confirming payment
 * @param {Object} paymentPayload - Contains paymentDetails, bookingInfo, amount
 * @returns {Promise<Object>} - { success: boolean, paymentId?: string, message?: string }
 */
export const processPayment = async ({ paymentDetails, bookingInfo, amount }) => {
  try {
    // Step 1: Create payment intent
    const intentResponse = await createPaymentIntent({
      bookingInfo,
      amount
    });

    if (!intentResponse || !intentResponse.paymentIntentId) {
      return { success: false, message: 'Failed to create payment intent' };
    }

    const paymentIntentId = intentResponse.paymentIntentId;

    // Step 2: Confirm payment with payment details
    const confirmResponse = await confirmPayment(paymentIntentId, paymentDetails);

    if (confirmResponse && confirmResponse.success) {
      return { success: true, paymentId: paymentIntentId };
    } else {
      return { success: false, message: confirmResponse?.message || 'Payment confirmation failed' };
    }
  } catch (error) {
    console.error('processPayment error:', error);
    return { success: false, message: error.message || 'Payment processing error' };
  }
};

/**
 * Get payment methods for the current user
 * @returns {Promise} - Promise resolving to payment methods array
 */
export const getPaymentMethods = async () => {
  try {
    const response = await fetch(`${API_URL}/payments/methods`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error fetching payment methods: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    throw error;
  }
};

/**
 * Add a new payment method
 * @param {Object} paymentMethodData - Payment method details
 * @returns {Promise} - Promise resolving to added payment method
 */
export const addPaymentMethod = async (paymentMethodData) => {
  try {
    const response = await fetch(`${API_URL}/payments/methods`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(paymentMethodData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error adding payment method: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error adding payment method:', error);
    throw error;
  }
};

/**
 * Remove a payment method
 * @param {string} paymentMethodId - Payment method ID
 * @returns {Promise} - Promise resolving to removal confirmation
 */
export const removePaymentMethod = async (paymentMethodId) => {
  try {
    const response = await fetch(`${API_URL}/payments/methods/${paymentMethodId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error removing payment method: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error removing payment method ${paymentMethodId}:`, error);
    throw error;
  }
};

/**
 * Get payment history for the current user
 * @param {Object} filters - Optional filters like date range, status
 * @returns {Promise} - Promise resolving to payments array
 */
export const getPaymentHistory = async (filters = {}) => {
  try {
    // Build query string from filters
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        queryParams.append(key, value);
      }
    });
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    
    const response = await fetch(`${API_URL}/payments/history${queryString}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error fetching payment history: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching payment history:', error);
    throw error;
  }
};

/**
 * Request a refund
 * @param {string} paymentId - Payment ID
 * @param {Object} refundData - Refund details including reason and amount
 * @returns {Promise} - Promise resolving to refund confirmation
 */
export const requestRefund = async (paymentId, refundData) => {
  try {
    const response = await fetch(`${API_URL}/payments/${paymentId}/refund`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(refundData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error requesting refund: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error requesting refund for payment ${paymentId}:`, error);
    throw error;
  }
};
