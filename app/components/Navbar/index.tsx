"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { PiListBold, PiMoonBold, PiSunBold, PiXBold } from "react-icons/pi";

import { NAME } from "../../data/basic";
import { setTheme } from "../../utils/cookie";

const navItems = [
  { name: "Work", href: "/#work", section: "work" },
  { name: "Projects", href: "/#projects", section: "projects" },
  { name: "Writing", href: "/blogs", section: null },
  { name: "Contact", href: "/#contact", section: "contact" },
];

const [first, ...rest] = NAME.split(" ");
const last = rest.join(" ");
const initials = NAME.split(" ")
  .map((part) => part[0])
  .join("");

const resolvedTheme = () => {
  const explicit = document.documentElement.getAttribute("data-theme");
  if (explicit === "light" || explicit === "dark") return explicit;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const isCurrent = (item: (typeof navItems)[number]) => {
    if (item.section === null) return pathname.startsWith("/blogs");
    return pathname === "/" && active === item.section;
  };

  const close = useCallback((returnFocus = false) => {
    setOpen(false);
    if (returnFocus) menuButtonRef.current?.focus();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight the section currently in view on the home page.
  useEffect(() => {
    if (pathname !== "/") return;
    const sections = navItems
      .map((item) => item.section && document.getElementById(item.section))
      .filter((el): el is HTMLElement => Boolean(el));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close(true);
    };
    const onResize = () => {
      if (window.innerWidth >= 768) close();
    };
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open, close]);

  const toggleTheme = () =>
    setTheme(resolvedTheme() === "dark" ? "light" : "dark");

  return (
    <header
      className="site-header"
      data-scrolled={scrolled}
      data-open={open}
    >
      <div className="shell">
        <div className="site-header__bar">
          <Link href="/" className="brand" onClick={() => close()}>
            <span className="brand__mark" aria-hidden="true">
              {initials}
            </span>
            <span className="brand__name">
              {first} <span className="brand__last">{last}</span>
            </span>
          </Link>

          <nav className="nav-links" aria-label="Primary">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="nav-link"
                aria-current={
                  isCurrent(item)
                    ? item.section === null
                      ? "page"
                      : "true"
                    : undefined
                }
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            className="icon-button"
            onClick={toggleTheme}
            aria-label="Toggle color theme"
            title="Toggle color theme"
          >
            <PiMoonBold className="theme-icon--moon" aria-hidden="true" />
            <PiSunBold className="theme-icon--sun" aria-hidden="true" />
          </button>
          <button
            ref={menuButtonRef}
            type="button"
            className="icon-button menu-button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? (
              <PiXBold aria-hidden="true" />
            ) : (
              <PiListBold aria-hidden="true" />
            )}
          </button>
        </div>

        <div
          id="mobile-menu"
          className="mobile-menu"
          data-open={open}
          inert={!open}
        >
          <div>
            <nav aria-label="Mobile">
              <ul>
                {navItems.map((item, index) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={() => close()}
                      aria-current={
                        item.section === null && isCurrent(item)
                          ? "page"
                          : undefined
                      }
                    >
                      <span className="mono">0{index + 1}</span>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
