/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  darkMode: 'class',
  safelist: [
    'z-[-1]', // required to render Particles background behind content
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      colors: {
        apple: {
          gray: {
            50: '#f5f5f7',
            100: '#e8e8ed',
            200: '#d2d2d7',
            300: '#86868b',
            400: '#6e6e73',
            500: '#424245',
            600: '#1d1d1f',
          },
          blue: '#0066cc',
        }
      },
      boxShadow: {
        'apple-card': '0 4px 24px rgba(0, 0, 0, 0.04)',
        'apple-card-hover': '0 8px 32px rgba(0, 0, 0, 0.08)',
      },
      transformOrigin: {
        center: 'center',
      },
      rotate: {
        y180: '180deg',
      },
      scale: {
        102: '1.02',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      },
      animation: {
        fadeInUp: 'fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        fadeIn: 'fadeIn 1s cubic-bezier(0.4, 0, 0.2, 1) forwards',
      },
    },
  },
  plugins: [],
}
