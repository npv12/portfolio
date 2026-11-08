import JsonLd from "@/components/JsonLd";
import Navbar from "@/components/Navbar";
import {
  COMPANY,
  GITHUB,
  LINKEDIN,
  NAME,
  POSITION,
  SITE_URL,
  TWITTER,
} from "@/data/basic";
import Contact from "@/sections/Contact";
import Experience from "@/sections/Experience";
import Intro from "@/sections/Intro";
import Projects from "@/sections/Projects";
import Skills from "@/sections/Skills";
import Writing from "@/sections/Writing";

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
        <Intro />
        <Experience />
        <Projects />
        <Writing />
        <Skills />
      </main>
      <Contact index="05" />
    </>
  );
}
