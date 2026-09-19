import { defineStore } from "pinia";

type Theme = "light" | "dark";

export const useThemeStore = defineStore("theme", {
  state: () => ({ mode: "light" as Theme }),
  actions: {
    init() {
      const stored = window.localStorage.getItem("sebastian-cortes-theme") as Theme | null;
      const preferred = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      this.setTheme(stored ?? preferred);
    },
    setTheme(theme: Theme) {
      this.mode = theme;
      document.documentElement.dataset.theme = theme;
      window.localStorage.setItem("sebastian-cortes-theme", theme);
    },
    toggle() {
      this.setTheme(this.mode === "dark" ? "light" : "dark");
    }
  }
});
