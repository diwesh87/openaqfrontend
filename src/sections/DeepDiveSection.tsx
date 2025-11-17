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
  Legend,
} from 'recharts';
import { api } from '../lib/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { InfoTooltip } from '../components/InfoTooltip';
import { getAQIColor, getAQIBgColor, getPollutantInfo, formatDate } from '../lib/utils';
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
      <div className="flex items-center justify-center py-12 text-gray-500">
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
        <h2 className="text-2xl font-bold text-gray-900 mb-1">
          {city}, {countryName}
        </h2>
        <p className="text-gray-600">Detailed air quality analysis</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">{city}</h3>
            <p className="text-gray-600">
              Last updated: {new Date(summary.lastUpdated).toLocaleString()}
            </p>
          </div>

          <div className="flex flex-col items-start sm:items-end">
            <div
              className={`inline-flex items-center px-4 py-2 rounded-lg text-white text-2xl font-bold mb-2 ${getAQIBgColor(
                summary.aqiIndex
              )}`}
            >
              AQI {summary.aqiIndex}
            </div>
            <span className="text-sm font-medium text-gray-600">{summary.aqiCategory}</span>
          </div>
        </div>

        <div className="prose max-w-none">
          <p className="text-gray-700">
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
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Pollutant Breakdown</h3>
            <InfoTooltip
              title="Pollutant Levels"
              description="Current concentrations of major air pollutants"
              whyItMatters="Each pollutant has different health effects and comes from different sources"
            />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="pollutant" tick={{ fontSize: 12 }} />
              <PolarRadiusAxis angle={90} domain={[0, 'auto']} tick={{ fontSize: 10 }} />
              <Radar
                name="Current Level"
                dataKey="value"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.6}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pollutant Details</h3>
          <div className="space-y-4">
            {[
              { key: 'pm25', label: 'PM2.5', value: summary.pm25, unit: 'µg/m³' },
              { key: 'pm10', label: 'PM10', value: summary.pm10, unit: 'µg/m³' },
              { key: 'no2', label: 'NO2', value: summary.no2, unit: 'ppb' },
              { key: 'o3', label: 'O3', value: summary.o3, unit: 'ppb' },
              { key: 'co', label: 'CO', value: summary.co, unit: 'ppm' },
              { key: 'so2', label: 'SO2', value: summary.so2, unit: 'ppb' },
            ].map((pollutant) => (
              <div key={pollutant.key} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">{pollutant.label}</span>
                  <InfoTooltip {...getPollutantInfo(pollutant.key)} />
                </div>
                <span className="text-gray-900 font-semibold">
                  {pollutant.value} {pollutant.unit}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {history && history.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-lg font-semibold text-gray-900">PM2.5 Trend</h3>
              <InfoTooltip {...getPollutantInfo('pm25')} />
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={history} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
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
                <Line
                  type="monotone"
                  dataKey="pm25"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-lg font-semibold text-gray-900">AQI Trend</h3>
              <InfoTooltip {...getPollutantInfo('aqi')} />
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={history} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
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
                <Line
                  type="monotone"
                  dataKey="aqiIndex"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {stations && stations.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Monitoring Stations</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Station
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    AQI
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    PM2.5
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    PM10
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Coordinates
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stations.map((station, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {station.stationName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
                        style={{ backgroundColor: getAQIColor(station.aqiIndex) }}
                      >
                        {station.aqiIndex}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {station.pm25} µg/m³
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {station.pm10} µg/m³
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
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
