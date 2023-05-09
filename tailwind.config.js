/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1360px",
      },
    },
    extend: {
      colors: {
        primary: {
          1: "#33d0f4",
          2: "#33b4d1",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};

// purple: {
//   1: "#8d35e0",
//   2: "#7c1fd3",
//   3: "#550d99",
//   4: "#3b0b68",
//   5: "#351B4E",
// },
