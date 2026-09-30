import type { DemoReport } from "../utils/demoScoring";

// Values backend (PrepPilotBackend/src/types/interview.types.ts) jaise hi
export type InterviewType = "TECHNICAL" | "BEHAVIORAL" | "HR" | "MIXED";
export type Difficulty = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
export type InterviewStatus = "SETUP" | "IN_PROGRESS" | "COMPLETED";
export type TargetRoleId = "frontend" | "backend" | "fullstack";
// Interview kis cheez ke hisaab se tailor ho
export type Personalization = "JD" | "RESUME" | "BOTH" | "NONE";

// Setup wizard me user ne jo chuna
export interface InterviewConfig {
  targetRole: TargetRoleId;
  experienceYears: number;
  personalization: Personalization;
  jobDescription: string;
  // Server pe upload ho chuka resume (sirf id/naam/size rakhte hain)
  resume: { id: number; name: string; size: number } | null;
  type: InterviewType;
  difficulty: Difficulty;
}

// ---------- Backend request / response ----------

export interface CreateInterviewPayload {
  targetRole: string;
  experienceYears: number;
  jobDescription?: string;
  interviewType: InterviewType;
  difficulty: Difficulty;
}

// POST /api/interviews ka response
export interface ServerInterview {
  id: number;
  userId: number;
  targetRole: string;
  experienceYears: number;
  jobDescription: string | null;
  interviewType: InterviewType;
  difficulty: Difficulty;
  status: InterviewStatus;
  createdAt: string;
}

// POST /api/resumes ka response
export interface ServerResume {
  id: number;
  userId: number;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  createdAt: string;
}

// ---------- Local history ----------

// Ek poora hua interview. Report abhi browser me (redux-persist) save hoti hai,
// kyunki backend me answers/report save karne ki API abhi nahi hai.
export interface InterviewRecord {
  id: string;
  // Backend ke interviews table ki id (POST /api/interviews se mili)
  serverId?: number;
  roleTitle: string;
  createdAt: string;
  durationSec: number;
  report: DemoReport;
  config?: InterviewConfig;
}
