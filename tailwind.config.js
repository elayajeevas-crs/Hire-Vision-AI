/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#0A0F1C',
          900: '#0F1629',
          800: '#161F38',
          700: '#1E2A4A',
          600: '#2A3B63',
        },
        mist: {
          100: '#F3F5FA',
          200: '#D9DFEC',
          300: '#AEB9D4',
          400: '#8592B4',
        },
        signal: {
          amber: '#F5A623',
          amberDim: '#8A611A',
          teal: '#2FD9C4',
          coral: '#F2637A',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(245,166,35,0.15), 0 8px 30px rgba(0,0,0,0.35)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
};
