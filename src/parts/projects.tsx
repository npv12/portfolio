import useGradientArtifacts from "@/components/GradientCreator/gradient";
import Title from "@/components/Title";
import projects from "@/data/projects";
import { Project } from "@/types/projects";
import { useEffect, useState } from "react";
import {
  PiCaretCircleLeft,
  PiCaretCircleRight,
  PiGithubLogoDuotone,
  PiLinkDuotone,
  PiMediumLogoDuotone,
} from "react-icons/pi";

const ProjectCard = ({ project }: { project: Project }) => {
  const [width, setWidth] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // 0.8 accounts for the side buttons and the margins
    setWidth(window.innerWidth * 0.8);
    setIsMobile(window.innerWidth < 1024);
  }, []);

  return (
    <div
      className="card lg:card-side rounded-box bg-neutral shadow-md mx-4 mb-8 text-neutral-content"
      style={{ zIndex: -1 }}
    >
      <figure>
        <img
          src={`/projects-images/${project.image}`}
          alt="car!"
          style={{ width: isMobile ? width * 0.6 : width * 0.55 }}
        />
      </figure>
      <div
        className="card-body"
        style={{ width: isMobile ? width * 0.6 : width * 0.4 }}
      >
        <h2 className="card-title">{project.title}</h2>
        <p className="text-sm">
          {project.description.split(" ").slice(0, 50).join(" ")}
          ...
        </p>
        <div className="flex flex-wrap gap-2 mt-2">
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const gradients = useGradientArtifacts({
    maxGradients: 10,
    heightMultiplier: 3,
  });

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 1024);
  }, []);

  useEffect(() => {
    setProjectsList(projects);
  }, []);

  useEffect(() => {
    const element = document.getElementById(`slide${currentIndex + 1}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentIndex]);

  const handleNext = () => {
    if (currentIndex < projectsList.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(projectsList.length - 1);
    }
  };

  return (
    <div id="projects" className="my-8">
      <Title title="Projects" />
      {gradients}
      {!isMobile ? (
        <div className="flex flex-row items-center justify-center space-x-4 mt-4">
          <div className="btn-outline btn-circle" onClick={handlePrevious}>
            <PiCaretCircleLeft size={48} />
          </div>
          <div className="carousel carousel-end rounded-box">
            {projectsList.map((project, index) => (
              <div
                id={`slide${index + 1}`}
                key={project.title}
                className="carousel-item"
              >
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
          <div className="btn-outline btn-circle" onClick={handleNext}>
            <PiCaretCircleRight size={48} />
          </div>
        </div>
      ) : (
        <div className="flex flex-col">
          <div className="carousel carousel-end rounded-box">
            {projectsList.map((project, index) => (
              <div
                id={`slide${index + 1}`}
                key={project.title}
                className="carousel-item"
              >
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
          <div className="flex flex-row items-center justify-center space-x-4 mt-4">
            <div className="btn-outline btn-circle" onClick={handlePrevious}>
              <PiCaretCircleLeft size={48} />
            </div>
            <div className="btn-outline btn-circle" onClick={handleNext}>
              <PiCaretCircleRight size={48} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
