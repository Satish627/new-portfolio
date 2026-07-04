export interface Project {
  slug: string;
  title: string;
  oneLiner: string;
  stack: string[];
  link?: string;
}

export const projects: Project[] = [
  {
    slug: "project-one",
    title: "Project one",
    oneLiner:
      "Placeholder — a one-line description of what this project does and why it matters.",
    stack: ["Next.js", "TypeScript"],
  },
  {
    slug: "project-two",
    title: "Project two",
    oneLiner:
      "Placeholder — swap in a real project with a thumbnail, links, and a story.",
    stack: ["React", "Node.js"],
  },
  {
    slug: "project-three",
    title: "Project three",
    oneLiner:
      "Placeholder — three to five strong projects beat a wall of small ones.",
    stack: ["Three.js", "WebGL"],
  },
];
