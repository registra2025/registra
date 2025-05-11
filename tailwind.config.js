/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors';

export default {
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './app.vue',
    './plugins/**/*.{js,ts}',
  ],
  darkMode: 'class', // important: use class strategy
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          hover: 'var(--color-primary-hover)',
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)',
          hover: 'var(--color-secondary-hover)',
        },
        text: 'var(--color-text)',
        bg: 'var(--color-bg)',
        darkBg: '#1e1e2d',
        darkText: '#e5e5e5',
        blue: colors.gray,
        lightBlue: colors.gray,
        sky: colors.gray,
        cyan: colors.gray,
      },
    },
  },
  plugins: [],
};