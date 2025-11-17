import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: 'up' | 'down';
  trendValue?: string;
  color?: string;
}

export function KPICard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  color = 'blue',
}: KPICardProps) {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    red: 'bg-red-50 text-red-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  const darkColorClasses: Record<string, string> = {
    blue: 'dark:bg-blue-900/30 dark:text-neon-cyan',
    green: 'dark:bg-emerald-900/30 dark:text-neon-green',
    amber: 'dark:bg-amber-900/30 dark:text-neon-yellow',
    red: 'dark:bg-red-900/30 dark:text-red-400',
    orange: 'dark:bg-orange-900/30 dark:text-orange-400',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md dark:hover:shadow-neon-cyan/20 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors duration-300">{title}</h3>
        {Icon && (
          <div className={`p-2 rounded-lg ${colorClasses[color]} ${darkColorClasses[color]} transition-colors duration-300`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="text-3xl font-bold text-gray-900 dark:text-neon-cyan transition-colors duration-300">{value}</div>

        {subtitle && <div className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">{subtitle}</div>}

        {trend && trendValue && (
          <div
            className={`text-sm font-medium ${
              trend === 'up' ? 'text-red-600' : 'text-green-600'
            }`}
          >
            {trend === 'up' ? '↑' : '↓'} {trendValue}
          </div>
        )}
      </div>
    </div>
  );
}
