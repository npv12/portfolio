import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import "../App.scss";
import About from "../views/about/About";
import Contact from "../views/contact/Contact";
import Home from "../views/home/Home";
import Skills from "../views/skills/Skills";
import Work from "../views/work/Work";
import Copyright from "./Copyright";

function HomePage() {
  return (
    <>
        <Home />
        <About />
        <Skills />
        <Work />
        <Contact />
        <Copyright />
    </>
  );
}

export default HomePage;
