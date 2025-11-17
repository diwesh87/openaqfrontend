import { useState } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { ThemeProvider } from './contexts/ThemeContext';
import { Header } from './components/Header';
import { Sidebar, Section } from './components/Sidebar';
import { OverviewSection } from './sections/OverviewSection';
import { DeepDiveSection } from './sections/DeepDiveSection';
import { MapSection } from './sections/MapSection';
import { TrendsSection } from './sections/TrendsSection';
import { HealthSection } from './sections/HealthSection';
import { AboutSection } from './sections/AboutSection';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { api } from './lib/api';
import type { TimeRange } from './types';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function DashboardContent() {
  const [selectedCountry, setSelectedCountry] = useState('IN');
  const [selectedCity, setSelectedCity] = useState('New Delhi');
  const [timeRange, setTimeRange] = useState<TimeRange>('30days');
  const [currentSection, setCurrentSection] = useState<Section>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const {
    data: countries,
    isLoading: countriesLoading,
    error: countriesError,
  } = useQuery({
    queryKey: ['countries'],
    queryFn: api.getCountries,
  });

  const {
    data: cities,
    isLoading: citiesLoading,
    error: citiesError,
  } = useQuery({
    queryKey: ['cities', selectedCountry],
    queryFn: () => api.getCities(selectedCountry),
    enabled: !!selectedCountry,
  });

  const handleCountryChange = (code: string) => {
    setSelectedCountry(code);
    setSelectedCity('');
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
  };

  const selectedCountryData = countries?.find((c) => c.code === selectedCountry);
  const countryName = selectedCountryData?.name || '';

  if (countriesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-300">
        <LoadingSpinner />
      </div>
    );
  }

  if (countriesError) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 transition-colors duration-300">
        <ErrorMessage message="Failed to load countries. Please refresh the page." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-300">
      <Header
        countries={countries || []}
        cities={cities || []}
        selectedCountry={selectedCountry}
        selectedCity={selectedCity}
        timeRange={timeRange}
        onCountryChange={handleCountryChange}
        onCityChange={handleCityChange}
        onTimeRangeChange={setTimeRange}
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          isOpen={sidebarOpen}
          currentSection={currentSection}
          onSectionChange={setCurrentSection}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {currentSection === 'overview' && selectedCountry && (
              <OverviewSection
                countryCode={selectedCountry}
                countryName={countryName}
                timeRange={timeRange}
              />
            )}

            {currentSection === 'deep-dive' && (
              <DeepDiveSection
                city={selectedCity}
                countryCode={selectedCountry}
                countryName={countryName}
                timeRange={timeRange}
              />
            )}

            {currentSection === 'map' && (
              <MapSection countryCode={selectedCountry} countryName={countryName} />
            )}

            {currentSection === 'trends' && (
              <TrendsSection
                countryCode={selectedCountry}
                countryName={countryName}
                timeRange={timeRange}
              />
            )}

            {currentSection === 'health' && (
              <HealthSection
                city={selectedCity}
                countryCode={selectedCountry}
                countryName={countryName}
              />
            )}

            {currentSection === 'about' && <AboutSection />}
          </div>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <DashboardContent />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
