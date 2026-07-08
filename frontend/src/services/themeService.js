// themeService.js - Handles all theme-related API calls

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Fetch all available event themes
 * @param {Object} filters - Optional filters (category, price range, etc)
 * @returns {Promise} - Promise resolving to themes array
 */
export const getAllThemes = async (filters = {}) => {
  try {
    // Build query string from filters
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        queryParams.append(key, value);
      }
    });
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    const response = await fetch(`${API_URL}/themes${queryString}`);
    
    if (!response.ok) {
      throw new Error(`Error fetching themes: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Theme service error:', error);
    throw error;
  }
};

/**
 * Get a specific theme by ID
 * @param {string} id - Theme ID
 * @returns {Promise} - Promise resolving to theme object
 */
export const getThemeById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/themes/${id}`);
    
    if (!response.ok) {
      throw new Error(`Error fetching theme: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching theme ${id}:`, error);
    throw error;
  }
};

/**
 * Get theme categories for filtering
 * @returns {Promise} - Promise resolving to categories array
 */
export const getThemeCategories = async () => {
  try {
    const response = await fetch(`${API_URL}/themes/categories`);
    
    if (!response.ok) {
      throw new Error(`Error fetching theme categories: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching theme categories:', error);
    throw error;
  }
};

/**
 * Get theme add-ons for a specific theme
 * @param {string} themeId - Theme ID
 * @returns {Promise} - Promise resolving to add-ons array
 */
export const getThemeAddOns = async (themeId) => {
  try {
    const response = await fetch(`${API_URL}/themes/${themeId}/addons`);
    
    if (!response.ok) {
      throw new Error(`Error fetching theme add-ons: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching add-ons for theme ${themeId}:`, error);
    throw error;
  }
};
