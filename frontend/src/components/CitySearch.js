import React, { useState, useCallback } from 'react';
import AsyncSelect from 'react-select/async';
import { searchCities } from '../services/weatherApi';

let debounceTimer;

function CitySearch({ onCitySelect }) {
  const [selectedOption, setSelectedOption] = useState(null);

  const loadOptions = useCallback((inputValue) => {
    return new Promise((resolve) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(async () => {
        const results = await searchCities(inputValue);
        resolve(results);
      }, 400);
    });
  }, []);

  const handleChange = (option) => {
    setSelectedOption(option);
    if (option) {
      onCitySelect(option);
    }
  };

  return (
    <div className="city-search">
      <label className="search-label">Search for a city</label>
      <AsyncSelect
        cacheOptions
        loadOptions={loadOptions}
        value={selectedOption}
        onChange={handleChange}
        placeholder="Type a city name..."
        noOptionsMessage={({ inputValue }) =>
          inputValue.length < 2
            ? 'Type at least 2 characters'
            : 'No cities found'
        }
        isClearable
        classNamePrefix="react-select"
      />
    </div>
  );
}

export default CitySearch;
