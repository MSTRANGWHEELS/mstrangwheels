/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Fredoka"', '"Nunito"', '"Be Vietnam Pro"', 'system-ui', 'sans-serif'],
        heading: ['"Fredoka"', '"Nunito"', '"Be Vietnam Pro"', 'system-ui', 'sans-serif'],
        bubble: ['"Fredoka"', '"Nunito"', 'cursive', 'sans-serif'],
      },
      colors: {
        theme: {
          turquoise: '#20D9E5',
          aqua: '#38DFF0',
          mint: '#65E6C2',
          sky: '#29C8F5',
          yellow: '#FFD747',
          coral: '#FF7188',
          purple: '#AD78EF',
          green: '#65D84F',
          orange: '#FF7628',
          cream: '#FFFDF1',
          creamCard: '#FFFDF5',
          creamBorder: '#FFECA8',
        },
      },
      boxShadow: {
        '3d-green': '0 6px 0 #249C22, 0 12px 24px rgba(101, 216, 79, 0.45)',
        '3d-blue': '0 6px 0 #1B97C2, 0 12px 24px rgba(41, 200, 245, 0.45)',
        '3d-turquoise': '0 6px 0 #13A9B4, 0 12px 24px rgba(32, 217, 229, 0.45)',
        '3d-orange': '0 6px 0 #CC4F0A, 0 12px 24px rgba(255, 118, 40, 0.45)',
        '3d-coral': '0 6px 0 #D43F58, 0 12px 24px rgba(255, 113, 136, 0.45)',
        '3d-purple': '0 6px 0 #7A45C4, 0 12px 24px rgba(173, 120, 239, 0.45)',
        '3d-yellow': '0 6px 0 #CCA10A, 0 12px 24px rgba(255, 215, 71, 0.45)',
        'cream-card': '0 8px 0 #E2DFCA, 0 16px 36px rgba(0, 0, 0, 0.08)',
        'cream-banner': '0 6px 0 #DCD8BF, 0 12px 28px rgba(0, 0, 0, 0.07)',
      },
      animation: {
        'float-slow': 'floatSlow 6s ease-in-out infinite',
        'float-delayed': 'floatSlow 7s ease-in-out 2s infinite',
        'spin-slow': 'spin 20s linear infinite',
        'pulse-gentle': 'pulseGentle 3s ease-in-out infinite',
        'twinkle': 'twinkle 2.5s ease-in-out infinite',
        'sun-rays': 'sunRays 8s linear infinite',
      },
      keyframes: {
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGentle: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.04)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(0.85)' },
          '50%': { opacity: '1', transform: 'scale(1.15)' },
        },
        sunRays: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
}
