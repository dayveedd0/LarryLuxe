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
        gold: {
          50: '#FAF6EE',
          100: '#F4ECD9',
          200: '#EAD9B3',
          300: '#DFC28B',
          400: '#D5AD63',
          500: '#C5A059', // Core Larré Luxe Gold
          600: '#AF8842',
          700: '#8C682E',
          800: '#684B1F',
          900: '#473214',
          950: '#2A1D0A',
        },
        champagne: {
          50: '#FDFBF7',
          100: '#FBF7EE',
          200: '#F5ECDB',
          300: '#EDE0C5',
          400: '#DFCFA8',
          500: '#CDB98B',
        },
        obsidian: {
          950: '#07080A',
          900: '#0E1015',
          850: '#13161D',
          800: '#191C24',
          700: '#242833',
          600: '#343A4A',
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"Playfair Display"', 'Georgia', 'serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        script: ['"Pinyon Script"', '"Alex Brush"', '"Great Vibes"', 'cursive'],
        sans: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"SF Pro Text"', '"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 25px -5px rgba(197, 160, 89, 0.3)',
        'gold-glow-lg': '0 0 35px -5px rgba(197, 160, 89, 0.45)',
        'apple-subtle': '0 2px 10px rgba(0, 0, 0, 0.04), 0 10px 30px rgba(0, 0, 0, 0.03)',
        'apple-elevated': '0 12px 36px -4px rgba(0, 0, 0, 0.08), 0 4px 16px -2px rgba(0, 0, 0, 0.04)',
        'dark-glass': '0 20px 50px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease-out',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        'shake': 'shake 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97) both',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.97)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shake: {
          '10%, 90%': { transform: 'translate3d(-2px, 0, 0)' },
          '20%, 80%': { transform: 'translate3d(4px, 0, 0)' },
          '30%, 50%, 70%': { transform: 'translate3d(-6px, 0, 0)' },
          '40%, 60%': { transform: 'translate3d(6px, 0, 0)' },
        }
      }

    },
  },
  plugins: [],
}
