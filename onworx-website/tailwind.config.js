/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html,js}", "./assets/js/**/*.js"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1.5rem',
        md: '3rem',
        lg: '4rem',
      },
    },
    extend: {
      colors: {
        'cream': '#FDFBF7',
        'ink': '#1A1A1A',
        'terra': '#D95D39',
        'green': '#afbe9d',
        'sage': '#E3E8E3',
      },
      fontFamily: {
        serif: ['"Plantagenet"', 'serif'],
        sans: ['"AzoSans"', 'sans-serif'],
      },
      animation: {
        'marquee': 'marquee 25s linear infinite',
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'spin-slow': 'spin 16s linear infinite',
        'scroll': 'scroll 40s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      }
    },
  },
  plugins: [],
}