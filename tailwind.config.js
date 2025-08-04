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
      },
      animation: {
        fadeInUp: 'fadeInUp 0.8s ease-out forwards',
      },
    },
  },
  plugins: [],
}
