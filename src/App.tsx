import "./App.scss";
import Copyright from "./components/Copyright";
import Navbar from "./components/navbar/Navbar";
import About from "./views/about/About";
import Contact from "./views/contact/Contact";
import Home from "./views/home/Home";
import Skills from "./views/skills/Skills";
import Work from "./views/work/Work";

function App() {
  return (
    <>
      <header className="navbar">
        <Navbar />
      </header>
      <div>
        <Home />
        <About />
        <Skills />
        <Work />
        <Contact />
        <Copyright />
      </div>
    </>
  );
}

export default App;
