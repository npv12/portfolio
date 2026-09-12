const setCookie = (name: string, value: string) => {
  if (!name || !value) return;
  document.cookie = `${name}=${value}; path=/; max-age=${60 * 60 * 24 * 7}`;
};

export const setTheme = (theme: string) => {
  document.documentElement.setAttribute("data-theme", theme);
  setCookie("theme", theme);
};
