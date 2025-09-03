// tailwind.config.ts
import type { Config } from "tailwindcss";
import { ColorPalatte } from "./lib/constants";

const config = {
  darkMode: ["class"],
  content: [
    // if you use src/, keep these:
    "./src/app/**/*.{ts,tsx,js,jsx,mdx}",
    "./src/components/**/*.{ts,tsx,js,jsx,mdx}",
    "./src/features/**/*.{ts,tsx,js,jsx,mdx}",
    "./src/pages/**/*.{ts,tsx,js,jsx,mdx}",

    // ALSO include root-level folders (per your stack trace)
    "./app/**/*.{ts,tsx,js,jsx,mdx}",
    "./components/**/*.{ts,tsx,js,jsx,mdx}",
    "./features/**/*.{ts,tsx,js,jsx,mdx}",
    "./pages/**/*.{ts,tsx,js,jsx,mdx}",
  ],
  theme: {
    container: { center: true, screens: { "2xl": "1400px" } },
    extend: {
      fontFamily: {
        primary: ["var(--font-azo-sans)"],
        secondary: ["Lexend"],
      },
      colors: { ...ColorPalatte },
      // ...your keyframes/animations/shadows
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("tailwind-scrollbar"),
    require("@tailwindcss/aspect-ratio"),
  ],
} satisfies Config;

export default config;
