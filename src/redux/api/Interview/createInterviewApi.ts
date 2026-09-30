import { apiRequest } from "../apiClient";
import type { ApiResponse } from "../../../types/auth.types";
import type { CreateInterviewPayload, ServerInterview } from "../../../types/interview.types";

// POST /api/interviews (token zaroori)
export const createInterviewApi = (token: string | null, payload: CreateInterviewPayload) =>
  apiRequest<ApiResponse<ServerInterview>>("/api/interviews", {
    method: "POST",
    body: JSON.stringify(payload),
    token,
  });
