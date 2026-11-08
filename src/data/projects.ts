import { Project } from "@/types/projects";

const projects: Project[] = [
  {
    title: "Agent harness",
    category: "At Simbian / Agent platform",
    focus: "Running long-lived agents for many tenants, safely and cheaply.",
    description:
      "The runtime around the model: a thin orchestrator that owns every policy decision, jailed sandboxes that only execute, and a shared filesystem that holds all session state, so any worker can resume any session.",
    highlights: [
      "Single event inbox for humans, webhooks, and other sessions, drained before every model call so agents can change course mid-turn.",
      "Prompt-cache-first design: a static prompt prefix, deferred tool loading, append-only history, and forks that reuse the parent's cache.",
      "Context pipeline from cheap truncation to persisted summaries, plus per-session permissions, budgets, sub-agents, and cooperative cancellation.",
    ],
    blogLink: "/blogs/agent-harness-architecture",
    tags: ["Python", "Strands Agents", "MCP", "nsjail", "gRPC"],
  },
  {
    title: "NeuroSpend",
    category: "Personal project / Finance",
    focus: "Turning bank statements into useful financial data.",
    description:
      "An expense-management platform for Indian bank statements. The backend handles ingestion, categorization, household-level analytics, and the distinction between spending, transfers, and investments.",
    highlights: [
      "Go API built with Gin and pgx, backed by PostgreSQL and versioned Goose migrations.",
      "Statement parsing for Axis, SBI, and HDFC, with AI-assisted transaction categorization.",
      "Shared analytics queries for category allocation, spending trends, cash flow, and investments.",
    ],
    githubLink: "https://github.com/trainjumpers/neurospend",
    liveLink: "https://neurospend.vercel.app",
    blogLink: "/blogs/additive-financial-analytics",
    tags: ["Go", "Gin", "PostgreSQL", "pgx"],
  },
  {
    title: "Fabric",
    category: "At Dream11 / Infrastructure",
    focus: "Service discovery across Kubernetes and EC2.",
    description:
      "A custom discovery service connecting workloads across two different infrastructure models, without making every consumer understand where a service runs.",
    highlights: [
      "Go services for hybrid Kubernetes and EC2 workloads.",
      "A common discovery layer between orchestration-managed and VM-based services.",
    ],
    blogLink:
      "/blogs/gke-load-balancer-operators#fabric-one-name-for-kubernetes-and-ec2",
    tags: ["Go", "Kubernetes", "AWS", "Service discovery"],
  },
  {
    title: "Multi-cluster networking",
    category: "At Dream11 / Platform engineering",
    focus: "Making deployment intent reach the network.",
    description:
      "A Karmada-based GKE deployment system, backed by Kubernetes operators and networking APIs for provisioning and routing across cloud environments.",
    highlights: [
      "Two Go operators to reconcile load balancers and routing updates.",
      "Network APIs for cross-account VPC peering and CIDR allocation on AWS and GCP.",
    ],
    blogLink: "/blogs/gke-load-balancer-operators",
    tags: ["Go", "Karmada", "Kubernetes", "GCP"],
  },
  {
    title: "Shortcuts",
    category: "At Simbian / Backend platform",
    focus: "Customer-defined automation with explicit boundaries.",
    description:
      "Backend infrastructure for authoring and executing reusable workflows, with persistent sessions, versioned resources, scoped permissions, and parent-to-child tenant distribution.",
    highlights: [
      "Separated workflow definitions from execution state and persistent session results.",
      "Built authoring, portable import/export, and inherited configuration management.",
    ],
    blogLink: "/blogs/agent-shortcuts",
    tags: ["Python", "Django", "PostgreSQL", "Multi-tenancy"],
  },
  {
    title: "Sequences",
    category: "At Blaze AI / Messaging",
    focus: "Follow-up workflows driven by replies, not just timers.",
    description:
      "A messaging system for Twitter and LinkedIn that uses response sentiment to choose follow-up paths and coordinate scheduled communication.",
    highlights: [
      "FastAPI services and event-driven execution on AWS.",
      "Workflow branching based on response sentiment and follow-up state.",
    ],
    tags: ["Python", "FastAPI", "AWS", "Event-driven"],
  },
  {
    title: "Social data and engagement",
    category: "At Blaze AI / Data pipelines",
    focus: "Connecting social signals to actions.",
    description:
      "Audience discovery, Twitter Listening, and reward-based quests. These services combined social-platform data, segmentation, and campaign execution.",
    highlights: [
      "Lambda and Step Functions pipelines for social listening and campaign actions.",
      "Audience enrichment using messaging availability and wallet data, alongside quests spanning social integrations.",
    ],
    tags: ["Python", "AWS Lambda", "Step Functions", "Data pipelines"],
  },
];

export default projects;
