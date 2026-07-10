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
        serif: ["var(--font-sans)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      colors: {
        ink: "#0a0a0a",
        void: "#000000",
        surface: "#141414",
        paper: "#FAF9F6",
        accent: "#3B82F6",
      },
      boxShadow: {
        "line-light": "rgba(17, 17, 26, 0.1) 0px 1px 0px",
        "line-dark": "rgb(29, 29, 32) 0px 1px 0px",
      },
      gridTemplateColumns: {
        custom: "1.2fr 1fr",
      },
      gridTemplateRows: {
        fit: "min-content 0fr",
        full: "min-content 1fr",
      },
    },
  },
  plugins: [],
};
