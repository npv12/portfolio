import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import "../../App.scss";
import Home from "../../views/home/Home";
import FadeIn from "../FadeIn/FadeIn";
import Card from "./Card";

// import Card from "./Card/Card";
function CardsCollection() {
  return (
    <>
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

export default CardsCollection;
