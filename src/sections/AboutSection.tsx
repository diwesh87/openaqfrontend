import { Database, Globe, Shield, TrendingUp } from 'lucide-react';

export function AboutSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-neon-cyan mb-1 transition-colors duration-300">About OpenAQ Global Air Dashboard</h2>
        <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">Understanding our data sources and methodology</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300 shadow-sm dark:shadow-neon-cyan/10">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-neon-cyan mb-4 transition-colors duration-300">Mission</h3>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed transition-colors duration-300">
          The OpenAQ Global Air Dashboard provides transparent, accessible air quality data to
          empower individuals and communities to make informed decisions about their health and
          environment. We aggregate data from monitoring stations worldwide to provide real-time
          insights into air pollution levels.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300 shadow-sm dark:shadow-neon-cyan/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg transition-colors duration-300">
              <Database className="w-6 h-6 text-blue-600 dark:text-neon-cyan transition-colors duration-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-neon-cyan transition-colors duration-300">Data Sources</h3>
          </div>
          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed transition-colors duration-300">
            Our data comes from the OpenAQ platform, which aggregates measurements from government
            monitoring stations, research organizations, and citizen science projects across the
            globe. All data is validated and quality-checked before display.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300 shadow-sm dark:shadow-neon-cyan/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-lg transition-colors duration-300">
              <Globe className="w-6 h-6 text-green-600 dark:text-neon-green transition-colors duration-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-neon-cyan transition-colors duration-300">Global Coverage</h3>
          </div>
          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed transition-colors duration-300">
            We provide coverage for major cities across multiple countries, with data from
            thousands of monitoring stations. Our network continues to expand as more communities
            join the open air quality movement.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300 shadow-sm dark:shadow-neon-cyan/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-orange-50 dark:bg-orange-900/30 rounded-lg transition-colors duration-300">
              <Shield className="w-6 h-6 text-orange-600 dark:text-orange-400 transition-colors duration-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-neon-cyan transition-colors duration-300">Methodology</h3>
          </div>
          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed transition-colors duration-300">
            Air Quality Index (AQI) values are calculated using EPA standards, considering
            multiple pollutants including PM2.5, PM10, NO2, O3, CO, and SO2. The highest
            pollutant sub-index determines the overall AQI.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300 shadow-sm dark:shadow-neon-cyan/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg transition-colors duration-300">
              <TrendingUp className="w-6 h-6 text-purple-600 dark:text-neon-pink transition-colors duration-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-neon-cyan transition-colors duration-300">Updates</h3>
          </div>
          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed transition-colors duration-300">
            Data is refreshed regularly from source monitoring stations. Historical data is
            maintained to enable trend analysis and long-term air quality monitoring across
            different regions and time periods.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300 shadow-sm dark:shadow-neon-cyan/10">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-neon-cyan mb-4 transition-colors duration-300">Understanding Pollutants</h3>

        <div className="space-y-4">
          <div className="border-l-4 border-blue-500 dark:border-neon-cyan pl-4 transition-colors duration-300">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 transition-colors duration-300">PM2.5 (Fine Particulate Matter)</h4>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
              Particles smaller than 2.5 micrometers that can penetrate deep into lungs and
              bloodstream. Sources include vehicle exhaust, industrial emissions, and wildfires.
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300">WHO guideline: 15 µg/m³ (24-hour mean)</p>
          </div>

          <div className="border-l-4 border-green-500 dark:border-neon-green pl-4 transition-colors duration-300">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 transition-colors duration-300">PM10 (Coarse Particulate Matter)</h4>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
              Particles between 2.5 and 10 micrometers. Can irritate airways and cause respiratory
              issues. Sources include dust, pollen, and mold.
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300">WHO guideline: 45 µg/m³ (24-hour mean)</p>
          </div>

          <div className="border-l-4 border-orange-500 dark:border-orange-400 pl-4 transition-colors duration-300">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 transition-colors duration-300">NO2 (Nitrogen Dioxide)</h4>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
              A reddish-brown gas from vehicle emissions and power plants. Can worsen asthma and
              decrease lung function with long-term exposure.
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300">Moderate range: 54-100 ppb</p>
          </div>

          <div className="border-l-4 border-amber-500 dark:border-amber-400 pl-4 transition-colors duration-300">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 transition-colors duration-300">O3 (Ozone)</h4>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
              Ground-level ozone forms when pollutants react with sunlight. Can trigger asthma
              attacks and cause throat irritation.
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300">Good range: 0-54 ppb</p>
          </div>

          <div className="border-l-4 border-red-500 dark:border-red-400 pl-4 transition-colors duration-300">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 transition-colors duration-300">CO (Carbon Monoxide)</h4>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
              A colorless, odorless gas from incomplete combustion. Reduces oxygen delivery to
              organs and can be fatal at high levels.
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300">Good range: 0-4.4 ppm</p>
          </div>

          <div className="border-l-4 border-purple-500 dark:border-neon-pink pl-4 transition-colors duration-300">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 transition-colors duration-300">SO2 (Sulfur Dioxide)</h4>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
              A gas from burning fossil fuels and volcanic eruptions. Can cause breathing
              difficulties, especially for people with asthma.
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300">Good range: 0-35 ppb</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/30 dark:to-green-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-6 transition-colors duration-300">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-neon-cyan mb-3 transition-colors duration-300">Open Data Initiative</h3>
        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4 transition-colors duration-300">
          This dashboard is built on open data principles. All air quality data is freely
          accessible and can be used for research, advocacy, and policy-making. We believe that
          environmental data should be open, transparent, and accessible to everyone.
        </p>
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
            Open Source
          </span>
          <span className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
            Real-time Data
          </span>
          <span className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
            Global Coverage
          </span>
          <span className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
            Community Driven
          </span>
        </div>
      </div>
    </div>
  );
}
