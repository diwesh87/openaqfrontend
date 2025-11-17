import { Menu, X, Cloud } from 'lucide-react';
import { useState } from 'react';
import { ThemeToggle } from './ThemeToggle';
import type { Country, City, TimeRange } from '../types';

interface HeaderProps {
  countries: Country[];
  cities: City[];
  selectedCountry: string;
  selectedCity: string;
  timeRange: TimeRange;
  onCountryChange: (code: string) => void;
  onCityChange: (city: string) => void;
  onTimeRangeChange: (range: TimeRange) => void;
  onMenuToggle: () => void;
}

export function Header({
  countries,
  cities,
  selectedCountry,
  selectedCity,
  timeRange,
  onCountryChange,
  onCityChange,
  onTimeRangeChange,
  onMenuToggle,
}: HeaderProps) {
  const timeRanges: { value: TimeRange; label: string }[] = [
    { value: 'today', label: 'Today' },
    { value: '7days', label: '7 Days' },
    { value: '30days', label: '30 Days' },
  ];

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 transition-colors duration-300 shadow-sm dark:shadow-neon-cyan/20">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onMenuToggle}
              className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-700 dark:text-gray-300"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <Cloud className="w-6 h-6 text-blue-600 dark:text-neon-cyan transition-colors duration-300" />
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-neon-cyan hidden sm:block transition-colors duration-300">
                OpenAQ Global Air Dashboard
              </h1>
              <h1 className="text-lg font-bold text-gray-900 dark:text-neon-cyan sm:hidden transition-colors duration-300">OpenAQ</h1>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-end">
            <ThemeToggle />
            <select
              value={selectedCountry}
              onChange={(e) => onCountryChange(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                         focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-neon-cyan
                         transition-colors duration-300"
            >
              <option value="">Select Country</option>
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>

            <select
              value={selectedCity}
              onChange={(e) => onCityChange(e.target.value)}
              disabled={!selectedCountry}
              className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                         focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-neon-cyan
                         disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed
                         transition-colors duration-300"
            >
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city.city} value={city.city}>
                  {city.city}
                </option>
              ))}
            </select>

            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1 transition-colors duration-300">
              {timeRanges.map((range) => (
                <button
                  key={range.value}
                  onClick={() => onTimeRangeChange(range.value)}
                  className={`px-3 py-1 text-xs sm:text-sm font-medium rounded-md transition-all duration-300 ${
                    timeRange === range.value
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-neon-cyan shadow-sm dark:shadow-neon-cyan/30'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-neon-cyan'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
