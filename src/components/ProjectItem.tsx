import Link from "next/link";
import {
  PiArrowUpRightBold,
  PiGithubLogoBold,
  PiNotebookBold,
} from "react-icons/pi";

import { Project } from "@/types/projects";

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

type ProjectItemProps = {
  project: Project;
  /** 1-based position, shown as the row number. */
  index: number;
  /** Shared by every item so only one is open at a time. */
  group: string;
  defaultOpen?: boolean;
};

/**
 * One project in the projects accordion. Collapsed, it shows the title,
 * focus, and stack; open, it shows the full write-up. Exclusivity comes
 * from the native `<details name>` group, so no client JavaScript is needed.
 */
export default function ProjectItem({
  project,
  index,
  group,
  defaultOpen = false,
}: ProjectItemProps) {
  return (
    <details className="project" name={group} open={defaultOpen} data-glow>
      <summary>
        <span className="project__num mono">
          {String(index).padStart(2, "0")}
        </span>
        <span className="project__head">
          <span className="project__cat mono">{project.category}</span>
          <span className="project__title">{project.title}</span>
        </span>
        <span className="project__summary">
          <span className="project__focus">{project.focus}</span>
          <span className="project__stack mono">
            {project.tags.join(" · ")}
          </span>
        </span>
        <span className="project__toggle" aria-hidden="true" />
      </summary>
      <div className="project__body">
        <div>
          <p className="project__description">{project.description}</p>
          <ProjectLinks project={project} />
        </div>
        <div>
          <p className="project__label mono">What&apos;s inside</p>
          <ul className="ticks">
            {project.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
          <Tags tags={project.tags} />
        </div>
      </div>
    </details>
  );
}
