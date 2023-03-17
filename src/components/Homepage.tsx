import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import "../App.scss";
import About from "../views/about/About";
import Contact from "../views/contact/Contact";
import Home from "../views/home/Home";
import Skills from "../views/skills/Skills";
import Work from "../views/work/Work";
import Card from "./Card/Card";
import Copyright from "./Copyright";
// import Card from "./Card/Card";
function HomePage() {
  return (
    <>
        <Home />
        <About />
        {/* <Skills /> */}
        {/* <Work /> */}
        {/* <Contact /> */}
        {/* <Copyright /> */}
        <Card/>
        
    </>
  );
}

export default HomePage;
