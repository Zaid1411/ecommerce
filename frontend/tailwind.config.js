/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#FAF8F5',
          100: '#F4EFEA',
          200: '#E7DDD3',
          300: '#D5C4B3',
          400: '#BBA28C',
          500: '#9C7F67',
          600: '#7C624E',
          700: '#5F4B3C',
          800: '#46382E',
          900: '#231D18',
          sand: '#F7F5F0',
          oat: '#EFECE6',
          charcoal: '#1A1817',
          timber: '#8C7355',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest: '.2em',
        loose: '.15em',
      }
    },
  },
  plugins: [],
}
