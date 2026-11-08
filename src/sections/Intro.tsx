import {
  PiArrowDownBold,
  PiDownloadSimpleBold,
  PiGithubLogoBold,
  PiLinkedinLogoBold,
  PiXLogoBold,
} from "react-icons/pi";

import SkillSphere from "@/components/SkillSphere";
import { COMPANY, GITHUB, LINKEDIN, NAME, TWITTER } from "@/data/basic";
import Experiences from "@/data/experience";
import { allSkills } from "@/data/skills";

const socials = [
  { href: GITHUB, label: "GitHub", icon: PiGithubLogoBold },
  { href: LINKEDIN, label: "LinkedIn", icon: PiLinkedinLogoBold },
  { href: TWITTER, label: "X (Twitter)", icon: PiXLogoBold },
];

export default function Intro() {
  const [first, ...rest] = NAME.split(" ");
  const previous = Experiences.slice(1).map((exp) => exp.company);

  return (
    <section id="intro" className="hero shell" aria-labelledby="hero-name">
      <div>
        <p
          className="hero__eyebrow mono rise"
          style={{ "--i": 0 } as React.CSSProperties}
        >
          <span className="status-dot">Backend engineer at {COMPANY}</span>
          <span aria-hidden="true">/</span>
          <span>Python &amp; Go</span>
        </p>
        <h1
          id="hero-name"
          className="hero__name rise"
          style={{ "--i": 1 } as React.CSSProperties}
        >
          <span>{first}</span>
          <span>{rest.join(" ")}</span>
        </h1>
        <p
          className="hero__statement rise"
          style={{ "--i": 2 } as React.CSSProperties}
        >
          I build the <em>services that make the product work.</em>
        </p>
        <p
          className="hero__description rise"
          style={{ "--i": 3 } as React.CSSProperties}
        >
          APIs, PostgreSQL, cloud infrastructure, and agent runtimes. Right now
          that means multi-tenant platforms for security operations at {COMPANY}
          .
        </p>
        <div
          className="hero__actions rise"
          style={{ "--i": 4 } as React.CSSProperties}
        >
          <a href="#work" className="button button--primary">
            See the work <PiArrowDownBold aria-hidden="true" />
          </a>
          <a href="/resume.pdf" download className="button button--ghost">
            <PiDownloadSimpleBold aria-hidden="true" /> Resume (PDF)
          </a>
        </div>
        <div
          className="hero__socials rise"
          style={{ "--i": 5 } as React.CSSProperties}
        >
          {socials.map(({ href, label, icon: Icon }) => (
            <a
              key={label}
              href={href}
              className="icon-button"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              title={label}
            >
              <Icon aria-hidden="true" />
            </a>
          ))}
        </div>
        <p
          className="hero__previously mono rise"
          style={{ "--i": 6 } as React.CSSProperties}
        >
          <span>Previously</span>
          {previous.map((company) => (
            <strong key={company}>{company}</strong>
          ))}
        </p>
      </div>
      <div
        className="hero__visual rise"
        style={{ "--i": 3 } as React.CSSProperties}
      >
        <SkillSphere
          skills={allSkills.map(({ name, Icon }) => ({
            name,
            icon: <Icon aria-hidden="true" />,
          }))}
        />
      </div>
    </section>
  );
}
