module.exports = {
  extends: ["next/core-web-vitals"],
  plugins: ["tailwindcss"],
  rules: {
    "no-restricted-syntax": [
      "error",
      {
        selector: "Literal[value=/^#(?:[0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/]",
        message: "Use design tokens instead of raw hex values in components.",
      },
      {
        selector: "Literal[value=/^(?:rgb|hsl)a?\\(/i]",
        message: "Use design tokens instead of rgb()/hsl() color strings.",
      },
      {
        selector: "TemplateElement[value.raw=/^(?:#|rgb|hsl)/i]",
        message: "Use design tokens instead of literal color values in templates.",
      },
    ],
    "tailwindcss/no-arbitrary-value": [
      "error",
      {
        ignoreValues: [/^\[calc/, /^\[color:/, /^\[radial-gradient/, /^\[hsl\(var/, /^\[minmax/, /^\[var\(--/],
      },
    ],
  },
  settings: {
    tailwindcss: {
      callees: ["cn"],
      config: "tailwind.config.ts",
    },
  },
};
