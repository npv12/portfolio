import { IconType } from "react-icons";
import { FaAws } from "react-icons/fa";
import {
  SiApachekafka,
  SiDjango,
  SiDocker,
  SiFastapi,
  SiGo,
  SiGooglecloud,
  SiKubernetes,
  SiLinux,
  SiMongodb,
  SiNextdotjs,
  SiNodedotjs,
  SiOpenjdk,
  SiPostgresql,
  SiPython,
  SiReact,
  SiRedis,
  SiRust,
  SiTailwindcss,
  SiTerraform,
  SiTypescript,
} from "react-icons/si";

export type Skill = {
  name: string;
  Icon: IconType;
};

export const allSkills: Skill[] = [
  { name: "Python", Icon: SiPython },
  { name: "Go", Icon: SiGo },
  { name: "TypeScript", Icon: SiTypescript },
  { name: "Java", Icon: SiOpenjdk },
  { name: "Rust", Icon: SiRust },
  { name: "React", Icon: SiReact },
  { name: "Next.js", Icon: SiNextdotjs },
  { name: "Tailwind CSS", Icon: SiTailwindcss },
  { name: "Django", Icon: SiDjango },
  { name: "FastAPI", Icon: SiFastapi },
  { name: "Node.js", Icon: SiNodedotjs },
  { name: "PostgreSQL", Icon: SiPostgresql },
  { name: "Redis", Icon: SiRedis },
  { name: "MongoDB", Icon: SiMongodb },
  { name: "Kubernetes", Icon: SiKubernetes },
  { name: "Docker", Icon: SiDocker },
  { name: "Terraform", Icon: SiTerraform },
  { name: "AWS", Icon: FaAws },
  { name: "GCP", Icon: SiGooglecloud },
  { name: "Kafka", Icon: SiApachekafka },
  { name: "Linux", Icon: SiLinux },
];

export const skillGroups = [
  {
    title: "Services & APIs",
    skills: allSkills.filter(({ name }) =>
      ["Python", "Go", "Django", "FastAPI"].includes(name)
    ),
  },
  {
    title: "Data & messaging",
    skills: allSkills.filter(({ name }) =>
      ["PostgreSQL", "Redis", "Kafka"].includes(name)
    ),
  },
  {
    title: "Cloud & infrastructure",
    skills: allSkills.filter(({ name }) =>
      ["Kubernetes", "Docker", "Terraform", "AWS", "GCP", "Linux"].includes(
        name
      )
    ),
  },
  {
    title: "When the product needs it",
    skills: allSkills.filter(({ name }) =>
      ["TypeScript", "React", "Next.js", "Java", "Rust"].includes(name)
    ),
  },
];
