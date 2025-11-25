import { create } from "zustand";
import { persist } from "zustand/middleware";
import { themeConfigs } from "../constants/themeConfigs";

// Zustand theme store with persistence
export const useThemeStore = create(
  persist(
    (set) => ({
      currentTheme: "oceanBlue",
      themeConfigs,
      setCurrentTheme: (themeKey) =>
        set((state) => ({
          currentTheme: themeKey,
        })),
    }),
    {
      name: "theme-storage",
    }
  )
);
