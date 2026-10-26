import type { Difficulty, InterviewType, Personalization, TargetRoleId } from "../types/interview.types";

export interface Option<T extends string> {
  id: T;
  title: string;
  description: string;
}

export const TARGET_ROLES: Option<TargetRoleId>[] = [
  {
    id: "frontend",
    title: "Frontend Developer",
    description: "JavaScript, React, browser and web performance",
  },
  { id: "backend", title: "Backend Developer", description: "Node.js, APIs, databases and security" },
  { id: "fullstack", title: "Full Stack Developer", description: "A mix of frontend and backend questions" },
];

// Role ke baad language / framework. List me na ho to user "Other" chun ke khud likhe.
export const TECH_STACKS: Record<TargetRoleId, string[]> = {
  frontend: ["JavaScript", "TypeScript", "React", "Angular", "Vue", "Next.js"],
  backend: ["Node.js", "Java", "Python", "Go", "C# / .NET", "PHP"],
  fullstack: ["MERN", "MEAN", "Next.js", "Django + React", "Spring Boot + React", "Laravel + Vue"],
};

// Backend limit (interview.controller.ts)
export const TECH_STACK_MAX_LENGTH = 50;

// Personalize step ke do checkbox
export const PERSONALIZE_SOURCES: Option<"JD" | "RESUME">[] = [
  { id: "JD", title: "Job description", description: "Questions match the job you applied for" },
  { id: "RESUME", title: "My resume", description: "Questions about your own projects and skills" },
];

export const usesJd = (p: Personalization) => p === "JD" || p === "BOTH";
export const usesResume = (p: Personalization) => p === "RESUME" || p === "BOTH";

// Dono checkbox ki state se ek value
export const toPersonalization = (jd: boolean, resume: boolean): Personalization =>
  jd && resume ? "BOTH" : jd ? "JD" : resume ? "RESUME" : "NONE";

// ids backend ke enum jaise hi (TECHNICAL, BEHAVIORAL, HR, MIXED, CODING)
export const INTERVIEW_TYPES: Option<InterviewType>[] = [
  { id: "TECHNICAL", title: "Technical", description: "Concepts, problem solving and design" },
  { id: "CODING", title: "Coding", description: "Solve DSA problems: approach, code and complexity" },
  { id: "BEHAVIORAL", title: "Behavioral", description: "Past situations, teamwork and ownership" },
  { id: "HR", title: "HR", description: "About you, motivation and career goals" },
  { id: "MIXED", title: "Mixed", description: "An HR opener followed by technical questions" },
];

// ids backend ke enum jaise hi (BEGINNER, INTERMEDIATE, ADVANCED)
export const DIFFICULTIES: Option<Difficulty>[] = [
  { id: "BEGINNER", title: "Beginner", description: "Core questions, no follow-ups" },
  { id: "INTERMEDIATE", title: "Intermediate", description: "Follow-up questions based on your answers" },
  { id: "ADVANCED", title: "Advanced", description: "Tougher questions with deeper follow-ups" },
];

// Coding round: backend values wahi, sirf naam Basic / Medium / Hard
export const CODING_DIFFICULTIES: Option<Difficulty>[] = [
  { id: "BEGINNER", title: "Basic", description: "Arrays and strings, no follow-ups" },
  { id: "INTERMEDIATE", title: "Medium", description: "Hashing, two pointers and stacks, with follow-ups" },
  { id: "ADVANCED", title: "Hard", description: "Sliding window, DP and graphs" },
];

export const difficultyOptions = (type: InterviewType) =>
  type === "CODING" ? CODING_DIFFICULTIES : DIFFICULTIES;

// Backend limits (interview.controller.ts / upload.middleware.ts)
export const EXPERIENCE_MIN = 0;
export const EXPERIENCE_MAX = 50;
export const JD_MAX_LENGTH = 10000;
export const RESUME_MAX_BYTES = 5 * 1024 * 1024;
export const RESUME_ACCEPT = ".pdf,.docx";

// Har jawab ke liye time: 5 se 10 minute, sawaal ke hisaab se (sirf dikhata hai, auto-submit nahi)
const MIN_ANSWER_SEC = 5 * 60;
const MAX_ANSWER_SEC = 10 * 60;

export const answerTimeFor = (
  turn: { question: string; keyPoints: unknown[] },
  isFollowUp: boolean,
  type: InterviewType,
  difficulty: Difficulty,
) => {
  // Coding: approach + code + complexity, poora time
  if (type === "CODING" && !isFollowUp) return MAX_ANSWER_SEC;
  // Follow-up pichhle jawab pe chhota sawaal hota hai
  if (isFollowUp) return MIN_ANSWER_SEC;

  let minutes = 5;
  // Zyada points cover karne hain to zyada time
  minutes += Math.max(0, turn.keyPoints.length - 2);
  // Lamba sawaal (scenario / design) = zyada sochna
  if (turn.question.length > 160) minutes += 1;
  if (difficulty === "ADVANCED") minutes += 1;

  return Math.min(MAX_ANSWER_SEC, Math.max(MIN_ANSWER_SEC, minutes * 60));
};

export const EXPERIENCE_PRESETS = [0, 1, 2, 3, 5, 8, 10];

export const experienceLabel = (years: number) =>
  years === 0 ? "Fresher" : `${years} year${years === 1 ? "" : "s"}`;

export const JD_MIN_LENGTH = 50;

export type SetupStepId = "role" | "experience" | "personalize" | "details" | "type";

export interface SetupStep {
  id: SetupStepId;
  title: string;
  hint: string;
}

// "details" step sirf tab jab JD/resume chuna ho (NONE pe skip)
export const getSetupSteps = (p: Personalization | null): SetupStep[] => [
  { id: "role", title: "Target Role", hint: "What are you interviewing for?" },
  { id: "experience", title: "Experience", hint: "How many years have you worked?" },
  { id: "personalize", title: "Personalize", hint: "JD, resume, both or neither" },
  ...(p && p !== "NONE"
    ? [
        {
          id: "details" as const,
          title: p === "BOTH" ? "JD & Resume" : p === "JD" ? "Job Description" : "Resume",
          hint: "Add what you chose",
        },
      ]
    : []),
  { id: "type", title: "Type & Difficulty", hint: "How tough should it be?" },
];

export const labelOf = <T extends string>(options: Option<T>[], id: T) =>
  options.find((o) => o.id === id)?.title ?? id;

// Backend se aaye difficulty/status ke labels (AUTO bhi aa sakta hai)
// Coding round me Basic / Medium / Hard
export const difficultyLabel = (d: string, type?: string) =>
  d === "AUTO"
    ? "Auto"
    : ((type === "CODING" ? CODING_DIFFICULTIES : DIFFICULTIES).find((o) => o.id === d)?.title ?? d);

export const STATUS_LABELS: Record<string, string> = {
  SETUP: "Not started",
  IN_PROGRESS: "In progress",
  COMPLETED: "Completed",
};
