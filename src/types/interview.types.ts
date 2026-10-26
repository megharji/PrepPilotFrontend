import type { DemoReport } from "../utils/demoScoring";

// Values backend (PrepPilotBackend/src/types/interview.types.ts) jaise hi
export type InterviewType = "TECHNICAL" | "BEHAVIORAL" | "HR" | "MIXED" | "CODING";
export type Difficulty = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
// Backend AUTO bhi rakh sakta hai (AI experience se khud decide kare); list/detail me aa sakta hai
export type ServerDifficulty = Difficulty | "AUTO";
export type InterviewStatus = "SETUP" | "IN_PROGRESS" | "COMPLETED";
export type TargetRoleId = "frontend" | "backend" | "fullstack";
// Interview kis cheez ke hisaab se tailor ho
export type Personalization = "JD" | "RESUME" | "BOTH" | "NONE";

// Setup wizard me user ne jo chuna
export interface InterviewConfig {
  targetRole: TargetRoleId;
  // Language / framework (list se ya "Other" me khud likha)
  techStack: string;
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
  techStack?: string;
  experienceYears: number;
  jobDescription?: string;
  // POST /api/resumes se mili id; resume na chuna ho to nahi bhejte
  resumeId?: number;
  interviewType: InterviewType;
  difficulty: Difficulty;
}

// POST /api/interviews, GET /api/interviews aur GET /api/interviews/:id ka shape
export interface ServerInterview {
  id: number;
  userId: number;
  targetRole: string;
  experienceYears: number;
  techStack: string | null;
  jobDescription: string | null;
  resumeId: number | null;
  interviewType: InterviewType;
  difficulty: ServerDifficulty;
  status: InterviewStatus;
  createdAt: string;
  // AI score; interview poora hone tak null
  overallScore: number | null;
  completedAt: string | null;
  durationSec: number | null;
}

// GET /api/interviews/:id aur POST /api/interviews/:id/submit: upar wale fields + AI report
export interface ServerInterviewDetail extends ServerInterview {
  report: DemoReport | null;
}

// POST /api/interviews/:id/submit me ek jawab. Sawaal ka text nahi bhejte, sirf uska number.
export interface SubmittedAnswer {
  questionIndex: number;
  isFollowUp: boolean;
  answer: string;
  skipped: boolean;
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
