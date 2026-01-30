const STORAGE_KEY = 'weather_most_viewed_cities';
const MAX_CITIES = 3;

/**
 * Get the most viewed cities from localStorage, sorted by view count descending.
 * @returns {Array<{name: string, label: string, value: string, latitude: number, longitude: number, country: string, viewCount: number}>}
 */
export function getMostViewedCities() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return data.sort((a, b) => b.viewCount - a.viewCount).slice(0, MAX_CITIES);
  } catch {
    return [];
  }
}

/**
 * Record a city view. Increments count if exists, otherwise adds it.
 * Keeps only the top 3 by view count.
 */
export function recordCityView(city) {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const existing = data.find((c) => c.value === city.value);

    if (existing) {
      existing.viewCount += 1;
    } else {
      data.push({ ...city, viewCount: 1 });
    }

    // Sort by viewCount descending and keep top cities
    data.sort((a, b) => b.viewCount - a.viewCount);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data.slice(0, MAX_CITIES)));
  } catch {
    // Silently fail if localStorage is unavailable
  }
}
