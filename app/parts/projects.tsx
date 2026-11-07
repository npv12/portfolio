import SectionHead from "../components/SectionHead";
import ProjectRow, { FeaturedProject } from "../components/ProjectCard/ProjectCard";
import projects from "../data/projects";

export default function Projects() {
  const [featured, ...rest] = projects;

  return (
    <section
      id="projects"
      className="section"
      aria-labelledby="projects-heading"
    >
      <div className="shell">
        <SectionHead
          index="02"
          label="Projects"
          id="projects-heading"
          title="APIs, platforms, and the plumbing."
        >
          Personal builds and systems I worked on at Simbian, Dream11, and Blaze
          AI. Professional projects are described without private source code.
        </SectionHead>
        <FeaturedProject project={featured} />
        <div className="project-list">
          {rest.map((project, index) => (
            <ProjectRow
              key={project.title}
              project={project}
              index={index + 2}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
