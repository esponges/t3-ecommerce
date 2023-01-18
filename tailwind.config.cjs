/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary-blue": "var(--color-primary-blue)",
        "secondary-blue": "var(--color-secondary-blue)",
      },
    },
  },
  plugins: [],
};
