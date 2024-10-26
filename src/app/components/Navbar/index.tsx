import { NAME } from "@/app/data/basic";
import { themes } from "@/app/data/themes";
import { getTheme, setTheme as setGlobalTheme } from "@/app/utils/cookie";
import React, { useEffect, useState } from "react";
import {
  PiBrainDuotone,
  PiCodeBlockDuotone,
  PiHouseDuotone,
  PiPaletteDuotone,
  PiQuotesDuotone,
  PiTextOutdentDuotone,
} from "react-icons/pi";

const Navbar = () => {
  const [isClient, setIsClient] = useState(false);

  const [theme, setTheme] = useState(getTheme(isClient));

  const navItems = [
    { name: "Home", section: "intro", icon: <PiHouseDuotone size={18} /> },
    { name: "Skills", section: "skills", icon: <PiBrainDuotone size={18} /> },
    {
      name: "Projects",
      section: "projects",
      icon: <PiCodeBlockDuotone size={18} />,
    },
    { name: "Blogs", section: "blogs", icon: <PiQuotesDuotone size={18} /> },
  ];

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

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    setTheme(getTheme(isClient));
    if (!isClient) return;
    setGlobalTheme(getTheme(isClient));
  }, [isClient]);

  return (
    <div className="drawer sticky top-0">
      <input id="navbar-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <div className="navbar bg-base-300 w-full">
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
                    key={item.name}
                    onClick={() => scrollToSection(item.section)}
                    className="font-bold normal-case flex items-center"
                  >
                    {item.icon}
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Theme Toggle */}
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost rounded-btn"
            >
              <PiPaletteDuotone size={18} />
              {theme
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
            </div>
            <ul
              tabIndex={0}
              className="menu dropdown-content bg-base-200 rounded-box mt-4 w-96 overflow-y-auto p-2 shadow z-50"
              style={{ maxHeight: "calc(100vh - 10rem)" }}
            >
              {themes.map((t) => (
                <li key={t}>
                  <a
                    onClick={() => {
                      setTheme(t);
                      setGlobalTheme(t);
                    }}
                  >
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
        ></label>
        <ul className="menu bg-base-200 min-h-full w-80 p-4">
          {navItems.map((item) => (
            <li key={item.name}>
              <a
                key={item.name}
                onClick={() => scrollToSection(item.section)}
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
