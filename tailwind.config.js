/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background-color, #ffffff)',
        text: 'var(--text-color, #1a1a1a)',
        primary: 'var(--primary-color, #0070f3)',
        secondary: 'var(--secondary-color, #7928ca)',
      },
      animation: {
        'text-shimmer': 'text-shimmer 3s ease-out infinite alternate',
        'subtle-zoom': 'subtle-zoom 30s ease-in-out infinite alternate',
        'float-slow': 'float 8s ease-in-out infinite',
        'float-reverse': 'float-reverse 12s ease-in-out infinite',
        'pulse-slow': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-slower': 'pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scroll-down': 'scroll-down 2s ease-in-out infinite',
      },
      keyframes: {
        'text-shimmer': {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
        'subtle-zoom': {
          '0%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1.15)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'float-reverse': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(20px)' },
        },
        'scroll-down': {
          '0%': { transform: 'translate(-50%, 0)', opacity: '1' },
          '75%': { transform: 'translate(-50%, 16px)', opacity: '0' },
          '76%': { transform: 'translate(-50%, 0)', opacity: '0' },
          '100%': { transform: 'translate(-50%, 0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
