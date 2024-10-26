import useGradientArtifacts from "@/app/components/GradientCreator/gradient";
import Title from "@/app/components/Title";
import projects from "@/app/data/projects";
import { Project } from "@/app/types/projects";
import { useEffect, useState } from "react";
import {
  PiGithubLogoDuotone,
  PiLinkDuotone,
  PiMediumLogoDuotone,
} from "react-icons/pi";

const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <div className="card bg-neutral shadow-md text-neutral-content h-[400px] z-[-1]">
      <div className="card-body">
        <h2 className="card-title text-xl md:text-2xl lg:text-3xl">{project.title}</h2>
        <p className="text-sm mt-4 text-pretty text-justify">
          {project.description.split(" ").slice(0, 75).join(" ")}
          {project.description.split(" ").length > 75 && "..."}
        </p>
        <div className="flex flex-wrap gap-2 mt-6">
          {project.githubLink && (
            <div
              className="btn"
              onClick={() => window.open(project.githubLink, "_blank")}
            >
              <PiGithubLogoDuotone size={24} />
            </div>
          )}
          {project.liveLink && (
            <div
              className="btn"
              onClick={() => window.open(project.liveLink, "_blank")}
            >
              <PiLinkDuotone size={24} />
            </div>
          )}
          {project.blogLink && (
            <div
              className="btn"
              onClick={() => window.open(project.blogLink, "_blank")}
            >
              <PiMediumLogoDuotone size={24} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Projects = () => {
  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const gradients = useGradientArtifacts({
    maxGradients: 10,
    heightMultiplier: 4,
  });

  const projectsPerPage = 6;
  const totalPages = Math.ceil(projects.length / projectsPerPage);

  useEffect(() => {
    const start = currentPage * projectsPerPage;
    setProjectsList(projects.slice(start, start + projectsPerPage));
  }, [projects, currentPage]);

  return (
    <div id="projects" className="my-8">
      <Title title="Projects" />
      {gradients}
      <div className="container mx-auto mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {projectsList.map((project) => (
            <div key={project.title}>
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
        {totalPages > 1 && (
          <div className="flex justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i)}
                className={`btn btn-circle ${
                  currentPage === i ? "btn-primary" : "btn-outline"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;