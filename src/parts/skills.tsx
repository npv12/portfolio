import useGradientArtifacts from "@/components/GradientCreator/gradient";
import TagSphere from "@/components/TagSphere/TagSphere";
import Title from "@/components/Title";
import { COMPANY, NAME } from "@/data/basic";
import { allSkills } from "@/data/skills";

const SkillTree = () => {
  const gradients = useGradientArtifacts({
    heightMultiplier: 2,
    maxGradients: 5,
  });
  
  return (
    <div id="skills">
      {gradients}
      <div className="flex justify-between">
        <div className="w-1/2 px-40">
          <TagSphere skills={allSkills} />
        </div>
        <div className="w-1/2 pl-40">
          <Title title="About Me" />
          <div className="space-y-4 text-lg text-justify">
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
      </div>
    </div>
  );
};

export default SkillTree;
