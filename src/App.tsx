import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import "./App.scss";
import HomePage from "./components/Homepage";
import Navbar from "./components/navbar/Navbar";
import Project from "./components/Projects/Project";
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

            <Route path="/CardRoute" element={<Project/>} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
