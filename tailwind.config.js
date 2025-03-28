/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./public/**/*.{html,js}",
    "./views/**/*.ejs",
    "./views/layouts/**/*.ejs",
    "./views/partials/**/*.ejs",
    "./views/pages/**/*.ejs",
  ],
  theme: {
    extend: {
      colors: {
        "dark-bg": "#121212",
        "dark-surface": "#1E1E1E",
        "dark-border": "#333333",
        "dark-text": "#E0E0E0",
        "dark-text-secondary": "#AAAAAA",
        "dark-accent": "#3B82F6",
      },
    },
  },
  plugins: [],
};
