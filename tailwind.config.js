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
        board: {
          bg: '#F1F2F4',
          column: '#EBECF0',
          columnHover: '#E2E4E9',
        },
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0,0,0,0.12), 0 1px 2px 0 rgba(0,0,0,0.08)',
        'card-hover': '0 4px 12px 0 rgba(0,0,0,0.16)',
        'card-drag': '0 12px 30px 0 rgba(0,0,0,0.22)',
      },
    },
  },
  plugins: [],
}
