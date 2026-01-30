import React from 'react';
import { render, screen } from '@testing-library/react';
import CurrentWeather from './CurrentWeather';

const mockData = {
  current: {
    temperature_2m: 15.3,
    relative_humidity_2m: 72,
    apparent_temperature: 13.1,
    wind_speed_10m: 12.5,
    wind_direction_10m: 180,
    weather_code: 2,
    pressure_msl: 1013.2,
  },
  current_units: {
    temperature_2m: '°C',
    relative_humidity_2m: '%',
    apparent_temperature: '°C',
    wind_speed_10m: 'km/h',
    wind_direction_10m: '°',
    pressure_msl: 'hPa',
  },
};

test('renders city name and temperature', () => {
  render(<CurrentWeather cityName="Vilnius, Lithuania" data={mockData} />);
  expect(screen.getByText('Vilnius, Lithuania')).toBeInTheDocument();
  expect(screen.getByText(/15/)).toBeInTheDocument();
});

test('renders nothing when data is null', () => {
  const { container } = render(<CurrentWeather cityName="Test" data={null} />);
  expect(container.firstChild).toBeNull();
});

test('renders weather details', () => {
  render(<CurrentWeather cityName="Vilnius" data={mockData} />);
  expect(screen.getByText('Humidity')).toBeInTheDocument();
  expect(screen.getByText('Wind')).toBeInTheDocument();
  expect(screen.getByText('Pressure')).toBeInTheDocument();
});
