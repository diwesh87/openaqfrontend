import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, MapPin, AlertTriangle, Users } from 'lucide-react';
import { api } from '../lib/api';
import { KPICard } from '../components/KPICard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { InfoTooltip } from '../components/InfoTooltip';
import { getAQIColor, getPollutantInfo, formatNumber, formatDate } from '../lib/utils';
import { useTheme } from '../contexts/ThemeContext';
import type { City, TimeRange } from '../types';
import { useMemo, useState } from 'react';

interface OverviewSectionProps {
  countryCode: string;
  countryName: string;
  timeRange: TimeRange;
}

export function OverviewSection({ countryCode, countryName, timeRange }: OverviewSectionProps) {
  const [sortKey, setSortKey] = useState<keyof City>('aqiIndex');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const { data: cities, isLoading, error } = useQuery({
    queryKey: ['cities', countryCode],
    queryFn: () => api.getCities(countryCode),
    enabled: !!countryCode,
  });

  const days = timeRange === 'today' ? 1 : timeRange === '7days' ? 7 : 30;

  // Get top 5 cities for national average calculation
  const topCities = useMemo(() => {
    if (!cities || cities.length === 0) return [];
    return [...cities]
      .sort((a, b) => b.population - a.population)
      .slice(0, 5)
      .map(c => c.city);
  }, [cities]);

  // Fetch historical data for top cities
  const cityHistories = useQuery({
    queryKey: ['national-trend', countryCode, topCities, days, timeRange],
    queryFn: async () => {
      if (!topCities.length) return [];
      const histories = await Promise.all(
        topCities.map(city => api.getCityHistory(city, countryCode, days))
      );
      return histories;
    },
    enabled: !!countryCode && topCities.length > 0,
    staleTime: 0,
  });

  // Calculate national average AQI trend
  const nationalTrend = useMemo(() => {
    if (!cityHistories.data || cityHistories.data.length === 0) return [];
    
    const histories = cityHistories.data.filter(h => h && h.length > 0);
    if (histories.length === 0) return [];

    // Get all unique dates
    const allDates = new Set<string>();
    histories.forEach(history => {
      history.forEach(day => allDates.add(day.date));
    });

    // Calculate average AQI for each date
    const trendData: Array<{ date: string; avgAqi: number; avgPm25: number }> = [];
    
    Array.from(allDates).sort().forEach(date => {
      const dayData: number[] = [];
      const pm25Data: number[] = [];
      
      histories.forEach(history => {
        const dayEntry = history.find(h => h.date === date);
        if (dayEntry) {
          dayData.push(dayEntry.aqiIndex);
          pm25Data.push(dayEntry.pm25);
        }
      });

      if (dayData.length > 0) {
        trendData.push({
          date,
          avgAqi: Math.round(dayData.reduce((a, b) => a + b, 0) / dayData.length),
          avgPm25: Math.round((pm25Data.reduce((a, b) => a + b, 0) / pm25Data.length) * 10) / 10,
        });
      }
    });

    return trendData;
  }, [cityHistories.data]);

  const stats = useMemo(() => {
    if (!cities || cities.length === 0) return null;

    const avgPM25 = cities.reduce((sum, city) => sum + city.pm25, 0) / cities.length;
    const worstCity = cities.reduce((worst, city) =>
      city.aqiIndex > worst.aqiIndex ? city : worst
    );
    const aboveWHO = cities.filter((city) => city.pm25 > 15).length;
    const percentAboveWHO = (aboveWHO / cities.length) * 100;

    return {
      avgPM25: Math.round(avgPM25),
      worstCity: worstCity.city,
      worstCityAqi: worstCity.aqiIndex,
      percentAboveWHO: Math.round(percentAboveWHO),
      totalPopulation: cities.reduce((sum, city) => sum + city.population, 0),
    };
  }, [cities]);

  const top10Cities = useMemo(() => {
    if (!cities) return [];
    return [...cities]
      .sort((a, b) => b.aqiIndex - a.aqiIndex)
      .slice(0, 10)
      .map((city) => ({
        name: city.city,
        aqi: city.aqiIndex,
        pm25: city.pm25,
      }));
  }, [cities]);

  const sortedAndFilteredCities = useMemo(() => {
    if (!cities) return [];

    let filtered = cities.filter((city) =>
      city.city.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return filtered.sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      }
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortOrder === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      return 0;
    });
  }, [cities, sortKey, sortOrder, searchQuery]);

  const handleSort = (key: keyof City) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="Failed to load overview data" />;
  if (!cities || cities.length === 0) return <ErrorMessage message="No data available" />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-neon-cyan mb-1 transition-colors duration-300">{countryName} Overview</h2>
        <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">Air quality summary for {cities.length} cities</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Average PM2.5"
          value={stats?.avgPM25 || 0}
          subtitle="µg/m³ across all cities"
          icon={TrendingUp}
          color="blue"
        />
        <KPICard
          title="Worst City Today"
          value={stats?.worstCity || '-'}
          subtitle={`AQI: ${stats?.worstCityAqi}`}
          icon={AlertTriangle}
          color="red"
        />
        <KPICard
          title="Above WHO Guideline"
          value={`${stats?.percentAboveWHO}%`}
          subtitle="Cities exceeding 15 µg/m³"
          icon={MapPin}
          color="orange"
        />
        <KPICard
          title="Total Population"
          value={formatNumber(stats?.totalPopulation || 0)}
          subtitle="People affected"
          icon={Users}
          color="green"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300 shadow-sm dark:shadow-neon-cyan/10">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-neon-cyan transition-colors duration-300">
              Top 10 Most Polluted Cities
            </h3>
            <InfoTooltip
              title="PM2.5 Levels"
              {...getPollutantInfo('pm25')}
            />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={top10Cities} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#f0f0f0'} />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={100}
                tick={{ fontSize: 12, fill: isDark ? '#00ffff' : '#6b7280' }}
              />
              <YAxis tick={{ fontSize: 12, fill: isDark ? '#00ffff' : '#6b7280' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#1f2937' : 'white',
                  border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                  borderRadius: '0.5rem',
                  color: isDark ? '#00ffff' : '#111827',
                }}
              />
              <Bar dataKey="pm25" fill={isDark ? '#00ffff' : '#3b82f6'} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300 shadow-sm dark:shadow-neon-cyan/10">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-neon-cyan transition-colors duration-300">
              National Average AQI Trend
            </h3>
            <InfoTooltip
              title="National Average AQI"
              {...getPollutantInfo('aqi')}
            />
          </div>
          {cityHistories.isLoading ? (
            <div className="flex items-center justify-center h-[300px]">
              <LoadingSpinner />
            </div>
          ) : nationalTrend.length === 0 ? (
            <div className="flex items-center justify-center h-[300px] text-gray-500 dark:text-gray-400 transition-colors duration-300">
              No historical data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={nationalTrend} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#f0f0f0'} />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDate}
                  tick={{ fontSize: 11, fill: isDark ? '#00ffff' : '#6b7280' }}
                  angle={days === 30 ? -45 : 0}
                  textAnchor={days === 30 ? 'end' : 'middle'}
                  height={days === 30 ? 60 : 30}
                />
                <YAxis tick={{ fontSize: 12, fill: isDark ? '#00ffff' : '#6b7280' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#1f2937' : 'white',
                    border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                    borderRadius: '0.5rem',
                    color: isDark ? '#00ffff' : '#111827',
                  }}
                  labelFormatter={(label) => `Date: ${formatDate(label)}`}
                  formatter={(value: number) => [value, 'Average AQI']}
                />
                <Line
                  type="monotone"
                  dataKey="avgAqi"
                  stroke={isDark ? '#00ffff' : '#3b82f6'}
                  strokeWidth={2}
                  dot={{ r: 3, fill: isDark ? '#00ffff' : '#3b82f6' }}
                  name="National Avg AQI"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors duration-300 shadow-sm dark:shadow-neon-cyan/10">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-neon-cyan transition-colors duration-300">All Cities</h3>
            <input
              type="text"
              placeholder="Search cities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                         focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-neon-cyan
                         placeholder-gray-400 dark:placeholder-gray-500
                         transition-colors duration-300"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th
                  onClick={() => handleSort('city')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-300"
                >
                  City {sortKey === 'city' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  onClick={() => handleSort('aqiIndex')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-300"
                >
                  <div className="flex items-center gap-1">
                    AQI {sortKey === 'aqiIndex' && (sortOrder === 'asc' ? '↑' : '↓')}
                    <InfoTooltip
                      title="Air Quality Index"
                      {...getPollutantInfo('aqi')}
                    />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Category
                </th>
                <th
                  onClick={() => handleSort('pm25')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-300"
                >
                  <div className="flex items-center gap-1">
                    PM2.5 {sortKey === 'pm25' && (sortOrder === 'asc' ? '↑' : '↓')}
                    <InfoTooltip
                      title="PM2.5"
                      {...getPollutantInfo('pm25')}
                    />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('pm10')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-300"
                >
                  <div className="flex items-center gap-1">
                    PM10 {sortKey === 'pm10' && (sortOrder === 'asc' ? '↑' : '↓')}
                    <InfoTooltip
                      title="PM10"
                      {...getPollutantInfo('pm10')}
                    />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('population')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-300"
                >
                  Population {sortKey === 'population' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {sortedAndFilteredCities.map((city) => (
                <tr key={city.city} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-300">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100 transition-colors duration-300">
                    {city.city}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium text-white shadow-sm dark:shadow-neon-cyan/30"
                      style={{ backgroundColor: getAQIColor(city.aqiIndex) }}
                    >
                      {city.aqiIndex}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
                    {city.aqiCategory}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 transition-colors duration-300">
                    {city.pm25} µg/m³
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 transition-colors duration-300">
                    {city.pm10} µg/m³
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
                    {formatNumber(city.population)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
