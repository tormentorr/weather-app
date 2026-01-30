import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MostViewedCities from './MostViewedCities';

const mockCities = [
  { value: '1_2', name: 'Vilnius', country: 'Lithuania', viewCount: 5 },
  { value: '3_4', name: 'London', country: 'United Kingdom', viewCount: 3 },
];

test('renders city chips with view counts', () => {
  render(<MostViewedCities cities={mockCities} onCitySelect={() => {}} />);
  expect(screen.getByText(/Vilnius/)).toBeInTheDocument();
  expect(screen.getByText('(5)')).toBeInTheDocument();
  expect(screen.getByText(/London/)).toBeInTheDocument();
});

test('calls onCitySelect when chip is clicked', () => {
  const handler = jest.fn();
  render(<MostViewedCities cities={mockCities} onCitySelect={handler} />);
  fireEvent.click(screen.getByText(/Vilnius/));
  expect(handler).toHaveBeenCalledWith(mockCities[0]);
});

test('renders empty container when cities is empty', () => {
  const { container } = render(
    <MostViewedCities cities={[]} onCitySelect={() => {}} />
  );
  expect(container.firstChild).toBeEmptyDOMElement();
});
