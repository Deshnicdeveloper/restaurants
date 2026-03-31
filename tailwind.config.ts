import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        app: {
          bg: "var(--color-bg)",
          surface: "var(--color-surface)",
          border: "var(--color-border)",
          primary: "var(--color-primary)",
          primaryMuted: "var(--color-primary-muted)",
          text: "var(--color-text)",
          textMuted: "var(--color-text-muted)",
          success: "var(--color-success)",
          warning: "var(--color-warning)",
          danger: "var(--color-danger)"
        }
      },
      boxShadow: {
        gold: "0 10px 30px rgba(201, 169, 110, 0.2)"
      },
      borderRadius: {
        xl2: "1.125rem"
      }
    }
  },
  plugins: []
};

export default config;
