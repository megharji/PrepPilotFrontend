import type { DemoQuestion } from "../data/demoInterview";
import { TARGET_ROLES, difficultyLabel, experienceLabel, labelOf } from "../data/interviewSetup";
import type { InterviewConfig, InterviewType } from "../types/interview.types";

const TYPE_PHRASE: Record<InterviewType, string> = {
  TECHNICAL: "technical",
  BEHAVIORAL: "behavioral",
  HR: "HR",
  MIXED: "mixed HR and technical",
  CODING: "coding",
};

// Setup config + AI (backend, Groq) ke sawaal se interview room ka title aur intro.
// Sawaal hamesha AI se aate hain; Beginner me follow-up AI khud nahi banata.
export const buildInterview = (config: InterviewConfig, questions: DemoQuestion[], userName?: string) => {
  const title = labelOf(TARGET_ROLES, config.targetRole);
  // Purane saved config me techStack nahi tha
  const experience = [config.techStack, experienceLabel(config.experienceYears)].filter(Boolean).join(", ");
  const greeting = userName ? `Hi ${userName.split(" ")[0]}, thanks for joining.` : "Hi, thanks for joining.";

  const intro =
    config.type === "CODING"
      ? `${greeting} This is a ${difficultyLabel(config.difficulty, "CODING").toLowerCase()} coding round for a ${title} role (${experience}). I'll give you a few problems, one at a time. For each one, explain your approach, write the code, and tell me the time and space complexity. Let's begin.`
      : `${greeting} This is a ${TYPE_PHRASE[config.type]} interview for a ${title} role (${experience}). Each answer has its own timer. Take your time and think out loud. Let's begin.`;

  return { title, questions, intro };
};
