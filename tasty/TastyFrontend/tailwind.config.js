/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#fffbf0',
          100: '#ffedd5',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          900: '#7c2d12',
        },
        surface: '#ffffff',
        background: '#fafafa',
        primary: '#3b82f6',
        secondary: '#10b981',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'glow': '0 0 15px rgba(249, 115, 22, 0.3)',
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'blob': {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' }
        },
        'sweep': {
          '0%': { transform: 'scaleX(0)', transformOrigin: 'bottom left' },
          '100%': { transform: 'scaleX(1)', transformOrigin: 'bottom left' }
        }
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.5s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'blob': 'blob 7s infinite',
        'sweep': 'sweep 0.3s ease-out forwards'
      }
    },
  },
  plugins: [],
}
