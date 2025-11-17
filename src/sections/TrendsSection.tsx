import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { api } from '../lib/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { formatDate } from '../lib/utils';
import type { TimeRange, City } from '../types';

interface TrendsSectionProps {
  countryCode: string;
  countryName: string;
  timeRange: TimeRange;
}

export function TrendsSection({ countryCode, countryName, timeRange }: TrendsSectionProps) {
  const [cityA, setCityA] = useState('');
  const [cityB, setCityB] = useState('');

  const days = timeRange === 'today' ? 1 : timeRange === '7days' ? 7 : 30;

  const { data: cities } = useQuery({
    queryKey: ['cities', countryCode],
    queryFn: () => api.getCities(countryCode),
    enabled: !!countryCode,
  });

  const { data: historyA, isLoading: loadingA } = useQuery({
    queryKey: ['city-history', cityA, countryCode, days, timeRange],
    queryFn: () => api.getCityHistory(cityA, countryCode, days),
    enabled: !!cityA && !!countryCode,
    staleTime: 0, // Always refetch when timeRange changes
  });

  const { data: historyB, isLoading: loadingB } = useQuery({
    queryKey: ['city-history', cityB, countryCode, days, timeRange],
    queryFn: () => api.getCityHistory(cityB, countryCode, days),
    enabled: !!cityB && !!countryCode,
    staleTime: 0, // Always refetch when timeRange changes
  });

  if (!countryCode) {
    return (
      <div className="flex items-center justify-center py-12 text-gray-500">
        Select a country to compare cities
      </div>
    );
  }

  const combinedData = historyA && historyB
    ? historyA.map((dataA, idx) => ({
        date: dataA.date,
        [`${cityA} PM2.5`]: dataA.pm25,
        [`${cityB} PM2.5`]: historyB[idx]?.pm25 || 0,
        [`${cityA} AQI`]: dataA.aqiIndex,
        [`${cityB} AQI`]: historyB[idx]?.aqiIndex || 0,
      }))
    : [];

  const avgA = historyA
    ? historyA.reduce((sum, d) => sum + d.pm25, 0) / historyA.length
    : 0;
  const avgB = historyB
    ? historyB.reduce((sum, d) => sum + d.pm25, 0) / historyB.length
    : 0;

  const percentDiff = avgA && avgB ? Math.abs(((avgA - avgB) / avgB) * 100) : 0;
  const higherCity = avgA > avgB ? cityA : cityB;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">
          Trends & Comparison - {countryName}
        </h2>
        <p className="text-gray-600">Compare air quality trends between cities</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Cities to Compare</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">City A</label>
            <select
              value={cityA}
              onChange={(e) => setCityA(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a city</option>
              {cities?.map((city) => (
                <option key={city.city} value={city.city}>
                  {city.city}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">City B</label>
            <select
              value={cityB}
              onChange={(e) => setCityB(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a city</option>
              {cities?.map((city) => (
                <option key={city.city} value={city.city}>
                  {city.city}
                </option>
              ))}
            </select>
          </div>
        </div>

        {!cityA || !cityB ? (
          <div className="flex items-center justify-center py-12 text-gray-500">
            Select two cities to compare their air quality trends
          </div>
        ) : loadingA || loadingB ? (
          <LoadingSpinner />
        ) : (
          <>
            {combinedData.length > 0 && (
              <>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h4 className="font-semibold text-blue-900 mb-2">Comparison Insight</h4>
                  <p className="text-sm text-blue-800">
                    Over the last {days} days, {higherCity}'s average PM2.5 is{' '}
                    <span className="font-bold">{percentDiff.toFixed(1)}%</span>{' '}
                    {avgA > avgB ? 'higher' : 'lower'} than {avgA > avgB ? cityB : cityA}.
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-blue-700">{cityA} avg:</span>{' '}
                      <span className="font-semibold text-blue-900">{avgA.toFixed(1)} µg/m³</span>
                    </div>
                    <div>
                      <span className="text-blue-700">{cityB} avg:</span>{' '}
                      <span className="font-semibold text-blue-900">{avgB.toFixed(1)} µg/m³</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-md font-semibold text-gray-900 mb-3">
                      PM2.5 Comparison
                    </h4>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={combinedData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.5rem',
                          }}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey={`${cityA} PM2.5`}
                          stroke="#3b82f6"
                          strokeWidth={2}
                          dot={{ r: 3 }}
                        />
                        <Line
                          type="monotone"
                          dataKey={`${cityB} PM2.5`}
                          stroke="#f59e0b"
                          strokeWidth={2}
                          dot={{ r: 3 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div>
                    <h4 className="text-md font-semibold text-gray-900 mb-3">AQI Comparison</h4>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={combinedData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.5rem',
                          }}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey={`${cityA} AQI`}
                          stroke="#10b981"
                          strokeWidth={2}
                          dot={{ r: 3 }}
                        />
                        <Line
                          type="monotone"
                          dataKey={`${cityB} AQI`}
                          stroke="#ef4444"
                          strokeWidth={2}
                          dot={{ r: 3 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
