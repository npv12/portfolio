"use client";

import Navbar from "@/app/components/Navbar";
import GetInTouch from "@/app/parts/getInTouch";
import Introduction from "@/app/parts/intro";
import Projects from "@/app/parts/projects";
import SkillTree from "@/app/parts/skills";

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
