/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0D5C99",
          light: "#1e79c0",
          dark: "#093F69"
        },
        secondary: {
          DEFAULT: "#D87AB4",
          light: "#e29fc6",
          dark: "#b8478d"
        },
        accent: "#2563EB",
        darkText: "#1F2937",
      }
    },
  },
  plugins: [],
}
