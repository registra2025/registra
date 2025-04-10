/** @type {import('tailwindcss').Config} */
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
            darkBg: '#1e1e2d',
            darkText: '#e5e5e5',
          },
      },
    },
    plugins: [],
  };
  