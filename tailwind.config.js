/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        mt: {
          yellow: '#FFD100',
          orange: '#FF7A00',
          black: '#222222',
          gray: '#F5F5F5',
        },
      },
      boxShadow: {
        phone: '0 24px 80px rgba(31, 41, 55, 0.16)',
        card: '0 8px 22px rgba(18, 18, 18, 0.06)',
      },
    },
  },
  plugins: [],
};
