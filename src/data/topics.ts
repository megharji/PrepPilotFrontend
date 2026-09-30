// Abhi static hai. Backend me topics/questions API aane pe yahan se hata ke redux me le jaana.
export interface Topic {
  id: string;
  title: string;
  description: string;
  sample: string;
  tone: "indigo" | "teal" | "amber" | "rose" | "sky" | "violet";
}

export const TOPICS: Topic[] = [
  {
    id: "dsa",
    title: "Data Structures & Algorithms",
    description: "Arrays, trees, graphs, DP and the patterns behind them.",
    sample: "Find the longest substring without repeating characters.",
    tone: "indigo",
  },
  {
    id: "system-design",
    title: "System Design",
    description: "Scalability, caching, queues and trade-offs that interviewers probe.",
    sample: "Design a rate limiter for a public API.",
    tone: "teal",
  },
  {
    id: "javascript",
    title: "JavaScript",
    description: "Closures, the event loop, promises and prototypes.",
    sample: "What is printed when a setTimeout(0) races a resolved Promise?",
    tone: "amber",
  },
  {
    id: "react",
    title: "React",
    description: "Rendering, hooks, state management and performance.",
    sample: "Why does a useEffect run twice in development?",
    tone: "sky",
  },
  {
    id: "node",
    title: "Node.js & Backend",
    description: "Express, auth, REST design, databases and SQL.",
    sample: "How would you store passwords securely?",
    tone: "rose",
  },
  {
    id: "behavioral",
    title: "Behavioral / HR",
    description: "Structure your stories with the STAR method.",
    sample: "Tell me about a time you disagreed with your manager.",
    tone: "violet",
  },
];

