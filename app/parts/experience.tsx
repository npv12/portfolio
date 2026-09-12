import Title from "../components/Title";
import Experiences from "../data/experience";

const ExperienceItem = ({
  exp,
  compact,
}: {
  exp: (typeof Experiences)[number];
  compact?: boolean;
}) => (
  <div className={compact ? "p-4 max-w-xs" : "p-4 max-w-md"}>
    <h2 className="text-xl font-bold">{exp.company}</h2>
    <div className="badge badge-secondary text-secondary-content my-2 badge-md p-3">
      {exp.position}
    </div>
    <p className="text-sm text-base-content/60">
      {exp.startDate} - {exp.endDate}
    </p>
    {!compact && (
      <>
        <p className="mt-2 text-pretty text-justify">{exp.description}</p>
        <div className="flex flex-wrap gap-2 mt-3">
          {exp.techStack.map((tech) => (
            <span key={tech} className="badge badge-ghost badge-sm p-2">
              {tech}
            </span>
          ))}
        </div>
      </>
    )}
  </div>
);

const Timeline = ({ compact }: { compact?: boolean }) => (
  <ul
    className={`timeline timeline-vertical ${compact ? "timeline-compact mt-12" : ""}`}
  >
    {Experiences.map((exp, index) => (
      <li key={exp.company}>
        {index > 0 && <hr />}
        <div
          className={`timeline-${index % 2 === 0 ? "start" : "end"} timeline-box bg-neutral text-neutral-content`}
        >
          <ExperienceItem exp={exp} compact={compact} />
        </div>
        <div className="timeline-middle">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-5 w-5"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        {index < Experiences.length - 1 && <hr />}
      </li>
    ))}
  </ul>
);

const Experience = () => {
  return (
    <div className="px-4 py-16" id="experience">
      <Title title="Experience" />
      <div className="hidden md:block">
        <Timeline />
      </div>
      <div className="md:hidden">
        <Timeline compact />
      </div>
    </div>
  );
};

export default Experience;
