import {
  PiGithubLogoDuotone,
  PiLinkDuotone,
  PiMediumLogoDuotone,
} from "react-icons/pi";

import { Project } from "../../types/projects";

const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <div className="card bg-neutral shadow-md text-neutral-content h-[450px]">
      <div className="card-body">
        <h2 className="card-title text-xl md:text-2xl lg:text-3xl">
          {project.title}
        </h2>
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

export default ProjectCard;
