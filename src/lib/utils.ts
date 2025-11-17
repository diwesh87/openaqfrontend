import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function getAQIColor(aqi: number): string {
  if (aqi <= 50) return '#10b981';
  if (aqi <= 100) return '#fbbf24';
  if (aqi <= 150) return '#f97316';
  if (aqi <= 200) return '#ef4444';
  if (aqi <= 300) return '#991b1b';
  return '#7f1d1d';
}

export function getAQIBgColor(aqi: number): string {
  if (aqi <= 50) return 'bg-emerald-500';
  if (aqi <= 100) return 'bg-amber-400';
  if (aqi <= 150) return 'bg-orange-500';
  if (aqi <= 200) return 'bg-red-500';
  if (aqi <= 300) return 'bg-red-800';
  return 'bg-red-950';
}

export function getAQITextColor(aqi: number): string {
  if (aqi <= 50) return 'text-emerald-600';
  if (aqi <= 100) return 'text-amber-600';
  if (aqi <= 150) return 'text-orange-600';
  if (aqi <= 200) return 'text-red-600';
  if (aqi <= 300) return 'text-red-800';
  return 'text-red-950';
}

export function getPollutantInfo(pollutant: string): {
  name: string;
  description: string;
  whyItMatters: string;
  ranges: { range: string; level: string }[];
} {
  const info: Record<string, any> = {
    pm25: {
      name: 'PM2.5 (Fine Particulate Matter)',
      description:
        'Particles smaller than 2.5 micrometers in diameter. These tiny particles can come from vehicle exhaust, industrial emissions, and wildfires.',
      whyItMatters:
        'PM2.5 can penetrate deep into the lungs and even enter the bloodstream, causing respiratory and cardiovascular problems.',
      ranges: [
        { range: '0-12 µg/m³', level: 'Good' },
        { range: '12.1-35.4 µg/m³', level: 'Moderate' },
        { range: '35.5-55.4 µg/m³', level: 'Unhealthy for Sensitive Groups' },
        { range: '55.5-150.4 µg/m³', level: 'Unhealthy' },
        { range: '150.5-250.4 µg/m³', level: 'Very Unhealthy' },
        { range: '250.5+ µg/m³', level: 'Hazardous' },
      ],
    },
    pm10: {
      name: 'PM10 (Coarse Particulate Matter)',
      description:
        'Particles between 2.5 and 10 micrometers in diameter. Sources include dust, pollen, and mold.',
      whyItMatters:
        'PM10 can irritate airways, cause coughing and difficulty breathing, and aggravate asthma.',
      ranges: [
        { range: '0-54 µg/m³', level: 'Good' },
        { range: '55-154 µg/m³', level: 'Moderate' },
        { range: '155-254 µg/m³', level: 'Unhealthy for Sensitive Groups' },
        { range: '255-354 µg/m³', level: 'Unhealthy' },
        { range: '355-424 µg/m³', level: 'Very Unhealthy' },
        { range: '425+ µg/m³', level: 'Hazardous' },
      ],
    },
    no2: {
      name: 'NO2 (Nitrogen Dioxide)',
      description:
        'A reddish-brown gas primarily from vehicle emissions and power plants.',
      whyItMatters:
        'NO2 can irritate airways and worsen asthma. Long-term exposure can decrease lung function.',
      ranges: [
        { range: '0-53 ppb', level: 'Good' },
        { range: '54-100 ppb', level: 'Moderate' },
        { range: '101-360 ppb', level: 'Unhealthy for Sensitive Groups' },
        { range: '361-649 ppb', level: 'Unhealthy' },
        { range: '650-1249 ppb', level: 'Very Unhealthy' },
        { range: '1250+ ppb', level: 'Hazardous' },
      ],
    },
    o3: {
      name: 'O3 (Ozone)',
      description:
        'Ground-level ozone forms when pollutants from cars and industry react with sunlight.',
      whyItMatters:
        'Ozone can trigger asthma attacks, reduce lung function, and cause throat irritation and coughing.',
      ranges: [
        { range: '0-54 ppb', level: 'Good' },
        { range: '55-70 ppb', level: 'Moderate' },
        { range: '71-85 ppb', level: 'Unhealthy for Sensitive Groups' },
        { range: '86-105 ppb', level: 'Unhealthy' },
        { range: '106-200 ppb', level: 'Very Unhealthy' },
        { range: '201+ ppb', level: 'Hazardous' },
      ],
    },
    co: {
      name: 'CO (Carbon Monoxide)',
      description:
        'A colorless, odorless gas from incomplete combustion of fossil fuels.',
      whyItMatters:
        'CO reduces oxygen delivery to the body\'s organs. High levels can cause dizziness, confusion, and death.',
      ranges: [
        { range: '0-4.4 ppm', level: 'Good' },
        { range: '4.5-9.4 ppm', level: 'Moderate' },
        { range: '9.5-12.4 ppm', level: 'Unhealthy for Sensitive Groups' },
        { range: '12.5-15.4 ppm', level: 'Unhealthy' },
        { range: '15.5-30.4 ppm', level: 'Very Unhealthy' },
        { range: '30.5+ ppm', level: 'Hazardous' },
      ],
    },
    so2: {
      name: 'SO2 (Sulfur Dioxide)',
      description:
        'A gas produced by burning fossil fuels and during volcanic eruptions.',
      whyItMatters:
        'SO2 can cause breathing difficulties, especially for people with asthma.',
      ranges: [
        { range: '0-35 ppb', level: 'Good' },
        { range: '36-75 ppb', level: 'Moderate' },
        { range: '76-185 ppb', level: 'Unhealthy for Sensitive Groups' },
        { range: '186-304 ppb', level: 'Unhealthy' },
        { range: '305-604 ppb', level: 'Very Unhealthy' },
        { range: '605+ ppb', level: 'Hazardous' },
      ],
    },
    aqi: {
      name: 'AQI (Air Quality Index)',
      description:
        'A unified index that represents overall air quality based on multiple pollutants.',
      whyItMatters:
        'The AQI provides a simple way to understand air quality and its health implications.',
      ranges: [
        { range: '0-50', level: 'Good - Air quality is satisfactory' },
        { range: '51-100', level: 'Moderate - Acceptable for most people' },
        { range: '101-150', level: 'Unhealthy for Sensitive Groups' },
        { range: '151-200', level: 'Unhealthy - Everyone may experience effects' },
        { range: '201-300', level: 'Very Unhealthy - Health alert' },
        { range: '301+', level: 'Hazardous - Emergency conditions' },
      ],
    },
  };

  return info[pollutant] || { name: pollutant, description: '', whyItMatters: '', ranges: [] };
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
