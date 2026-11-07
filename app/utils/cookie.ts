const setCookie = (name: string, value: string) => {
  if (!name || !value) return;
  document.cookie = `${name}=${value}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
};

export const setTheme = (theme: "light" | "dark") => {
  document.documentElement.setAttribute("data-theme", theme);
  setCookie("theme", theme);
};
