import { useQuery } from '@tanstack/react-query';
import { Heart, Activity, Baby, Users, Wind } from 'lucide-react';
import { api } from '../lib/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { getAQIBgColor } from '../lib/utils';

interface HealthSectionProps {
  city: string;
  countryCode: string;
  countryName: string;
}

export function HealthSection({ city, countryCode, countryName }: HealthSectionProps) {
  const { data: insights, isLoading, error } = useQuery({
    queryKey: ['insights', city, countryCode],
    queryFn: () => api.getInsights(city, countryCode),
    enabled: !!city && !!countryCode,
  });

  if (!city) {
    return (
      <div className="flex items-center justify-center py-12 text-gray-500">
        Select a city to view health insights
      </div>
    );
  }

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="Failed to load health insights" />;
  if (!insights) return <ErrorMessage message="No insights available" />;

  const activities = [
    { key: 'walking', label: 'Walking', icon: Activity },
    { key: 'running', label: 'Running', icon: Activity },
    { key: 'outdoor_play', label: 'Outdoor Play', icon: Baby },
    { key: 'cycling', label: 'Cycling', icon: Activity },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">
          Health & Lifestyle - {city}, {countryName}
        </h2>
        <p className="text-gray-600">Air quality health impact and activity recommendations</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Current Air Quality</h3>
            <p className="text-gray-600">{insights.category}</p>
          </div>
          <div
            className={`px-6 py-3 rounded-lg text-white text-3xl font-bold ${getAQIBgColor(
              insights.aqi
            )}`}
          >
            {insights.aqi}
          </div>
        </div>

        <div className="prose max-w-none">
          <p className="text-gray-700 text-lg">{insights.health.general}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-6 h-6 text-red-500" />
            <h3 className="text-lg font-semibold text-gray-900">Health Impacts</h3>
          </div>

          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-medium text-gray-900 mb-1 flex items-center gap-2">
                <Users className="w-4 h-4" /> General Population
              </h4>
              <p className="text-sm text-gray-700">{insights.health.general}</p>
            </div>

            <div className="border-l-4 border-orange-500 pl-4">
              <h4 className="font-medium text-gray-900 mb-1 flex items-center gap-2">
                <Wind className="w-4 h-4" /> Sensitive Groups
              </h4>
              <p className="text-sm text-gray-700">{insights.health.sensitive}</p>
            </div>

            <div className="border-l-4 border-purple-500 pl-4">
              <h4 className="font-medium text-gray-900 mb-1 flex items-center gap-2">
                <Baby className="w-4 h-4" /> Children
              </h4>
              <p className="text-sm text-gray-700">{insights.health.children}</p>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-medium text-gray-900 mb-1 flex items-center gap-2">
                <Users className="w-4 h-4" /> Elderly
              </h4>
              <p className="text-sm text-gray-700">{insights.health.elderly}</p>
            </div>

            <div className="border-l-4 border-red-500 pl-4">
              <h4 className="font-medium text-gray-900 mb-1 flex items-center gap-2">
                <Heart className="w-4 h-4" /> Asthma Patients
              </h4>
              <p className="text-sm text-gray-700">{insights.health.asthma}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-6 h-6 text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-900">Activity Recommendations</h3>
          </div>

          <div className="space-y-4">
            {activities.map((activity) => {
              const activityData = insights.activities[activity.key as keyof typeof insights.activities];
              const Icon = activity.icon;

              return (
                <div
                  key={activity.key}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className="w-5 h-5 text-gray-600" />
                      <h4 className="font-medium text-gray-900">{activity.label}</h4>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold text-white ${
                        activityData.safe ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    >
                      {activityData.safe ? 'Safe' : 'Unsafe'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{activityData.recommendation}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Quick Guide</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="font-medium text-gray-900">Good (0-50)</span>
            </div>
            <p className="text-sm text-gray-600">Perfect for all outdoor activities</p>
          </div>

          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-amber-400"></div>
              <span className="font-medium text-gray-900">Moderate (51-100)</span>
            </div>
            <p className="text-sm text-gray-600">Acceptable for most people</p>
          </div>

          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span className="font-medium text-gray-900">Unhealthy for Sensitive (101-150)</span>
            </div>
            <p className="text-sm text-gray-600">Sensitive groups should limit exposure</p>
          </div>

          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="font-medium text-gray-900">Unhealthy (151-200)</span>
            </div>
            <p className="text-sm text-gray-600">Everyone should reduce outdoor time</p>
          </div>

          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-red-800"></div>
              <span className="font-medium text-gray-900">Very Unhealthy (201-300)</span>
            </div>
            <p className="text-sm text-gray-600">Stay indoors if possible</p>
          </div>

          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-red-950"></div>
              <span className="font-medium text-gray-900">Hazardous (301+)</span>
            </div>
            <p className="text-sm text-gray-600">Emergency conditions, avoid all exposure</p>
          </div>
        </div>
      </div>
    </div>
  );
}
