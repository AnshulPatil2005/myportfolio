/** @type {import('tailwindcss').Config} */
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

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
        // the whole site is set in one serif; mono is reserved for data
        sans: ["var(--font-serif)", '"Newsreader Fallback"', "Georgia", "serif"],
        serif: ["var(--font-serif)", '"Newsreader Fallback"', "Georgia", "serif"],
        display: ["var(--font-serif)", '"Newsreader Fallback"', "Georgia", "serif"],
        incognito: ["var(--font-serif)", '"Newsreader Fallback"', "Georgia", "serif"],
        mono: ["var(--font-mono)", '"JetBrains Mono Fallback"', "ui-monospace", "monospace"],
      },
      fontSize: {
        // 1.25 scale from an 18px body
        meta: ["0.8125rem", { lineHeight: "1.5" }],
        small: ["0.9375rem", { lineHeight: "1.55" }],
        body: ["1.125rem", { lineHeight: "1.6" }],
        lead: ["1.40625rem", { lineHeight: "1.45" }],
        h3: ["1.75rem", { lineHeight: "1.2" }],
        h2: ["2.75rem", { lineHeight: "1.08" }],
      },
      colors: {
        // monograph tokens, switched per theme in globals.css
        page: token("page"),
        fg: token("fg"),
        muted: token("muted"),
        line: token("line"),
        rubric: token("rubric"),
        wash: token("wash"),

        // legacy palette, still used by the Career Mode overlay
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
      maxWidth: {
        measure: "36rem",
      },
      gridTemplateRows: {
        fit:  "min-content 0fr",
        full: "min-content 1fr",
      },
    },
  },
  plugins: [],
};
