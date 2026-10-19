/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#F7F3EA',
        paper: '#FFFDF8',
        ink: {
          DEFAULT: '#2C3330',
          soft: '#5C6B64',
        },
        sage: {
          50: '#F3F7F4',
          100: '#E4EFE6',
          200: '#C9DFCD',
          300: '#A9C9B0',
          400: '#7C9A82',
          500: '#5F7F68',
          600: '#4C6754',
          700: '#3C5143',
        },
        mist: {
          50: '#F4F8FA',
          100: '#E6EEF3',
          300: '#A9BCCB',
          500: '#7A93A8',
          700: '#4E6474',
        },
        lilac: {
          50: '#F8F5FB',
          100: '#F3EEF7',
          300: '#D9CEE6',
          500: '#B7A6CB',
          700: '#6E5E82',
        },
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Nunito', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 18px 40px -28px rgba(60, 80, 70, 0.55)',
      },
      keyframes: {
        rise: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        floaty: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        rise: 'rise .55s ease both',
        floaty: 'floaty 7s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
