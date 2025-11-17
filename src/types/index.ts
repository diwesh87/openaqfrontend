export interface Country {
  code: string;
  name: string;
  cityCount: number;
  averageAqi: number;
  worstCity: string;
  worstCityAqi: number;
}

export interface City {
  city: string;
  aqiIndex: number;
  aqiCategory: string;
  pm25: number;
  pm10: number;
  no2: number;
  o3: number;
  co: number;
  so2: number;
  population: number;
  lat: number;
  lon: number;
  lastUpdated: string;
}

export interface HistoricalData {
  date: string;
  pm25: number;
  pm10: number;
  no2: number;
  o3: number;
  co: number;
  so2: number;
  aqiIndex: number;
}

export interface Station {
  stationName: string;
  latitude: number;
  longitude: number;
  pm25: number;
  pm10: number;
  no2: number;
  o3: number;
  co: number;
  so2: number;
  aqiIndex: number;
  lastUpdated: string;
}

export interface HeatmapPoint {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  pm25: number;
  aqiIndex: number;
  aqiCategory: string;
}

export interface ActivityInsight {
  safe: boolean;
  recommendation: string;
}

export interface Insights {
  city: string;
  country: string;
  aqi: number;
  category: string;
  health: {
    general: string;
    sensitive: string;
    children: string;
    elderly: string;
    asthma: string;
  };
  activities: {
    walking: ActivityInsight;
    running: ActivityInsight;
    outdoor_play: ActivityInsight;
    cycling: ActivityInsight;
  };
}

export type TimeRange = 'today' | '7days' | '30days';

export type AQICategory =
  | 'Good'
  | 'Moderate'
  | 'Unhealthy for Sensitive Groups'
  | 'Unhealthy'
  | 'Very Unhealthy'
  | 'Hazardous';
