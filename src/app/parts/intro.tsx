"use client";

import GlowingCircles from "@/app/components/GlowingCircles/circles";
import useGradientArtifacts from "@/app/components/GradientCreator/gradient";
import {
  COMPANY,
  EMAIL,
  GITHUB,
  LINKEDIN,
  NAME,
  TWITTER,
} from "@/app/data/basic";
import Head from "next/head";
import {
  PiDownloadDuotone,
  PiEnvelopeOpenDuotone,
  PiGithubLogoDuotone,
  PiLinkedinLogoDuotone,
  PiTwitterLogoDuotone,
} from "react-icons/pi";

export default function Introduction() {
  const gradients = useGradientArtifacts();
  return (
    <div id="intro" className="min-h-screen flex flex-col justify-center">
      {gradients}
      <div className="hidden lg:block">
        <GlowingCircles maxRadius={712} position={30} />
      </div>
      <Head>
        <title>Personal Introduction</title>
      </Head>
      <div className="mb-4">
        <h1 className="lg:text-6xl text-xl font-bold">Hello! I&lsquo;m</h1>
        <h2 className=" lg:text-8xl md:text-6xl text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
          {NAME}
        </h2>
      </div>
      <p className="mt-4 lg:text-2xl text-xl">
        I am a Full Stack Developer working at {COMPANY}
      </p>
      <div className="flex space-x-4 mt-6">
        <a
          href={GITHUB}
          className="text-2xl"
          target="_blank"
          rel="noopener noreferrer"
        >
          <PiGithubLogoDuotone />
        </a>
        <a
          href={LINKEDIN}
          className="text-2xl"
          target="_blank"
          rel="noopener noreferrer"
        >
          <PiLinkedinLogoDuotone />
        </a>
        <a
          href={`mailto:${EMAIL}`}
          className="text-2xl"
          target="_blank"
          rel="noopener noreferrer"
        >
          <PiEnvelopeOpenDuotone />
        </a>
        <a
          href={TWITTER}
          className="text-2xl"
          target="_blank"
          rel="noopener noreferrer"
        >
          <PiTwitterLogoDuotone />
        </a>
      </div>
      <button className="btn btn-secondary text-secondary-content w-48 mt-6">
        <PiDownloadDuotone size={24} className="mr-2" />
        <p>View Resume</p>
      </button>
    </div>
  );
}
