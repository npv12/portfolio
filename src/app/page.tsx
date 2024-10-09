"use client";

import Navbar from "@/components/Navbar";
import Introduction from "@/parts/intro";
import Projects from "@/parts/projects";
import SkillTree from "@/parts/skills";

export default function Home() {
  return (
    <div>
      <Navbar />
      <div className="px-20">
      <Introduction />
      <SkillTree />
      <Projects />
      </div>
    </div>
  );
}
