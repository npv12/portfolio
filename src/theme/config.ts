/**
 * Theme settings shared by server and client code. Kept free of
 * "use client" so the root layout can import them.
 */

export type Scheme = "light" | "dark";

/** Cookie that stores the visitor's explicit choice. */
export const SCHEME_COOKIE = "theme";
/** Attribute on `<html>` that the stylesheet keys explicit choices off. */
export const SCHEME_ATTRIBUTE = "data-theme";

export const isScheme = (value: unknown): value is Scheme =>
  value === "light" || value === "dark";

/**
 * Inline script for `<head>`: applies a saved choice before first paint so
 * there is no flash of the wrong theme. Anything other than a valid scheme
 * (including legacy daisyUI theme names) falls back to the OS preference.
 */
export const schemeInitScript = `(function(){var m=document.cookie.match(/(?:^|; )${SCHEME_COOKIE}=([^;]*)/);var t=m&&m[1];if(t==="light"||t==="dark")document.documentElement.setAttribute("${SCHEME_ATTRIBUTE}",t);})();`;
