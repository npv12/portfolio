import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import "./App.scss";
import HomePage from "./components/Homepage";
import Navbar from "./components/navbar/Navbar";
import CTT from "./components/Projects/CTT/CTT";
import DroneBase from "./components/Projects/DroneBase/DroneBase";
import Exo from "./components/Projects/Exo/Exo";
import Eyantra from "./components/Projects/Eyantra/Eyantra";
import Flipkart from "./components/Projects/Flipkart/Flipkart";
// import Project from "./components/Projects/Project";
import About from "./views/about/About";

function App() {
  return (
    <>
      <Router>
        <header className="navbar">
          <Navbar />
        </header>
        <div className="container">
          <Routes>
            <Route path="/" element={<HomePage />} />

            <Route path="/CardRoute" element={<Flipkart/>} />
            <Route path="/FlipkartRoute" element={<Flipkart/>} />
            <Route path="/ExoRoute" element={<Exo/>} />
            <Route path="/EyantraRoute" element={<Eyantra/>} />
            <Route path="/CTTRoute" element={<CTT/>} />
            <Route path="/DroneBaseRoute" element={<DroneBase/>} />

          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
