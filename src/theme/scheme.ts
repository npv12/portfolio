"use client";

import { useEffect, useState } from "react";

import {
  SCHEME_ATTRIBUTE,
  SCHEME_COOKIE,
  type Scheme,
  isScheme,
} from "./config";

/*
 * The visitor's explicit choice lives in a cookie and is mirrored onto
 * `<html data-theme>`. With no choice the site follows the OS preference.
 */

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;
const DARK_QUERY = "(prefers-color-scheme: dark)";

/** The scheme currently in effect: explicit choice first, then the OS. */
export function getScheme(): Scheme {
  const explicit = document.documentElement.getAttribute(SCHEME_ATTRIBUTE);
  if (isScheme(explicit)) return explicit;
  return window.matchMedia(DARK_QUERY).matches ? "dark" : "light";
}

/** Applies a scheme and remembers it for future visits. */
export function setScheme(scheme: Scheme) {
  document.documentElement.setAttribute(SCHEME_ATTRIBUTE, scheme);
  document.cookie = `${SCHEME_COOKIE}=${scheme}; path=/; max-age=${ONE_YEAR_SECONDS}; samesite=lax`;
}

export function toggleScheme() {
  setScheme(getScheme() === "dark" ? "light" : "dark");
}

/**
 * The resolved scheme, updated when the visitor toggles it or the OS
 * preference changes. `null` until mounted, since the server cannot know it.
 */
export function useScheme(): Scheme | null {
  const [scheme, setState] = useState<Scheme | null>(null);

  useEffect(() => {
    const update = () => setState(getScheme());
    update();

    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: [SCHEME_ATTRIBUTE],
    });
    const media = window.matchMedia(DARK_QUERY);
    media.addEventListener("change", update);

    return () => {
      observer.disconnect();
      media.removeEventListener("change", update);
    };
  }, []);

  return scheme;
}
