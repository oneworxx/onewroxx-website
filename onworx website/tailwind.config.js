/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html,js}", "./assets/js/**/*.js"],
  theme: {
    extend: {
      colors: {
        'cream': '#FDFBF7',
        'ink': '#1A1A1A',
        'terra': '#D95D39', // Terracotta accent
        'sage': '#E3E8E3',  // Soft green background option
      },
      fontFamily: {
       serif: ['"Plantagenet"', 'serif'],
              sans: ['"AzoSans"', 'sans-serif'],
      },
      animation: {
        'marquee': 'marquee 25s linear infinite',
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'spin-slow': 'spin 16s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}