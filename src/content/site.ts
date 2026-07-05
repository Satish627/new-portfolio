export const home = {
  badge: "Satish | Developer Portfolio",
  headline: "Software Developer building modern web applications.",
  tagline: "MSc Computer Science · DTU Copenhagen · Open to opportunities",
  paragraphs: [
    "I build responsive and scalable web applications with a strong focus on clean code, performance, and user experience.",
    "My work focuses on modern frontend development using technologies like Next.js, TypeScript, and Tailwind while understanding the full stack behind the scenes.",
  ],
  techStack: [
    "Next.js",
    "TypeScript",
    "React",
    "Node.js",
    "PostgreSQL",
    "Docker",
  ],
  ctas: [
    { label: "View Projects", href: "#projects", variant: "solid" as const },
    { label: "Contact Me", href: "#contact", variant: "outline" as const },
  ],
};

export const about = {
  kicker: "Know Me Better",
  title: "About Me",
  description:
    "Denmark-based student developer turning complex ideas into fast, intuitive web experiences.",
  details: [
    "I build modern, responsive interfaces with Next.js, TypeScript, and Tailwind CSS.",
    "I enjoy combining clean UI, strong architecture, and practical problem-solving.",
    "My goal is to grow as a full-stack engineer and create scalable digital products people enjoy using.",
  ],
  storySteps: [
    {
      phase: "Step 1",
      title: "Getting Started",
      description:
        "My development journey began during my bachelor's program at VIA University College, where I was introduced to programming and the core concepts of software development.",
    },
    {
      phase: "Step 2",
      title: "First Project",
      description:
        "One of my first projects was a JavaFX application designed to manage gym data, which helped me understand how software systems handle data, logic, and user interfaces.",
    },
    {
      phase: "Step 3",
      title: "Building Foundations",
      description:
        "As I progressed through my studies, I developed a strong foundation in programming principles, problem solving, and software design.",
    },
    {
      phase: "Step 4",
      title: "Modern Web Development",
      description:
        "I started focusing on modern web technologies and frontend engineering, working with tools such as React, Next.js, TypeScript, and Tailwind CSS to build responsive and scalable interfaces.",
    },
    {
      phase: "Step 5",
      title: "System Thinking",
      description:
        "My focus expanded beyond individual components to thinking about full systems — architecture, performance, modular design, and how frontend applications integrate with backend services.",
    },
    {
      phase: "Step 6",
      title: "Future Direction",
      description:
        "I am currently focused on growing as a full-stack engineer by working on challenging projects, improving my system design skills, and building applications that combine strong engineering with great user experience.",
    },
  ],
};

export interface ProjectLink {
  label: string;
  href: string;
}

export interface Project {
  title: string;
  category: string;
  summary: string;
  highlight: string;
  stack: string[];
  links: ProjectLink[];
}

export const projects = {
  kicker: "Ideas Into Products",
  title: "Projects",
  description:
    "Explore real applications where I combine frontend architecture, performance, and user-focused design.",
  details: [
    "I build practical products with modern web stacks, focusing on clean architecture, smooth interactions, and measurable performance.",
    "Each project is treated as an end-to-end system, from interface design and component structure to API integration and deployment readiness.",
  ],
  featured: [
    {
      title: "Process-Oriented Event-Driven Software Project",
      category: "Master's Project",
      summary:
        "Course project focused on process-oriented and event-driven software design with collaborative implementation.",
      highlight:
        "Built as a team-oriented master's project with event-driven architecture principles.",
      stack: [
        "TypeScript",
        "Event-Driven Design",
        "Process-Oriented Architecture",
      ],
      links: [
        {
          label: "GitHub Repository",
          href: "https://github.com/MrSachin7/-02268-Process-Oriented-Event-Driven-Software-Project",
        },
      ],
    },
    {
      title: "RoboRally Platform (Team Project)",
      category: "Master's Team Project",
      summary:
        "Collaborative RoboRally system delivered through separate frontend and backend repositories under a shared organization.",
      highlight:
        "Worked in a coordinated team setup with dedicated frontend and backend codebases.",
      stack: [
        "TypeScript",
        "C#",
        "Frontend/Backend Separation",
        "Team Collaboration",
      ],
      links: [
        {
          label: "Organization",
          href: "https://github.com/SoftwareEngineering2-G",
        },
        {
          label: "Frontend Repo",
          href: "https://github.com/SoftwareEngineering2-G/Roborally-frontend",
        },
        {
          label: "Backend Repo",
          href: "https://github.com/SoftwareEngineering2-G/Roborally-backend",
        },
      ],
    },
    {
      title: "MiniCraft",
      category: "Graphics / Systems Project",
      summary:
        "Experimental project exploring mini game/simulation mechanics and system-level implementation concepts.",
      highlight:
        "Focused on interactive system behavior and practical implementation experiments.",
      stack: [
        "Programming Fundamentals",
        "Interactive Systems",
        "Project Architecture",
      ],
      links: [
        {
          label: "GitHub Repository",
          href: "https://github.com/Satish627/MiniCraft",
        },
      ],
    },
    {
      title: "DataSecurityA2",
      category: "Security Assignment",
      summary:
        "Academic security-focused implementation covering practical data protection and secure coding concepts.",
      highlight:
        "Explored applied security concepts through a hands-on Java implementation.",
      stack: ["Java", "Data Security", "Secure Coding"],
      links: [
        {
          label: "GitHub Repository",
          href: "https://github.com/Satish627/DataSecurityA2",
        },
      ],
    },
    {
      title: "ExpenseTrackerApp",
      category: "Application Development",
      summary:
        "Personal finance tracker application for managing expenses and basic budgeting workflows.",
      highlight:
        "Built a practical tracking workflow with Java application structure.",
      stack: ["Java", "Application Design", "Data Handling"],
      links: [
        {
          label: "GitHub Repository",
          href: "https://github.com/Satish627/ExpenseTrackerApp",
        },
      ],
    },
    {
      title: "Restaurant Website & Online Ordering App",
      category: "Bachelor Project",
      summary:
        "Built a full-stack ordering platform for menu browsing, ordering, and payment simulation with secure auth flows and scalable API design.",
      highlight: "Integrated Stripe, Redux, and Dockerized deployment workflow.",
      stack: ["MERN Stack", "Tailwind CSS", "Redux", "Stripe", "Docker"],
      links: [],
    },
    {
      title: "Employee Management System",
      category: "Client-Server Project",
      summary:
        "Developed a Java-based employee management system with a JavaFX client and server-side architecture using clear MVVM separation.",
      highlight:
        "Implemented Java RMI communication and PostgreSQL-backed persistence.",
      stack: ["Java", "JavaFX", "RMI", "PostgreSQL", "MVVM"],
      links: [],
    },
    {
      title: "Sauna Monitoring IoT Solution",
      category: "Data & IoT Project",
      summary:
        "Designed an IoT monitoring flow for real-time sauna temperature and moisture data with dashboard-driven insights.",
      highlight:
        "Created interactive Power BI visualizations connected to a cleaned data warehouse pipeline.",
      stack: ["IoT Sensors", "Android", "Power BI", "Data Warehouse", "ETL"],
      links: [],
    },
    {
      title: "Real-Time Chat Application",
      category: "Hobby Project",
      summary:
        "Built a secure chat platform with real-time messaging, authenticated sessions, and responsive UI architecture.",
      highlight:
        "Implemented WebSocket messaging with Socket.io and state handling via Zustand.",
      stack: ["React.js", "Node.js", "MongoDB", "Socket.io", "JWT", "Zustand"],
      links: [
        {
          label: "GitHub Repository",
          href: "https://github.com/Satish627/ChatApp",
        },
      ],
    },
  ] as Project[],
};

export const education = {
  kicker: "Learning That Ships",
  title: "Education",
  description:
    "My learning path in software engineering, from academic foundations to practical system-building experience.",
  details: [
    "I continuously strengthen core computer science fundamentals while applying them in real project work.",
    "Beyond formal study, I learn through building products, experimenting with new tools, and refining systems based on feedback.",
  ],
  milestones: [
    {
      period: "February 2020 - February 2024",
      institution: "VIA University College",
      location: "Horsens, Denmark",
      program: "Bachelor of Engineering in Software Technology",
      status: "Graduated",
      summary:
        "Built a strong base in software engineering principles, object-oriented development, and collaborative project delivery.",
      focus: [
        "Programming fundamentals",
        "Data structures and algorithms",
        "Team-based software projects",
      ],
      logo: "/via_logo.jpg",
      website: "https://en.via.dk/",
    },
    {
      period: "September 2024 - June 2026",
      institution: "Technical University of Denmark (DTU)",
      location: "Copenhagen, Denmark",
      program: "Master's in Computer Science",
      status: "In progress",
      summary:
        "Advancing into modern web systems, scalable architecture, and engineering practices for production-grade applications.",
      focus: ["Network Security", "Process Mining", "Functional Programming"],
      logo: "/dtu_logo.png",
      website: "https://www.dtu.dk/english",
    },
  ],
};

export const contact = {
  kicker: "Let's Build Something",
  title: "Contact",
  description:
    "Get in touch for collaboration opportunities, project ideas, or development roles.",
  details: [
    "I am currently looking for software developer roles and freelance opportunities.",
    "If you have a role or project in mind, feel free to reach out.",
  ],
  availability: ["Software developer roles", "Freelancing opportunities"],
  contactInfo: [
    {
      label: "Email",
      value: "satish.grg627@gmail.com",
      href: "mailto:satish.grg627@gmail.com",
    },
    {
      label: "Phone",
      value: "+45 53 78 17 26",
      href: "tel:+4553781726",
    },
    {
      label: "LinkedIn",
      value: "linkedin.com/in/satish-gurung-3a2781223",
      href: "https://linkedin.com/in/satish-gurung-3a2781223",
    },
    {
      label: "GitHub",
      value: "github.com/Satish627",
      href: "https://github.com/Satish627",
    },
  ],
  cv: { label: "Download CV", href: "/Satish_Gurung_CV.pdf" },
};
