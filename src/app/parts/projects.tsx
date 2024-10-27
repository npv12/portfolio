"use client";

import useGradientArtifacts from "@/app/components/GradientCreator/gradient";
import Title from "@/app/components/Title";
import projects from "@/app/data/projects";
import { Project } from "@/app/types/projects";
import { useEffect, useState } from "react";

import ProjectCard from "../components/ProjectCard/ProjectCard";

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
  }, [currentPage]);

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
