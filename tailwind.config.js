/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        neon: {
          cyan: '#00ffff',
          pink: '#ff00ff',
          green: '#39ff14',
          blue: '#0080ff',
          purple: '#bf00ff',
          yellow: '#ffff00',
        },
      },
      boxShadow: {
        'neon-cyan': '0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff',
        'neon-pink': '0 0 10px #ff00ff, 0 0 20px #ff00ff, 0 0 30px #ff00ff',
        'neon-green': '0 0 10px #39ff14, 0 0 20px #39ff14, 0 0 30px #39ff14',
        'neon-blue': '0 0 10px #0080ff, 0 0 20px #0080ff, 0 0 30px #0080ff',
      },
    },
  },
  plugins: [],
};
