import "./App.css";
import Copyright from "./components/Copyright";
import Navbar from "./components/navbar/Navbar.jsx";
import About from "./views/about/About";
import Home from "./views/home/Home";
import Skills from "./views/skills/Skills";
import Work from "./views/work/Work";
import Contact from "./views/contact/Contact";

function App() {
  return (
    <div className="App">
      <header className="App-header sticky top-0 shadow">
        <Navbar />
      </header>
      <Home />
      <About />
      <Skills />
      <Work />
      <Contact />
      <Copyright />
    </div>
  );
}

export default App;
