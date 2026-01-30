import React from 'react';
import { render, screen } from '@testing-library/react';
import Forecast from './Forecast';

const mockData = {
  daily: {
    time: ['2026-01-30', '2026-01-31', '2026-02-01', '2026-02-02', '2026-02-03'],
    temperature_2m_max: [5, 7, 3, 8, 6],
    temperature_2m_min: [-1, 2, -2, 3, 1],
    weather_code: [0, 2, 71, 3, 61],
    wind_speed_10m_max: [15, 20, 10, 25, 18],
    precipitation_sum: [0, 0.5, 3.2, 0, 1.1],
  },
};

test('renders 5-day forecast heading', () => {
  render(<Forecast data={mockData} />);
  expect(screen.getByText('5-Day Forecast')).toBeInTheDocument();
});

test('renders 5 forecast days', () => {
  render(<Forecast data={mockData} />);
  const days = document.querySelectorAll('.forecast-day');
  expect(days).toHaveLength(5);
});

test('renders nothing when data is null', () => {
  const { container } = render(<Forecast data={null} />);
  expect(container.firstChild).toBeNull();
});
