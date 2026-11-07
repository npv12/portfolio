import Link from "next/link";
import {
  PiArrowUpRightBold,
  PiGithubLogoBold,
  PiNotebookBold,
} from "react-icons/pi";

import { Project } from "../../types/projects";

function ProjectLinks({ project }: { project: Project }) {
  if (!project.blogLink && !project.githubLink && !project.liveLink)
    return null;
  return (
    <div className="links">
      {project.blogLink && (
        <Link href={project.blogLink} className="text-link">
          <PiNotebookBold aria-hidden="true" /> Architecture notes
        </Link>
      )}
      {project.githubLink && (
        <a
          href={project.githubLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-link"
        >
          <PiGithubLogoBold aria-hidden="true" /> Source
        </a>
      )}
      {project.liveLink && (
        <a
          href={project.liveLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-link"
        >
          Live site <PiArrowUpRightBold aria-hidden="true" />
        </a>
      )}
    </div>
  );
}

function Tags({ tags }: { tags: string[] }) {
  return (
    <ul className="stack" aria-label="Technologies">
      {tags.map((tag) => (
        <li key={tag} className="tag">
          {tag}
        </li>
      ))}
    </ul>
  );
}

export function FeaturedProject({ project }: { project: Project }) {
  return (
    <article className="feature" data-glow>
      <div>
        <p className="feature__kicker mono">
          <span className="tag tag--signal">Featured</span>
          <span>{project.category}</span>
        </p>
        <h3 className="feature__title">{project.title}</h3>
        <p className="feature__focus">{project.focus}</p>
        <p className="feature__body">{project.description}</p>
        <ProjectLinks project={project} />
      </div>
      <div>
        <p className="feature__label mono">What&apos;s inside</p>
        <ul className="ticks">
          {project.highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
        <Tags tags={project.tags} />
      </div>
    </article>
  );
}

export default function ProjectRow({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  return (
    <details className="project">
      <summary>
        <span className="project__num mono">
          {String(index).padStart(2, "0")}
        </span>
        <span className="project__head">
          <span className="project__cat mono">{project.category}</span>
          <span className="project__title">{project.title}</span>
        </span>
        <span className="project__focus">{project.focus}</span>
        <span className="project__toggle" aria-hidden="true" />
      </summary>
      <div className="project__body">
        <p>{project.description}</p>
        <ul className="ticks">
          {project.highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
        <Tags tags={project.tags} />
        <ProjectLinks project={project} />
      </div>
    </details>
  );
}
