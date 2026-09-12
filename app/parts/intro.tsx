"use client";

import {
  PiDownloadDuotone,
  PiEnvelopeOpenDuotone,
  PiGithubLogoDuotone,
  PiLinkedinLogoDuotone,
  PiTwitterLogoDuotone,
} from "react-icons/pi";

import GlowingCircles from "../components/GlowingCircles/circles";
import { COMPANY, EMAIL, GITHUB, LINKEDIN, NAME, POSITION, TWITTER } from "../data/basic";

const socials = [
  { href: GITHUB, label: "GitHub", icon: PiGithubLogoDuotone },
  { href: LINKEDIN, label: "LinkedIn", icon: PiLinkedinLogoDuotone },
  { href: `mailto:${EMAIL}`, label: "Email", icon: PiEnvelopeOpenDuotone },
  { href: TWITTER, label: "Twitter", icon: PiTwitterLogoDuotone },
];

export default function Introduction() {
  return (
    <div id="intro" className="min-h-[calc(100vh-4rem)] flex flex-col justify-center py-16">
      <div className="hidden lg:block">
        <GlowingCircles maxRadius={712} position={30} />
      </div>
      <div className="mb-4">
        <p className="lg:text-2xl text-lg font-medium text-base-content/70">
          Hello, I&apos;m
        </p>
        <h2 className="lg:text-8xl md:text-6xl text-4xl font-extrabold bg-clip-text text-transparent bg-linear-to-r from-primary to-secondary">
          {NAME}
        </h2>
      </div>
      <p className="mt-4 lg:text-2xl text-xl text-base-content/80">
        {POSITION} at {COMPANY}
      </p>
      <div className="flex space-x-4 mt-6">
        {socials.map(({ href, label, icon: Icon }) => (
          <a
            key={label}
            href={href}
            className="text-2xl hover:text-primary transition-colors"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
          >
            <Icon />
          </a>
        ))}
      </div>
      <a
        href="/resume.pdf"
        download
        className="btn btn-secondary text-secondary-content w-48 mt-6"
      >
        <PiDownloadDuotone size={24} />
        View Resume
      </a>
    </div>
  );
}
