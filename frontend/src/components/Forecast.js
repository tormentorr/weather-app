import React from 'react';
import { getWeatherInfo } from '../services/weatherApi';

function Forecast({ data }) {
  if (!data || !data.daily) return null;

  const { daily } = data;
  const days = daily.time.map((date, i) => {
    const weatherInfo = getWeatherInfo(daily.weather_code[i]);
    const dayName = new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });

    return {
      date,
      dayName,
      icon: weatherInfo.icon,
      description: weatherInfo.description,
      tempMax: Math.round(daily.temperature_2m_max[i]),
      tempMin: Math.round(daily.temperature_2m_min[i]),
      wind: daily.wind_speed_10m_max[i],
      precipitation: daily.precipitation_sum[i],
    };
  });

  return (
    <div className="forecast">
      <h5>5-Day Forecast</h5>
      <div className="forecast-list">
        {days.map((day) => (
          <div key={day.date} className="forecast-day">
            <div className="day-name">{day.dayName}</div>
            <div className="day-icon">{day.icon}</div>
            <div className="day-temp">
              {day.tempMax}° <span className="temp-min">/ {day.tempMin}°</span>
            </div>
            <div className="day-detail">{day.description}</div>
            <div className="day-detail">Wind: {day.wind} km/h</div>
            <div className="day-detail">Rain: {day.precipitation} mm</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Forecast;
