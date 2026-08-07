/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "surface-dim": "#cbdbf5",
        "primary": "#3525cd",
        "primary-hover": "#291bb8",
        "primary-container": "#4f46e5",
        "on-primary": "#ffffff",
        "on-primary-container": "#dad7ff",
        "primary-fixed": "#e2dfff",
        "primary-fixed-dim": "#c3c0ff",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#eff4ff",
        "surface-container": "#e5eeff",
        "surface-container-high": "#dce9ff",
        "surface-container-highest": "#d3e4fe",
        "inverse-surface": "#213145",
        "inverse-on-surface": "#eaf1ff",
        "inverse-primary": "#c3c0ff",
        "surface-bright": "#f8f9ff",
        "surface": "#f8f9ff",
        "background": "#f8f9ff",
        "on-background": "#0b1c30",
        "on-surface": "#0b1c30",
        "on-surface-variant": "#464555",
        "outline": "#777587",
        "outline-variant": "#c7c4d8",
        "secondary": "#565e74",
        "secondary-container": "#dae2fd",
        "on-secondary-container": "#5c647a",
        "tertiary": "#7e3000",
        "tertiary-container": "#a44100",
        "on-tertiary-container": "#ffd2be",
        "error": "#ba1a1a",
        "error-container": "#ffdad6",
        "on-error": "#ffffff",
        "on-error-container": "#93000a",
        
        // Status colors for candidate exam & proctoring
        "status-answered": "#059669",
        "status-marked": "#eab308",
        "status-unanswered": "#ef4444",
        "status-not-visited": "#e2e8f0",
        "status-active": "#4f46e5"
      },
      borderRadius: {
        "DEFAULT": "0.125rem",
        "sm": "0.125rem",
        "md": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "2xl": "1rem",
        "full": "9999px"
      },
      spacing: {
        "xs": "4px",
        "sm": "8px",
        "md": "16px",
        "lg": "24px",
        "xl": "40px",
        "gutter": "20px",
        "container-max": "1440px"
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      }
    },
  },
  plugins: [],
}
