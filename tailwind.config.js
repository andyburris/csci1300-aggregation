const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        displaySerif: ["Libre Caslon Condensed", "serif"],
      },
      boxShadow: {
        outset: "0px 1px 1px 0px rgba(255, 255, 255, 0.18) inset, 0px 0px 0px 1px rgba(255, 255, 255, 0.12) inset, 0px -0.5px 2px 0px rgba(0, 0, 0, 0.08) inset, 0px 0px 0px 0.5px rgba(0, 0, 0, 0.08), 0px 1px 3px 0px rgba(0, 0, 0, 0.05), 0px 0px 2px 0px rgba(0, 0, 0, 0.12)",
      },      
    },
    screens: {
      'xs': '475px',
      ...defaultTheme.screens,
    },
  },
  plugins: [],
}

