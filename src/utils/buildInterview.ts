import { DEMO_ROLES } from "../data/demoInterview";
import type { DemoQuestion, DemoRoleId } from "../data/demoInterview";
import { TARGET_ROLES, experienceLabel, labelOf } from "../data/interviewSetup";
import type { InterviewConfig, InterviewType } from "../types/interview.types";

const TYPE_PHRASE: Record<InterviewType, string> = {
  TECHNICAL: "technical",
  BEHAVIORAL: "behavioral",
  HR: "HR",
  MIXED: "mixed HR and technical",
};

const bank = (id: DemoRoleId) => DEMO_ROLES.find((r) => r.id === id)!.questions;

// Role ke hisaab se technical sawaal
const technicalQuestions = (config: InterviewConfig): DemoQuestion[] => {
  const fe = bank("frontend");
  const be = bank("backend");
  if (config.targetRole === "frontend") return fe;
  if (config.targetRole === "backend") return be;
  return [fe[1], be[1], be[0]]; // full stack: React perf, API design, security
};

const pickQuestions = (config: InterviewConfig): DemoQuestion[] => {
  const hr = bank("hr");
  const tech = technicalQuestions(config);
  switch (config.type) {
    case "TECHNICAL":
      return tech;
    case "BEHAVIORAL":
      return [hr[1], hr[0], hr[2]]; // problem-solving story se shuru
    case "HR":
      return hr;
    case "MIXED":
      return [hr[0], ...tech.slice(0, 2)];
  }
};

// Setup config se interview ke sawaal. Abhi frontend ke question bank se aate hain;
// jab backend AI se sawaal banayega (JD + resume ke hisaab se), ye function hat jayega.
export const buildInterview = (config: InterviewConfig, userName?: string) => {
  let questions = pickQuestions(config);

  // Beginner me follow-up nahi
  if (config.difficulty === "BEGINNER") {
    questions = questions.map((q) => ({ ...q, followUps: [] }));
  }

  const title = labelOf(TARGET_ROLES, config.targetRole);
  const experience = experienceLabel(config.experienceYears);
  const greeting = userName ? `Hi ${userName.split(" ")[0]}, thanks for joining.` : "Hi, thanks for joining.";

  const intro = `${greeting} This is a ${TYPE_PHRASE[config.type]} interview for a ${title} role (${experience}). I'll ask ${questions.length} questions. Take your time and think out loud. Let's begin.`;

  return { title, questions, intro };
};
