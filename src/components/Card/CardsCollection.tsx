import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import "../../App.scss";
import FadeIn from "../FadeIn/FadeIn";
import CTTcard from "../Projects/CTT/CTTcard";
import DroneBasecard from "../Projects/DroneBase/DroneBaseCard";
import ExoCard from "../Projects/Exo/ExoCard";
import EyantraCard from "../Projects/Eyantra/EyantraCard";
import FlipkartCard from "../Projects/Flipkart/Card";
import './card.scss'
// import Card from "./Card/Card";
function CardsCollection() {
  return (
    <>
      <div className="home-grid">
      <div className="home-grid-item">
          <FadeIn>
            <FlipkartCard />
          </FadeIn>
        </div>
        <div className="home-grid-item">
          <FadeIn>
            <ExoCard />
          </FadeIn>
        </div>
        <div className="home-grid-item">
          <FadeIn>
            <EyantraCard />
          </FadeIn>
        </div>
        <div className="home-grid-item">
          <FadeIn>
            <CTTcard />
          </FadeIn>
        </div>
        <div className="home-grid-item">
          <FadeIn>
            <DroneBasecard />
          </FadeIn>
        </div>
      </div>
    </>
  );
}

export default CardsCollection;
