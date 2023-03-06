import { Rotate as Hamburger } from "hamburger-react";
import { useState } from "react";
import { HiOutlineMoon } from "react-icons/hi";

import { handleClickScroll } from "../../helper/util";
import NavLink from "./NavLink";
import "./navbar.scss";

export default function MobileNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="topnav">
      <div className="navbar">
        <p
          className="name-tag"
          onClick={() => {
            handleClickScroll("home");
          }}
        >
          Nedungadi Pranav V
        </p>
        <div className="flex-row">
          <div className="icon m2">
            <Hamburger
              toggled={isOpen}
              toggle={() => {
                setIsOpen(!isOpen);
              }}
            />
          </div>
          <div className="icon m2">
            <HiOutlineMoon size={30} />
          </div>
        </div>
      </div>
      <div className={isOpen ? "hamburger" : "hamburger-hidden"}>
        <NavLink navlink="home">Home</NavLink>
        <NavLink navlink="about">About</NavLink>
        <NavLink navlink="skills">Skills</NavLink>
        <NavLink navlink="work">Work</NavLink>
        <NavLink navlink="contact">Contact</NavLink>
      </div>
    </div>
  );
}
