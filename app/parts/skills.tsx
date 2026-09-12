"use client";

import TagSphere from "../components/TagSphere/TagSphere";
import { tagSphereProps } from "../components/TagSphere/types";
import Title from "../components/Title";
import { COMPANY, NAME, POSITION } from "../data/basic";
import { allSkills } from "../data/skills";

const SkillTree = () => {
  const defaultStateTagSphere: tagSphereProps = {
    skills: allSkills,
    maxSpeed: 4,
    initialSpeed: 64,
    initialDirection: 135,
    keepRollingAfterMouseOut: false,
    useContainerInlineStyles: true,
    fullWidth: false,
    fullHeight: false,
  };

  return (
    <div id="skills" className="py-8">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:gap-16">
        <div className="w-full lg:w-2/3 space-y-4 text-sm md:text-base lg:text-lg">
          <Title title="About Me" />
          <p>Hi, I&apos;m {NAME} (npv12).</p>
          <p>
            I am a {POSITION} at {COMPANY}, mostly on backend systems: multi-tenant
            Django, SQL, and agent workflows for security operations.
          </p>
          <p>
            Before that I worked on Kubernetes platforms at Dream11 and on
            campaign/data pipelines at Blaze AI. I like keeping the query layer
            honest and the job-spec surface small.
          </p>
        </div>
        <div className="w-full lg:w-1/3">
          <TagSphere {...defaultStateTagSphere} />
        </div>
      </div>
    </div>
  );
};
export default SkillTree;
