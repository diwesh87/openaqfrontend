import { Info } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface InfoTooltipProps {
  title: string;
  description: string;
  whyItMatters?: string;
  ranges?: { range: string; level: string }[];
}

export function InfoTooltip({ title, description, whyItMatters, ranges }: InfoTooltipProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center w-5 h-5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-neon-cyan transition-colors duration-300"
      >
        <Info className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-80 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl dark:shadow-neon-cyan/30 left-0 top-6 transition-colors duration-300">
          <h4 className="font-semibold text-sm mb-2 text-gray-900 dark:text-neon-cyan transition-colors duration-300">{title}</h4>
          <p className="text-xs text-gray-600 dark:text-gray-300 mb-3 transition-colors duration-300">{description}</p>

          {whyItMatters && (
            <div className="mb-3">
              <h5 className="font-medium text-xs text-gray-700 dark:text-gray-200 mb-1 transition-colors duration-300">Why it matters:</h5>
              <p className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300">{whyItMatters}</p>
            </div>
          )}

          {ranges && ranges.length > 0 && (
            <div>
              <h5 className="font-medium text-xs text-gray-700 dark:text-gray-200 mb-2 transition-colors duration-300">Value ranges:</h5>
              <div className="space-y-1">
                {ranges.map((range, idx) => (
                  <div key={idx} className="flex justify-between text-xs">
                    <span className="text-gray-600 dark:text-gray-400 transition-colors duration-300">{range.range}</span>
                    <span className="text-gray-500 dark:text-gray-300 font-medium transition-colors duration-300">{range.level}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
