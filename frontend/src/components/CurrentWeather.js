import React from 'react';
import { getWeatherInfo } from '../services/weatherApi';

function CurrentWeather({ cityName, data }) {
  if (!data) return null;

  const { current, current_units } = data;
  const weatherInfo = getWeatherInfo(current.weather_code);

  return (
    <div className="current-weather">
      <div className="city-name">{cityName}</div>
      <div className="weather-description">
        {weatherInfo.icon} {weatherInfo.description}
      </div>
      <div className="temperature">
        {Math.round(current.temperature_2m)}{current_units.temperature_2m}
      </div>
      <div className="weather-details">
        <div className="detail-item">
          <span className="detail-label">Feels Like</span>
          <span className="detail-value">
            {Math.round(current.apparent_temperature)}{current_units.apparent_temperature}
          </span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Humidity</span>
          <span className="detail-value">
            {current.relative_humidity_2m}{current_units.relative_humidity_2m}
          </span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Wind</span>
          <span className="detail-value">
            {current.wind_speed_10m} {current_units.wind_speed_10m}
          </span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Wind Direction</span>
          <span className="detail-value">
            {current.wind_direction_10m}{current_units.wind_direction_10m}
          </span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Pressure</span>
          <span className="detail-value">
            {current.pressure_msl} {current_units.pressure_msl}
          </span>
        </div>
      </div>
    </div>
  );
}

export default CurrentWeather;
