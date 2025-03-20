import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f6ff",
          100: "#e0ecff",
          200: "#bcd6ff",
          300: "#85b4ff",
          400: "#4785ff",
          500: "#1a56ff",
          600: "#0037ff",
          700: "#002ce6",
          800: "#0024bd",
          900: "#001f99",
          950: "#000f4d",
        },
        navy: {
          50: "#f2f4f9",
          100: "#e3e8f4",
          200: "#c3cde6",
          300: "#9aacd5",
          400: "#7085c3",
          500: "#5267b1",
          600: "#415094",
          700: "#364079",
          800: "#2d3563",
          900: "#282e52",
          950: "#1a1d36",
        },
        accent: {
          50: "#fff1f1",
          100: "#ffe1e1",
          200: "#ffc7c7",
          300: "#ffa0a0",
          400: "#ff6b6b",
          500: "#ff3838",
          600: "#ff1111",
          700: "#e70000",
          800: "#c00",
          900: "#a00",
          950: "#560000",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)"],
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};

export default config; 