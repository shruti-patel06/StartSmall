/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    screens: {
      'xs': '375px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        cream: '#FFF8F0',
        coral: {
          50: '#FFF0ED',
          100: '#FFE0D9',
          200: '#FFC2B3',
          300: '#FF9980',
          400: '#FF6B6B',
          500: '#FF5252',
          600: '#E84545',
        },
        navy: {
          DEFAULT: '#2D3436',
          light: '#636E72',
          muted: '#B2BEC3',
        },
        gold: {
          DEFAULT: '#FFD93D',
          light: '#FFF3CD',
        },
        mint: {
          DEFAULT: '#6BCB77',
          light: '#E8F8E8',
        },
        sky: {
          400: '#4A90D9',
          light: '#E3F0FF',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 8s ease-in-out 1s infinite',
        'float-slow': 'float 10s ease-in-out 2s infinite',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'pulse-soft': 'pulseSoft 2.5s ease-in-out infinite',
        'bounce-soft': 'bounceSoft 2s ease-in-out infinite',
        'wiggle': 'wiggle 0.6s ease-in-out',
        'spin-slow': 'spin 12s linear infinite',
        'confetti-fall': 'confettiFall 1.5s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(3deg)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { transform: 'scale(1)', boxShadow: '0 4px 15px rgba(255,107,107,0.3)' },
          '50%': { transform: 'scale(1.04)', boxShadow: '0 8px 30px rgba(255,107,107,0.45)' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-3deg)' },
          '75%': { transform: 'rotate(3deg)' },
        },
        confettiFall: {
          '0%': { transform: 'translateY(-10vh) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(100vh) rotate(720deg)', opacity: '0' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      boxShadow: {
        'soft': '0 2px 15px rgba(0, 0, 0, 0.05)',
        'medium': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'coral': '0 4px 15px rgba(255, 107, 107, 0.3)',
        'coral-lg': '0 8px 25px rgba(255, 107, 107, 0.35)',
      },
    },
  },
  plugins: [],
}
