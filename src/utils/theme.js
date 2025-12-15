const THEME_KEY = "theme";       // light | dark
const COLOR_KEY = "colorTheme"; // blue | green | purple

export const applyTheme = (mode, color) => {
  const root = document.documentElement;

  // mode
  root.classList.toggle("dark", mode === "dark");

  // color themes
  root.setAttribute("data-theme", color);

  localStorage.setItem(THEME_KEY, mode);
  localStorage.setItem(COLOR_KEY, color);
};

export const getThemeState = () => {
  return {
    mode: localStorage.getItem(THEME_KEY) || "light",
    color: localStorage.getItem(COLOR_KEY) || "blue",
  };
};

export const toggleMode = () => {
  const { mode, color } = getThemeState();
  const nextMode = mode === "dark" ? "light" : "dark";
  applyTheme(nextMode, color);
  return nextMode;
};

export const setColorTheme = (color) => {
  const { mode } = getThemeState();
  applyTheme(mode, color);
};
