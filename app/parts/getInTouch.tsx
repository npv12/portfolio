import {
  PiArrowUpRightBold,
  PiDownloadSimpleBold,
  PiGithubLogoBold,
  PiLinkedinLogoBold,
  PiXLogoBold,
} from "react-icons/pi";

import CopyEmail from "../components/CopyEmail";
import { EMAIL, GITHUB, LINKEDIN, NAME, TWITTER } from "../data/basic";

const channels = [
  {
    href: GITHUB,
    label: "GitHub",
    handle: GITHUB.replace("https://github.com/", "@"),
    icon: PiGithubLogoBold,
    external: true,
  },
  {
    href: LINKEDIN,
    label: "LinkedIn",
    handle: "in/npv12",
    icon: PiLinkedinLogoBold,
    external: true,
  },
  {
    href: TWITTER,
    label: "X (Twitter)",
    handle: TWITTER.replace("https://twitter.com/", "@"),
    icon: PiXLogoBold,
    external: true,
  },
  {
    href: "/resume.pdf",
    label: "Resume",
    handle: "PDF",
    icon: PiDownloadSimpleBold,
    external: false,
  },
];

export default function GetInTouch({ index }: { index?: string }) {
  return (
    <section
      id="contact"
      className="contact"
      data-glow
      aria-labelledby="contact-heading"
    >
      <div className="shell">
        <p className="section__index mono">
          {index && <b>{index}</b>} Contact
        </p>
        <h2 id="contact-heading" className="contact__title">
          Have a backend worth <span>building well?</span>
        </h2>
        <p className="contact__lede">
          I&apos;m happy to talk about work, collaborations, or a gnarly
          problem in Python, Go, or PostgreSQL. Email is the fastest way to
          reach me.
        </p>
        <div className="contact__email">
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
          <CopyEmail email={EMAIL} />
        </div>
        <nav className="contact__channels" aria-label="Elsewhere">
          {channels.map(({ href, label, handle, icon: Icon, external }) => (
            <a
              key={label}
              href={href}
              {...(external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : { download: true })}
            >
              <span>
                <Icon aria-hidden="true" />
                {label}
              </span>
              <span className="mono">
                {handle}{" "}
                {external && (
                  <PiArrowUpRightBold aria-hidden="true" className="inline-icon" />
                )}
              </span>
            </a>
          ))}
        </nav>
        <footer className="site-footer mono">
          <span>
            © {new Date().getFullYear()} {NAME}
          </span>
          <span>
            Built with Next.js.{" "}
            <a
              href={`${GITHUB}/portfolio`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Source
            </a>
          </span>
        </footer>
      </div>
    </section>
  );
}
