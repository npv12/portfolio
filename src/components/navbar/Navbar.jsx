/* eslint-disable no-undef */
import { useState } from "react";
import {
  RiBarChartHorizontalLine,
  RiCloseLine,
  RiFacebookFill,
  RiGithubFill,
  RiLinkedinBoxFill,
  RiMailAddFill,
  RiTwitterFill,
} from "react-icons/ri";
import { Link } from "react-scroll";

import logo from "../../assets/logo1.png";
import "./navbar.css";

const Navbar = () => {
  const [nav, setNav] = useState(false);
  const handleNavClick = () => setNav(!nav);
  return (
    <div>
      <div className="flex h-[80px] bg-[#0a192f] justify-between px-4 items-center text-white">
        <div className="logo">
          <img src={logo} className="w-[50px]" alt="logo" />
        </div>
        {/* menu */}
        <ul className="hidden md:flex">
          <li>
            <Link to="home" smooth={true} duration={500}>
              Home
            </Link>
          </li>
          <li>
            <Link to="about" smooth={true} duration={500}>
              About
            </Link>
          </li>
          <li>
            <Link to="skills" smooth={true} duration={500}>
              Skills
            </Link>
          </li>
          <li>
            <Link to="work" smooth={true} duration={500}>
              Work
            </Link>
          </li>
          <li>
            <Link to="contact" smooth={true}>
              Contact Me
            </Link>
          </li>
        </ul>
        {/* Hamburger */}
        <div
          onClick={handleNavClick}
          className="md:hidden z-10 cursor-pointer text-2xl fixed top-5 right-5"
        >
          {!nav ? <RiBarChartHorizontalLine /> : <RiCloseLine />}
        </div>
        {/* mobile menu */}
        <ul
          className={`bg-[#0a192fe7] ${
            !nav
              ? "hidden"
              : "fixed text-white flex items-center flex-col justify-center md:hidden inset-0"
          }`}
        >
          <li className="py-4 text-3xl">
            <Link
              onClick={handleNavClick}
              to="home"
              smooth={true}
              duration={500}
            >
              Home
            </Link>
          </li>
          <li className="py-4 text-3xl">
            <Link
              onClick={handleNavClick}
              to="about"
              smooth={true}
              duration={500}
            >
              About
            </Link>
          </li>
          <li className="py-4 text-3xl">
            <Link
              onClick={handleNavClick}
              to="skills"
              smooth={true}
              duration={500}
            >
              Skills
            </Link>
          </li>
          <li className="py-4 text-3xl">
            <Link
              onClick={handleNavClick}
              to="work"
              smooth={true}
              duration={500}
            >
              Work
            </Link>
          </li>
          <li className="py-4 text-3xl">
            <Link
              onClick={handleNavClick}
              to="contact"
              smooth={true}
              duration={500}
            >
              Contact Me
            </Link>
          </li>
        </ul>
        {/* mobile menu end */}
        {/* social icons */}
        <div className="fixed top-[35%] left-0 hidden xl:block">
          <ul className="">
            <li className="w-[160px] h-10 flex justify-between items-center bg-blue-600 text-xl ml-[-105px] hover:ml-[0] duration-300">
              <a href="/">Facebook</a>
              <RiFacebookFill className="text-3xl" />
            </li>
            <li className="w-[160px] h-10 flex justify-between items-center bg-[#3A1078] text-xl ml-[-105px] hover:ml-[0] duration-300">
              <a href="/">Linkedin</a>
              <RiLinkedinBoxFill className="text-3xl" />
            </li>
            <li className="w-[160px] h-10 flex justify-between items-center bg-[#C147E9] text-xl ml-[-105px] hover:ml-[0] duration-300">
              <a href="/">Twitter</a>
              <RiTwitterFill className="text-3xl" />
            </li>
            <li className="w-[160px] h-10 flex justify-between items-center bg-[#D36B00] text-xl ml-[-105px] hover:ml-[0] duration-300">
              <a href="/">Email</a>
              <RiMailAddFill className="text-3xl" />
            </li>
            <li className="w-[160px] h-10 flex justify-between items-center bg-[#182747] text-xl ml-[-105px] hover:ml-[0] duration-300">
              <a href="/">Github</a>
              <RiGithubFill className="text-3xl" />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
