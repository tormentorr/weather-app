import axios from 'axios';

const OPEN_METEO_BASE = 'https://api.open-meteo.com/v1';
const GEOCODING_BASE = 'https://geocoding-api.open-meteo.com/v1';

/**
 * Search for cities by name using Open-Meteo Geocoding API.
 */
export async function searchCities(query) {
  if (!query || query.length < 2) return [];

  const { data } = await axios.get(`${GEOCODING_BASE}/search`, {
    params: { name: query, count: 10, language: 'en', format: 'json' },
  });

  if (!data.results) return [];

  return data.results.map((r) => ({
    label: `${r.name}, ${r.admin1 || ''}, ${r.country}`.replace(/, ,/, ','),
    value: `${r.latitude}_${r.longitude}`,
    name: r.name,
    country: r.country,
    latitude: r.latitude,
    longitude: r.longitude,
  }));
}

/**
 * Fetch current weather and 5-day forecast for given coordinates.
 */
export async function getWeather(latitude, longitude) {
  const { data } = await axios.get(`${OPEN_METEO_BASE}/forecast`, {
    params: {
      latitude,
      longitude,
      current: [
        'temperature_2m',
        'relative_humidity_2m',
        'apparent_temperature',
        'wind_speed_10m',
        'wind_direction_10m',
        'weather_code',
        'pressure_msl',
      ].join(','),
      daily: [
        'temperature_2m_max',
        'temperature_2m_min',
        'weather_code',
        'wind_speed_10m_max',
        'precipitation_sum',
      ].join(','),
      timezone: 'auto',
      forecast_days: 5,
    },
  });

  return data;
}

/**
 * Map WMO weather codes to descriptions and icons.
 */
export function getWeatherInfo(code) {
  const map = {
    0: { description: 'Clear sky', icon: '☀️' },
    1: { description: 'Mainly clear', icon: '🌤️' },
    2: { description: 'Partly cloudy', icon: '⛅' },
    3: { description: 'Overcast', icon: '☁️' },
    45: { description: 'Foggy', icon: '🌫️' },
    48: { description: 'Depositing rime fog', icon: '🌫️' },
    51: { description: 'Light drizzle', icon: '🌦️' },
    53: { description: 'Moderate drizzle', icon: '🌦️' },
    55: { description: 'Dense drizzle', icon: '🌧️' },
    61: { description: 'Slight rain', icon: '🌧️' },
    63: { description: 'Moderate rain', icon: '🌧️' },
    65: { description: 'Heavy rain', icon: '🌧️' },
    71: { description: 'Slight snow', icon: '🌨️' },
    73: { description: 'Moderate snow', icon: '🌨️' },
    75: { description: 'Heavy snow', icon: '❄️' },
    77: { description: 'Snow grains', icon: '❄️' },
    80: { description: 'Slight rain showers', icon: '🌦️' },
    81: { description: 'Moderate rain showers', icon: '🌧️' },
    82: { description: 'Violent rain showers', icon: '⛈️' },
    85: { description: 'Slight snow showers', icon: '🌨️' },
    86: { description: 'Heavy snow showers', icon: '❄️' },
    95: { description: 'Thunderstorm', icon: '⛈️' },
    96: { description: 'Thunderstorm with hail', icon: '⛈️' },
    99: { description: 'Thunderstorm with heavy hail', icon: '⛈️' },
  };

  return map[code] || { description: 'Unknown', icon: '❓' };
}
