/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
      "./public/index.html"
  ],
  theme: {
    extend: {
      padding: {
        '1/3': '33.33333%',
        '2/3': '66.666667%'
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

