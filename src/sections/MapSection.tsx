import { useQuery } from '@tanstack/react-query';
import { MapPin } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { getAQIColor, getAQIBgColor } from '../lib/utils';
import type { HeatmapPoint } from '../types';

// Import Leaflet components - will only work on client side
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';

interface MapSectionProps {
  countryCode: string;
  countryName: string;
}

export function MapSection({ countryCode, countryName }: MapSectionProps) {
  const { data: points, isLoading, error } = useQuery({
    queryKey: ['heatmap', countryCode],
    queryFn: () => api.getHeatmap(countryCode),
    enabled: !!countryCode,
  });

  if (!countryCode) {
    return (
      <div className="flex items-center justify-center py-12 text-gray-500 dark:text-gray-400 transition-colors duration-300">
        Select a country to view the map
      </div>
    );
  }

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="Failed to load map data" />;
  if (!points || points.length === 0)
    return <ErrorMessage message="No sensor data available" />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-neon-cyan mb-1 transition-colors duration-300">
          Map & Sensors - {countryName}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">Air quality monitoring stations and city locations</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300 shadow-sm dark:shadow-neon-cyan/10">
        <div className="mb-6 rounded-lg overflow-hidden" style={{ height: '500px' }}>
          <MapComponent points={points} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {points.map((point, idx) => (
            <div
              key={idx}
              className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600 hover:shadow-md dark:hover:shadow-neon-cyan/20 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1 transition-colors duration-300">{point.city}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">
                    {point.latitude.toFixed(4)}, {point.longitude.toFixed(4)}
                  </p>
                </div>
                <div
                  className={`px-2 py-1 rounded text-xs font-bold text-white shadow-sm dark:shadow-neon-cyan/30 ${getAQIBgColor(
                    point.aqiIndex
                  )}`}
                >
                  {point.aqiIndex}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400 transition-colors duration-300">PM2.5:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100 transition-colors duration-300">{point.pm25} µg/m³</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400 transition-colors duration-300">Category:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100 transition-colors duration-300">{point.aqiCategory}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-4 transition-colors duration-300">
        <h4 className="font-semibold text-blue-900 dark:text-neon-cyan mb-2 transition-colors duration-300">About the Data</h4>
        <p className="text-sm text-blue-800 dark:text-gray-300 transition-colors duration-300">
          Sensor locations and readings are updated in real-time from the OpenAQ network. Each
          marker represents an active monitoring station measuring various air pollutants.
        </p>
      </div>
    </div>
  );
}

// Component to auto-fit map bounds
function MapBounds({ points }: { points: HeatmapPoint[] }) {
  const map = useMap();

  useEffect(() => {
    if (points.length > 0) {
      const bounds = points.map((p) => [p.latitude, p.longitude] as [number, number]);
      if (bounds.length > 0) {
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [map, points]);

  return null;
}

// Main map component
function MapComponent({ points }: { points: HeatmapPoint[] }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Calculate center point - must be called before conditional return
  const center = useMemo(() => {
    if (points.length === 0) return [0, 0] as [number, number];
    const avgLat = points.reduce((sum, p) => sum + p.latitude, 0) / points.length;
    const avgLon = points.reduce((sum, p) => sum + p.longitude, 0) / points.length;
    return [avgLat, avgLon] as [number, number];
  }, [points]);

  // Create custom markers with AQI colors
  const createMarkerIcon = (aqi: number) => {
    const color = getAQIColor(aqi);
    // Create SVG marker
    const svgIcon = `
      <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
        <path fill="${color}" stroke="#fff" stroke-width="2" d="M12.5 0C5.6 0 0 5.6 0 12.5c0 8.8 12.5 28.5 12.5 28.5S25 21.3 25 12.5C25 5.6 19.4 0 12.5 0z"/>
        <circle cx="12.5" cy="12.5" r="6" fill="#fff"/>
      </svg>
    `;
    return new Icon({
      iconUrl: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgIcon)}`,
      iconSize: [25, 41],
      iconAnchor: [12.5, 41],
      popupAnchor: [0, -41],
    });
  };

  // Early return after all hooks are called
  if (!isMounted) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400 transition-colors duration-300">
        <div className="text-center">
          <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-500 transition-colors duration-300" />
          <p>Loading map...</p>
        </div>
      </div>
    );
  }

  if (points.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400 transition-colors duration-300">
        <div className="text-center">
          <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-500 transition-colors duration-300" />
          <p>No location data available</p>
        </div>
      </div>
    );
  }

  return (
    <MapContainer
      center={center}
      zoom={6}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapBounds points={points} />
      {points.map((point, idx) => (
        <Marker
          key={idx}
          position={[point.latitude, point.longitude]}
          icon={createMarkerIcon(point.aqiIndex)}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-bold text-lg mb-2">{point.city}</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">AQI:</span>
                  <span
                    className="font-bold px-2 py-1 rounded text-white"
                    style={{ backgroundColor: getAQIColor(point.aqiIndex) }}
                  >
                    {point.aqiIndex}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium">{point.aqiCategory}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">PM2.5:</span>
                  <span className="font-medium">{point.pm25} µg/m³</span>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  {point.latitude.toFixed(4)}, {point.longitude.toFixed(4)}
                </div>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
