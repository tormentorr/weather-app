import React from 'react';

function MostViewedCities({ cities, onCitySelect }) {
  return (
    <div className="most-viewed">
      {cities && cities.length > 0 && <h6>Most Viewed Cities</h6>}
      {cities.map((city) => (
        <span
          key={city.value}
          className="city-chip"
          onClick={() => onCitySelect(city)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onCitySelect(city)}
        >
          {city.name}, {city.country}
          <span className="view-count">({city.viewCount})</span>
        </span>
      ))}
    </div>
  );
}

export default MostViewedCities;
