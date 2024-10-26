import { FC } from "react";

import useGradientArtifacts from "../components/GradientCreator/gradient";
import Title from "../components/Title";
import Experiences from "../data/experience";

const Experience: FC = () => {
  const gradients = useGradientArtifacts({
    maxGradients: 10,
    heightMultiplier: 3,
  });
  return (
    <div className="px-4 py-16" id="experience">
      <Title title="Experience" />
      {gradients}
      <ul className="timeline timeline-vertical mt-12">
        {Experiences.map((exp, index) => (
          <li key={index}>
            <hr />
            <div
              className={`timeline-${
                index % 2 === 0 ? "start" : "end"
              } timeline-box`}
            >
              <div className="p-4">
                <h2 className="text-xl font-bold">{exp.company}</h2>
                <div className="badge badge-ghost my-2 badge-md p-3">{exp.position}</div>
                <p className="text-sm text-gray-500">
                  {exp.startDate} - {exp.endDate}
                </p>
                <p className="mt-2 text-gray-700">{exp.description}</p>
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
    </div>
  );
};

export default Experience;
