import { useQuery } from '@tanstack/react-query';
import {
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { api } from '../lib/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { InfoTooltip } from '../components/InfoTooltip';
import { getAQIColor, getAQIBgColor, getPollutantInfo, formatDate } from '../lib/utils';
import { useTheme } from '../contexts/ThemeContext';
import type { TimeRange } from '../types';

interface DeepDiveSectionProps {
  city: string;
  countryCode: string;
  countryName: string;
  timeRange: TimeRange;
}

export function DeepDiveSection({
  city,
  countryCode,
  countryName,
  timeRange,
}: DeepDiveSectionProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const days = timeRange === 'today' ? 1 : timeRange === '7days' ? 7 : 30;

  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ['city-summary', city, countryCode],
    queryFn: () => api.getCitySummary(city, countryCode),
    enabled: !!city && !!countryCode,
  });

  const { data: history, isLoading: historyLoading } = useQuery({
    queryKey: ['city-history', city, countryCode, days, timeRange],
    queryFn: () => api.getCityHistory(city, countryCode, days),
    enabled: !!city && !!countryCode,
    staleTime: 0, // Always refetch when timeRange changes
  });

  const { data: stations, isLoading: stationsLoading } = useQuery({
    queryKey: ['city-stations', city, countryCode],
    queryFn: () => api.getCityStations(city, countryCode),
    enabled: !!city && !!countryCode,
  });

  if (!city) {
    return (
      <div className="flex items-center justify-center py-12 text-gray-500 dark:text-gray-400 transition-colors duration-300">
        Select a city to view detailed analytics
      </div>
    );
  }

  if (summaryLoading || historyLoading || stationsLoading) {
    return <LoadingSpinner />;
  }

  if (!summary) {
    return <ErrorMessage message="Failed to load city data" />;
  }

  const radarData = [
    { pollutant: 'PM2.5', value: summary.pm25, fullMark: 200 },
    { pollutant: 'PM10', value: summary.pm10, fullMark: 300 },
    { pollutant: 'NO2', value: summary.no2, fullMark: 100 },
    { pollutant: 'O3', value: summary.o3, fullMark: 100 },
    { pollutant: 'CO', value: summary.co * 20, fullMark: 20 },
    { pollutant: 'SO2', value: summary.so2, fullMark: 50 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-neon-cyan mb-1 transition-colors duration-300">
          {city}, {countryName}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">Detailed air quality analysis</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300 shadow-sm dark:shadow-neon-cyan/10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-neon-cyan mb-2 transition-colors duration-300">{city}</h3>
            <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
              Last updated: {new Date(summary.lastUpdated).toLocaleString()}
            </p>
          </div>

          <div className="flex flex-col items-start sm:items-end">
            <div
              className={`inline-flex items-center px-4 py-2 rounded-lg text-white text-2xl font-bold mb-2 shadow-sm dark:shadow-neon-cyan/30 ${getAQIBgColor(
                summary.aqiIndex
              )}`}
            >
              AQI {summary.aqiIndex}
            </div>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors duration-300">{summary.aqiCategory}</span>
          </div>
        </div>

        <div className="prose max-w-none">
          <p className="text-gray-700 dark:text-gray-300 transition-colors duration-300">
            {summary.aqiIndex <= 50 && (
              <>Air quality is excellent. Perfect conditions for outdoor activities.</>
            )}
            {summary.aqiIndex > 50 && summary.aqiIndex <= 100 && (
              <>Air quality is acceptable for most people.</>
            )}
            {summary.aqiIndex > 100 && summary.aqiIndex <= 150 && (
              <>
                Air quality is unhealthy for sensitive groups. People with respiratory conditions
                should limit outdoor exposure.
              </>
            )}
            {summary.aqiIndex > 150 && summary.aqiIndex <= 200 && (
              <>
                Air quality is unhealthy. Everyone may experience health effects. Sensitive groups
                should avoid outdoor activities.
              </>
            )}
            {summary.aqiIndex > 200 && summary.aqiIndex <= 300 && (
              <>
                Air quality is very unhealthy. Health alert: everyone may experience serious
                effects. Stay indoors if possible.
              </>
            )}
            {summary.aqiIndex > 300 && (
              <>
                Hazardous air quality. Health warnings of emergency conditions. Everyone should
                avoid outdoor exposure.
              </>
            )}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300 shadow-sm dark:shadow-neon-cyan/10">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-neon-cyan transition-colors duration-300">Pollutant Breakdown</h3>
            <InfoTooltip
              title="Pollutant Levels"
              description="Current concentrations of major air pollutants"
              whyItMatters="Each pollutant has different health effects and comes from different sources"
            />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke={isDark ? '#374151' : '#e5e7eb'} />
              <PolarAngleAxis dataKey="pollutant" tick={{ fontSize: 12, fill: isDark ? '#00ffff' : '#6b7280' }} />
              <PolarRadiusAxis angle={90} domain={[0, 'auto']} tick={{ fontSize: 10, fill: isDark ? '#00ffff' : '#6b7280' }} />
              <Radar
                name="Current Level"
                dataKey="value"
                stroke={isDark ? '#00ffff' : '#3b82f6'}
                fill={isDark ? '#00ffff' : '#3b82f6'}
                fillOpacity={0.6}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#1f2937' : 'white',
                  border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                  borderRadius: '0.5rem',
                  color: isDark ? '#00ffff' : '#111827',
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300 shadow-sm dark:shadow-neon-cyan/10">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-neon-cyan mb-4 transition-colors duration-300">Pollutant Details</h3>
          <div className="space-y-4">
            {[
              { key: 'pm25', label: 'PM2.5', value: summary.pm25, unit: 'µg/m³' },
              { key: 'pm10', label: 'PM10', value: summary.pm10, unit: 'µg/m³' },
              { key: 'no2', label: 'NO2', value: summary.no2, unit: 'ppb' },
              { key: 'o3', label: 'O3', value: summary.o3, unit: 'ppb' },
              { key: 'co', label: 'CO', value: summary.co, unit: 'ppm' },
              { key: 'so2', label: 'SO2', value: summary.so2, unit: 'ppb' },
            ].map((pollutant) => {
              const pollutantInfo = getPollutantInfo(pollutant.key);
              return (
              <div key={pollutant.key} className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-3 last:border-0 last:pb-0 transition-colors duration-300">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900 dark:text-gray-100 transition-colors duration-300">{pollutant.label}</span>
                  <InfoTooltip title={pollutantInfo.name} description={pollutantInfo.description} whyItMatters={pollutantInfo.whyItMatters} ranges={pollutantInfo.ranges} />
                </div>
                <span className="text-gray-900 dark:text-neon-cyan font-semibold transition-colors duration-300">
                  {pollutant.value} {pollutant.unit}
                </span>
              </div>
              );
            })}
          </div>
        </div>
      </div>

      {history && history.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300 shadow-sm dark:shadow-neon-cyan/10">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-neon-cyan transition-colors duration-300">PM2.5 Trend</h3>
              {(() => {
                const info = getPollutantInfo('pm25');
                return <InfoTooltip title={info.name} description={info.description} whyItMatters={info.whyItMatters} ranges={info.ranges} />;
              })()}
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={history} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#f0f0f0'} />
                <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fontSize: 11, fill: isDark ? '#00ffff' : '#6b7280' }} />
                <YAxis tick={{ fontSize: 11, fill: isDark ? '#00ffff' : '#6b7280' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#1f2937' : 'white',
                    border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                    borderRadius: '0.5rem',
                    color: isDark ? '#00ffff' : '#111827',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="pm25"
                  stroke={isDark ? '#00ffff' : '#3b82f6'}
                  strokeWidth={2}
                  dot={{ r: 3, fill: isDark ? '#00ffff' : '#3b82f6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300 shadow-sm dark:shadow-neon-cyan/10">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-neon-cyan transition-colors duration-300">AQI Trend</h3>
              {(() => {
                const info = getPollutantInfo('aqi');
                return <InfoTooltip title={info.name} description={info.description} whyItMatters={info.whyItMatters} ranges={info.ranges} />;
              })()}
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={history} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#f0f0f0'} />
                <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fontSize: 11, fill: isDark ? '#00ffff' : '#6b7280' }} />
                <YAxis tick={{ fontSize: 11, fill: isDark ? '#00ffff' : '#6b7280' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#1f2937' : 'white',
                    border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                    borderRadius: '0.5rem',
                    color: isDark ? '#00ffff' : '#111827',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="aqiIndex"
                  stroke={isDark ? '#ff00ff' : '#f59e0b'}
                  strokeWidth={2}
                  dot={{ r: 3, fill: isDark ? '#ff00ff' : '#f59e0b' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {stations && stations.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors duration-300 shadow-sm dark:shadow-neon-cyan/10">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-neon-cyan transition-colors duration-300">Monitoring Stations</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase transition-colors duration-300">
                    Station
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase transition-colors duration-300">
                    AQI
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase transition-colors duration-300">
                    PM2.5
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase transition-colors duration-300">
                    PM10
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase transition-colors duration-300">
                    Coordinates
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {stations.map((station, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-300">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100 transition-colors duration-300">
                      {station.stationName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white shadow-sm dark:shadow-neon-cyan/30"
                        style={{ backgroundColor: getAQIColor(station.aqiIndex) }}
                      >
                        {station.aqiIndex}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 transition-colors duration-300">
                      {station.pm25} µg/m³
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 transition-colors duration-300">
                      {station.pm10} µg/m³
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
                      {station.latitude.toFixed(4)}, {station.longitude.toFixed(4)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
