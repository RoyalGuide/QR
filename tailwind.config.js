/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#070608',
          900: '#0c0a12',
          800: '#13101b',
          700: '#1c1828',
          600: '#2a2440',
        },
        gold: {
          50: '#fbf7ed',
          100: '#f6eccf',
          200: '#ecd79b',
          300: '#e0bd5f',
          400: '#d4a73c',
          500: '#c08c28',
          600: '#a06d1d',
          700: '#7d5216',
          800: '#553713',
          900: '#2f1f0e',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float-slow': 'float 7s ease-in-out infinite',
        'float-slower': 'float 11s ease-in-out infinite',
        'shimmer': 'shimmer 3s linear infinite',
        'fade-up': 'fadeUp 0.7s ease forwards',
        'spin-slow': 'spin 14s linear infinite',
        'pulse-gold': 'pulseGold 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-22px) rotate(2deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(28px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(212,167,60,0.35)' },
          '50%': { boxShadow: '0 0 0 18px rgba(212,167,60,0)' },
        },
      },
    },
  },
  plugins: [],
};
