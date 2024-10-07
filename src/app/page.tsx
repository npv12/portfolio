"use client";

import Navbar from "@/components/Navbar";
import Introduction from "@/parts/intro";
import SkillTree from "@/parts/skills";

export default function Home() {
  return (
    <div>
      <Navbar />
      <div className="px-20">
      <Introduction />
      <SkillTree />
      </div>
    </div>
  );
}
