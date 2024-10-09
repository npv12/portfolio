import GlowingCircles from "@/components/GlowingCircles/circles";
import useGradientArtifacts from "@/components/GradientCreator/gradient";
import { COMPANY, NAME } from "@/data/basic";
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
      <GlowingCircles maxRadius={712} position={30} />
      <Head>
        <title>Personal Introduction</title>
      </Head>
      <div className="mb-4">
        <h1 className="text-6xl font-bold">Hello! I'm</h1>
        <h2 className="text-8xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
          {NAME}
        </h2>
      </div>
      <p className="mt-4 text-2xl">
        I am a Full Stack Developer working at {COMPANY}
      </p>
      <div className="flex space-x-4 mt-6">
        <a
          href="https://github.com/npv12"
          className="text-2xl"
          target="_blank"
          rel="noopener noreferrer"
        >
          <PiGithubLogoDuotone />
        </a>
        <a
          href="https://www.linkedin.com/in/npv12/"
          className="text-2xl"
          target="_blank"
          rel="noopener noreferrer"
        >
          <PiLinkedinLogoDuotone />
        </a>
        <a
          href="mailto:pranav10121@gmail.com"
          className="text-2xl"
          target="_blank"
          rel="noopener noreferrer"
        >
          <PiEnvelopeOpenDuotone />
        </a>
        <a
          href="https://www.x.com/PranavNedungad4/"
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
