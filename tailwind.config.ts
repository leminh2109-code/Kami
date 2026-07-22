import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#14110F",
        parchment: "#F7F3EC",
        brass: {
          DEFAULT: "#B8874B",
          light: "#D9B27C",
          dark: "#8C6535",
        },
        emerald: {
          DEFAULT: "#2F4B3C",
          light: "#3F6350",
        },
        silver: {
          DEFAULT: "#C7C9CC",
          dark: "#8A8D92",
        },
        line: "#E4DDD0",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        none: "0px",
      },
    },
  },
  plugins: [],
};

export default config;
