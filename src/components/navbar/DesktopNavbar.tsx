import { HiOutlineMoon } from "react-icons/hi";

import { handleClickScroll } from "../../helper/util";
import NavLink from "./NavLink";
import "./navbar.scss";
import { Link } from "react-router-dom";

export default function DesktopNavbar() {
  return (
    <div className="navbar">
      <p
        className="name-tag"
        onClick={() => {
          handleClickScroll("home");
        }}
      >
        Nedungadi Pranav V
      </p>
      <div className="menu">
        <NavLink navlink="home" classname="item">
          Home
        </NavLink>
        <NavLink navlink="about" classname="item">
          About
        </NavLink>
        <NavLink navlink="skills" classname="item">
          Skills
        </NavLink>
        <NavLink navlink="work" classname="item">
          Work
        </NavLink>
        <NavLink navlink="contact" classname="item">
          Contact
        </NavLink>
      </div>
      <div className="icon">
        <HiOutlineMoon size={30} />
      </div>
    </div>
  );
}
