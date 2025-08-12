// src/config/api.js

const API_CONFIG = {
  // Development API URL
  DEVELOPMENT: 'http://localhost:5000/api',
  
  // Production API URL (update this when you deploy)
  PRODUCTION: 'https://memora-backend-kgdg.onrender.com/api',
  
  // Staging API URL (if you have one)
  STAGING: 'https://staging-api.your-domain.com/api'
};

// Determine which environment we're in
const getEnvironment = () => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'DEVELOPMENT';
    } else if (hostname.includes('staging')) {
      return 'STAGING';
    } else {
      return 'PRODUCTION';
    }
  }
  
  return 'DEVELOPMENT'; // Default fallback
};

// Get the appropriate API URL for current environment
export const getApiUrl = () => {
  const environment = getEnvironment();
  return API_CONFIG[environment];
};

// Export the configuration object for direct access if needed
export default API_CONFIG;