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
    },
  },
  plugins: [],
}
