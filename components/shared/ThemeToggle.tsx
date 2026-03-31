"use client";

import { Moon, Sun } from "lucide-react";

export function ThemeToggle({
  theme,
  onToggle
}: {
  theme: "dark" | "light";
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="fixed right-3 top-3 z-[70] inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-app-border bg-app-surface/90 text-app-text backdrop-blur transition hover:border-app-primary"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
