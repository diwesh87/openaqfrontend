import type { Country, City, HistoricalData, Station, HeatmapPoint, Insights } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const api = {
  async getCountries(): Promise<Country[]> {
    const response = await fetch(`${API_BASE_URL}/api/countries`);
    if (!response.ok) throw new Error('Failed to fetch countries');
    const data = await response.json();
    return data.countries;
  },

  async getCities(countryCode: string): Promise<City[]> {
    const response = await fetch(`${API_BASE_URL}/api/cities?country=${countryCode}`);
    if (!response.ok) throw new Error('Failed to fetch cities');
    const data = await response.json();
    return data.cities;
  },

  async getCitySummary(city: string, countryCode: string): Promise<City> {
    const response = await fetch(
      `${API_BASE_URL}/api/city/${encodeURIComponent(city)}/summary?country=${countryCode}`
    );
    if (!response.ok) throw new Error('Failed to fetch city summary');
    return response.json();
  },

  async getCityHistory(city: string, countryCode: string, days: number): Promise<HistoricalData[]> {
    const response = await fetch(
      `${API_BASE_URL}/api/city/${encodeURIComponent(city)}/history?country=${countryCode}&days=${days}`
    );
    if (!response.ok) throw new Error('Failed to fetch city history');
    const data = await response.json();
    return data.history;
  },

  async getCityStations(city: string, countryCode: string): Promise<Station[]> {
    const response = await fetch(
      `${API_BASE_URL}/api/city/${encodeURIComponent(city)}/stations?country=${countryCode}`
    );
    if (!response.ok) throw new Error('Failed to fetch city stations');
    const data = await response.json();
    return data.stations;
  },

  async getHeatmap(countryCode?: string): Promise<HeatmapPoint[]> {
    const url = countryCode
      ? `${API_BASE_URL}/api/heatmap?country=${countryCode}`
      : `${API_BASE_URL}/api/heatmap`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch heatmap');
    const data = await response.json();
    return data.points;
  },

  async getInsights(city: string, countryCode: string): Promise<Insights> {
    const response = await fetch(
      `${API_BASE_URL}/api/insights?country=${countryCode}&city=${encodeURIComponent(city)}`
    );
    if (!response.ok) throw new Error('Failed to fetch insights');
    return response.json();
  },
};
