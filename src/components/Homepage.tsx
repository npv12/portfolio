import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import "../App.scss";
import About from "../views/about/About";
import Contact from "../views/contact/Contact";
import Home from "../views/home/Home";
import Skills from "../views/skills/Skills";
import Work from "../views/work/Work";
import Card from "./Card/Card";
import Copyright from "./Copyright";
import FadeIn from "./FadeIn/FadeIn";

// import Card from "./Card/Card";
function HomePage() {
  return (
    <>
      <FadeIn>
        <Home />
      </FadeIn>
      <FadeIn>
        <About />
      </FadeIn>
      {/* <Skills /> */}
      {/* <Work /> */}
      {/* <Contact /> */}
      {/* <Copyright /> */}
      <div className="row">
      <div className="col-sm">
          <FadeIn>
            <Card />
          </FadeIn>
        </div>
        <div className="col-sm">
          <FadeIn>
            <Card />
          </FadeIn>
        </div>
        <div className="col-sm">
          <FadeIn>
            <Card />
          </FadeIn>
        </div>
      </div>
    </>
  );
}

export default HomePage;
