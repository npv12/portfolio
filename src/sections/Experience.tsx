import SectionHead from "@/components/SectionHead";
import Experiences from "@/data/experience";

export default function Experience() {
  return (
    <section className="section" id="work" aria-labelledby="work-heading">
      <div className="shell">
        <SectionHead
          index="01"
          label="Work"
          id="work-heading"
          title="The systems behind the work."
        >
          Four teams since 2021: from founding engineer on an assessment product
          to cloud platforms and multi-tenant agent infrastructure.
        </SectionHead>
        <div className="timeline">
          {Experiences.map((exp) => {
            const current = exp.endDate === "Present";
            return (
              <article key={exp.company} className="job">
                <div className="job__meta">
                  <p className="job__period mono">
                    {exp.startDate} – {exp.endDate}
                  </p>
                  <h3 className="job__company">{exp.company}</h3>
                  <p className="job__role">{exp.position}</p>
                  {current && (
                    <span className="job__now tag tag--signal">Current</span>
                  )}
                </div>
                <div>
                  <h4 className="job__focus">{exp.focus}</h4>
                  <ul className="ticks">
                    {exp.highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                  <ul className="stack" aria-label="Technologies">
                    {exp.techStack.map((tech) => (
                      <li key={tech} className="tag">
                        {tech}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
