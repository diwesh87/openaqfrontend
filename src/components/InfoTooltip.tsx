import { Info } from 'lucide-react';
import { useState } from 'react';

interface InfoTooltipProps {
  title: string;
  description: string;
  whyItMatters?: string;
  ranges?: { range: string; level: string }[];
}

export function InfoTooltip({ title, description, whyItMatters, ranges }: InfoTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <Info className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-80 p-4 bg-white border border-gray-200 rounded-lg shadow-xl left-0 top-6">
          <h4 className="font-semibold text-sm mb-2 text-gray-900">{title}</h4>
          <p className="text-xs text-gray-600 mb-3">{description}</p>

          {whyItMatters && (
            <div className="mb-3">
              <h5 className="font-medium text-xs text-gray-700 mb-1">Why it matters:</h5>
              <p className="text-xs text-gray-600">{whyItMatters}</p>
            </div>
          )}

          {ranges && ranges.length > 0 && (
            <div>
              <h5 className="font-medium text-xs text-gray-700 mb-2">Value ranges:</h5>
              <div className="space-y-1">
                {ranges.map((range, idx) => (
                  <div key={idx} className="flex justify-between text-xs">
                    <span className="text-gray-600">{range.range}</span>
                    <span className="text-gray-500 font-medium">{range.level}</span>
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
