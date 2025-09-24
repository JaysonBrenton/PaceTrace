import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--color-bg) / <alpha-value>)",
        foreground: "hsl(var(--color-fg) / <alpha-value>)",
        muted: "hsl(var(--color-muted) / <alpha-value>)",
        "muted-foreground": "hsl(var(--color-muted-foreground) / <alpha-value>)",
        card: "hsl(var(--color-card) / <alpha-value>)",
        border: "hsl(var(--color-card-border) / <alpha-value>)",
        accent: "hsl(var(--color-accent) / <alpha-value>)",
        "accent-muted": "hsl(var(--color-accent-muted) / <alpha-value>)",
        "accent-2": "hsl(var(--color-accent-2) / <alpha-value>)",
        success: "hsl(var(--color-success) / <alpha-value>)",
        destructive: "hsl(var(--color-destructive) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      backgroundImage: {
        "grid-fade":
          "linear-gradient(transparent 0%, transparent 48%, hsla(var(--color-card-border) / 0.3) 50%, transparent 52%, transparent 100%)",
      },
      boxShadow: {
        card: "0 18px 50px -15px hsla(var(--color-accent) / 0.25)",
      },
      borderRadius: {
        xl: "1.25rem",
      },
    },
  },
  plugins: [],
};
export default config;
