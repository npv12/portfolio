import Experience from "../types/experience";

const Experiences: Experience[] = [
  {
    company: "Simbian",
    position: "Software Developer",
    startDate: "Nov 2025",
    endDate: "Present",
    description:
      "I started on MSSP: parent-to-child tenant case management, Excel roster ingestion with shift-based assignment, and making case and task views tenant-aware so parent analysts can work child tenants. From there I owned a large slice of SOC and the agent harness: related-incident and entity-intelligence graphs, SOCv2 investigation lists over Postgres and a columnar store with dialect-safe filters, ServiceNow case sync with custom HTTP tools, and the configurable shortcut system (authoring, placements, health/repair, portable import/export) including the MSSP-to-child editing path.",
    techStack: ["Python", "Django", "PostgreSQL", "TypeScript", "React"],
  },
  {
    company: "Dream11",
    position: "Software Developer",
    startDate: "Nov 2024",
    endDate: "Nov 2025",
    description:
      "I engineered a multi-cluster GKE deployment system using Karmada, developing two Kubernetes operators in Go to overcome GCP's performance bottlenecks by automating load balancerprovisioning and routing updates. This platform-building extended to the network layer, where I built Fabric, a custom service discovery system in Go for hybrid workloads. At Blaze AI, I not only built a stateful workflow engine that drove 50% of revenue, but also cut AWS costs by 80% through rigorous monitoring of slow queries, data pipeline optimization, and strategic database indexing.",
    techStack: ["Go", "Java", "Vertx", "Kubernetes", "Kafka"],
  },
  {
    company: "Blaze AI (YC W22)",
    position: "Software Developer",
    startDate: "Apr 2023",
    endDate: "Oct 2024",
    description:
      "I developed various website features like Tweet library, Discord analytics, Quests and Rewards, and segment exclusion. I redesigned the social search feature, boosting usage by 20%. I built and deployed Lambda functions and step functions for Twitter Listening, and an XMTP-based messaging infrastructure, enabling secure communication. I added reCAPTCHA support and measures to prevent web scraping and unauthorized access. Additionally, I addressed customer concerns, solved issues, and implemented feature requests.",
    techStack: ["Web3", "AWS", "Flask", "React", "RDS"],
  },
  {
    company: "Quriate",
    position: "Founding Engineer",
    startDate: "Aug 2021",
    endDate: "Apr 2023",
    description:
      "As a founding engineer, I led the design and deployment of an adaptive assessment platform from scratch. I developed the backend using FastAPI, SQL, and pandas, and implemented TDD using pytests and pydantic. On the frontend, I used React to create features like Authentication, User Dashboards, LaTeX-supported questions, and Analytics. I managed GCP hosting, ensuring a scalable infrastructure that handled 10k concurrent users.",
    techStack: ["React", "GCP", "FastAPI", "OCR", "EdTech"],
  },
];

export default Experiences;
