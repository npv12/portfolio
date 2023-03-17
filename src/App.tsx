import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import "./App.scss";
import HomePage from "./components/Homepage";
import Navbar from "./components/navbar/Navbar";

function App() {
  return (
    <>
      <Router>
        <header className="navbar">
          <Navbar />
        </header>
        <div className="container">
          <Routes>
            <Route path="/" element={<HomePage />}/>
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
