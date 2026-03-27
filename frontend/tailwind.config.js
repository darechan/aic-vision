/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        purple: {
          100: "#e0aaff",
          300: "#c77dff",
          500: "#9d4edd",
          600: "#7b2cbf",
          700: "#5a189a",
          800: "#3c096c",
          900: "#240046",
          950: "#10002b",
        },
      },
    },
  },
  plugins: [],
};
