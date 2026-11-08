import ProjectItem from "@/components/ProjectItem";
import SectionHead from "@/components/SectionHead";
import projects from "@/data/projects";

export default function Projects() {
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
        <div className="project-list">
          {projects.map((project, index) => (
            <ProjectItem
              key={project.title}
              project={project}
              index={index + 1}
              group="projects"
              defaultOpen={index === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
