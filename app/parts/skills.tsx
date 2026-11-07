import SectionHead from "../components/SectionHead";
import { skillGroups } from "../data/skills";

export default function SkillTree() {
  return (
    <section id="toolbox" className="section" aria-labelledby="toolbox-heading">
      <div className="shell">
        <SectionHead
          index="04"
          label="Toolbox"
          id="toolbox-heading"
          title="Backend first. Product aware."
        >
          Mostly Python and Go, from API design and SQL to background jobs,
          Kubernetes operators, and long-running agent workflows. TypeScript and
          React when the product needs them.
        </SectionHead>
        <div className="toolbox">
          {skillGroups.map((group) => (
            <div key={group.title} className="toolbox__group">
              <h3>{group.title}</h3>
              <ul>
                {group.skills.map(({ name, Icon }) => (
                  <li key={name}>
                    <Icon aria-hidden="true" />
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
