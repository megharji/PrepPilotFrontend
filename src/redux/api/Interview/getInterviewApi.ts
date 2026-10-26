import { apiRequest } from "../apiClient";
import type { ApiResponse } from "../../../types/auth.types";
import type { ServerInterviewDetail } from "../../../types/interview.types";

// GET /api/interviews/:id: sirf apna interview milta hai, kisi aur ka ho to 404 (token zaroori)
export const getInterviewApi = (token: string | null, id: number) =>
  apiRequest<ApiResponse<ServerInterviewDetail>>(`/api/interviews/${id}`, { method: "GET", token });
