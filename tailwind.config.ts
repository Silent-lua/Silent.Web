import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#050505",
        surface: "#0a0a0a",
        surfaceHover: "#111111",
        border: "#1f1f1f",
        cyan: {
          400: "#22d3ee",
          500: "#06b6d4",
        }
      },
    },
  },
  plugins: [],
};
export default config;