import { apiRequest } from "../apiClient";
import type { ApiResponse } from "../../../types/auth.types";
import type { ServerInterview } from "../../../types/interview.types";

// GET /api/interviews: logged-in user ke saare interviews, naye pehle (token zaroori)
export const getInterviewsApi = (token: string | null) =>
  apiRequest<ApiResponse<ServerInterview[]>>("/api/interviews", { method: "GET", token });
