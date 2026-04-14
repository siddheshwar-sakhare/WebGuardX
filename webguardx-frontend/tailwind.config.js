/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        darkBg: "#0f172a",
        darkCard: "#1e293b",
        neonBlue: "#38bdf8",
        neonPurple: "#c084fc",
        neonGreen: "#4ade80",
        neonRed: "#f87171"
      }
    },
  },
  plugins: [],
}
