import { X, Home, Building2, Map, TrendingUp, Heart, Info } from 'lucide-react';

type Section =
  | 'overview'
  | 'deep-dive'
  | 'map'
  | 'trends'
  | 'health'
  | 'about';

interface SidebarProps {
  isOpen: boolean;
  currentSection: Section;
  onSectionChange: (section: Section) => void;
  onClose: () => void;
}

const sections = [
  { id: 'overview' as Section, label: 'Overview', icon: Home },
  { id: 'deep-dive' as Section, label: 'City Deep Dive', icon: Building2 },
  { id: 'map' as Section, label: 'Map & Sensors', icon: Map },
  { id: 'trends' as Section, label: 'Trends & Comparison', icon: TrendingUp },
  { id: 'health' as Section, label: 'Health & Lifestyle', icon: Heart },
  { id: 'about' as Section, label: 'About', icon: Info },
];

export function Sidebar({ isOpen, currentSection, onSectionChange, onClose }: SidebarProps) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 lg:hidden">
          <h2 className="font-semibold text-gray-900 dark:text-neon-cyan">Menu</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-700 dark:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = currentSection === section.id;

            return (
              <button
                key={section.id}
                onClick={() => {
                  onSectionChange(section.id);
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? 'bg-blue-50 dark:bg-gray-700 text-blue-700 dark:text-neon-cyan shadow-sm dark:shadow-neon-cyan/30'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-neon-cyan'
                }`}
              >
                <Icon className="w-5 h-5" />
                {section.label}
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

export type { Section };
