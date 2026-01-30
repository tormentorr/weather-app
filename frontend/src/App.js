import React, { useState, useEffect, useCallback, useRef } from 'react';
import CitySearch from './components/CitySearch';
import MostViewedCities from './components/MostViewedCities';
import CurrentWeather from './components/CurrentWeather';
import Forecast from './components/Forecast';
import { getWeather } from './services/weatherApi';
import { logCitySelection } from './services/backendApi';
import { getMostViewedCities, recordCityView } from './services/storage';
import './styles/main.scss';

function App() {
  const [mostViewed, setMostViewed] = useState([]);
  const [error, setError] = useState(null);
  const [hasData, setHasData] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  const weatherRef = useRef(null);
  const cityRef = useRef(null);
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    setMostViewed(getMostViewedCities());
  }, []);

  const handleCitySelect = useCallback(async (city) => {
    cityRef.current = city;
    setError(null);

    recordCityView(city);
    logCitySelection(city.label || city.name);

    // Only show spinner if fetch takes longer than 300ms
    const loadingTimer = setTimeout(() => setShowLoading(true), 300);

    try {
      const data = await getWeather(city.latitude, city.longitude);
      weatherRef.current = data;
      setHasData(true);
    } catch (err) {
      setError('Failed to fetch weather data. Please try again.');
    }

    clearTimeout(loadingTimer);
    setShowLoading(false);
    setMostViewed(getMostViewedCities());
    forceUpdate((n) => n + 1);
  }, []);

  const cityName = cityRef.current?.label || cityRef.current?.name;

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Weather Forecast</h1>
        <p>Search for a city to see current weather and 5-day forecast</p>
      </header>

      <CitySearch onCitySelect={handleCitySelect} />

      <MostViewedCities cities={mostViewed} onCitySelect={handleCitySelect} />

      {showLoading && (
        <div className="loading-spinner">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading weather data...</p>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      {hasData && (
        <>
          <CurrentWeather cityName={cityName} data={weatherRef.current} />
          <Forecast data={weatherRef.current} />
        </>
      )}
    </div>
  );
}

export default App;
