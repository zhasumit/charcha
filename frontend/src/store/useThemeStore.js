import { create } from "zustand";

export const useThemeStore = create((set) => ({
    theme: localStorage.getItem("charcha-theme") || "coffee",
    setTheme: (theme) => {
        localStorage.setItem("charcha-theme", theme);
        set({ theme });
    },
}));