import { apiRequest } from "../apiClient";
import type { ApiResponse } from "../../../types/auth.types";
import type { DemoQuestion } from "../../../data/demoInterview";
import type { ServerInterviewDetail, SubmittedAnswer } from "../../../types/interview.types";

// POST /api/interviews/:id/questions: AI (Groq) role, tech, experience, JD, resume ke hisaab se sawaal banata hai.
// Pehle se bane hon to wahi wapas aate hain.
export const prepareQuestionsApi = (token: string | null, id: number) =>
  apiRequest<ApiResponse<DemoQuestion[]>>(`/api/interviews/${id}/questions`, { method: "POST", token });

// POST /api/interviews/:id/submit: AI jawab check karke score deta hai, interview COMPLETED
export const submitInterviewApi = (
  token: string | null,
  id: number,
  payload: { answers: SubmittedAnswer[]; durationSec: number },
) =>
  apiRequest<ApiResponse<ServerInterviewDetail>>(`/api/interviews/${id}/submit`, {
    method: "POST",
    body: JSON.stringify(payload),
    token,
  });
