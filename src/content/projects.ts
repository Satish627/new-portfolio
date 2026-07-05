export interface Project {
  slug: string;
  title: string;
  oneLiner: string;
  stack: string[];
  link?: string;
  linkLabel?: string;
}

export const projects: Project[] = [
  {
    slug: "reading-the-reader",
    title: "Reading the Reader",
    oneLiner:
      "Master's thesis at DTU — an adaptive reading system that watches how you read: eye-tracking data drives micro-interventions that keep readers in flow.",
    stack: ["Eye-tracking", "Adaptive UX", "HCI", "DTU thesis"],
  },
  {
    slug: "restaurant-ordering-platform",
    title: "Restaurant ordering platform",
    oneLiner:
      "Full-stack ordering platform — menu browsing, orders, and simulated Stripe payments behind secure auth. Bachelor's thesis at VIA, containerized for deployment.",
    stack: ["MERN", "Redux", "Stripe", "Docker"],
  },
  {
    slug: "realtime-chat",
    title: "Real-time chat application",
    oneLiner:
      "Secure real-time messaging over WebSockets with JWT sessions and persistent history in MongoDB.",
    stack: ["React", "Socket.io", "MongoDB", "Zustand"],
    link: "https://github.com/Satish627/ChatApp",
    linkLabel: "GitHub",
  },
  {
    slug: "sauna-iot",
    title: "Sauna monitoring IoT",
    oneLiner:
      "Live sauna temperature and humidity, end to end — sensors into a data warehouse, Power BI dashboards on top, and an Android app for readings on the go.",
    stack: ["IoT", "Power BI", "Android", "ETL"],
  },
];

export const skills = [
  "TypeScript",
  "JavaScript",
  "Java",
  "C#",
  "Python",
  "React",
  "Next.js",
  "Node.js",
  ".NET",
  "Spring Boot",
  "PostgreSQL",
  "MongoDB",
  "Docker",
];

export const experience = [
  {
    when: "Jan 2025 — now",
    title: "Student developer · Nearby Rentals",
    where: "Copenhagen",
    body: "Building and maintaining platform features across the stack — UI, APIs, and databases — shipping to production in agile, cross-functional teams.",
  },
  {
    when: "2024 — 2026",
    title: "MSc Computer Science · DTU",
    where: "Copenhagen",
    body: "Thesis: Reading the Reader — adaptive reading through eye-tracking and micro-interventions. Coursework in network security, process mining, and functional programming.",
  },
  {
    when: "Jan — Jul 2022",
    title: "Frontend intern · ParkShare",
    where: "Aarhus",
    body: "Component-based, responsive UIs in React — agile sprints with UX designers, code reviews, and cross-browser hardening.",
  },
  {
    when: "2020 — 2024",
    title: "BEng Software Technology · VIA University College",
    where: "Horsens",
    body: "Foundations in distributed systems, design patterns, and algorithms — capped by the restaurant-platform thesis.",
  },
];
