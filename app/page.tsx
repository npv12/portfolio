import Navbar from "./components/Navbar";
import Experience from "./parts/experience";
import GetInTouch from "./parts/getInTouch";
import Introduction from "./parts/intro";
import Projects from "./parts/projects";
import SkillTree from "./parts/skills";
import Writing from "./parts/writing";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main">
        <Introduction />
        <Experience />
        <Projects />
        <Writing />
        <SkillTree />
      </main>
      <GetInTouch index="05" />
    </>
  );
}
