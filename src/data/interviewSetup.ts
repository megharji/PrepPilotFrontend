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

// ids backend ke enum jaise hi (TECHNICAL, BEHAVIORAL, HR, MIXED)
export const INTERVIEW_TYPES: Option<InterviewType>[] = [
  { id: "TECHNICAL", title: "Technical", description: "Concepts, problem solving and design" },
  { id: "BEHAVIORAL", title: "Behavioral", description: "Past situations, teamwork and ownership" },
  { id: "HR", title: "HR", description: "About you, motivation and career goals" },
  { id: "MIXED", title: "Mixed", description: "An HR opener followed by technical questions" },
];

// ids backend ke enum jaise hi (BEGINNER, INTERMEDIATE, ADVANCED)
export const DIFFICULTIES: Option<Difficulty>[] = [
  { id: "BEGINNER", title: "Beginner", description: "Core questions, no follow-ups" },
  { id: "INTERMEDIATE", title: "Intermediate", description: "Follow-up questions based on your answers" },
  { id: "ADVANCED", title: "Advanced", description: "Follow-ups plus a 2-minute limit per answer" },
];

// Backend limits (interview.controller.ts / upload.middleware.ts)
export const EXPERIENCE_MIN = 0;
export const EXPERIENCE_MAX = 50;
export const JD_MAX_LENGTH = 10000;
export const RESUME_MAX_BYTES = 5 * 1024 * 1024;
export const RESUME_ACCEPT = ".pdf,.docx";

export const ADVANCED_ANSWER_LIMIT_SEC = 120;

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
