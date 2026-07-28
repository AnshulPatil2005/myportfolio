/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        incognito: ["var(--font-sans)", "sans-serif"],
        sans: ["var(--font-sans)", "sans-serif"],
        serif: ["var(--font-display)", "serif"],
        display: ["var(--font-display)", "serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      colors: {
        // Warm dark amber palette — replaces cold zinc across the entire site
        zinc: {
          50:  "#faf8f5",
          100: "#f2ece3",
          200: "#e4d9ca",
          300: "#cfc0a8",
          400: "#b8a898",
          500: "#9a8f7e",
          600: "#7d7060",
          700: "#5a5145",
          800: "#3a3128",
          900: "#221c17",
          950: "#15100d",
        },
        ink:     "#100d0b",
        void:    "#0a0805",
        surface: "#15100d",
        paper:   "#FAF5EE",
        accent:  "#ffb000",
        "accent-2": "#ff5c47",
      },
      boxShadow: {
        "line-light": "rgba(17, 17, 26, 0.1) 0px 1px 0px",
        "line-dark":  "rgb(34, 28, 23) 0px 1px 0px",
      },
      gridTemplateColumns: {
        custom: "1.2fr 1fr",
      },
      gridTemplateRows: {
        fit:  "min-content 0fr",
        full: "min-content 1fr",
      },
    },
  },
  plugins: [],
};
