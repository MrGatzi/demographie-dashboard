"use client";

import { useThemeStore } from "@/app/stores/themeStore";
import { useEffect, useLayoutEffect } from "react";

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useThemeStore();

  // Use useLayoutEffect for immediate application before paint
  useLayoutEffect(() => {
    if (typeof window !== "undefined") {
      const root = document.documentElement;

      // Remove any existing theme classes instantly
      root.classList.remove("light", "dark");
      root.classList.add(theme);
      root.setAttribute("data-theme", theme);

      // Set color-scheme for better browser optimization
      root.style.colorScheme = theme;
    }
  }, [theme]);

  // Prevent flash of wrong theme on initial load
  useEffect(() => {
    // Only run on client side
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme-store");
      if (savedTheme) {
        try {
          const parsed = JSON.parse(savedTheme);
          if (parsed?.state?.theme) {
            const root = document.documentElement;
            root.classList.remove("light", "dark");
            root.classList.add(parsed.state.theme);
            root.setAttribute("data-theme", parsed.state.theme);
            root.style.colorScheme = parsed.state.theme;
          }
        } catch {
          // Ignore parsing errors
        }
      }
    }
  }, []);

  return <>{children}</>;
}
