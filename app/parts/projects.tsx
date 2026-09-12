"use client";

import { useState } from "react";

import ProjectCard from "../components/ProjectCard/ProjectCard";
import Title from "../components/Title";
import projects from "../data/projects";
import { Project } from "../types/projects";

const Projects = () => {
  const [currentPage, setCurrentPage] = useState(0);

  const projectsPerPage = 6;
  const totalPages = Math.ceil(projects.length / projectsPerPage);
  const start = currentPage * projectsPerPage;
  const projectsList: Project[] = projects.slice(
    start,
    start + projectsPerPage
  );

  return (
    <div id="projects" className="py-16">
      <Title title="Projects" />
      <div className="container mx-auto mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-6 mb-6">
          {projectsList.map((project) => (
            <div key={project.title} className="h-full">
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
