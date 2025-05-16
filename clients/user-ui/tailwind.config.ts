import type { Config } from "tailwindcss";
import { heroui } from "@heroui/react";

/** @type {import('tailwindcss').Config} */
const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        Poppins: ["var(--font-Poppins)"],
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
};

export default config;
