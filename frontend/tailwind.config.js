/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc8fc',
          400: '#38aaf8',
          500: '#0e8fe9',
          600: '#0273c7',
          700: '#035ca1',
          800: '#074e85',
          900: '#0c426e',
          950: '#082a49',
        },
        dark: {
          bg: '#0B0F17',
          surface: '#111827',
          card: '#182234',
          border: '#1E293B',
          muted: '#334155'
        },
        // Category specialized highlight palettes
        cat: {
          entertainment: '#EC4899', // Pink / Magenta
          jobs: '#10B981',          // Emerald Green
          news: '#3B82F6',          // Blue
          education: '#F59E0B',     // Amber
          tech: '#8B5CF6',          // Purple / Violet
          sports: '#EF4444',        // Red
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-brand': '0 0 20px -5px rgba(14, 143, 233, 0.3)',
        'glow-purple': '0 0 20px -5px rgba(139, 92, 246, 0.3)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.25)',
      }
    },
  },
  plugins: [],
};
