import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "light" | "dark";

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const applyTheme = (theme: Theme) => {
  if (typeof window === "undefined") return;

  const root = document.documentElement;

  // Remove any existing theme classes
  root.classList.remove("light", "dark");
  // Add the new theme class
  root.classList.add(theme);

  // Also set a data attribute for immediate CSS targeting
  root.setAttribute("data-theme", theme);
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "light",
      toggleTheme: () => {
        const newTheme = get().theme === "light" ? "dark" : "light";
        set({ theme: newTheme });
        applyTheme(newTheme);
      },
      setTheme: (theme: Theme) => {
        set({ theme });
        applyTheme(theme);
      },
    }),
    {
      name: "theme-store",
      onRehydrateStorage: () => (state) => {
        // Apply theme immediately on hydration
        if (state) {
          applyTheme(state.theme);
        }
      },
    }
  )
);
