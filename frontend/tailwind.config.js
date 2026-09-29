/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#4A3B32',
        secondary: '#D2B48C',
        accent: '#D4AF37',
        'light-bg': '#F9F8F6',
        'dark-text': '#1A1A1A',
        nude: {
          50: '#F9F8F6',
          100: '#F0EBE4',
          200: '#D2B48C',
        },
        marrom: {
          400: '#8A7464',
          600: '#4A3B32',
          800: '#4A3B32',
        },
        dourado: {
          400: '#E0C86A',
          500: '#D4AF37',
          600: '#B8962C',
        },
        rosa: {
          200: '#E8D9CC',
          300: '#D2B48C',
        },
        brand: {
          50: '#F9F8F6',
          100: '#F0EBE4',
          200: '#E4D5C2',
          300: '#D2B48C',
          400: '#D4AF37',
          500: '#D4AF37',
          600: '#B8962C',
          700: '#4A3B32',
        },
        cream: {
          50: '#F9F8F6',
          100: '#F0EBE4',
          200: '#E8D9CC',
        },
        ink: {
          950: '#1A1A1A',
          900: '#1A1A1A',
          700: '#4A3B32',
          500: '#6B5C52',
          400: '#8A7A70',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 12px 40px rgba(74, 59, 50, 0.12)',
        'glow-lg': '0 20px 50px rgba(74, 59, 50, 0.16)',
        card: '0 4px 24px rgba(26, 26, 26, 0.06)',
      },
      backgroundImage: {
        'hero-glow':
          'radial-gradient(ellipse 70% 55% at 85% 35%, rgba(212, 175, 55, 0.22) 0%, transparent 65%), linear-gradient(160deg, #F9F8F6 0%, #F0EBE4 45%, #FFFFFF 100%)',
        'promo-glow': 'linear-gradient(135deg, #4A3B32 0%, #6B5346 48%, #D4AF37 100%)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
};
