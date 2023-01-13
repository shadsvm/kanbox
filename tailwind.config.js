/** @type {import('tailwindcss').Config} */

const colors = require("tailwindcss/colors")

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: colors.blue,
        gray: colors.zinc,
        // neutral: {
        //   920: '#151515',
        //   940: '#131313',
        //   960: '#121212',
        //   980: '#111111',
        // }
      },
    },
  },
  plugins: [],
}
