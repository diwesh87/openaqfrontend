import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-lg transition-all duration-300 
                 bg-gray-200 dark:bg-gray-800 
                 hover:bg-gray-300 dark:hover:bg-gray-700
                 border border-gray-300 dark:border-gray-600
                 hover:border-neon-cyan dark:hover:border-neon-cyan
                 hover:shadow-neon-cyan
                 group"
      aria-label="Toggle theme"
    >
      <Sun
        className={`w-5 h-5 text-yellow-500 transition-all duration-300 ${
          theme === 'dark' ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
        }`}
      />
      <Moon
        className={`absolute top-2 left-2 w-5 h-5 text-neon-cyan transition-all duration-300 ${
          theme === 'dark' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'
        }`}
      />
    </button>
  );
}

