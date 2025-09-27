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
        bg: "rgb(var(--color-bg) / <alpha-value>)",
        background: "rgb(var(--color-bg) / <alpha-value>)",
        "bg-subtle": "rgb(var(--color-bg-subtle) / <alpha-value>)",
        muted: "rgb(var(--color-bg-subtle) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        card: "rgb(var(--color-surface) / <alpha-value>)",
        elevated: "rgb(var(--color-elevated) / <alpha-value>)",
        fg: "rgb(var(--color-fg) / <alpha-value>)",
        foreground: "rgb(var(--color-fg) / <alpha-value>)",
        "fg-muted": "rgb(var(--color-fg-muted) / <alpha-value>)",
        "muted-foreground": "rgb(var(--color-fg-muted) / <alpha-value>)",
        "fg-subtle": "rgb(var(--color-fg-subtle) / <alpha-value>)",
        inverted: "rgb(var(--color-inverted) / <alpha-value>)",
        accent: "rgb(var(--color-accent) / <alpha-value>)",
        "accent-strong": "rgb(var(--color-accent-strong) / <alpha-value>)",
        "accent-contrast": "rgb(var(--color-accent-contrast) / <alpha-value>)",
        success: "rgb(var(--color-success) / <alpha-value>)",
        "success-strong": "rgb(var(--color-success-strong) / <alpha-value>)",
        warn: "rgb(var(--color-warn) / <alpha-value>)",
        "warn-strong": "rgb(var(--color-warn-strong) / <alpha-value>)",
        danger: "rgb(var(--color-danger) / <alpha-value>)",
        "danger-strong": "rgb(var(--color-danger-strong) / <alpha-value>)",
        destructive: "rgb(var(--color-danger) / <alpha-value>)",
        border: "rgb(var(--color-border) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
        hero: "1.75rem",
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        card: "var(--shadow-lg)",
      },
      spacing: {
        1: "var(--space-1)",
        2: "var(--space-2)",
        3: "var(--space-3)",
        4: "var(--space-4)",
        5: "var(--space-5)",
        6: "var(--space-6)",
      },
      letterSpacing: {
        "caps-tight": "0.24em",
        caps: "0.28em",
        "caps-wide": "0.3em",
        "caps-wider": "0.32em",
      },
      backgroundImage: {
        "hero-top": "radial-gradient(circle at top, rgb(var(--color-accent) / 0.22), transparent 70%)",
        "hero-corner": "radial-gradient(circle at top right, rgb(var(--color-accent) / 0.25), transparent 65%)",
      },
    },
  },
  plugins: [],
};

export default config;
