// authService.js - Handles authentication API calls

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Register a new user
 * @param {Object} userData - { username, email, password }
 * @returns {Promise} - Promise resolving to registration response
 */
export const register = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || (errorData.errors && errorData.errors.map(e => e.msg).join(', ')) || `Error registering user: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

/**
 * Login user
 * @param {Object} credentials - { email, password }
 * @returns {Promise} - Promise resolving to { token, user }
 */
export const login = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(credentials)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || (errorData.errors && errorData.errors.map(e => e.msg).join(', ')) || `Error logging in: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Logout user — calls backend to clear HttpOnly JWT cookie, then clears localStorage
 */
export const logout = async () => {
  try {
    await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    });
  } catch (err) {
    console.warn('Backend logout call failed:', err.message);
  }
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};

/**
 * Save user info and token to localStorage
 * @param {Object} user - User object from login response
 */
export const saveAuthData = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

/**
 * Request password reset link
 * @param {string} email
 * @returns {Promise}
 */
export const forgotPassword = async (email) => {
  try {
    const response = await fetch(`${API_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || (errorData.errors && errorData.errors.map(e => e.msg).join(', ')) || 'Failed to process forgot password request');
    }

    return await response.json();
  } catch (error) {
    console.error('Forgot password error:', error);
    throw error;
  }
};

/**
 * Reset password using token
 * @param {Object} data - { token, newPassword }
 * @returns {Promise}
 */
export const resetPassword = async ({ token, newPassword }) => {
  try {
    const response = await fetch(`${API_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token, newPassword })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || (errorData.errors && errorData.errors.map(e => e.msg).join(', ')) || 'Failed to reset password');
    }

    return await response.json();
  } catch (error) {
    console.error('Reset password error:', error);
    throw error;
  }
};

/**
 * Get current authenticated user from localStorage
 * @returns {Object|null}
 */
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

