import useGradientArtifacts from "@/components/GradientCreator/gradient";
import TagSphere from "@/components/TagSphere/TagSphere";
import Title from "@/components/Title";
import { COMPANY, NAME } from "@/data/basic";
import { allSkills } from "@/data/skills";

const SkillTree = () => {
  const gradients = useGradientArtifacts({
    heightMultiplier: 2,
    maxGradients: 3,
  });

  return (
    <div id="skills">
      {gradients}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:space-x-40">
        <div className="w-full lg:w-2/3 lg:space-y-8 lg:text-lg lg:text-justify">
          <Title title="About Me" />
          <div className="space-y-4 text-sm md:text-base lg:text-lg">
            <p>Hi, I'm {NAME} (a.k.a. npv12)!</p>
            <p>I am a fullstack developer at {COMPANY}</p>
            <p>
              My passion lies in full-stack development, where I excel at
              creating seamless web experiences. I am also a dedicated advocate
              of open-source development, enjoying the process of building
              high-quality web applications that positively impact users' lives.
            </p>
            <p>
              I spend my free time learning new technologies and continuously
              challenging myself to enhance my skills and stay current with the
              latest industry trends.
            </p>
          </div>
        </div>
        <div className="w-full lg:w-1/3">
          <TagSphere skills={allSkills} />
        </div>
      </div>
    </div>
  );
};

export default SkillTree;
