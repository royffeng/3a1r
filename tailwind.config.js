/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        lexend: ["Lexend", "sans-serif"],
      },
      colors: {
        micdrop: {
          gray: "#E5E5E5",
          purple: "#D6B9D7",
          green: "#154633",
          pink: "#FFE4ED",
          yellow: "#FFD85F",
          lightpurple: "#E6E1FF",
          beige: "#F1EAE0",
        },
      },
    },
  },
  plugins: [],
};
