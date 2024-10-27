import { FC } from "react";

import Title from "../components/Title";
import Experiences from "../data/experience";

const DesktopExperience: FC = () => (
  <ul className="timeline timeline-vertical z-[-1]">
    {Experiences.map((exp, index) => (
      <li key={index}>
        <hr />
        <div
          className={`timeline-${
            index % 2 === 0 ? "start" : "end"
          } timeline-box bg-neutral text-neutral-content`}
        >
          <div className="p-4 w-96">
            <h2 className="text-xl font-bold">{exp.company}</h2>
            <div className="badge badge-secondary text-secondary-content my-2 badge-md p-3">
              {exp.position}
            </div>
            <p className="text-sm text-gray-500">
              {exp.startDate} - {exp.endDate}
            </p>
            <p className="mt-2 text-pretty text-justify">{exp.description}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {exp.techStack.map((tech, i) => (
                <span key={i} className="badge badge-ghost badge-sm p-2">
                  {tech}
                </span>
              ))}
            </div>
          </div>
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
        <hr />
      </li>
    ))}
  </ul>
);

const MobileExperience: FC = () => (
  <ul className="timeline timeline-compact timeline-vertical mt-12 z-[-1]">
    {Experiences.map((exp, index) => (
      <li key={index}>
        <hr />
        <div
          className={`timeline-${
            index % 2 === 0 ? "start" : "end"
          } timeline-box`}
        >
          <div className="p-4 w-[200px]">
            <h2 className="text-xl font-bold mb-2">{exp.company}</h2>
            <div className="text mb-2">{exp.position}</div>
            <p className="text-sm text-gray-500">
              {exp.startDate} - {exp.endDate}
            </p>
          </div>
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
        <hr />
      </li>
    ))}
  </ul>
);

const Experience: FC = () => {
  return (
    <div className="px-4 py-16" id="experience">
      <Title title="Experience" />
      <div className="hidden md:block lg:block">
        <DesktopExperience />
      </div>
      <div className="block md:hidden lg:hidden">
        <MobileExperience />
      </div>
    </div>
  );
};

export default Experience;
