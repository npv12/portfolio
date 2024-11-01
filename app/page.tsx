import Navbar from "./components/Navbar";
import Experience from "./parts/experience";
import GetInTouch from "./parts/getInTouch";
import Introduction from "./parts/intro";
import Projects from "./parts/projects";
import SkillTree from "./parts/skills";

export default function Home() {
  return (
    <div>
      <Navbar />
      <div className="lg:px-20 px-8">
        <Introduction />
        <SkillTree />
        <Experience />
        <Projects />
        <GetInTouch />
      </div>
    </div>
  );
}
