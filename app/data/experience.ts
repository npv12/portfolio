import Experience from "../types/experience";
import { COMPANY, POSITION } from "./basic";

const Experiences: Experience[] = [
  {
    company: COMPANY,
    position: POSITION,
    startDate: "Nov 2025",
    endDate: "Present",
    focus: "Backend systems for security operations and AI agents",
    description:
      "Building the backend behind configurable agent workflows, multi-tenant security operations, and customer-defined automation.",
    highlights: [
      "Workflow platform: authoring, versioned runs, and parent-to-child tenant distribution.",
      "Role-backed agent permissions with acting-user attribution across async jobs.",
      "Persistent agent sessions and investigation queries over PostgreSQL and a columnar store.",
    ],
    techStack: ["Python", "Django", "PostgreSQL", "SQL", "Agent runtimes"],
  },
  {
    company: "Dream11",
    position: "Software Developer",
    startDate: "Nov 2024",
    endDate: "Nov 2025",
    focus: "Cloud networking and Kubernetes platforms in Go",
    description:
      "Built infrastructure services connecting multi-cluster Kubernetes deployments and hybrid cloud workloads.",
    highlights: [
      "Multi-cluster GKE on Karmada, with two Go operators for load balancing and routing.",
      "Fabric: Go service discovery spanning Kubernetes and EC2.",
      "Network API for cross-account VPC peering and CIDR allocation on AWS and GCP.",
    ],
    techStack: ["Go", "Kubernetes", "AWS", "GCP", "Kafka", "Java"],
  },
  {
    company: "Blaze AI (YC W22)",
    position: "Software Developer",
    startDate: "Apr 2023",
    endDate: "Oct 2024",
    focus: "Event-driven services and social data pipelines",
    description:
      "Developed the services behind social listening, audience discovery, messaging workflows, and engagement campaigns.",
    highlights: [
      "Social listening pipelines on Lambda and Step Functions, plus XMTP messaging.",
      "Redesigned social search, lifting usage by 20%.",
    ],
    techStack: ["Python", "Flask", "AWS Lambda", "Step Functions", "RDS"],
  },
  {
    company: "Quriate",
    position: "Founding Engineer",
    startDate: "Aug 2021",
    endDate: "Apr 2023",
    focus: "An adaptive assessment platform, from the ground up",
    description:
      "Designed and deployed an assessment product spanning backend APIs, data processing, analytics, and cloud infrastructure.",
    highlights: [
      "FastAPI, SQL, and pandas backend, built test-first with pytest.",
      "GCP infrastructure serving 10,000 concurrent users.",
    ],
    techStack: ["Python", "FastAPI", "SQL", "pandas", "GCP"],
  },
];

export default Experiences;
