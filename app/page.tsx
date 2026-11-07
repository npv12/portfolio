import JsonLd from "./components/JsonLd";
import Navbar from "./components/Navbar";
import {
  COMPANY,
  GITHUB,
  LINKEDIN,
  NAME,
  POSITION,
  SITE_URL,
  TWITTER,
} from "./data/basic";
import Experience from "./parts/experience";
import GetInTouch from "./parts/getInTouch";
import Introduction from "./parts/intro";
import Projects from "./parts/projects";
import SkillTree from "./parts/skills";
import Writing from "./parts/writing";

const personSchema = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  url: SITE_URL,
  mainEntity: {
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: NAME,
    url: SITE_URL,
    jobTitle: POSITION,
    worksFor: { "@type": "Organization", name: COMPANY },
    knowsAbout: [
      "Backend engineering",
      "Python",
      "Go",
      "PostgreSQL",
      "Kubernetes",
      "Distributed systems",
      "AI agent runtimes",
    ],
    sameAs: [GITHUB, LINKEDIN, TWITTER],
  },
};

export default function Home() {
  return (
    <>
      <JsonLd data={personSchema} />
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
