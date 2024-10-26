import Experience from "../types/experience";

const Experiences: Experience[] = [
  {
    company: "Dream11",
    position: "Software Developer 1",
    startDate: "Nov 2024",
    endDate: "Present",
    description:
      "Lets see what this beholds",
    techStack: ["Go", "Java", "CI/CD"],
  },
  {
    company: "Blaze AI (YC W22)",
    position: "Software Developer",
    startDate: "Apr 2023",
    endDate: "Oct 2024",
    description:
      "I developed and improved various website features, such as the Tweet library, Discord analytics, Quests and Rewards, and segment exclusion, resolving multiple bugs to ensure UX and stability. I redesigned the social search feature used for creating leads from LinkedIn or Twitter, making it very easy to use and increasing usage by 20%. I built and deployed Lambda functions and step functions to enable the Twitter Listening feature, which tracks posts with specific keywords and mentions. Additionally, I built and deployed an XMTP-based messaging infrastructure, designed the frontend, and set up debugging tools to automate messaging across the XMTP protocol, enabling secure and reliable communication between systems and applications. I also added reCAPTCHA support to key pages and implemented measures to prevent web scraping and unauthorized access. Finally, I addressed customer concerns, solved various issues, and implemented feature requests.",
    techStack: ["Web3", "AWS", "Flask", "React", "RDS"],
  },
  {
    company: "Quriate",
    position: "Founding Engineer",
    startDate: "Aug 2021",
    endDate: "Apr 2023",
    description:
      "As a founding engineer, I led the design and deployment of an adaptive assessment evaluation platform from scratch. This platform enables educational institutions to create, manage, and evaluate online tests for their students. I developed the backend using FastAPI, SQL, and pandas, ensuring fast and accurate data processing and analysis of student responses and performance metrics for both students and instructors. I implemented a test-driven-development approach using pytests and pydantic to ensure high-quality code and functionality. On the frontend, I designed and maintained the platform using React, creating user-friendly features such as Authentication, User Dashboards, an NTA-style question screen that supports LaTeX, Student and Teacher Analytics, and responsive design for various screen sizes. I also managed the hosting on GCP, providing a reliable and scalable infrastructure that handled a load of 10k concurrent users.",
    techStack: ["React", "GCP", "FastAPI", "OCR", "EdTech"],
  },
];

export default Experiences;
