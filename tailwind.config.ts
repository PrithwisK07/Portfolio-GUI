import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        display: ['var(--font-syne)', 'sans-serif'],
      },
      colors: {
        dark: '#050505',
        light: '#f4f4f5',
        accent: '#ff4d00',
      }
    }
  },
  plugins: [],
};
export default config;