"use client";

import { useRouter } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";
import {
  PiBrainDuotone,
  PiCodeBlockDuotone,
  PiEnvelopeDuotone,
  PiHouseDuotone,
  PiLightbulbDuotone,
  PiPaletteDuotone,
  PiQuotesDuotone,
  PiTextOutdentDuotone,
} from "react-icons/pi";

import { NAME } from "../../data/basic";
import { themes } from "../../data/themes";
import { setTheme as setGlobalTheme } from "../../utils/cookie";

const navItems = [
  { name: "Home", section: "intro", icon: <PiHouseDuotone size={18} /> },
  { name: "Skills", section: "skills", icon: <PiBrainDuotone size={18} /> },
  {
    name: "Projects",
    section: "projects",
    icon: <PiCodeBlockDuotone size={18} />,
  },
  {
    name: "Experience",
    section: "experience",
    icon: <PiLightbulbDuotone size={18} />,
  },
  {
    name: "Contact",
    section: "contact",
    icon: <PiEnvelopeDuotone size={18} />,
  },
  { name: "Blogs", section: "blogs", icon: <PiQuotesDuotone size={18} /> },
];

const subscribeTheme = (onChange: () => void) => {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
};

const readTheme = () =>
  document.documentElement.getAttribute("data-theme") || "light";

const Navbar = () => {
  const router = useRouter();
  const theme = useSyncExternalStore(subscribeTheme, readTheme, () => "light");

  const scrollToSection = (section: string) => {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      const drawer = document.getElementById(
        "navbar-drawer"
      ) as HTMLInputElement;
      if (drawer && drawer.checked) {
        drawer.click();
      }
    }
  };

  const handleNavbarNavigation = (section: string) => {
    if (section === "blogs") {
      router.push("/blogs");
    } else if (window.location.pathname !== "/") {
      router.push(`/#${section}`);
    } else {
      scrollToSection(section);
    }
  };

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash && window.location.pathname === "/") {
      scrollToSection(hash);
    }
  }, []);

  return (
    <div className="drawer sticky top-0 z-50">
      <input id="navbar-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        <div className="navbar bg-base-300/80 backdrop-blur-md w-full">
          <div className="flex-none lg:hidden">
            <label
              htmlFor="navbar-drawer"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost"
            >
              <PiTextOutdentDuotone
                className="inline-block w-5 h-5"
                size={18}
              />
            </label>
          </div>
          <div className="mx-2 flex-1 px-2 text-xl font-bold">
            {NAME.split(" ")[0]}
          </div>

          <div className="hidden flex-none lg:block">
            <ul className="menu menu-horizontal">
              {navItems.map((item) => (
                <li key={item.name}>
                  <a
                    onClick={() => handleNavbarNavigation(item.section)}
                    className="font-bold normal-case flex items-center cursor-pointer"
                  >
                    {item.icon}
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost rounded-btn"
            >
              <PiPaletteDuotone size={18} />
              {theme.charAt(0).toUpperCase() + theme.slice(1)}
            </div>
            <ul
              tabIndex={0}
              className="menu dropdown-content bg-base-200 rounded-box mt-4 w-44 p-2 shadow-sm z-50"
            >
              {themes.map((t) => (
                <li key={t}>
                  <a onClick={() => setGlobalTheme(t)}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="drawer-side">
        <label
          htmlFor="navbar-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        />
        <ul className="menu bg-base-200 min-h-full w-80 p-4">
          {navItems.map((item) => (
            <li key={item.name}>
              <a
                onClick={() => handleNavbarNavigation(item.section)}
                className="btn btn-ghost normal-case flex items-center justify-start"
              >
                {item.icon}
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
