import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

/**
 * Log a user action (city selection) to the backend.
 */
export async function logCitySelection(city) {
  try {
    await axios.post(`${BACKEND_URL}/api/log`, {
      city,
      action: 'CITY_SELECTED',
    });
  } catch (err) {
    console.error('Failed to log action to backend:', err.message);
  }
}
