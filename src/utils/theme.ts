import type { AppDOM } from "../types/index.js";

type ThemeMode = "dark-mode" | "light-mode";

function applySavedTheme(DOM: AppDOM): void {
  const themeMode = localStorage.getItem("themeMode") as ThemeMode | null;

  if (!themeMode) return;
  document.body.classList.remove("dark-mode", "normal-mode");
  document.body.classList.add(themeMode);

  if (themeMode === "dark-mode") {
    DOM.modeBtn.checked = true;
    DOM.themeText.textContent = "Light Mode =>";
  } else {
    DOM.modeBtn.checked = false;
    DOM.themeText.textContent = "Dark Mode =>";
  }
}

function setupThemeToggle(DOM: AppDOM): void {
  DOM.modeBtn.addEventListener("click", () => {
    const isDark = DOM.modeBtn.checked;

    document.body.classList.toggle("dark-mode", isDark);
    document.body.classList.toggle("normal-mode", !isDark);
    DOM.themeText.textContent = isDark ? "Light Mode =>" : "Dark Mode =>";

    localStorage.setItem("themeMode", isDark ? "dark-mode" : "normal-mode");
  });
}

export function initTheme(DOM: AppDOM): void {
  applySavedTheme(DOM);
  setupThemeToggle(DOM);
}
