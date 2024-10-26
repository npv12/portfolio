"use client";

import Navbar from "@/components/Navbar";
import GetInTouch from "@/parts/getInTouch";
import Introduction from "@/parts/intro";
import Projects from "@/parts/projects";
import SkillTree from "@/parts/skills";

export default function Home() {
  return (
    <div>
      <Navbar />
      <div className="lg:px-20 px-8">
        <Introduction />
        <SkillTree />
        <Projects />
        <GetInTouch />
      </div>
    </div>
  );
}
